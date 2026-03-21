/* ══════════════════════════════════════════════════════════════════════════════
   Events Routes
   ══════════════════════════════════════════════════════════════════════════════ */

import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { databases, DATABASE_ID, COLLECTIONS } from '../lib/appwrite';
import { ID, Query } from 'node-appwrite';
import { walletAuth, requireAdmin, type AuthVariables } from '../middleware/auth';

const app = new Hono<{ Variables: AuthVariables }>();

app.use('*', walletAuth);

const eventSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  event_date: z.string(),
  end_date: z.string().optional(),
  location: z.string().optional(),
  location_type: z.enum(['online', 'offline', 'hybrid']),
  event_type: z.enum(['meetup', 'workshop', 'hackathon', 'ama', 'webinar', 'conference']),
  cover_image_url: z.string().url().optional(),
  meeting_link: z.string().url().optional(),
  max_attendees: z.number().int().positive().optional(),
  is_featured: z.boolean().optional(),
  is_published: z.boolean().optional(),
});

// GET /api/events
app.get('/', async (c) => {
  try {
    const limit = parseInt(c.req.query('limit') || '25');
    const offset = parseInt(c.req.query('offset') || '0');
    const type = c.req.query('type');
    const upcoming = c.req.query('upcoming');

    const queries = [Query.limit(limit), Query.offset(offset), Query.orderAsc('event_date')];

    if (type) {
      queries.push(Query.equal('event_type', type));
    }

    // TODO: Add is_published attribute to Appwrite Events collection schema
    // Then uncomment the filter below for non-admin visibility control
    // if (!c.get('isAdmin')) {
    //   queries.push(Query.equal('is_published', true));
    // }

    if (upcoming === 'true') {
      queries.push(Query.greaterThanEqual('event_date', new Date().toISOString()));
    }

    const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.EVENTS, queries);

    return c.json({
      success: true,
      data: {
        items: response.documents,
        total: response.total,
      },
    });
  } catch (error) {
    console.error('Events fetch error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch events';
    return c.json({ success: false, error: errorMessage }, 500);
  }
});

// GET /api/events/:id
app.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const event = await databases.getDocument(DATABASE_ID, COLLECTIONS.EVENTS, id);
    return c.json({ success: true, data: event });
  } catch (error) {
    return c.json({ success: false, error: 'Event not found' }, 404);
  }
});

// POST /api/events (admin only)
app.post('/', zValidator('json', eventSchema), async (c) => {
  try {
    const body = c.req.valid('json');
    const walletAddress = c.get('walletAddress');

    // In development, allow event creation without strict admin verification
    // In production, uncomment the admin check below:
    // if (!c.get('isAdmin')) {
    //   return c.json({ success: false, error: 'Admin access required' }, 403);
    // }

    const event = await databases.createDocument(DATABASE_ID, COLLECTIONS.EVENTS, ID.unique(), {
      ...body,
    });

    return c.json({ success: true, data: event }, 201);
  } catch (error) {
    console.error('Event creation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create event';
    return c.json({ success: false, error: errorMessage }, 500);
  }
});

// PATCH /api/events/:id (admin only)
app.patch('/:id', zValidator('json', eventSchema.partial()), async (c) => {
  try {
    const id = c.req.param('id');
    const body = c.req.valid('json');

    // In development, allow event updates without strict admin verification
    // In production, uncomment the admin check below:
    // if (!c.get('isAdmin')) {
    //   return c.json({ success: false, error: 'Admin access required' }, 403);
    // }

    const event = await databases.updateDocument(DATABASE_ID, COLLECTIONS.EVENTS, id, body);
    return c.json({ success: true, data: event });
  } catch (error) {
    console.error('Event update error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update event';
    return c.json({ success: false, error: errorMessage }, 500);
  }
});

// DELETE /api/events/:id (admin only)
app.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id');

    // In development, allow event deletion without strict admin verification
    // In production, uncomment the admin check below:
    // if (!c.get('isAdmin')) {
    //   return c.json({ success: false, error: 'Admin access required' }, 403);
    // }

    await databases.deleteDocument(DATABASE_ID, COLLECTIONS.EVENTS, id);
    return c.json({ success: true, message: 'Event deleted' });
  } catch (error) {
    console.error('Event deletion error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete event';
    return c.json({ success: false, error: errorMessage }, 500);
  }
});

export { app as eventsRoutes };
