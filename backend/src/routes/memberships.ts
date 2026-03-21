/* ══════════════════════════════════════════════════════════════════════════════
   Memberships Routes
   ══════════════════════════════════════════════════════════════════════════════ */

import { Hono } from 'hono';
import { databases, DATABASE_ID, COLLECTIONS } from '../lib/appwrite';
import { Query } from 'node-appwrite';
import { walletAuth, requireAdmin, type AuthVariables } from '../middleware/auth';

const app = new Hono<{ Variables: AuthVariables }>();

app.use('*', walletAuth);

// GET /api/memberships
app.get('/', requireAdmin, async (c) => {
  try {
    const limit = parseInt(c.req.query('limit') || '25');
    const offset = parseInt(c.req.query('offset') || '0');
    const tier = c.req.query('tier');
    const status = c.req.query('status');

    const queries = [Query.limit(limit), Query.offset(offset), Query.orderDesc('$createdAt')];

    if (tier) {
      queries.push(Query.equal('tier', tier));
    }

    if (status) {
      queries.push(Query.equal('status', status));
    }

    const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.MEMBERSHIPS, queries);

    return c.json({
      success: true,
      data: {
        items: response.documents,
        total: response.total,
      },
    });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch memberships' }, 500);
  }
});

// GET /api/memberships/wallet/:address
app.get('/wallet/:address', async (c) => {
  try {
    const address = c.req.param('address').toLowerCase();

    const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.MEMBERSHIPS, [
      Query.equal('wallet_address', address),
      Query.orderDesc('$createdAt'),
      Query.limit(1),
    ]);

    if (response.documents.length === 0) {
      return c.json({
        success: true,
        data: {
          hasMembership: false,
          tier: 'free',
        },
      });
    }

    const membership = response.documents[0] as any;

    return c.json({
      success: true,
      data: {
        hasMembership: true,
        ...membership,
      },
    });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch membership' }, 500);
  }
});

// GET /api/memberships/stats (admin only)
app.get('/admin/stats', requireAdmin, async (c) => {
  try {
    const tiers = ['bronze', 'silver', 'gold', 'platinum'];
    const stats: Record<string, number> = { total: 0 };

    for (const tier of tiers) {
      const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.MEMBERSHIPS, [
        Query.equal('tier', tier),
        Query.equal('status', 'minted'),
        Query.limit(1),
      ]);
      stats[tier] = response.total;
      stats.total += response.total;
    }

    return c.json({ success: true, data: stats });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch stats' }, 500);
  }
});

export { app as membershipsRoutes };
