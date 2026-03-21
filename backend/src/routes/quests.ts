/* ══════════════════════════════════════════════════════════════════════════════
   Quests Routes
   ══════════════════════════════════════════════════════════════════════════════ */

import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { databases, DATABASE_ID, COLLECTIONS } from '../lib/appwrite';
import { ID, Query } from 'node-appwrite';
import { walletAuth, requireWallet, requireAdmin, type AuthVariables } from '../middleware/auth';
import { calculateXP } from '@agentsclan/shared';

const app = new Hono<{ Variables: AuthVariables }>();

app.use('*', walletAuth);

const questSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string(),
  instructions: z.string().optional(),
  quest_type: z.enum(['social', 'content', 'referral', 'community', 'special']),
  xp_reward: z.number().int().positive(),
  token_reward: z.number().optional(),
  max_completions: z.number().int().positive().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  required_tier: z.enum(['free', 'bronze', 'silver', 'gold', 'platinum']).optional(),
  verification_method: z.enum(['manual', 'automatic', 'proof']),
  external_link: z.string().url().optional(),
});

const submitSchema = z.object({
  proof_url: z.string().url().optional(),
  proof_text: z.string().optional(),
});

const reviewSchema = z.object({
  status: z.enum(['approved', 'rejected']),
  review_notes: z.string().optional(),
});

// GET /api/quests
app.get('/', async (c) => {
  try {
    const limit = parseInt(c.req.query('limit') || '25');
    const offset = parseInt(c.req.query('offset') || '0');
    const type = c.req.query('type');
    const status = c.req.query('status');

    const queries = [Query.limit(limit), Query.offset(offset), Query.orderDesc('$createdAt')];

    if (type) {
      queries.push(Query.equal('quest_type', type));
    }

    // Only show active quests to non-admins
    if (!c.get('isAdmin')) {
      queries.push(Query.equal('status', 'active'));
    } else if (status) {
      queries.push(Query.equal('status', status));
    }

    const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.QUESTS, queries);

    return c.json({
      success: true,
      data: {
        items: response.documents,
        total: response.total,
      },
    });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch quests' }, 500);
  }
});

// GET /api/quests/:id
app.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const quest = await databases.getDocument(DATABASE_ID, COLLECTIONS.QUESTS, id);
    return c.json({ success: true, data: quest });
  } catch (error) {
    return c.json({ success: false, error: 'Quest not found' }, 404);
  }
});

// POST /api/quests (admin only)
app.post('/', requireAdmin, zValidator('json', questSchema), async (c) => {
  try {
    const body = c.req.valid('json');

    const quest = await databases.createDocument(DATABASE_ID, COLLECTIONS.QUESTS, ID.unique(), {
      ...body,
      current_completions: 0,
      status: 'active',
    });

    return c.json({ success: true, data: quest }, 201);
  } catch (error) {
    return c.json({ success: false, error: 'Failed to create quest' }, 500);
  }
});

// PATCH /api/quests/:id (admin only)
app.patch('/:id', requireAdmin, zValidator('json', questSchema.partial()), async (c) => {
  try {
    const id = c.req.param('id');
    const body = c.req.valid('json');

    const quest = await databases.updateDocument(DATABASE_ID, COLLECTIONS.QUESTS, id, body);
    return c.json({ success: true, data: quest });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to update quest' }, 500);
  }
});

// POST /api/quests/:id/submit
app.post('/:id/submit', requireWallet, zValidator('json', submitSchema), async (c) => {
  try {
    const questId = c.req.param('id');
    const body = c.req.valid('json');
    const walletAddress = c.get('walletAddress')!;

    // Check if quest exists and is active
    const quest = await databases.getDocument(DATABASE_ID, COLLECTIONS.QUESTS, questId);
    if ((quest as any).status !== 'active') {
      return c.json({ success: false, error: 'Quest is not active' }, 400);
    }

    // Check if user already submitted
    const existing = await databases.listDocuments(DATABASE_ID, COLLECTIONS.QUEST_SUBMISSIONS, [
      Query.equal('quest_id', questId),
      Query.equal('user_wallet', walletAddress),
      Query.limit(1),
    ]);

    if (existing.documents.length > 0) {
      return c.json({ success: false, error: 'Already submitted' }, 400);
    }

    const submission = await databases.createDocument(DATABASE_ID, COLLECTIONS.QUEST_SUBMISSIONS, ID.unique(), {
      quest_id: questId,
      user_wallet: walletAddress,
      proof_url: body.proof_url || null,
      proof_text: body.proof_text || null,
      status: 'pending',
      xp_awarded: 0,
    });

    return c.json({ success: true, data: submission }, 201);
  } catch (error) {
    return c.json({ success: false, error: 'Failed to submit' }, 500);
  }
});

// GET /api/quests/submissions (admin only)
app.get('/admin/submissions', requireAdmin, async (c) => {
  try {
    const limit = parseInt(c.req.query('limit') || '25');
    const offset = parseInt(c.req.query('offset') || '0');
    const status = c.req.query('status') || 'pending';

    const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.QUEST_SUBMISSIONS, [
      Query.equal('status', status),
      Query.limit(limit),
      Query.offset(offset),
      Query.orderDesc('$createdAt'),
    ]);

    return c.json({
      success: true,
      data: {
        items: response.documents,
        total: response.total,
      },
    });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch submissions' }, 500);
  }
});

// PATCH /api/quests/submissions/:id (admin only)
app.patch('/submissions/:id', requireAdmin, zValidator('json', reviewSchema), async (c) => {
  try {
    const id = c.req.param('id');
    const body = c.req.valid('json');
    const reviewerId = c.get('walletAddress');

    const submission = await databases.getDocument(DATABASE_ID, COLLECTIONS.QUEST_SUBMISSIONS, id);
    const quest = await databases.getDocument(DATABASE_ID, COLLECTIONS.QUESTS, (submission as any).quest_id);

    let xpAwarded = 0;

    if (body.status === 'approved') {
      xpAwarded = (quest as any).xp_reward;

      // Update quest completion count
      await databases.updateDocument(DATABASE_ID, COLLECTIONS.QUESTS, (quest as any).$id, {
        current_completions: (quest as any).current_completions + 1,
      });

      // Update user XP (if user record exists)
      try {
        const users = await databases.listDocuments(DATABASE_ID, COLLECTIONS.USERS, [
          Query.equal('wallet_address', (submission as any).user_wallet),
          Query.limit(1),
        ]);
        if (users.documents.length > 0) {
          const user = users.documents[0] as any;
          await databases.updateDocument(DATABASE_ID, COLLECTIONS.USERS, user.$id, {
            total_points: user.total_points + xpAwarded,
          });
        }
      } catch (e) {
        // User might not exist
      }
    }

    const updated = await databases.updateDocument(DATABASE_ID, COLLECTIONS.QUEST_SUBMISSIONS, id, {
      status: body.status,
      review_notes: body.review_notes || null,
      reviewer_id: reviewerId,
      reviewed_at: new Date().toISOString(),
      xp_awarded: xpAwarded,
    });

    return c.json({ success: true, data: updated });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to review submission' }, 500);
  }
});

export { app as questsRoutes };
