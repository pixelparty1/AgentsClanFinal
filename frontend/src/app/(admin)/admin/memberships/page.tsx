'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Shield, Wallet, Calendar, ExternalLink, Sparkles } from 'lucide-react';
import GradientHeading from '@/components/ui/GradientHeading';
import { GlowCard } from '@/components/ui/glow-card';
import { getMemberships, type Membership } from '@/lib/admin';

const TIER_COLORS: Record<string, string> = {
  creator: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  legend: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
};

export default function MembershipsAdmin() {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [selectedMembership, setSelectedMembership] = useState<Membership | null>(null);

  useEffect(() => {
    fetchMemberships();
  }, []);

  async function fetchMemberships() {
    try {
      const data = await getMemberships();
      setMemberships(data);
    } catch (error) {
      console.error('Failed to fetch memberships:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredMemberships = memberships.filter(membership => {
    const matchesSearch = 
      membership.wallet_address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      membership.token_id?.toString().includes(searchQuery);
    
    const matchesTier = tierFilter === 'all' || membership.tier === tierFilter;
    
    return matchesSearch && matchesTier;
  });

  const stats = {
    total: memberships.length,
    creator: memberships.filter(m => m.tier === 'creator').length,
    legend: memberships.filter(m => m.tier === 'legend').length,
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <GradientHeading as="h1" className="text-3xl mb-2">
          Memberships
        </GradientHeading>
        <p className="text-gray-400">View NFT membership holders and their tiers.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <GlowCard>
          <div className="p-4 rounded-xl border border-emerald-900/30 bg-emerald-950/20 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-sm text-gray-400">Total NFTs</p>
          </div>
        </GlowCard>
        <GlowCard>
          <div className="p-4 rounded-xl border border-purple-500/30 bg-purple-950/20 text-center">
            <p className="text-2xl font-bold text-purple-400">{stats.creator}</p>
            <p className="text-sm text-gray-400">Creator</p>
          </div>
        </GlowCard>
        <GlowCard>
          <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/10 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-emerald-400">{stats.legend}</p>
            <p className="text-sm text-gray-400">Legend</p>
          </div>
        </GlowCard>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search by wallet address or token ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-emerald-950/30 border border-emerald-900/30 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'creator', 'legend'].map((tier) => (
            <button
              key={tier}
              onClick={() => setTierFilter(tier)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                tierFilter === tier
                  ? 'bg-emerald-500 text-black'
                  : 'bg-emerald-950/30 text-gray-400 hover:text-white border border-emerald-900/30'
              }`}
            >
              {tier.charAt(0).toUpperCase() + tier.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Memberships Table */}
      <div className="rounded-2xl border border-emerald-900/30 bg-emerald-950/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-emerald-950/40">
              <tr>
                <th className="px-6 py-4 text-left text-sm text-gray-400 font-medium">Token ID</th>
                <th className="px-6 py-4 text-left text-sm text-gray-400 font-medium">Wallet Address</th>
                <th className="px-6 py-4 text-left text-sm text-gray-400 font-medium">Tier</th>
                <th className="px-6 py-4 text-left text-sm text-gray-400 font-medium">Status</th>
                <th className="px-6 py-4 text-left text-sm text-gray-400 font-medium">Price Paid</th>
                <th className="px-6 py-4 text-left text-sm text-gray-400 font-medium">Minted</th>
                <th className="px-6 py-4 text-right text-sm text-gray-400 font-medium">Links</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-900/20">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : filteredMemberships.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No memberships found
                  </td>
                </tr>
              ) : (
                filteredMemberships.map((membership) => (
                  <motion.tr 
                    key={membership.$id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-emerald-950/30 transition-colors cursor-pointer"
                    onClick={() => setSelectedMembership(membership)}
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono text-emerald-400">
                        #{membership.token_id || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Wallet className="w-4 h-4 text-gray-500" />
                        <span className="font-mono text-sm">
                          {membership.wallet_address?.slice(0, 6)}...{membership.wallet_address?.slice(-4)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
                        TIER_COLORS[membership.tier as keyof typeof TIER_COLORS] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                      }`}>
                        {membership.tier?.toUpperCase() || 'FREE'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        membership.status === 'minted' ? 'bg-emerald-500/20 text-emerald-400' :
                        membership.status === 'paid' ? 'bg-blue-500/20 text-blue-400' :
                        membership.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        membership.status === 'minting' ? 'bg-purple-500/20 text-purple-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {membership.status?.toUpperCase() || 'UNKNOWN'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {membership.price_paid 
                        ? new Intl.NumberFormat('en-IN', {
                            style: 'currency',
                            currency: membership.currency || 'INR',
                            minimumFractionDigits: 0,
                          }).format(membership.price_paid / 100)
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Calendar className="w-4 h-4" />
                        {formatDate(membership.$createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {membership.mint_tx_hash && (
                        <a
                          href={`https://amoy.polygonscan.com/tx/${membership.mint_tx_hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Tx
                        </a>
                      )}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Membership Details Modal */}
      {selectedMembership && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
          onClick={() => setSelectedMembership(null)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-lg rounded-2xl border border-emerald-900/30 bg-[#0a0f0d] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold">Membership Details</h2>
                <p className="text-sm text-emerald-400 font-mono">
                  Token #{selectedMembership.token_id || 'N/A'}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
                TIER_COLORS[selectedMembership.tier as keyof typeof TIER_COLORS] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'
              }`}>
                {selectedMembership.tier?.toUpperCase() || 'FREE'}
              </span>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/20">
                <p className="text-sm text-gray-400 mb-1">Wallet Address</p>
                <p className="font-mono text-sm break-all">{selectedMembership.wallet_address}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/20">
                  <p className="text-sm text-gray-400 mb-1">Status</p>
                  <p className={`text-xl font-bold ${
                    selectedMembership.status === 'minted' ? 'text-emerald-400' :
                    selectedMembership.status === 'paid' ? 'text-blue-400' :
                    selectedMembership.status === 'pending' ? 'text-yellow-400' :
                    selectedMembership.status === 'minting' ? 'text-purple-400' :
                    'text-red-400'
                  }`}>
                    {selectedMembership.status?.toUpperCase() || 'UNKNOWN'}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/20">
                  <p className="text-sm text-gray-400 mb-1">Price Paid</p>
                  <p className="text-2xl font-bold">
                    {selectedMembership.price_paid 
                      ? new Intl.NumberFormat('en-IN', {
                          style: 'currency',
                          currency: selectedMembership.currency || 'INR',
                          minimumFractionDigits: 0,
                        }).format(selectedMembership.price_paid / 100)
                      : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/20">
                <p className="text-sm text-gray-400 mb-1">Minted On</p>
                <p>{formatDate(selectedMembership.$createdAt)}</p>
              </div>

              {selectedMembership.mint_tx_hash && (
                <a
                  href={`https://amoy.polygonscan.com/tx/${selectedMembership.mint_tx_hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full p-3 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Transaction on Polygonscan
                </a>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedMembership(null)}
                className="px-6 py-2 rounded-xl border border-emerald-900/30 text-gray-400 hover:text-white hover:border-emerald-500/30 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
