'use client';

import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Target, Zap, CheckCircle, AlertCircle } from 'lucide-react';
import type { Quest, SubmissionStatus, QuestSubmission } from '@/lib/quests';
import ProofSubmissionForm from './ProofSubmissionForm';

interface QuestModalProps {
  quest: Quest | null;
  status: SubmissionStatus;
  submission: QuestSubmission | null;
  onClose: () => void;
  onSubmitProof: (data: { proofLink: string; description: string; fileUrl?: string }) => Promise<void>;
}

const statusBadge: Record<SubmissionStatus, { label: string; icon: React.ReactNode; classes: string }> = {
  not_started: {
    label: 'Not Started',
    icon: <AlertCircle size={12} />,
    classes: 'bg-white/10 border-white/15 text-white/50',
  },
  pending: {
    label: 'Submitted — Pending Review',
    icon: <Clock size={12} />,
    classes: 'bg-yellow-500/15 border-yellow-500/30 text-yellow-400',
  },
  approved: {
    label: 'Approved ✓',
    icon: <CheckCircle size={12} />,
    classes: 'bg-[#00FF66]/15 border-[#00FF66]/30 text-[#00FF66]',
  },
};

export default function QuestModal({ quest, status, submission, onClose, onSubmitProof }: QuestModalProps) {
  // Close on Escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    if (quest) document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [quest, handleKeyDown]);

  const badge = quest ? statusBadge[status] : null;

  return (
    <AnimatePresence>
      {quest && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          />

          {/* Side drawer (mobile: full bottom sheet, desktop: right slide) */}
          <motion.div
            key="drawer"
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full md:max-w-[520px] bg-[#0a0a0a] border-l border-white/10 overflow-y-auto"
          >
            <div className="flex flex-col gap-6 px-6 md:px-8 py-8">
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-3">
                  {/* Category */}
                  <div className="inline-flex w-fit items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15">
                    <Zap size={12} className="text-[#00FF66]" />
                    <span className="text-white/60 text-xs font-medium">{quest.type}</span>
                  </div>
                  {/* Title */}
                  <h2 className="text-white text-[22px] md:text-[26px] font-semibold leading-snug">{quest.title}</h2>
                </div>
                <button
                  onClick={onClose}
                  className="mt-1 w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors shrink-0"
                >
                  <X size={16} className="text-white/50" />
                </button>
              </div>

              {/* Status badge */}
              {badge && (
                <div className={`inline-flex w-fit items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold ${badge.classes}`}>
                  {badge.icon}
                  <span>{badge.label}</span>
                </div>
              )}

              {/* Description */}
              <p className="text-white/65 text-[15px] leading-relaxed">{quest.description}</p>

              {/* Meta grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col items-center gap-1.5">
                  <Target size={14} className="text-[#00FF66]" />
                  <span className="text-white text-sm font-semibold">{quest.points} pts</span>
                  <span className="text-white/40 text-[10px]">Reward</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col items-center gap-1.5">
                  <Clock size={14} className="text-[#00FF66]" />
                  <span className="text-white text-sm font-semibold">{quest.time}</span>
                  <span className="text-white/40 text-[10px]">Est. Time</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col items-center gap-1.5">
                  <Zap size={14} className="text-[#00FF66]" />
                  <span className="text-white text-sm font-semibold">{quest.type}</span>
                  <span className="text-white/40 text-[10px]">Category</span>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-white/10" />

              {/* Proof section */}
              {status === 'not_started' && (
                <div className="flex flex-col gap-3">
                  <h3 className="text-white text-sm font-semibold">Submit Proof</h3>
                  <ProofSubmissionForm onSubmit={onSubmitProof} />
                </div>
              )}

              {status === 'pending' && submission && (
                <div className="flex flex-col gap-3">
                  <h3 className="text-white text-sm font-semibold">Your Submission</h3>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-2">
                    <a
                      href={submission.proof_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#00FF66] text-sm underline underline-offset-2 break-all"
                    >
                      {submission.proof_link}
                    </a>
                    {submission.description && (
                      <p className="text-white/60 text-sm">{submission.description}</p>
                    )}
                    <span className="text-white/30 text-xs">
                      Submitted {new Date(submission.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-yellow-400/70 text-xs">
                    Your proof is under review. Points will be awarded after admin approval.
                  </p>
                </div>
              )}

              {status === 'approved' && (
                <div className="flex flex-col items-center gap-3 py-6">
                  <div className="w-14 h-14 rounded-full bg-[#00FF66]/15 border border-[#00FF66]/30 flex items-center justify-center">
                    <CheckCircle size={28} className="text-[#00FF66]" />
                  </div>
                  <span className="text-[#00FF66] text-sm font-semibold">Quest Completed!</span>
                  <span className="text-white/40 text-xs">+{quest.points} points awarded</span>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
