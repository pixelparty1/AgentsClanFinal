/* ══════════════════════════════════════════════════════════════════════════════
   Authentication Middleware
   ══════════════════════════════════════════════════════════════════════════════ */

import { createMiddleware } from 'hono/factory';
import type { Context, Next } from 'hono';
import { isOwnerWallet } from '@agentsclan/shared';

// Type for context variables
export interface AuthVariables {
  walletAddress?: string;
  isAdmin: boolean;
}

/**
 * Extract wallet address from request headers
 */
export const walletAuth = createMiddleware<{
  Variables: AuthVariables;
}>(async (c, next) => {
  const walletAddress = c.req.header('X-Wallet-Address');
  
  c.set('walletAddress', walletAddress);
  c.set('isAdmin', isOwnerWallet(walletAddress, process.env.OWNER_WALLET_ADDRESS || ''));

  await next();
});

/**
 * Require wallet address to be present
 */
export const requireWallet = createMiddleware<{
  Variables: AuthVariables;
}>(async (c, next) => {
  const walletAddress = c.get('walletAddress');

  if (!walletAddress) {
    return c.json(
      {
        success: false,
        error: 'Unauthorized',
        message: 'Wallet address is required. Include X-Wallet-Address header.',
      },
      401
    );
  }

  await next();
});

/**
 * Require admin (owner) wallet
 */
export const requireAdmin = createMiddleware<{
  Variables: AuthVariables;
}>(async (c, next) => {
  const walletAddress = c.get('walletAddress');
  const isAdmin = c.get('isAdmin');

  if (!walletAddress) {
    return c.json(
      {
        success: false,
        error: 'Unauthorized',
        message: 'Wallet address is required.',
      },
      401
    );
  }

  if (!isAdmin) {
    return c.json(
      {
        success: false,
        error: 'Forbidden',
        message: 'Admin access required.',
      },
      403
    );
  }

  await next();
});
