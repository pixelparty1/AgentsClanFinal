/* ══════════════════════════════════════════════════════════════════════════════
   Products Routes
   ══════════════════════════════════════════════════════════════════════════════ */

import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { databases, DATABASE_ID, COLLECTIONS, storage, BUCKETS } from '../lib/appwrite';
import { ID, Query } from 'node-appwrite';
import { walletAuth, requireAdmin, type AuthVariables } from '../middleware/auth';
import { slugify } from '@agentsclan/shared';

const app = new Hono<{ Variables: AuthVariables }>();

app.use('*', walletAuth);

const VALID_SIZES = ['double_extra_small', 'extra_small', 'small', 'medium', 'large', 'extra_large', 'double_extra_large'];

const productSchema = z.object({
  name: z.string().min(1).max(200),
  handle: z.string().optional(),
  description: z.string().optional(),
  price: z.number().positive(),
  category: z.string(),
  sizes: z.string().optional(),
  stock: z.boolean().optional(),
  active: z.boolean().optional(),
  images: z.array(z.string()).optional(),
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
      queries.push(Query.equal('active', true));
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
    console.error('Failed to fetch products:', error);
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

// POST /api/products/upload (admin only)
app.post('/upload', requireAdmin, async (c) => {
  try {
    const formData = await c.req.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return c.json({ success: false, error: 'No files provided' }, 400);
    }

    const fileUrls: string[] = [];
    let firstFileUrl = null;

    for (const file of files) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const fileId = ID.unique();
        await storage.createFile(
          BUCKETS.PRODUCT_IMAGES,
          fileId,
          file,
        );

        // Construct the public file URL (view endpoint)
        const endpoint = process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
        const project = process.env.APPWRITE_PROJECT_ID || '69a7f212001b0a737d22';
        const fileUrl = `${endpoint}/storage/buckets/${BUCKETS.PRODUCT_IMAGES}/files/${fileId}/view?project=${project}`;
        fileUrls.push(fileUrl);
        if (!firstFileUrl) firstFileUrl = fileUrl;
        console.log(`File uploaded successfully: ${file.name} (ID: ${fileId}) URL: ${fileUrl}`);
      } catch (uploadError) {
        console.error(`Failed to upload file ${file.name}:`, uploadError);
      }
    }

    return c.json({ 
      success: true, 
      data: { fileUrls, image_url: firstFileUrl },
      message: `${fileUrls.length} file(s) uploaded successfully`
    }, 201);
  } catch (error) {
    console.error('File upload error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return c.json({ success: false, error: errorMessage }, 500);
  }
});

// POST /api/products (admin only)
app.post('/', requireAdmin, async (c, next) => {
  // Manual validation with detailed error messages
  try {
    const body = await c.req.json();
    
    const validation = productSchema.safeParse(body);
    if (!validation.success) {
      const errors = validation.error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
      console.error('Validation failed:', errors);
      return c.json({ success: false, error: `Validation failed: ${errors}` }, 400);
    }

    await next();
  } catch (error) {
    console.error('Request parsing error:', error);
    return c.json({ success: false, error: 'Invalid request body' }, 400);
  }
}, async (c) => {
  try {
    const body = await c.req.json();
    const validation = productSchema.safeParse(body);
    if (!validation.success) {
      return c.json({ success: false, error: 'Validation failed' }, 400);
    }

    const validBody = validation.data;
    console.log('Creating product with data:', validBody);

    const createPayload: any = {
      name: validBody.name,
      handle: validBody.handle || slugify(validBody.name),
      description: validBody.description || null,
      price: validBody.price,
      category: validBody.category,
      stock: validBody.stock ?? false,
      active: validBody.active ?? true,
      sizes: validBody.sizes || '',
      images: validBody.images && validBody.images.length > 0 ? JSON.stringify(validBody.images) : JSON.stringify([]),
      image_url: Array.isArray(validBody.images) && validBody.images.length > 0 && typeof validBody.images[0] === 'string' && validBody.images[0].startsWith('http') ? validBody.images[0] : undefined,
    };

    const product = await databases.createDocument(DATABASE_ID, COLLECTIONS.PRODUCTS, ID.unique(), createPayload);

    console.log('Product created successfully:', product);
    return c.json({ success: true, data: product }, 201);
  } catch (error) {
    console.error('Failed to create product error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return c.json({ success: false, error: errorMessage }, 500);
  }
});

// PATCH /api/products/:id (admin only)
app.patch('/:id', requireAdmin, zValidator('json', productSchema.partial()), async (c) => {
  try {
    const id = c.req.param('id');
    const body = c.req.valid('json');

    const updateData: any = {};
    
    if (body.name !== undefined) {
      updateData.name = body.name;
      updateData.handle = body.handle || slugify(body.name);
    }
    if (body.handle !== undefined) updateData.handle = body.handle;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.price !== undefined) updateData.price = body.price;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.sizes !== undefined) updateData.sizes = body.sizes;
    if (body.stock !== undefined) updateData.stock = body.stock;
    if (body.active !== undefined) updateData.active = body.active;
    if (body.images !== undefined) updateData.images = body.images && body.images.length > 0 ? JSON.stringify(body.images) : JSON.stringify([]);

    const product = await databases.updateDocument(DATABASE_ID, COLLECTIONS.PRODUCTS, id, updateData);
    return c.json({ success: true, data: product });
  } catch (error) {
    console.error('Failed to update product:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return c.json({ success: false, error: errorMessage }, 500);
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

export { app as productsRoutes };
