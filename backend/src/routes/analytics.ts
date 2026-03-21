/* ══════════════════════════════════════════════════════════════════════════════
   Analytics Routes
   ══════════════════════════════════════════════════════════════════════════════ */

import { Hono } from 'hono';
import { databases, DATABASE_ID, COLLECTIONS } from '../lib/appwrite';
import { Query } from 'node-appwrite';
import { walletAuth, requireAdmin, type AuthVariables } from '../middleware/auth';
import type { DashboardStats } from '@agentsclan/shared';

const app = new Hono<{ Variables: AuthVariables }>();

app.use('*', walletAuth);

// GET /api/analytics/dashboard (admin only)
app.get('/dashboard', requireAdmin, async (c) => {
  try {
    const [users, orders, posts, submissions, quests, events, applications] = await Promise.all([
      databases.listDocuments(DATABASE_ID, COLLECTIONS.USERS, [Query.limit(1)]),
      databases.listDocuments(DATABASE_ID, COLLECTIONS.ORDERS, [Query.limit(1)]),
      databases.listDocuments(DATABASE_ID, COLLECTIONS.POSTS, [Query.limit(1)]),
      databases.listDocuments(DATABASE_ID, COLLECTIONS.QUEST_SUBMISSIONS, [
        Query.equal('status', 'pending'),
        Query.limit(1),
      ]),
      databases.listDocuments(DATABASE_ID, COLLECTIONS.QUESTS, [Query.equal('status', 'active'), Query.limit(1)]),
      databases.listDocuments(DATABASE_ID, COLLECTIONS.EVENTS, [
        Query.greaterThanEqual('event_date', new Date().toISOString()),
        Query.limit(1),
      ]),
      databases.listDocuments(DATABASE_ID, COLLECTIONS.JOB_APPLICATIONS, [
        Query.equal('status', 'pending'),
        Query.limit(1),
      ]),
    ]);

    // Calculate total revenue from orders
    const paidOrders = await databases.listDocuments(DATABASE_ID, COLLECTIONS.ORDERS, [
      Query.notEqual('status', 'cancelled'),
      Query.notEqual('status', 'refunded'),
      Query.limit(1000),
    ]);

    const totalRevenue = paidOrders.documents.reduce((sum, order: any) => sum + (order.total_price || 0), 0);

    const stats: DashboardStats = {
      totalUsers: users.total,
      totalOrders: orders.total,
      totalRevenue,
      totalPosts: posts.total,
      pendingSubmissions: submissions.total,
      activeQuests: quests.total,
      upcomingEvents: events.total,
      pendingApplications: applications.total,
    };

    return c.json({ success: true, data: stats });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return c.json({ success: false, error: 'Failed to fetch stats' }, 500);
  }
});

// GET /api/analytics/daily (admin only)
app.get('/daily', requireAdmin, async (c) => {
  try {
    const days = parseInt(c.req.query('days') || '30');
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.ANALYTICS, [
      Query.greaterThanEqual('date', startDate.toISOString().split('T')[0]),
      Query.orderDesc('date'),
      Query.limit(days),
    ]);

    return c.json({
      success: true,
      data: {
        items: response.documents,
        total: response.total,
      },
    });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch analytics' }, 500);
  }
});

// GET /api/analytics/revenue (admin only)
app.get('/revenue', requireAdmin, async (c) => {
  try {
    const period = c.req.query('period') || '30d';
    const days = period === '7d' ? 7 : period === '90d' ? 90 : period === '1y' ? 365 : 30;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const orders = await databases.listDocuments(DATABASE_ID, COLLECTIONS.ORDERS, [
      Query.greaterThanEqual('$createdAt', startDate.toISOString()),
      Query.notEqual('status', 'cancelled'),
      Query.notEqual('status', 'refunded'),
      Query.limit(1000),
    ]);

    const memberships = await databases.listDocuments(DATABASE_ID, COLLECTIONS.MEMBERSHIPS, [
      Query.greaterThanEqual('$createdAt', startDate.toISOString()),
      Query.equal('status', 'minted'),
      Query.limit(1000),
    ]);

    const orderRevenue = orders.documents.reduce((sum, o: any) => sum + (o.total_price || 0), 0);
    const membershipRevenue = memberships.documents.reduce((sum, m: any) => sum + (m.price_paid || 0), 0);

    return c.json({
      success: true,
      data: {
        period,
        totalRevenue: orderRevenue + membershipRevenue,
        orderRevenue,
        membershipRevenue,
        ordersCount: orders.total,
        membershipsCount: memberships.total,
      },
    });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch revenue' }, 500);
  }
});

export { app as analyticsRoutes };
