/* ──────────────────────────────────────────────────────────
   Quest types, Supabase helpers & local quest data
   ────────────────────────────────────────────────────────── */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

/* ── Types ───────────────────────────────────────────────── */

/** Quest category */
export type QuestCategory = 'Builder' | 'Community' | 'Learning' | 'Show Up' | 'Social' | 'Open Source';

/** Submission review status */
export type SubmissionStatus = 'not_started' | 'pending' | 'approved';

/** A quest definition (static data) */
export interface Quest {
  id: string;
  type: QuestCategory;
  title: string;
  points: number;
  time: string;
  description: string;
}

/** A row from quest_submissions table */
export interface QuestSubmission {
  id: string;
  user_id: string;
  quest_id: string;
  proof_link: string;
  description: string;
  file_url: string | null;
  status: 'pending' | 'approved';
  created_at: string;
}

/** Streak info for the current user */
export interface StreakInfo {
  current: number;
  lastCompletedAt: string | null;
}

/* ── Quest catalogue ─────────────────────────────────────── */

export const QUESTS: Quest[] = [
  { id: 'q-ship-feature',       type: 'Builder',     title: 'Ship One Small Feature',       points: 25, time: '~45 min',   description: 'Commit and push at least one meaningful change to a personal or community project.' },
  { id: 'q-help-builder',       type: 'Community',   title: 'Help Another Builder',          points: 15, time: '~20 min',   description: 'Answer a question, review code, or give feedback to someone in the community.' },
  { id: 'q-study-30',           type: 'Learning',    title: 'Study for 30 Minutes',          points: 10, time: '30 min',    description: 'Read docs, watch a talk, or learn something new and share a short summary.' },
  { id: 'q-attend-event',       type: 'Show Up',     title: 'Attend an Event or Session',    points: 20, time: 'Variable',  description: 'Join an AgentsClan event, AMA, or workshop live.' },
  { id: 'q-share-progress',     type: 'Social',      title: 'Share Your Build Progress',     points: 10, time: '~10 min',   description: 'Post an honest progress update in the community or on socials.' },
  { id: 'q-open-source',        type: 'Open Source',  title: 'Make One Contribution',         points: 35, time: '~60+ min',  description: 'Open a pull request or file a helpful issue in an open-source project.' },
];

export const MAX_DAILY_POINTS = QUESTS.reduce((s, q) => s + q.points, 0);

/* ── Lazy Supabase client ────────────────────────────────── */

let _sb: SupabaseClient | null = null;

function sb(): SupabaseClient {
  if (!_sb) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) throw new Error('Supabase env vars missing');
    _sb = createClient(url, key);
  }
  return _sb;
}

function safeClient(): SupabaseClient | null {
  try { return sb(); } catch { return null; }
}

/* ── Submission CRUD ─────────────────────────────────────── */

/** Fetch all submissions for a user (today only).
 *  Returns [] if Supabase is not configured. */
export async function fetchTodaySubmissions(userId: string): Promise<QuestSubmission[]> {
  const client = safeClient();
  if (!client) return [];

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const { data, error } = await client
    .from('quest_submissions')
    .select('*')
    .eq('user_id', userId)
    .gte('created_at', todayStart.toISOString())
    .order('created_at', { ascending: false });

  if (error) { console.error('fetchTodaySubmissions:', error); return []; }
  return (data as QuestSubmission[]) ?? [];
}

/** Submit proof for a quest.
 *  Returns the created row, or null on failure / no Supabase. */
export async function submitQuestProof({
  userId,
  questId,
  proofLink,
  description,
  fileUrl,
}: {
  userId: string;
  questId: string;
  proofLink: string;
  description: string;
  fileUrl?: string;
}): Promise<QuestSubmission | null> {
  const client = safeClient();
  if (!client) {
    console.warn('Supabase not configured — simulating submission');
    // Return a fake row so the UI still works in dev
    return {
      id: crypto.randomUUID(),
      user_id: userId,
      quest_id: questId,
      proof_link: proofLink,
      description,
      file_url: fileUrl ?? null,
      status: 'pending',
      created_at: new Date().toISOString(),
    };
  }

  const { data, error } = await client
    .from('quest_submissions')
    .insert([{
      user_id: userId,
      quest_id: questId,
      proof_link: proofLink,
      description,
      file_url: fileUrl ?? null,
      status: 'pending',
    }])
    .select()
    .single();

  if (error) { console.error('submitQuestProof:', error); return null; }
  return data as QuestSubmission;
}

/* ── Streak ──────────────────────────────────────────────── */

/** Fetch streak info for user.
 *  Returns { current: 0, lastCompletedAt: null } when Supabase is missing. */
export async function fetchStreak(userId: string): Promise<StreakInfo> {
  const client = safeClient();
  if (!client) return { current: 0, lastCompletedAt: null };

  const { data, error } = await client
    .from('user_streaks')
    .select('current_streak, last_completed_at')
    .eq('user_id', userId)
    .single();

  if (error || !data) return { current: 0, lastCompletedAt: null };
  return { current: data.current_streak, lastCompletedAt: data.last_completed_at };
}
