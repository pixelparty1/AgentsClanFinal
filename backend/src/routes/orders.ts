/* ══════════════════════════════════════════════════════════════════════════════
   Orders Routes
   ══════════════════════════════════════════════════════════════════════════════ */

import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { databases, DATABASE_ID, COLLECTIONS } from '../lib/appwrite';
import { Query } from 'node-appwrite';
import { walletAuth, requireWallet, requireAdmin, type AuthVariables } from '../middleware/auth';

const app = new Hono<{ Variables: AuthVariables }>();

app.use('*', walletAuth);

const updateStatusSchema = z.object({
  status: z.enum(['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']),
  tracking_number: z.string().optional(),
  notes: z.string().optional(),
});

// GET /api/orders
app.get('/', requireWallet, async (c) => {
  try {
    const limit = parseInt(c.req.query('limit') || '25');
    const offset = parseInt(c.req.query('offset') || '0');
    const status = c.req.query('status');
    const wallet = c.req.query('wallet');

    const queries = [Query.limit(limit), Query.offset(offset), Query.orderDesc('$createdAt')];

    if (status) {
      queries.push(Query.equal('status', status));
    }

    // Non-admin users can only see their own orders
    const isAdmin = c.get('isAdmin');
    const walletAddress = c.get('walletAddress');

    if (!isAdmin) {
      queries.push(Query.equal('user_wallet', walletAddress!));
    } else if (wallet) {
      queries.push(Query.equal('user_wallet', wallet));
    }

    const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.ORDERS, queries);

    return c.json({
      success: true,
      data: {
        items: response.documents,
        total: response.total,
      },
    });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch orders' }, 500);
  }
});

// GET /api/orders/:id
app.get('/:id', requireWallet, async (c) => {
  try {
    const id = c.req.param('id');
    const order = await databases.getDocument(DATABASE_ID, COLLECTIONS.ORDERS, id);

    // Non-admin can only view their own orders
    const isAdmin = c.get('isAdmin');
    const walletAddress = c.get('walletAddress');

    if (!isAdmin && (order as any).user_wallet !== walletAddress) {
      return c.json({ success: false, error: 'Not authorized' }, 403);
    }

    // Get order items
    const items = await databases.listDocuments(DATABASE_ID, COLLECTIONS.ORDER_ITEMS, [
      Query.equal('order_id', id),
    ]);

    return c.json({
      success: true,
      data: {
        ...order,
        items: items.documents,
      },
    });
  } catch (error) {
    return c.json({ success: false, error: 'Order not found' }, 404);
  }
});

// PATCH /api/orders/:id/status (admin only)
app.patch('/:id/status', requireAdmin, zValidator('json', updateStatusSchema), async (c) => {
  try {
    const id = c.req.param('id');
    const body = c.req.valid('json');

    const order = await databases.updateDocument(DATABASE_ID, COLLECTIONS.ORDERS, id, {
      status: body.status,
      tracking_number: body.tracking_number,
      notes: body.notes,
    });

    return c.json({ success: true, data: order });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to update order' }, 500);
  }
});

// GET /api/orders/stats (admin only)
app.get('/admin/stats', requireAdmin, async (c) => {
  try {
    const statuses = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
    const stats: Record<string, number> = {};

    for (const status of statuses) {
      const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.ORDERS, [
        Query.equal('status', status),
        Query.limit(1),
      ]);
      stats[status] = response.total;
    }

    return c.json({ success: true, data: stats });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch stats' }, 500);
  }
});

export { app as ordersRoutes };
