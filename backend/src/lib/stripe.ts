/* ══════════════════════════════════════════════════════════════════════════════
   Stripe Server Configuration
   ══════════════════════════════════════════════════════════════════════════════ */

import Stripe from 'stripe';
import { MEMBERSHIP_TIERS, type MembershipTier, type CheckoutItem, type ShippingAddress } from '@agentsclan/shared';

// Initialize Stripe only if key is provided
const stripeKey = process.env.STRIPE_SECRET_KEY;
export const stripe = stripeKey 
  ? new Stripe(stripeKey, { apiVersion: '2024-11-20.acacia' as Stripe.LatestApiVersion })
  : null;

// Helper to ensure Stripe is available
function getStripe(): Stripe {
  if (!stripe) {
    throw new Error('Stripe is not configured. Set STRIPE_SECRET_KEY environment variable.');
  }
  return stripe;
}

export interface CheckoutSessionParams {
  items: CheckoutItem[];
  walletAddress: string;
  customerEmail?: string;
  shippingAddress?: ShippingAddress;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}

// Create checkout session for store purchases
export async function createCheckoutSession(data: CheckoutSessionParams): Promise<Stripe.Checkout.Session> {
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = data.items.map((item) => ({
    price_data: {
      currency: 'inr',
      product_data: {
        name: item.name,
        images: item.image ? [item.image] : [],
        metadata: {
          productId: item.productId,
          size: item.size || '',
        },
      },
      unit_amount: item.price,
    },
    quantity: item.quantity,
  }));

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: lineItems,
    success_url: `${data.successUrl}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: data.cancelUrl,
    metadata: {
      type: 'store',
      walletAddress: data.walletAddress,
      ...data.metadata,
    },
    customer_email: data.customerEmail,
    shipping_address_collection: {
      allowed_countries: ['IN'],
    },
    phone_number_collection: {
      enabled: true,
    },
  };

  return getStripe().checkout.sessions.create(sessionParams);
}

// Create checkout session for membership purchase
export async function createMembershipCheckout(
  tier: Exclude<MembershipTier, 'free'>,
  walletAddress: string,
  successUrl: string,
  cancelUrl: string
): Promise<Stripe.Checkout.Session> {
  const tierConfig = MEMBERSHIP_TIERS[tier];

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: tierConfig.currency,
          product_data: {
            name: `AgentsClan ${tierConfig.name} Membership`,
            description: tierConfig.benefits.join(' • '),
            images: [], // Add membership tier images here
          },
          unit_amount: tierConfig.price,
        },
        quantity: 1,
      },
    ],
    success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: cancelUrl,
    metadata: {
      type: 'membership',
      tier,
      walletAddress,
    },
  };

  return getStripe().checkout.sessions.create(sessionParams);
}

// Get checkout session
export async function getCheckoutSession(sessionId: string): Promise<Stripe.Checkout.Session> {
  return getStripe().checkout.sessions.retrieve(sessionId, {
    expand: ['line_items', 'customer', 'payment_intent'],
  });
}

// Verify webhook signature
export function verifyWebhookSignature(payload: string, signature: string): Stripe.Event {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new Error('Stripe webhook secret is not configured');
  }
  return getStripe().webhooks.constructEvent(payload, signature, webhookSecret);
}

export { MEMBERSHIP_TIERS };
