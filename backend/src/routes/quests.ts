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
  instagram_url: z.string().url().optional(),
  facebook_url: z.string().url().optional(),
  twitter_url: z.string().url().optional(),
  linkedin_url: z.string().url().optional(),
  description: z.string().optional(),
  email: z.string().email().optional(),
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

// GET /api/quests/my-submissions (current wallet)
app.get('/my-submissions', requireWallet, async (c) => {
  try {
    const walletAddress = (c.get('walletAddress') || '').toLowerCase();
    const limit = parseInt(c.req.query('limit') || '200');

    const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.QUESTS_SUBMISSIONS, [
      Query.orderDesc('$createdAt'),
      Query.limit(limit),
    ]);

    const items = response.documents
      .map((doc: any) => {
        const rawDescription = (doc.Description || '') as string;
        const walletMatch = rawDescription.match(/\[\[WALLET:([^\]]+)\]\]/i);
        const qidMatch = rawDescription.match(/\[\[QID:([^\]]+)\]\]/i);
        const statusMatch = rawDescription.match(/\[\[STATUS:([^\]]+)\]\]/i);
        const msgMatch = rawDescription.match(/\[\[MSG:([^\]]+)\]\]/i);

        return {
          ...doc,
          _wallet: (walletMatch?.[1] || '').toLowerCase(),
          quest_id: qidMatch?.[1] || '',
          status: statusMatch?.[1] || 'pending',
          message: msgMatch?.[1] || null,
        };
      })
      .filter((doc: any) => doc._wallet === walletAddress);

    return c.json({
      success: true,
      data: {
        items,
        total: items.length,
      },
    });
  } catch (error: any) {
    return c.json({ success: false, error: error?.message || 'Failed to fetch submissions' }, 500);
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
    const walletAddress = (c.get('walletAddress') || '').toLowerCase();

    // Check if quest exists and is active
    const quest = await databases.getDocument(DATABASE_ID, COLLECTIONS.QUESTS, questId);
    if ((quest as any).active !== true) {
      return c.json({ success: false, error: 'Quest is not active' }, 400);
    }

    const encodedDescription = [
      `[[WALLET:${walletAddress}]]`,
      `[[QID:${questId}]]`,
      '[[STATUS:pending]]',
      `[[MSG:submission pending review]]`,
      body.email ? `[[EMAIL:${body.email}]]` : '',
      body.description || '',
    ].join(' ').trim();

    const submission = await databases.createDocument(DATABASE_ID, COLLECTIONS.QUESTS_SUBMISSIONS, ID.unique(), {
      Instagram_URL: body.instagram_url || null,
      Facebook_URL: body.facebook_url || null,
      Twitter_URL: body.twitter_url || null,
      Linkedin_URL: body.linkedin_url || null,
      Description: encodedDescription || null,
      status: null,
      points_submission: (quest as any).points,
    });

    return c.json({ success: true, data: submission }, 201);
  } catch (error: any) {
    console.error('Failed to submit quest proof:', error);
    return c.json({ success: false, error: error?.message || 'Failed to submit' }, 500);
  }
});

// GET /api/quests/submissions (admin only)
app.get('/admin/submissions', requireAdmin, async (c) => {
  try {
    const limit = parseInt(c.req.query('limit') || '25');
    const offset = parseInt(c.req.query('offset') || '0');
    const status = c.req.query('status');

    const queries: any[] = [
      Query.limit(limit),
      Query.offset(offset),
      Query.orderDesc('$createdAt'),
    ];
    if (status === 'approved') {
      queries.push(Query.equal('status', true));
    } else if (status === 'rejected') {
      queries.push(Query.equal('status', false));
    }

    const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.QUESTS_SUBMISSIONS, queries);

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

    const submission = await databases.getDocument(DATABASE_ID, COLLECTIONS.QUESTS_SUBMISSIONS, id);
    const currentDescription = ((submission as any).Description || '') as string;
    const emailMatch = currentDescription.match(/\[\[EMAIL:([^\]]+)\]\]/);
    const userEmail = emailMatch?.[1] || null;

    const plainDescription = currentDescription
      .replace(/\[\[WALLET:[^\]]+\]\]/g, '')
      .replace(/\[\[QID:[^\]]+\]\]/g, '')
      .replace(/\[\[STATUS:[^\]]+\]\]/g, '')
      .replace(/\[\[MSG:[^\]]+\]\]/g, '')
      .replace(/\[\[EMAIL:[^\]]+\]\]/g, '')
      .trim();

    const userMessage =
      body.status === 'approved'
        ? 'quests approved points have been rewarded'
        : 'quests rejected please verify and submit again';

    const walletMatch = currentDescription.match(/\[\[WALLET:([^\]]+)\]\]/);
    const walletToken = walletMatch ? `[[WALLET:${walletMatch[1]}]]` : '';
    const questIdMatch = currentDescription.match(/\[\[QID:([^\]]+)\]\]/);
    const qidToken = questIdMatch ? `[[QID:${questIdMatch[1]}]]` : '';
    const emailToken = userEmail ? `[[EMAIL:${userEmail}]]` : '';
    const encodedDescription = [
      walletToken,
      qidToken,
      `[[STATUS:${body.status}]]`,
      `[[MSG:${userMessage}]]`,
      emailToken,
      plainDescription,
    ].join(' ').trim();

    const updated = await databases.updateDocument(DATABASE_ID, COLLECTIONS.QUESTS_SUBMISSIONS, id, {
      Description: encodedDescription,
      status: body.status === 'approved',
    });

    // If approved, update user points in users table
    if (body.status === 'approved' && userEmail) {
      try {
        const pointsToAdd = (submission as any).points_submission || 0;

        // Find user by email
        const userResult = await databases.listDocuments(DATABASE_ID, COLLECTIONS.USERS_TABLE, [
          Query.equal('email', userEmail),
          Query.limit(1),
        ]);

        if (userResult.documents.length > 0) {
          const user = userResult.documents[0] as any;
          const currentPoints = user.points || 0;
          const newPoints = currentPoints + pointsToAdd;

          // Update user points
          await databases.updateDocument(DATABASE_ID, COLLECTIONS.USERS_TABLE, user.$id, {
            points: newPoints,
          });
        }
      } catch (pointsError: any) {
        console.error('Failed to update user points:', pointsError);
        // Don't fail the request if points update fails
      }
    }

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
