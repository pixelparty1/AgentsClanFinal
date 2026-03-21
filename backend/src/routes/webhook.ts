/* ══════════════════════════════════════════════════════════════════════════════
   Webhook Routes
   Handles incoming webhooks (Stripe, etc.)
   ══════════════════════════════════════════════════════════════════════════════ */

import { Hono } from 'hono';
import { verifyWebhookSignature } from '../lib/stripe';
import { databases, DATABASE_ID, COLLECTIONS } from '../lib/appwrite';
import { ID } from 'node-appwrite';
import { generateOrderNumber } from '@agentsclan/shared';
import type Stripe from 'stripe';

const app = new Hono();

/**
 * POST /api/webhook/stripe
 * Handle Stripe webhook events
 */
app.post('/stripe', async (c) => {
  try {
    const signature = c.req.header('stripe-signature');
    if (!signature) {
      return c.json({ error: 'Missing stripe-signature header' }, 400);
    }

    // Get raw body for signature verification
    const rawBody = await c.req.text();

    let event: Stripe.Event;
    try {
      event = verifyWebhookSignature(rawBody, signature);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return c.json({ error: 'Invalid signature' }, 400);
    }

    console.log(`Webhook received: ${event.type}`);

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutComplete(session);
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`Payment succeeded: ${paymentIntent.id}`);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.error(`Payment failed: ${paymentIntent.id}`);
        await handlePaymentFailed(paymentIntent);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return c.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return c.json({ error: 'Webhook handler failed' }, 500);
  }
});

/**
 * Handle successful checkout
 */
async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const { metadata } = session;
  if (!metadata) return;

  const type = metadata.type;
  const walletAddress = metadata.walletAddress;

  if (type === 'membership') {
    await handleMembershipPurchase(session, walletAddress, metadata.tier);
  } else if (type === 'store') {
    await handleStorePurchase(session, walletAddress);
  }
}

/**
 * Handle membership purchase
 */
async function handleMembershipPurchase(session: Stripe.Checkout.Session, walletAddress: string, tier: string) {
  try {
    // Create membership record
    await databases.createDocument(DATABASE_ID, COLLECTIONS.MEMBERSHIPS, ID.unique(), {
      wallet_address: walletAddress,
      tier,
      price_paid: session.amount_total,
      currency: session.currency?.toUpperCase() || 'INR',
      stripe_payment_id: session.payment_intent as string,
      stripe_session_id: session.id,
      status: 'paid',
      xp_total: 0,
    });

    // Update analytics
    await updateDailyAnalytics('new_memberships', 1);
    await updateDailyAnalytics('revenue', session.amount_total || 0);

    console.log(`Membership created for ${walletAddress} - Tier: ${tier}`);

    // TODO: Trigger gasless NFT minting
  } catch (error) {
    console.error('Failed to create membership:', error);
    throw error;
  }
}

/**
 * Handle store purchase
 */
async function handleStorePurchase(session: Stripe.Checkout.Session, walletAddress: string) {
  try {
    const orderNumber = generateOrderNumber();

    // Create order record
    const order = await databases.createDocument(DATABASE_ID, COLLECTIONS.ORDERS, ID.unique(), {
      order_number: orderNumber,
      user_wallet: walletAddress,
      subtotal: session.amount_subtotal || 0,
      shipping_cost: 0,
      tax: 0,
      total_price: session.amount_total || 0,
      currency: session.currency?.toUpperCase() || 'INR',
      status: 'paid',
      stripe_payment_id: session.payment_intent as string,
      stripe_session_id: session.id,
      shipping_email: session.customer_email,
    });

    // Update analytics
    await updateDailyAnalytics('orders_count', 1);
    await updateDailyAnalytics('revenue', session.amount_total || 0);

    console.log(`Order created: ${orderNumber} for ${walletAddress}`);
  } catch (error) {
    console.error('Failed to create order:', error);
    throw error;
  }
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.error(`Payment failed for ${paymentIntent.id}: ${paymentIntent.last_payment_error?.message}`);
  // TODO: Send notification to admin, update records
}

/**
 * Update daily analytics
 */
async function updateDailyAnalytics(field: string, increment: number) {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Try to find today's analytics record
    const records = await databases.listDocuments(DATABASE_ID, COLLECTIONS.ANALYTICS, []);
    const todayRecord = records.documents.find((doc: any) => doc.date === today);

    if (todayRecord) {
      await databases.updateDocument(DATABASE_ID, COLLECTIONS.ANALYTICS, todayRecord.$id, {
        [field]: (todayRecord as any)[field] + increment,
      });
    } else {
      await databases.createDocument(DATABASE_ID, COLLECTIONS.ANALYTICS, ID.unique(), {
        date: today,
        new_users: field === 'new_users' ? increment : 0,
        orders_count: field === 'orders_count' ? increment : 0,
        revenue: field === 'revenue' ? increment : 0,
        quests_completed: field === 'quests_completed' ? increment : 0,
        new_memberships: field === 'new_memberships' ? increment : 0,
        page_views: 0,
      });
    }
  } catch (error) {
    console.error('Failed to update analytics:', error);
  }
}

export { app as webhookRoutes };
