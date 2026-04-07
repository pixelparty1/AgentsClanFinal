import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { secureHeaders } from 'hono/secure-headers';
import { timing } from 'hono/timing';

import { authRoutes } from './routes/auth';
import { checkoutRoutes } from './routes/checkout';
import { webhookRoutes } from './routes/webhook';
import { mintRoutes } from './routes/mint';
import { usersRoutes } from './routes/users';
import { productsRoutes } from './routes/products';
import { ordersRoutes } from './routes/orders';
import { membershipsRoutes } from './routes/memberships';
import { questsRoutes } from './routes/quests';
import { eventsRoutes } from './routes/events';
import { postsRoutes } from './routes/posts';
import { analyticsRoutes } from './routes/analytics';
import { adminRoutes } from './routes/admin';

const app = new Hono();

// Middleware
app.use('*', logger());
app.use('*', timing());
app.use('*', prettyJSON());
app.use('*', secureHeaders());

// CORS configuration
app.use(
  '*',
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'X-Wallet-Address'],
    credentials: true,
    maxAge: 86400,
  })
);

// Health check
app.get('/health', (c) => {
  return c.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// API documentation
app.get('/docs', (c) => {
  return c.json({
    name: 'AgentsClan API',
    version: '1.0.0',
    description: 'Backend API for AgentsClan Web3 Community Platform',
    endpoints: {
      auth: {
        'POST /api/auth/verify': 'Verify wallet signature',
      },
      checkout: {
        'POST /api/checkout': 'Create Stripe checkout session',
        'GET /api/checkout/:sessionId': 'Get checkout session status',
      },
      webhook: {
        'POST /api/webhook/stripe': 'Handle Stripe webhooks',
      },
      mint: {
        'POST /api/mint/gasless': 'Gasless NFT minting',
        'POST /api/mint/direct': 'Direct NFT minting',
      },
      users: {
        'GET /api/users': 'List users',
        'GET /api/users/:id': 'Get user by ID',
        'POST /api/users': 'Create user',
        'PATCH /api/users/:id': 'Update user',
      },
      products: {
        'GET /api/products': 'List products',
        'GET /api/products/:id': 'Get product by ID',
        'POST /api/products': 'Create product (admin)',
        'PATCH /api/products/:id': 'Update product (admin)',
        'DELETE /api/products/:id': 'Delete product (admin)',
      },
      orders: {
        'GET /api/orders': 'List orders',
        'GET /api/orders/:id': 'Get order by ID',
        'PATCH /api/orders/:id/status': 'Update order status',
      },
      memberships: {
        'GET /api/memberships': 'List memberships',
        'GET /api/memberships/:wallet': 'Get membership by wallet',
      },
      quests: {
        'GET /api/quests': 'List quests',
        'GET /api/quests/:id': 'Get quest by ID',
        'POST /api/quests/:id/submit': 'Submit quest proof',
        'PATCH /api/quests/submissions/:id': 'Review submission (admin)',
      },
      events: {
        'GET /api/events': 'List events',
        'GET /api/events/:id': 'Get event by ID',
        'POST /api/events': 'Create event (admin)',
        'PATCH /api/events/:id': 'Update event (admin)',
      },
      posts: {
        'GET /api/posts': 'List posts',
        'GET /api/posts/:id': 'Get post by ID',
        'POST /api/posts': 'Create post (admin)',
        'PATCH /api/posts/:id': 'Update post (admin)',
      },
      analytics: {
        'GET /api/analytics/dashboard': 'Get dashboard stats (admin)',
        'GET /api/analytics/daily': 'Get daily analytics (admin)',
      },
      admin: {
        'GET /api/admin/stats': 'Get admin stats',
        'POST /api/admin/announcements': 'Create announcement',
      },
    },
  });
});

// Mount routes
app.route('/api/auth', authRoutes);
app.route('/api/checkout', checkoutRoutes);
app.route('/api/webhook', webhookRoutes);
app.route('/api/mint', mintRoutes);
app.route('/api/users', usersRoutes);
app.route('/api/products', productsRoutes);
app.route('/api/orders', ordersRoutes);
app.route('/api/memberships', membershipsRoutes);
app.route('/api/quests', questsRoutes);
app.route('/api/events', eventsRoutes);
app.route('/api/posts', postsRoutes);
app.route('/api/analytics', analyticsRoutes);
app.route('/api/admin', adminRoutes);

// 404 handler
app.notFound((c) => {
  return c.json(
    {
      success: false,
      error: 'Not Found',
      message: `Route ${c.req.method} ${c.req.path} not found`,
    },
    404
  );
});

// Error handler
app.onError((err, c) => {
  console.error('Server error:', err);
  return c.json(
    {
      success: false,
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred',
    },
    500
  );
});

export { app };
