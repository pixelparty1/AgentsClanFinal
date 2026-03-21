/* ══════════════════════════════════════════════════════════════════════════════
   Quests Routes
   ══════════════════════════════════════════════════════════════════════════════ */

import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { databases, DATABASE_ID, COLLECTIONS } from '../lib/appwrite';
import { ensureCollectionPermissions } from '../lib/permissions';
import { ID, Query } from 'node-appwrite';
import { walletAuth, requireWallet, requireAdmin, type AuthVariables } from '../middleware/auth';
import { calculateXP } from '@agentsclan/shared';

const app = new Hono<{ Variables: AuthVariables }>();

app.use('*', walletAuth);

const questSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1),
  points: z.number().int().positive(),
  active: z.boolean().optional().default(true),
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

    const queries = [Query.limit(limit), Query.offset(offset), Query.orderDesc('$createdAt')];

    // Only show active quests to non-admins
    if (!c.get('isAdmin')) {
      queries.push(Query.equal('active', true));
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

// POST /api/quests
app.post('/', zValidator('json', questSchema), async (c) => {
  try {
    const body = c.req.valid('json');

    // Ensure collection has proper permissions
    await ensureCollectionPermissions(databases, DATABASE_ID, COLLECTIONS.QUESTS);

    const quest = await databases.createDocument(DATABASE_ID, COLLECTIONS.QUESTS, ID.unique(), {
      title: body.title,
      description: body.description,
      points: body.points,
      active: body.active ?? true,
    });

    return c.json({ success: true, data: quest }, 201);
  } catch (error: any) {
    console.error('Create quest error:', error);
    if (error.message?.includes('No permissions')) {
      return c.json({ 
        success: false, 
        error: 'Appwrite permissions not configured. Please check your Appwrite console collection permissions.' 
      }, 403);
    }
    return c.json({ success: false, error: error.message || 'Failed to create quest' }, 500);
  }
});

// PATCH /api/quests/:id
app.patch('/:id', zValidator('json', questSchema.partial()), async (c) => {
  try {
    const id = c.req.param('id');
    const body = c.req.valid('json');

    // Ensure collection has proper permissions
    await ensureCollectionPermissions(databases, DATABASE_ID, COLLECTIONS.QUESTS);

    const updateData: any = {};
    if ('title' in body) updateData.title = body.title;
    if ('description' in body) updateData.description = body.description;
    if ('points' in body) updateData.points = body.points;
    if ('active' in body) updateData.active = body.active;

    const quest = await databases.updateDocument(DATABASE_ID, COLLECTIONS.QUESTS, id, updateData);
    return c.json({ success: true, data: quest });
  } catch (error: any) {
    console.error('Update quest error:', error);
    if (error.message?.includes('No permissions')) {
      return c.json({ 
        success: false, 
        error: 'Appwrite permissions not configured. Please check your Appwrite console collection permissions.' 
      }, 403);
    }
    return c.json({ success: false, error: error.message || 'Failed to update quest' }, 500);
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
    if ((quest as any).active !== true) {
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

    let pointsAwarded = 0;

    if (body.status === 'approved') {
      pointsAwarded = (quest as any).points;

      // Update user points (if user record exists)
      try {
        const users = await databases.listDocuments(DATABASE_ID, COLLECTIONS.USERS, [
          Query.equal('wallet_address', (submission as any).user_wallet),
          Query.limit(1),
        ]);
        if (users.documents.length > 0) {
          const user = users.documents[0] as any;
          await databases.updateDocument(DATABASE_ID, COLLECTIONS.USERS, user.$id, {
            total_points: (user.total_points || 0) + pointsAwarded,
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
      points_awarded: pointsAwarded,
    });

    return c.json({ success: true, data: updated });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to review submission' }, 500);
  }
});

// DELETE /api/quests/:id
app.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id');

    // Ensure collection has proper permissions
    await ensureCollectionPermissions(databases, DATABASE_ID, COLLECTIONS.QUESTS);

    await databases.deleteDocument(DATABASE_ID, COLLECTIONS.QUESTS, id);
    return c.json({ success: true, message: 'Quest deleted' });
  } catch (error: any) {
    console.error('Delete quest error:', error);
    if (error.message?.includes('No permissions')) {
      return c.json({ 
        success: false, 
        error: 'Appwrite permissions not configured. Please check your Appwrite console collection permissions.' 
      }, 403);
    }
    return c.json({ success: false, error: error.message || 'Failed to delete quest' }, 500);
  }
});

export { app as questsRoutes };
