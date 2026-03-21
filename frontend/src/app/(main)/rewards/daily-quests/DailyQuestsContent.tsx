'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import SectionBadge from '@/components/ui/SectionBadge';
import GradientHeading from '@/components/ui/GradientHeading';
import QuestCard from '@/components/quests/QuestCard';
import QuestModal from '@/components/quests/QuestModal';
import QuestProgressBar from '@/components/quests/QuestProgressBar';
import {
  QUESTS,
  MAX_DAILY_POINTS,
  submitQuestProof,
  fetchTodaySubmissions,
  fetchStreak,
  type Quest,
  type QuestSubmission,
  type SubmissionStatus,
} from '@/lib/quests';

/** Temporary user id — replace with real auth when available */
const TEMP_USER_ID = 'demo-user-001';

export default function DailyQuestsContent() {
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [submissions, setSubmissions] = useState<QuestSubmission[]>([]);
  const [streak, setStreak] = useState(0);

  // Load today's submissions & streak on mount
  useEffect(() => {
    fetchTodaySubmissions(TEMP_USER_ID).then(setSubmissions);
    fetchStreak(TEMP_USER_ID).then((s) => setStreak(s.current));
  }, []);

  /** Map quest id → latest submission */
  const submissionMap = useMemo(() => {
    const map = new Map<string, QuestSubmission>();
    for (const sub of submissions) {
      if (!map.has(sub.quest_id)) map.set(sub.quest_id, sub);
    }
    return map;
  }, [submissions]);

  /** Derive status for a quest */
  const getStatus = useCallback(
    (questId: string): SubmissionStatus => {
      const sub = submissionMap.get(questId);
      if (!sub) return 'not_started';
      return sub.status === 'approved' ? 'approved' : 'pending';
    },
    [submissionMap],
  );

  /** Earned points (approved only) */
  const earnedPoints = useMemo(() => {
    return submissions
      .filter((s) => s.status === 'approved')
      .reduce((sum, s) => {
        const quest = QUESTS.find((q) => q.id === s.quest_id);
        return sum + (quest?.points ?? 0);
      }, 0);
  }, [submissions]);

  /** Handle proof submission from modal */
  const handleSubmitProof = useCallback(
    async (data: { proofLink: string; description: string; fileUrl?: string }) => {
      if (!selectedQuest) return;

      const result = await submitQuestProof({
        userId: TEMP_USER_ID,
        questId: selectedQuest.id,
        proofLink: data.proofLink,
        description: data.description,
        fileUrl: data.fileUrl,
      });

      if (result) {
        setSubmissions((prev) => [result, ...prev]);
        toast.success('Proof submitted successfully', {
          style: { background: '#111', color: '#e6fff5', border: '1px solid rgba(0,255,102,0.25)' },
          iconTheme: { primary: '#00FF66', secondary: '#0b1a13' },
        });
        // Close modal after short delay so user sees the state change
        setTimeout(() => setSelectedQuest(null), 800);
      } else {
        toast.error('Submission failed — try again', {
          style: { background: '#111', color: '#ff6b6b', border: '1px solid rgba(255,100,100,0.25)' },
        });
      }
    },
    [selectedQuest],
  );

  return (
    <main className="bg-black min-h-screen">
      <Toaster position="top-right" />

      {/* Hero */}
      <section className="px-6 md:px-[120px] pt-[140px] md:pt-[160px] pb-16 md:pb-20">
        <div className="flex flex-col items-start gap-5 max-w-[640px]">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <SectionBadge text="Rewards" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}>
            <GradientHeading className="text-[40px] md:text-[56px]">Daily Quests for Consistent Builders</GradientHeading>
          </motion.div>
          <motion.p className="text-white/75 text-[17px] leading-relaxed" initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.22 }}>
            Pick a few quests each day, submit proof, and watch your points — and skills — compound over time.
          </motion.p>
        </div>
      </section>

      {/* Progress + Streak */}
      <section className="px-6 md:px-[120px] pb-6">
        <QuestProgressBar earnedPoints={earnedPoints} maxPoints={MAX_DAILY_POINTS} streak={streak} />
      </section>

      {/* Quest grid */}
      <section className="px-6 md:px-[120px] pb-16 md:pb-24 border-t border-white/10 pt-12 md:pt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {QUESTS.map((quest, i) => (
            <QuestCard
              key={quest.id}
              quest={quest}
              status={getStatus(quest.id)}
              approvedPoints={quest.points}
              index={i}
              onClick={() => setSelectedQuest(quest)}
            />
          ))}
        </div>
      </section>

      {/* Modal / Side Drawer */}
      <QuestModal
        quest={selectedQuest}
        status={selectedQuest ? getStatus(selectedQuest.id) : 'not_started'}
        submission={selectedQuest ? submissionMap.get(selectedQuest.id) ?? null : null}
        onClose={() => setSelectedQuest(null)}
        onSubmitProof={handleSubmitProof}
      />
    </main>
  );
}
