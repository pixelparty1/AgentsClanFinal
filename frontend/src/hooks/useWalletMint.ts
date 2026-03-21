'use client';

import { useState, useCallback } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { storeMintTransaction } from '@/lib/supabase';

export type MintStatus = 'idle' | 'connecting' | 'minting' | 'success' | 'error';

/**
 * Hook that manages MetaMask wallet connection and NFT minting flow.
 *
 * Flow:
 * 1. If wallet already connected → mint directly
 * 2. If wallet not connected → prompt MetaMask → then mint
 * 3. After successful mint → store tx hash in Supabase
 */
export function useWalletMint() {
  const { address, isConnected } = useAccount();
  const { connectAsync } = useConnect();
  const { disconnect } = useDisconnect();
  const [status, setStatus] = useState<MintStatus>('idle');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  /** Simulated mintNFT call — replace with real contract interaction */
  async function mintNFT(_walletAddress: string, _tier: 'creator' | 'legend'): Promise<{ txHash: string; tokenId: string }> {
    // Simulate network delay for the mint
    await new Promise((r) => setTimeout(r, 2500));

    // In production, replace this with:
    // const { hash } = await writeContract({ ... })
    const fakeTxHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    const fakeTokenId = String(Math.floor(Math.random() * 10000));

    return { txHash: fakeTxHash, tokenId: fakeTokenId };
  }

  const mint = useCallback(
    async (tier: 'creator' | 'legend') => {
      setStatus('idle');
      setError(null);
      setTxHash(null);

      let walletAddress = address;

      // Step 1: Ensure wallet is connected
      if (!isConnected || !walletAddress) {
        try {
          setStatus('connecting');
          const result = await connectAsync({ connector: injected({ target: 'metaMask' }) });
          walletAddress = result.accounts[0];
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Wallet connection failed';
          setError(message);
          setStatus('error');
          return;
        }
      }

      // Step 2: Mint NFT
      try {
        setStatus('minting');
        const result = await mintNFT(walletAddress!, tier);
        setTxHash(result.txHash);

        // Step 3: Store in Supabase (best-effort, don't block success state)
        try {
          await storeMintTransaction({
            walletAddress: walletAddress!,
            tier,
            txHash: result.txHash,
            tokenId: result.tokenId,
          });
        } catch {
          console.warn('Supabase storage failed — tx still succeeded on-chain');
        }

        setStatus('success');
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Minting failed';
        setError(message);
        setStatus('error');
      }
    },
    [address, isConnected, connectAsync],
  );

  const reset = useCallback(() => {
    setStatus('idle');
    setTxHash(null);
    setError(null);
  }, []);

  return {
    address,
    isConnected,
    disconnect,
    status,
    txHash,
    error,
    mint,
    reset,
  };
}
