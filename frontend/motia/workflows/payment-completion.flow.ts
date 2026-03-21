/**
 * Payment Completion Workflow
 * 
 * Orchestrates the full payment completion process:
 * 1. Receive Stripe webhook event
 * 2. Verify payment
 * 3. Create database records
 * 4. Trigger NFT minting (for memberships)
 * 5. Send notifications
 */

import { defineWorkflow, step, trigger } from '@motia/core';

// Types
interface PaymentEvent {
  sessionId: string;
  type: 'membership' | 'store';
  walletAddress: string;
  tier?: string;
  amount: number;
  items?: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  shipping?: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
}

// Workflow definition
export default defineWorkflow({
  name: 'payment-completion',
  description: 'Handles post-payment processing for memberships and store orders',
  
  // Trigger: HTTP webhook from Stripe
  trigger: trigger.http({
    path: '/webhooks/payment-completed',
    method: 'POST',
  }),

  // Workflow steps
  steps: [
    // Step 1: Parse and validate payment event
    step('validate-payment', {
      handler: async (ctx, event: PaymentEvent) => {
        if (!event.sessionId || !event.walletAddress) {
          throw new Error('Invalid payment event');
        }

        // Verify with Stripe API
        const stripe = ctx.getService('stripe');
        const session = await stripe.checkout.sessions.retrieve(event.sessionId);
        
        if (session.payment_status !== 'paid') {
          throw new Error('Payment not completed');
        }

        return {
          verified: true,
          session,
          ...event,
        };
      },
    }),

    // Step 2: Create database records
    step('create-records', {
      handler: async (ctx, data) => {
        const appwrite = ctx.getService('appwrite');
        
        if (data.type === 'membership') {
          // Create membership record
          const membership = await appwrite.createDocument('memberships', {
            wallet_address: data.walletAddress,
            tier: data.tier,
            payment_status: 'paid',
            stripe_session_id: data.sessionId,
            amount_paid: data.amount,
            is_active: true,
          });

          return { ...data, membershipId: membership.$id };
        } else {
          // Create order record
          const order = await appwrite.createDocument('orders', {
            wallet_address: data.walletAddress,
            total_amount: data.amount,
            payment_status: 'paid',
            status: 'confirmed',
            stripe_session_id: data.sessionId,
            ...data.shipping,
          });

          // Create order items
          for (const item of data.items || []) {
            await appwrite.createDocument('order_items', {
              order_id: order.$id,
              product_id: item.productId,
              product_name: item.name,
              quantity: item.quantity,
              price: item.price,
            });
          }

          return { ...data, orderId: order.$id };
        }
      },
    }),

    // Step 3: Mint NFT (membership only)
    step('mint-nft', {
      condition: (data) => data.type === 'membership',
      handler: async (ctx, data) => {
        const nft = ctx.getService('nft-minter');
        
        const result = await nft.mint({
          to: data.walletAddress,
          tier: data.tier,
          tokenURI: `https://metadata.agentsclan.com/membership/${data.tier}`,
        });

        // Update membership with tx hash
        const appwrite = ctx.getService('appwrite');
        await appwrite.updateDocument('memberships', data.membershipId, {
          tx_hash: result.txHash,
          token_id: result.tokenId,
        });

        return { ...data, txHash: result.txHash, tokenId: result.tokenId };
      },
    }),

    // Step 4: Send notifications
    step('send-notifications', {
      handler: async (ctx, data) => {
        const notifications = ctx.getService('notifications');

        if (data.type === 'membership') {
          await notifications.send({
            type: 'email',
            to: data.shipping?.email,
            template: 'membership-welcome',
            data: {
              tier: data.tier,
              txHash: data.txHash,
              tokenId: data.tokenId,
            },
          });

          // Send Discord notification
          await notifications.send({
            type: 'discord',
            channel: 'welcome',
            template: 'new-member',
            data: {
              wallet: data.walletAddress,
              tier: data.tier,
            },
          });
        } else {
          await notifications.send({
            type: 'email',
            to: data.shipping?.email,
            template: 'order-confirmation',
            data: {
              orderId: data.orderId,
              items: data.items,
              total: data.amount,
            },
          });
        }

        return { success: true, ...data };
      },
    }),

    // Step 5: Update analytics
    step('update-analytics', {
      handler: async (ctx, data) => {
        const appwrite = ctx.getService('appwrite');
        const today = new Date().toISOString().split('T')[0];

        const metricName = data.type === 'membership' 
          ? 'membership_sales' 
          : 'store_sales';

        await appwrite.createDocument('analytics_daily', {
          date: today,
          metric_name: metricName,
          metric_value: data.amount,
          metadata: JSON.stringify({
            session_id: data.sessionId,
            type: data.type,
            tier: data.tier,
          }),
        });

        return { completed: true };
      },
    }),
  ],

  // Error handling
  onError: async (ctx, error, step) => {
    console.error(`Workflow error at step ${step}:`, error);
    
    const notifications = ctx.getService('notifications');
    await notifications.send({
      type: 'slack',
      channel: 'alerts',
      message: `Payment workflow failed at ${step}: ${error.message}`,
    });
  },
});
