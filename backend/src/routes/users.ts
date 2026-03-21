/* ══════════════════════════════════════════════════════════════════════════════
   Users Routes
   ══════════════════════════════════════════════════════════════════════════════ */

import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { databases, DATABASE_ID, COLLECTIONS } from '../lib/appwrite';
import { ID, Query } from 'node-appwrite';
import { walletAuth, requireWallet, requireAdmin, type AuthVariables } from '../middleware/auth';

const app = new Hono<{ Variables: AuthVariables }>();

app.use('*', walletAuth);

const createUserSchema = z.object({
  wallet_address: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  email: z.string().email().optional(),
  username: z.string().min(3).max(30).optional(),
  avatar_url: z.string().url().optional(),
});

const updateUserSchema = z.object({
  email: z.string().email().optional(),
  username: z.string().min(3).max(30).optional(),
  avatar_url: z.string().url().optional(),
  role: z.enum(['member', 'admin', 'moderator']).optional(),
});

// GET /api/users
app.get('/', async (c) => {
  try {
    const limit = parseInt(c.req.query('limit') || '25');
    const offset = parseInt(c.req.query('offset') || '0');

    const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.USERS, [
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
    return c.json({ success: false, error: 'Failed to fetch users' }, 500);
  }
});

// GET /api/users/:id
app.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const user = await databases.getDocument(DATABASE_ID, COLLECTIONS.USERS, id);
    return c.json({ success: true, data: user });
  } catch (error) {
    return c.json({ success: false, error: 'User not found' }, 404);
  }
});

// GET /api/users/wallet/:address
app.get('/wallet/:address', async (c) => {
  try {
    const address = c.req.param('address').toLowerCase();
    const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.USERS, [
      Query.equal('wallet_address', address),
      Query.limit(1),
    ]);

    if (response.documents.length === 0) {
      return c.json({ success: false, error: 'User not found' }, 404);
    }

    return c.json({ success: true, data: response.documents[0] });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch user' }, 500);
  }
});

// POST /api/users
app.post('/', zValidator('json', createUserSchema), async (c) => {
  try {
    const body = c.req.valid('json');

    // Check if user already exists
    const existing = await databases.listDocuments(DATABASE_ID, COLLECTIONS.USERS, [
      Query.equal('wallet_address', body.wallet_address.toLowerCase()),
      Query.limit(1),
    ]);

    if (existing.documents.length > 0) {
      return c.json({ success: true, data: existing.documents[0] });
    }

    const user = await databases.createDocument(DATABASE_ID, COLLECTIONS.USERS, ID.unique(), {
      wallet_address: body.wallet_address.toLowerCase(),
      email: body.email || null,
      username: body.username || null,
      avatar_url: body.avatar_url || null,
      role: 'member',
      total_points: 0,
      streak_days: 0,
    });

    return c.json({ success: true, data: user }, 201);
  } catch (error) {
    return c.json({ success: false, error: 'Failed to create user' }, 500);
  }
});

// PATCH /api/users/:id
app.patch('/:id', requireWallet, zValidator('json', updateUserSchema), async (c) => {
  try {
    const id = c.req.param('id');
    const body = c.req.valid('json');

    // Only admin can change roles
    if (body.role && !c.get('isAdmin')) {
      return c.json({ success: false, error: 'Admin required to change roles' }, 403);
    }

    const user = await databases.updateDocument(DATABASE_ID, COLLECTIONS.USERS, id, body);
    return c.json({ success: true, data: user });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to update user' }, 500);
  }
});

export { app as usersRoutes };
