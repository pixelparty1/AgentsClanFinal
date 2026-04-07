/* ══════════════════════════════════════════════════════════════════════════════
   Auth Routes
   ══════════════════════════════════════════════════════════════════════════════ */

import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { databases, DATABASE_ID, COLLECTIONS } from '../lib/appwrite';
import { ID, Query } from 'node-appwrite';

const app = new Hono();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// POST /api/auth/register
app.post('/register', zValidator('json', registerSchema), async (c) => {
  try {
    const body = c.req.valid('json');

    // Check if user already exists
    const existing = await databases.listDocuments(DATABASE_ID, COLLECTIONS.USERS_TABLE, [
      Query.equal('email', body.email),
      Query.limit(1),
    ]);

    if (existing.documents.length > 0) {
      return c.json({ success: false, error: 'Email already registered' }, 409);
    }

    // Create user document with email, password, and points (0)
    const user = await databases.createDocument(DATABASE_ID, COLLECTIONS.USERS_TABLE, ID.unique(), {
      email: body.email,
      password: body.password,
      points: 0,
    });

    return c.json(
      {
        success: true,
        data: {
          id: user.$id,
          email: user.email,
          points: user.points,
        },
      },
      201
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    return c.json({ success: false, error: error?.message || 'Registration failed' }, 500);
  }
});

// POST /api/auth/login
app.post('/login', zValidator('json', loginSchema), async (c) => {
  try {
    const body = c.req.valid('json');

    // Find user by email and password
    const result = await databases.listDocuments(DATABASE_ID, COLLECTIONS.USERS_TABLE, [
      Query.equal('email', body.email),
      Query.limit(1),
    ]);

    if (result.documents.length === 0) {
      return c.json({ success: false, error: 'Invalid credentials' }, 401);
    }

    const user = result.documents[0] as any;

    // Verify password
    if (user.password !== body.password) {
      return c.json({ success: false, error: 'Invalid credentials' }, 401);
    }

    return c.json({
      success: true,
      data: {
        id: user.$id,
        email: user.email,
        points: user.points,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return c.json({ success: false, error: error?.message || 'Login failed' }, 500);
  }
});

// GET /api/auth/points/:email
app.get('/points/:email', async (c) => {
  try {
    const email = c.req.param('email');

    const result = await databases.listDocuments(DATABASE_ID, COLLECTIONS.USERS_TABLE, [
      Query.equal('email', email),
      Query.limit(1),
    ]);

    if (result.documents.length === 0) {
      return c.json({ success: false, error: 'User not found' }, 404);
    }

    const user = result.documents[0] as any;

    return c.json({
      success: true,
      data: {
        email: user.email,
        points: user.points || 0,
      },
    });
  } catch (error: any) {
    console.error('Get points error:', error);
    return c.json({ success: false, error: error?.message || 'Failed to get points' }, 500);
  }
});

export { app as authRoutes };
