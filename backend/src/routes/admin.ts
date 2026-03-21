/* ══════════════════════════════════════════════════════════════════════════════
   Admin Routes
   General admin operations and announcements
   ══════════════════════════════════════════════════════════════════════════════ */

import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { databases, DATABASE_ID, COLLECTIONS } from '../lib/appwrite';
import { ID, Query } from 'node-appwrite';
import { walletAuth, requireAdmin, type AuthVariables } from '../middleware/auth';

const app = new Hono<{ Variables: AuthVariables }>();

app.use('*', walletAuth);

const announcementSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string(),
  type: z.enum(['info', 'warning', 'success', 'alert']),
  is_active: z.boolean().optional(),
  priority: z.number().int().min(1).max(10).optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  target_audience: z.enum(['all', 'members', 'bronze', 'silver', 'gold', 'platinum']).optional(),
});

// GET /api/admin/announcements
app.get('/announcements', async (c) => {
  try {
    const queries = [Query.orderDesc('priority'), Query.orderDesc('$createdAt')];

    // Non-admin only sees active announcements
    if (!c.get('isAdmin')) {
      queries.push(Query.equal('is_active', true));
    }

    const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.ANNOUNCEMENTS, queries);

    return c.json({
      success: true,
      data: {
        items: response.documents,
        total: response.total,
      },
    });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch announcements' }, 500);
  }
});

// POST /api/admin/announcements (admin only)
app.post('/announcements', requireAdmin, zValidator('json', announcementSchema), async (c) => {
  try {
    const body = c.req.valid('json');

    const announcement = await databases.createDocument(DATABASE_ID, COLLECTIONS.ANNOUNCEMENTS, ID.unique(), {
      ...body,
      is_active: body.is_active ?? true,
      priority: body.priority ?? 1,
      target_audience: body.target_audience ?? 'all',
    });

    return c.json({ success: true, data: announcement }, 201);
  } catch (error) {
    return c.json({ success: false, error: 'Failed to create announcement' }, 500);
  }
});

// PATCH /api/admin/announcements/:id (admin only)
app.patch('/announcements/:id', requireAdmin, zValidator('json', announcementSchema.partial()), async (c) => {
  try {
    const id = c.req.param('id');
    const body = c.req.valid('json');

    const announcement = await databases.updateDocument(DATABASE_ID, COLLECTIONS.ANNOUNCEMENTS, id, body);
    return c.json({ success: true, data: announcement });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to update announcement' }, 500);
  }
});

// DELETE /api/admin/announcements/:id (admin only)
app.delete('/announcements/:id', requireAdmin, async (c) => {
  try {
    const id = c.req.param('id');
    await databases.deleteDocument(DATABASE_ID, COLLECTIONS.ANNOUNCEMENTS, id);
    return c.json({ success: true, message: 'Announcement deleted' });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to delete announcement' }, 500);
  }
});

// GET /api/admin/job-applications
app.get('/job-applications', requireAdmin, async (c) => {
  try {
    const limit = parseInt(c.req.query('limit') || '25');
    const offset = parseInt(c.req.query('offset') || '0');
    const status = c.req.query('status');

    const queries = [Query.limit(limit), Query.offset(offset), Query.orderDesc('$createdAt')];

    if (status) {
      queries.push(Query.equal('status', status));
    }

    const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.JOB_APPLICATIONS, queries);

    return c.json({
      success: true,
      data: {
        items: response.documents,
        total: response.total,
      },
    });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch applications' }, 500);
  }
});

// PATCH /api/admin/job-applications/:id (admin only)
app.patch('/job-applications/:id', requireAdmin, async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const reviewerId = c.get('walletAddress');

    const application = await databases.updateDocument(DATABASE_ID, COLLECTIONS.JOB_APPLICATIONS, id, {
      status: body.status,
      notes: body.notes,
      reviewer_id: reviewerId,
    });

    return c.json({ success: true, data: application });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to update application' }, 500);
  }
});

export { app as adminRoutes };
