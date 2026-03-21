/* ══════════════════════════════════════════════════════════════════════════════
   Checkout Routes
   Handles Stripe checkout session creation
   ══════════════════════════════════════════════════════════════════════════════ */

import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { createCheckoutSession, createMembershipCheckout, getCheckoutSession, MEMBERSHIP_TIERS } from '../lib/stripe';
import { walletAuth, requireWallet, type AuthVariables } from '../middleware/auth';
import type { CheckoutItem, ShippingAddress, MembershipTier } from '@agentsclan/shared';

const app = new Hono<{ Variables: AuthVariables }>();

// Apply wallet auth to all routes
app.use('*', walletAuth);

// Checkout request schema
const checkoutSchema = z.object({
  type: z.enum(['membership', 'store']),
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  tier: z.enum(['bronze', 'silver', 'gold', 'platinum']).optional(),
  items: z
    .array(
      z.object({
        productId: z.string(),
        name: z.string(),
        price: z.number().positive(),
        quantity: z.number().int().positive(),
        size: z.string().optional(),
        image: z.string().optional(),
      })
    )
    .optional(),
  customerEmail: z.string().email().optional(),
  shippingAddress: z
    .object({
      name: z.string(),
      phone: z.string(),
      address: z.string(),
      city: z.string(),
      state: z.string(),
      pincode: z.string(),
      email: z.string().email().optional(),
    })
    .optional(),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
});

/**
 * POST /api/checkout
 * Create a Stripe checkout session
 */
app.post('/', zValidator('json', checkoutSchema), async (c) => {
  try {
    const body = c.req.valid('json');
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    // Membership checkout
    if (body.type === 'membership') {
      if (!body.tier) {
        return c.json({ success: false, error: 'Tier is required for membership checkout' }, 400);
      }

      const session = await createMembershipCheckout(
        body.tier as Exclude<MembershipTier, 'free'>,
        body.walletAddress,
        body.successUrl || `${frontendUrl}/membership/success`,
        body.cancelUrl || `${frontendUrl}/membership`
      );

      return c.json({
        success: true,
        data: {
          sessionId: session.id,
          url: session.url,
        },
      });
    }

    // Store checkout
    if (body.type === 'store') {
      if (!body.items || body.items.length === 0) {
        return c.json({ success: false, error: 'Items are required for store checkout' }, 400);
      }

      const session = await createCheckoutSession({
        items: body.items as CheckoutItem[],
        walletAddress: body.walletAddress,
        customerEmail: body.customerEmail,
        shippingAddress: body.shippingAddress as ShippingAddress | undefined,
        successUrl: body.successUrl || `${frontendUrl}/store/success`,
        cancelUrl: body.cancelUrl || `${frontendUrl}/store`,
      });

      return c.json({
        success: true,
        data: {
          sessionId: session.id,
          url: session.url,
        },
      });
    }

    return c.json({ success: false, error: 'Invalid checkout type' }, 400);
  } catch (error) {
    console.error('Checkout error:', error);
    return c.json(
      {
        success: false,
        error: 'Failed to create checkout session',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
});

/**
 * GET /api/checkout/:sessionId
 * Get checkout session status
 */
app.get('/:sessionId', async (c) => {
  try {
    const sessionId = c.req.param('sessionId');
    const session = await getCheckoutSession(sessionId);

    return c.json({
      success: true,
      data: {
        id: session.id,
        status: session.status,
        paymentStatus: session.payment_status,
        amountTotal: session.amount_total,
        currency: session.currency,
        customerEmail: session.customer_email,
        metadata: session.metadata,
      },
    });
  } catch (error) {
    console.error('Get session error:', error);
    return c.json({ success: false, error: 'Session not found' }, 404);
  }
});

export { app as checkoutRoutes };
