'use client';

import { motion } from 'framer-motion';
import { Hexagon, Loader2, CheckCircle, Wallet } from 'lucide-react';
import { useWalletMint, MintStatus } from '@/hooks/useWalletMint';

interface MembershipNFTPreviewProps {
  tier: 'creator' | 'legend';
}

const tierConfig = {
  creator: {
    label: 'Creator',
    gradient: 'from-[#00FF66]/20 via-[#00CC55]/10 to-[#00FF66]/20',
    accentBorder: 'rgba(0,255,102,0.35)',
    glowColor: 'rgba(0,255,102,0.12)',
    hoverGlow: 'rgba(0,255,102,0.25)',
    iconBg: 'bg-[#00FF66]/10',
    iconColor: 'text-[#00FF66]',
    placeholderBg: 'from-[#00FF66]/10 to-[#00FF66]/5',
    badgeBg: 'bg-[#00FF66]/15 border-[#00FF66]/25',
    badgeText: 'text-[#00FF66]',
  },
  legend: {
    label: 'Legend',
    gradient: 'from-[#FFD700]/20 via-[#FFA500]/10 to-[#FFD700]/20',
    accentBorder: 'rgba(255,215,0,0.35)',
    glowColor: 'rgba(255,215,0,0.10)',
    hoverGlow: 'rgba(255,215,0,0.22)',
    iconBg: 'bg-[#FFD700]/10',
    iconColor: 'text-[#FFD700]',
    placeholderBg: 'from-[#FFD700]/10 to-[#FFD700]/5',
    badgeBg: 'bg-[#FFD700]/15 border-[#FFD700]/25',
    badgeText: 'text-[#FFD700]',
  },
};

function StatusOverlay({ status, txHash }: { status: MintStatus; txHash: string | null }) {
  if (status === 'connecting') {
    return (
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-2xl bg-black/70 backdrop-blur-sm">
        <Loader2 size={22} className="text-white/70 animate-spin" />
        <span className="text-white/70 text-xs font-medium">Connecting wallet…</span>
      </div>
    );
  }
  if (status === 'minting') {
    return (
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-2xl bg-black/70 backdrop-blur-sm">
        <Loader2 size={22} className="text-[#00FF66] animate-spin" />
        <span className="text-[#00FF66] text-xs font-medium">Minting your NFT…</span>
      </div>
    );
  }
  if (status === 'success') {
    return (
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-2xl bg-black/70 backdrop-blur-sm">
        <CheckCircle size={22} className="text-[#00FF66]" />
        <span className="text-[#00FF66] text-xs font-semibold">NFT Minted Successfully</span>
        {txHash && (
          <span className="text-white/40 text-[10px] font-mono max-w-[180px] truncate">
            {txHash}
          </span>
        )}
      </div>
    );
  }
  if (status === 'error') {
    return (
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-2xl bg-black/70 backdrop-blur-sm">
        <span className="text-red-400 text-xs font-medium">Mint failed — try again</span>
      </div>
    );
  }
  return null;
}

export default function MembershipNFTPreview({ tier }: MembershipNFTPreviewProps) {
  const config = tierConfig[tier];
  const { address, isConnected, status, txHash, mint, reset } = useWalletMint();

  const handleMintClick = async () => {
    if (status === 'success' || status === 'error') {
      reset();
      return;
    }
    await mint(tier);
  };

  return (
    <motion.div
      className="relative mx-auto w-full max-w-[220px] rounded-2xl p-3 flex flex-col items-center gap-3 cursor-pointer select-none"
      style={{
        background: 'rgba(0,255,120,0.05)',
        border: `1px solid ${config.accentBorder}`,
        boxShadow: `0 0 20px ${config.glowColor}, inset 0 1px 0 rgba(255,255,255,0.05)`,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
      whileHover={{
        scale: 1.02,
        boxShadow: `0 0 32px ${config.hoverGlow}, inset 0 1px 0 rgba(255,255,255,0.08)`,
        borderColor: tier === 'legend' ? 'rgba(255,215,0,0.55)' : 'rgba(0,255,102,0.55)',
      }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      onClick={handleMintClick}
    >
      {/* Status overlay */}
      <StatusOverlay status={status} txHash={txHash} />

      {/* NFT Image Placeholder */}
      <div
        className={`relative w-[120px] h-[120px] rounded-xl bg-gradient-to-br ${config.placeholderBg} border border-white/10 flex items-center justify-center overflow-hidden`}
      >
        {/* Decorative grid pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '12px 12px',
          }}
        />
        {/* Center icon */}
        <div className={`relative z-[1] w-12 h-12 rounded-xl ${config.iconBg} flex items-center justify-center`}>
          <Hexagon size={24} className={config.iconColor} />
        </div>
        {/* Tier badge */}
        <div className={`absolute bottom-1.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full border text-[9px] font-semibold uppercase tracking-wider ${config.badgeBg} ${config.badgeText}`}>
          {config.label}
        </div>
      </div>

      {/* Title & subtitle */}
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-white/80 text-xs font-semibold tracking-wide">Membership NFT</span>
        <span className="text-white/40 text-[10px]">Minted on purchase</span>
      </div>

      {/* Wallet status indicator */}
      <div className="flex items-center gap-1.5">
        <Wallet size={10} className={isConnected ? 'text-[#00FF66]' : 'text-white/30'} />
        <span className={`text-[10px] font-medium ${isConnected ? 'text-[#00FF66]/80' : 'text-white/30'}`}>
          {isConnected
            ? `${address?.slice(0, 6)}…${address?.slice(-4)}`
            : 'Click to connect & mint'}
        </span>
      </div>
    </motion.div>
  );
}
