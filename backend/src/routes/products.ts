/* ══════════════════════════════════════════════════════════════════════════════
   Products Routes
   ══════════════════════════════════════════════════════════════════════════════ */

import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { databases, DATABASE_ID, COLLECTIONS } from '../lib/appwrite';
import { ID, Query } from 'node-appwrite';
import { walletAuth, requireAdmin, type AuthVariables } from '../middleware/auth';
import { slugify } from '@agentsclan/shared';

const app = new Hono<{ Variables: AuthVariables }>();

app.use('*', walletAuth);

const productSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().optional(),
  details: z.array(z.string()).optional(),
  price: z.number().positive(),
  compare_price: z.number().positive().optional(),
  category: z.string(),
  images: z.array(z.string().url()).optional(),
  sizes: z.array(z.string()).optional(),
  stock: z.number().int().min(0).optional(),
  is_active: z.boolean().optional(),
  badge: z.string().optional(),
});

// GET /api/products
app.get('/', async (c) => {
  try {
    const limit = parseInt(c.req.query('limit') || '25');
    const offset = parseInt(c.req.query('offset') || '0');
    const category = c.req.query('category');
    const active = c.req.query('active');

    const queries = [Query.limit(limit), Query.offset(offset), Query.orderDesc('$createdAt')];

    if (category) {
      queries.push(Query.equal('category', category));
    }

    // Only show active products to non-admins
    if (active === 'true' || !c.get('isAdmin')) {
      queries.push(Query.equal('is_active', true));
    }

    const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.PRODUCTS, queries);

    return c.json({
      success: true,
      data: {
        items: response.documents,
        total: response.total,
      },
    });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch products' }, 500);
  }
});

// GET /api/products/:id
app.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const product = await databases.getDocument(DATABASE_ID, COLLECTIONS.PRODUCTS, id);
    return c.json({ success: true, data: product });
  } catch (error) {
    return c.json({ success: false, error: 'Product not found' }, 404);
  }
});

// POST /api/products (admin only)
app.post('/', requireAdmin, zValidator('json', productSchema), async (c) => {
  try {
    const body = c.req.valid('json');

    const product = await databases.createDocument(DATABASE_ID, COLLECTIONS.PRODUCTS, ID.unique(), {
      name: body.name,
      handle: slugify(body.name),
      description: body.description || null,
      details: body.details || [],
      price: body.price,
      compare_price: body.compare_price || null,
      category: body.category,
      images: body.images || [],
      sizes: body.sizes || [],
      stock: body.stock ?? 0,
      is_active: body.is_active ?? true,
      badge: body.badge || null,
      rating: 0,
      review_count: 0,
    });

    return c.json({ success: true, data: product }, 201);
  } catch (error) {
    return c.json({ success: false, error: 'Failed to create product' }, 500);
  }
});

// PATCH /api/products/:id (admin only)
app.patch('/:id', requireAdmin, zValidator('json', productSchema.partial()), async (c) => {
  try {
    const id = c.req.param('id');
    const body = c.req.valid('json');

    // Update handle if name changes
    const updateData: any = { ...body };
    if (body.name) {
      updateData.handle = slugify(body.name);
    }

    const product = await databases.updateDocument(DATABASE_ID, COLLECTIONS.PRODUCTS, id, updateData);
    return c.json({ success: true, data: product });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to update product' }, 500);
  }
});

// DELETE /api/products/:id (admin only)
app.delete('/:id', requireAdmin, async (c) => {
  try {
    const id = c.req.param('id');
    await databases.deleteDocument(DATABASE_ID, COLLECTIONS.PRODUCTS, id);
    return c.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to delete product' }, 500);
  }
});

// PATCH /api/products/:id/stock (admin only)
app.patch('/:id/stock', requireAdmin, async (c) => {
  try {
    const id = c.req.param('id');
    const { stock } = await c.req.json();

    if (typeof stock !== 'number' || stock < 0) {
      return c.json({ success: false, error: 'Invalid stock value' }, 400);
    }

    const product = await databases.updateDocument(DATABASE_ID, COLLECTIONS.PRODUCTS, id, { stock });
    return c.json({ success: true, data: product });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to update stock' }, 500);
  }
});

export { app as productsRoutes };
