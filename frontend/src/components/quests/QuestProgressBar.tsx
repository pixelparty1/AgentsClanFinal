'use client';

import { Flame, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { GlowingEffect } from '@/components/ui/glowing-effect';

interface QuestProgressBarProps {
  earnedPoints: number;
  maxPoints: number;
  streak: number;
}

export default function QuestProgressBar({ earnedPoints, maxPoints, streak }: QuestProgressBarProps) {
  const pct = maxPoints > 0 ? Math.min((earnedPoints / maxPoints) * 100, 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="relative bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col gap-4"
    >
      <GlowingEffect spread={40} glow proximity={80} inactiveZone={0.02} borderWidth={2} />
      <div className="flex items-center justify-between gap-4">
        {/* Left: progress label */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#00FF66]/10 flex items-center justify-center">
            <Target size={16} className="text-[#00FF66]" />
          </div>
          <div className="flex flex-col">
            <span className="text-white text-sm font-semibold">Today&apos;s Progress</span>
            <span className="text-white/40 text-xs">{earnedPoints} / {maxPoints} pts</span>
          </div>
        </div>

        {/* Right: streak counter */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/25">
          <Flame size={14} className="text-orange-400" />
          <span className="text-orange-400 text-xs font-semibold">
            {streak} day{streak !== 1 ? 's' : ''} streak
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[#00FF66] to-[#00cc66]"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          style={{ boxShadow: '0 0 12px rgba(0,255,102,0.35)' }}
        />
      </div>
    </motion.div>
  );
}
