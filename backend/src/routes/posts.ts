/* ══════════════════════════════════════════════════════════════════════════════
   Posts Routes
   ══════════════════════════════════════════════════════════════════════════════ */

import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { databases, DATABASE_ID, COLLECTIONS } from '../lib/appwrite';
import { ID, Query } from 'node-appwrite';
import { walletAuth, requireAdmin, type AuthVariables } from '../middleware/auth';

const app = new Hono<{ Variables: AuthVariables }>();

app.use('*', walletAuth);

const postSchema = z.object({
  title: z.string().min(1).max(300),
  content: z.string(),
  excerpt: z.string().optional(),
  cover_image_url: z.string().url().optional(),
  category: z.string(),
  tags: z.array(z.string()).optional(),
  is_published: z.boolean().optional(),
  is_pinned: z.boolean().optional(),
});

// GET /api/posts
app.get('/', async (c) => {
  try {
    const limit = parseInt(c.req.query('limit') || '25');
    const offset = parseInt(c.req.query('offset') || '0');
    const category = c.req.query('category');

    const queries = [Query.limit(limit), Query.offset(offset), Query.orderDesc('$createdAt')];

    if (category) {
      queries.push(Query.equal('category', category));
    }

    // Only show published posts to non-admins
    if (!c.get('isAdmin')) {
      queries.push(Query.equal('is_published', true));
    }

    const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.POSTS, queries);

    return c.json({
      success: true,
      data: {
        items: response.documents,
        total: response.total,
      },
    });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch posts' }, 500);
  }
});

// GET /api/posts/:id
app.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const post = await databases.getDocument(DATABASE_ID, COLLECTIONS.POSTS, id);

    // Increment view count
    await databases.updateDocument(DATABASE_ID, COLLECTIONS.POSTS, id, {
      view_count: ((post as any).view_count || 0) + 1,
    });

    return c.json({ success: true, data: post });
  } catch (error) {
    return c.json({ success: false, error: 'Post not found' }, 404);
  }
});

// POST /api/posts (admin only)
app.post('/', requireAdmin, zValidator('json', postSchema), async (c) => {
  try {
    const body = c.req.valid('json');
    const walletAddress = c.get('walletAddress');

    const post = await databases.createDocument(DATABASE_ID, COLLECTIONS.POSTS, ID.unique(), {
      ...body,
      author_id: walletAddress,
      view_count: 0,
    });

    return c.json({ success: true, data: post }, 201);
  } catch (error) {
    return c.json({ success: false, error: 'Failed to create post' }, 500);
  }
});

// PATCH /api/posts/:id (admin only)
app.patch('/:id', requireAdmin, zValidator('json', postSchema.partial()), async (c) => {
  try {
    const id = c.req.param('id');
    const body = c.req.valid('json');

    const post = await databases.updateDocument(DATABASE_ID, COLLECTIONS.POSTS, id, body);
    return c.json({ success: true, data: post });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to update post' }, 500);
  }
});

// DELETE /api/posts/:id (admin only)
app.delete('/:id', requireAdmin, async (c) => {
  try {
    const id = c.req.param('id');
    await databases.deleteDocument(DATABASE_ID, COLLECTIONS.POSTS, id);
    return c.json({ success: true, message: 'Post deleted' });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to delete post' }, 500);
  }
});

export { app as postsRoutes };
