import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _supabase: SupabaseClient | null = null;

/** Lazily initialise the Supabase client so the app doesn't crash at
 *  module-evaluation time when env vars are not yet configured. */
function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
      throw new Error(
        'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY – add them to .env.local',
      );
    }

    _supabase = createClient(url, key);
  }
  return _supabase;
}

/** Persist a membership NFT mint transaction to Supabase.
 *  Returns null silently if Supabase is not configured. */
export async function storeMintTransaction({
  walletAddress,
  tier,
  txHash,
  tokenId,
}: {
  walletAddress: string;
  tier: 'creator' | 'legend';
  txHash: string;
  tokenId?: string;
}) {
  let supabase: ReturnType<typeof getSupabase>;
  try {
    supabase = getSupabase();
  } catch {
    console.warn('Supabase not configured — skipping transaction storage');
    return null;
  }

  const { data, error } = await supabase.from('nft_transactions').insert([
    {
      wallet_address: walletAddress,
      tier,
      tx_hash: txHash,
      token_id: tokenId ?? null,
      minted_at: new Date().toISOString(),
    },
  ]);

  if (error) {
    console.error('Failed to store mint transaction:', error);
    throw error;
  }

  return data;
}
