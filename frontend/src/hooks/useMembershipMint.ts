import { useState, useCallback } from 'react';
import { useAccount, useChainId, useSignTypedData, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseAbiItem, encodeFunctionData } from 'viem';

// Contract addresses (update with deployed addresses)
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_MEMBERSHIP_CONTRACT_ADDRESS as `0x${string}`;

// Contract ABI - only the functions we need
const MEMBERSHIP_ABI = [
  {
    name: 'mintWithSignature',
    type: 'function',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'tier', type: 'uint8' },
      { name: 'tokenURI_', type: 'string' },
      { name: 'deadline', type: 'uint256' },
      { name: 'signature', type: 'bytes' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    name: 'getMembershipTokenId',
    type: 'function',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    name: 'getMembership',
    type: 'function',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [
      {
        type: 'tuple',
        components: [
          { name: 'tier', type: 'uint8' },
          { name: 'xpBalance', type: 'uint256' },
          { name: 'mintedAt', type: 'uint256' },
          { name: 'isActive', type: 'bool' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    name: 'getNonce',
    type: 'function',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    name: 'hasActiveMembership',
    type: 'function',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ type: 'bool' }],
    stateMutability: 'view',
  },
] as const;

// EIP-712 domain
const EIP712_DOMAIN = {
  name: 'AgentsClanMembership',
  version: '1',
  chainId: 80002, // Polygon Amoy
  verifyingContract: CONTRACT_ADDRESS,
};

// EIP-712 types for mint request
const MINT_TYPES = {
  MintRequest: [
    { name: 'to', type: 'address' },
    { name: 'tier', type: 'uint8' },
    { name: 'tokenURI', type: 'string' },
    { name: 'nonce', type: 'uint256' },
    { name: 'deadline', type: 'uint256' },
  ],
};

export type MembershipTier = 'free' | 'bronze' | 'silver' | 'gold' | 'platinum';

const TIER_VALUES: Record<MembershipTier, number> = {
  free: 0,
  bronze: 1,
  silver: 2,
  gold: 3,
  platinum: 4,
};

export interface MembershipData {
  tier: MembershipTier;
  xpBalance: bigint;
  mintedAt: bigint;
  isActive: boolean;
}

export interface MintResult {
  success: boolean;
  txHash?: string;
  error?: string;
}

export function useMembershipMint() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { signTypedDataAsync } = useSignTypedData();
  const { writeContractAsync } = useWriteContract();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Request a gasless mint signature from the backend
   */
  const requestMintSignature = useCallback(async (
    tier: MembershipTier,
    tokenURI: string
  ): Promise<{ signature: string; deadline: number; nonce: number } | null> => {
    if (!address) return null;

    try {
      const response = await fetch('/api/mint/signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: address,
          tier,
          tokenURI,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to get mint signature');
      }

      return response.json();
    } catch (err) {
      console.error('Error requesting mint signature:', err);
      return null;
    }
  }, [address]);

  /**
   * Mint membership NFT with zero gas (meta-transaction)
   * The relayer pays gas, user only signs
   */
  const mintGasless = useCallback(async (
    tier: MembershipTier,
    stripeSessionId?: string
  ): Promise<MintResult> => {
    if (!address || !isConnected) {
      return { success: false, error: 'Wallet not connected' };
    }

    setIsLoading(true);
    setError(null);

    try {
      // Generate token URI based on tier
      const tokenURI = `https://metadata.agentsclan.com/membership/${tier}`;

      // Request signature from backend (which also triggers the relayer)
      const response = await fetch('/api/mint/gasless', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: address,
          tier,
          tokenURI,
          stripeSessionId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Gasless mint failed');
      }

      const { txHash } = await response.json();

      return { success: true, txHash };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Mint failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  }, [address, isConnected]);

  /**
   * Mint membership NFT directly (user pays gas)
   * Fallback option if gasless isn't available
   */
  const mintDirect = useCallback(async (
    tier: MembershipTier
  ): Promise<MintResult> => {
    if (!address || !isConnected) {
      return { success: false, error: 'Wallet not connected' };
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get signature for meta-transaction
      const tokenURI = `https://metadata.agentsclan.com/membership/${tier}`;
      const sigData = await requestMintSignature(tier, tokenURI);

      if (!sigData) {
        throw new Error('Failed to get mint authorization');
      }

      // Call contract directly
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: MEMBERSHIP_ABI,
        functionName: 'mintWithSignature',
        args: [
          address,
          TIER_VALUES[tier],
          tokenURI,
          BigInt(sigData.deadline),
          sigData.signature as `0x${string}`,
        ],
      });

      return { success: true, txHash: hash };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Mint failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  }, [address, isConnected, writeContractAsync, requestMintSignature]);

  return {
    mintGasless,
    mintDirect,
    isLoading,
    error,
    isConnected,
    address,
  };
}

/**
 * Hook to check if user has an existing membership
 */
export function useMembershipStatus() {
  const { address } = useAccount();
  const [membership, setMembership] = useState<MembershipData | null>(null);
  const [hasMembership, setHasMembership] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const checkMembership = useCallback(async () => {
    if (!address) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/membership/status?address=${address}`);
      if (!response.ok) throw new Error('Failed to fetch membership status');

      const data = await response.json();
      setHasMembership(data.hasMembership);
      setMembership(data.membership || null);
    } catch (err) {
      console.error('Error checking membership:', err);
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  return {
    membership,
    hasMembership,
    isLoading,
    checkMembership,
  };
}
