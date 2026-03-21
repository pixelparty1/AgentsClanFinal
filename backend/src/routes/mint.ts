/* ══════════════════════════════════════════════════════════════════════════════
   NFT Minting Routes
   Handles both gasless and direct NFT minting
   ══════════════════════════════════════════════════════════════════════════════ */

import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { createWalletClient, http, createPublicClient } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { polygonAmoy } from 'viem/chains';
import { databases, DATABASE_ID, COLLECTIONS } from '../lib/appwrite';
import { ID } from 'node-appwrite';
import { walletAuth, requireWallet, type AuthVariables } from '../middleware/auth';

const app = new Hono<{ Variables: AuthVariables }>();

// Apply wallet auth
app.use('*', walletAuth);

// Contract ABI (minimal for minting)
const CONTRACT_ABI = [
  {
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'tier', type: 'uint8' },
      { name: 'uri', type: 'string' },
      { name: 'deadline', type: 'uint256' },
      { name: 'signature', type: 'bytes' },
    ],
    name: 'mintWithSignature',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

// Tier mapping
const TIER_MAP: Record<string, number> = {
  free: 0,
  bronze: 1,
  silver: 2,
  gold: 3,
  platinum: 4,
};

// Gasless mint request schema
const gaslessMintSchema = z.object({
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  tier: z.enum(['free', 'bronze', 'silver', 'gold', 'platinum']),
  signature: z.string(),
  deadline: z.number(),
  stripeSessionId: z.string().optional(),
});

/**
 * POST /api/mint/gasless
 * Gasless NFT minting using relayer
 */
app.post('/gasless', requireWallet, zValidator('json', gaslessMintSchema), async (c) => {
  try {
    const body = c.req.valid('json');
    const { walletAddress, tier, signature, deadline, stripeSessionId } = body;

    // Verify relayer private key exists
    const relayerKey = process.env.RELAYER_PRIVATE_KEY;
    if (!relayerKey) {
      return c.json({ success: false, error: 'Relayer not configured' }, 500);
    }

    // Verify contract address exists
    const contractAddress = process.env.NFT_CONTRACT_ADDRESS;
    if (!contractAddress) {
      return c.json({ success: false, error: 'Contract not configured' }, 500);
    }

    // For paid tiers, verify Stripe payment
    if (tier !== 'free' && stripeSessionId) {
      const membership = await databases.listDocuments(DATABASE_ID, COLLECTIONS.MEMBERSHIPS, []);
      const paidMembership = membership.documents.find(
        (doc: any) => doc.stripe_session_id === stripeSessionId && doc.wallet_address === walletAddress
      );

      if (!paidMembership) {
        return c.json({ success: false, error: 'Payment not verified' }, 400);
      }
    }

    // Create NFT transaction record
    const txRecord = await databases.createDocument(DATABASE_ID, COLLECTIONS.NFT_TRANSACTIONS, ID.unique(), {
      wallet_address: walletAddress,
      tier,
      status: 'minting',
      gas_paid_by: 'relayer',
    });

    // Setup relayer wallet client
    const account = privateKeyToAccount(relayerKey as `0x${string}`);
    const walletClient = createWalletClient({
      account,
      chain: polygonAmoy,
      transport: http(process.env.POLYGON_AMOY_RPC),
    });

    // Generate metadata URI
    const metadataUri = `https://api.agentsclan.com/metadata/${tier}/${walletAddress}`;

    // Execute mint transaction
    try {
      const hash = await walletClient.writeContract({
        address: contractAddress as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'mintWithSignature',
        args: [walletAddress as `0x${string}`, TIER_MAP[tier], metadataUri, BigInt(deadline), signature as `0x${string}`],
      });

      // Update transaction record
      await databases.updateDocument(DATABASE_ID, COLLECTIONS.NFT_TRANSACTIONS, txRecord.$id, {
        tx_hash: hash,
        status: 'minted',
      });

      // Update membership record if exists
      if (stripeSessionId) {
        const memberships = await databases.listDocuments(DATABASE_ID, COLLECTIONS.MEMBERSHIPS, []);
        const membership = memberships.documents.find(
          (doc: any) => doc.stripe_session_id === stripeSessionId
        );
        if (membership) {
          await databases.updateDocument(DATABASE_ID, COLLECTIONS.MEMBERSHIPS, membership.$id, {
            mint_tx_hash: hash,
            status: 'minted',
          });
        }
      }

      return c.json({
        success: true,
        data: {
          txHash: hash,
          tier,
          walletAddress,
        },
      });
    } catch (mintError) {
      // Update transaction record with error
      await databases.updateDocument(DATABASE_ID, COLLECTIONS.NFT_TRANSACTIONS, txRecord.$id, {
        status: 'failed',
        error_message: mintError instanceof Error ? mintError.message : 'Unknown error',
      });

      throw mintError;
    }
  } catch (error) {
    console.error('Gasless mint error:', error);
    return c.json(
      {
        success: false,
        error: 'Minting failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
});

/**
 * GET /api/mint/status/:txHash
 * Check minting transaction status
 */
app.get('/status/:txHash', async (c) => {
  try {
    const txHash = c.req.param('txHash');

    const publicClient = createPublicClient({
      chain: polygonAmoy,
      transport: http(process.env.POLYGON_AMOY_RPC),
    });

    const receipt = await publicClient.getTransactionReceipt({
      hash: txHash as `0x${string}`,
    });

    return c.json({
      success: true,
      data: {
        txHash,
        status: receipt.status === 'success' ? 'confirmed' : 'failed',
        blockNumber: receipt.blockNumber.toString(),
        gasUsed: receipt.gasUsed.toString(),
      },
    });
  } catch (error) {
    return c.json({
      success: true,
      data: {
        txHash: c.req.param('txHash'),
        status: 'pending',
      },
    });
  }
});

/**
 * GET /api/mint/check/:wallet
 * Check if wallet already has a membership NFT
 */
app.get('/check/:wallet', async (c) => {
  try {
    const wallet = c.req.param('wallet');
    const contractAddress = process.env.NFT_CONTRACT_ADDRESS;

    if (!contractAddress) {
      return c.json({ success: false, error: 'Contract not configured' }, 500);
    }

    const publicClient = createPublicClient({
      chain: polygonAmoy,
      transport: http(process.env.POLYGON_AMOY_RPC),
    });

    const balance = await publicClient.readContract({
      address: contractAddress as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: 'balanceOf',
      args: [wallet as `0x${string}`],
    });

    return c.json({
      success: true,
      data: {
        wallet,
        hasMembership: balance > 0n,
        balance: balance.toString(),
      },
    });
  } catch (error) {
    console.error('Check membership error:', error);
    return c.json({ success: false, error: 'Failed to check membership' }, 500);
  }
});

export { app as mintRoutes };
