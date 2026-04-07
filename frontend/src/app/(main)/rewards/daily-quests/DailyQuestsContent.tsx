'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { useAccount } from 'wagmi';
import { Query } from 'appwrite';
import SectionBadge from '@/components/ui/SectionBadge';
import GradientHeading from '@/components/ui/GradientHeading';
import QuestCard from '@/components/quests/QuestCard';
import QuestModal from '@/components/quests/QuestModal';
import QuestProgressBar from '@/components/quests/QuestProgressBar';
import { questsApi, authApi } from '@/lib/api';
import { databases, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite';
import {
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
  const { address } = useAccount();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [submissions, setSubmissions] = useState<QuestSubmission[]>([]);
  const [streak, setStreak] = useState(0);
  const [userPoints, setUserPoints] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (address) {
      localStorage.setItem('walletAddress', address);
    }
  }, [address]);

  // Load quests from API and today's submissions & streak on mount
  useEffect(() => {
    (async () => {
      try {
        // Get current user from Appwrite to fetch points
        const { account } = await import('@/lib/appwrite');
        try {
          const user = await account.get();
          // Fetch user points from backend
          const pointsResponse = await authApi.getPoints(user.email);
          if (pointsResponse.success) {
            setUserPoints(pointsResponse.data.points);
          }
        } catch (e) {
          console.warn('Could not fetch user points:', e);
        }

        // Fetch quests from backend API
        const questsResponse = await questsApi.list();
        const activeQuests = (questsResponse.data?.items || []).filter((q: any) => q.active !== false);

        // Transform API quests to Quest interface
        const transformedQuests: Quest[] = activeQuests.map((q: any) => ({
          id: q.$id,
          title: q.title,
          description: q.description,
          points: q.points,
          type: q.type || 'Builder',
          time: q.time || 'Variable',
        }));

        setQuests(transformedQuests);
      } catch (error) {
        try {
          // Fallback: read quests directly from Appwrite so existing quests still appear.
          const direct = await databases.listDocuments(DATABASE_ID, COLLECTIONS.QUESTS, [
            Query.equal('active', true),
            Query.orderDesc('$createdAt'),
            Query.limit(100),
          ]);

          const transformedQuests: Quest[] = direct.documents.map((q: any) => ({
            id: q.$id,
            title: q.title,
            description: q.description,
            points: q.points,
            type: q.type || 'Builder',
            time: q.time || 'Variable',
          }));

          setQuests(transformedQuests);
        } catch (fallbackError) {
          console.error('Failed to fetch quests:', fallbackError);
          toast.error('Failed to load quests', {
            style: { background: '#111', color: '#ff6b6b', border: '1px solid rgba(255,100,100,0.25)' },
          });
        }
      }

      try {
        // Fetch today's submissions
        const subs = await fetchTodaySubmissions(TEMP_USER_ID);
        setSubmissions(subs);

        // Fetch streak
        const streakInfo = await fetchStreak(TEMP_USER_ID);
        setStreak(streakInfo.current);
      } catch (error) {
        console.error('Failed to fetch submissions/streak:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Periodically refresh user points (every 30 seconds to check for admin approvals)
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const { account } = await import('@/lib/appwrite');
        const user = await account.get();
        const pointsResponse = await authApi.getPoints(user.email);
        if (pointsResponse.success) {
          setUserPoints(pointsResponse.data.points);
        }
      } catch (e) {
        // Silent fail - just continue polling
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
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
        const quest = quests.find((q) => q.id === s.quest_id);
        return sum + (quest?.points ?? 0);
      }, 0);
  }, [submissions, quests]);

  /** Max daily points from current quests */
  const maxDailyPoints = useMemo(() => {
    return quests.reduce((sum, q) => sum + q.points, 0);
  }, [quests]);

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
      <section className="px-6 md:px-[120px] pb-6 space-y-4">
        {/* Total Points Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative bg-white/5 border border-white/10 rounded-2xl p-5"
        >
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-white/60 text-xs uppercase tracking-wider font-medium">Total Points</span>
              <span className="text-white text-2xl font-semibold mt-1">{userPoints}</span>
            </div>
            <div className="text-right">
              <span className="text-white/60 text-xs">All-time</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Quest grid */}
      <section className="px-6 md:px-[120px] pb-16 md:pb-24 border-t border-white/10 pt-12 md:pt-16">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-white/60">Loading quests...</p>
          </div>
        ) : quests.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/60">No quests available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {quests.map((quest, i) => (
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
        )}
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
