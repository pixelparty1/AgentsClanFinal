'use client';

import { Clock, Target, Zap, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Quest, SubmissionStatus } from '@/lib/quests';
import { GlowingEffect } from '@/components/ui/glowing-effect';

interface QuestCardProps {
  quest: Quest;
  status: SubmissionStatus;
  approvedPoints?: number;
  index: number;
  onClick: () => void;
}

const statusConfig: Record<SubmissionStatus, { label: string; classes: string } | null> = {
  not_started: null,
  pending: { label: 'Pending Review', classes: 'bg-yellow-500/15 border-yellow-500/30 text-yellow-400' },
  approved: { label: '', classes: 'bg-[#00FF66]/15 border-[#00FF66]/30 text-[#00FF66]' },
};

export default function QuestCard({ quest, status, approvedPoints, index, onClick }: QuestCardProps) {
  const badge = statusConfig[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 55 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: index * 0.08 }}
      whileHover={{
        y: -7,
        boxShadow: '0 0 24px rgba(0,255,102,0.08)',
        borderColor: 'rgba(255,255,255,0.25)',
        transition: { duration: 0.2 },
      }}
      onClick={onClick}
      className={`relative bg-white/5 border rounded-2xl p-6 flex flex-col gap-4 transition-colors cursor-pointer select-none ${
        status === 'approved'
          ? 'border-[#00FF66]/30'
          : 'border-white/10 hover:border-white/20'
      }`}
    >
      <GlowingEffect spread={40} glow proximity={80} inactiveZone={0.02} borderWidth={2} />
      {/* Top row: category + status badge */}
      <div className="flex items-center justify-between gap-2">
        <div className="inline-flex w-fit items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15">
          <Zap size={12} className="text-[#00FF66]" />
          <span className="text-white/60 text-xs font-medium">{quest.type}</span>
        </div>

        {badge && (
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-semibold ${badge.classes}`}>
            {status === 'approved' && <CheckCircle size={10} />}
            <span>{status === 'approved' ? `Completed +${approvedPoints ?? quest.points}pts` : badge.label}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1">
        <h2 className="text-white text-[17px] font-semibold">{quest.title}</h2>
        <p className="text-white/65 text-[15px] leading-relaxed">{quest.description}</p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-white/50 mt-auto pt-2 border-t border-white/10">
        <div className="flex items-center gap-1.5">
          <Target size={12} className="text-white/40" />
          <span>{quest.points} pts</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock size={12} className="text-white/40" />
          <span>{quest.time}</span>
        </div>
      </div>
    </motion.div>
  );
}
