/* ──────────────────────────────────────────────────────────
   Quest types, Supabase helpers & local quest data
   ────────────────────────────────────────────────────────── */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { questsApi } from './api';

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

type Platform = 'instagram' | 'facebook' | 'twitter' | 'linkedin';

/* ── Quest catalogue ─────────────────────────────────────── */

export const QUESTS: Quest[] = [];

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
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  try {
    const response = await questsApi.getMySubmissions({ limit: 200 });
    const items = response.items || [];
    return items
      .filter((doc: any) => new Date(doc.$createdAt || doc.created_at).getTime() >= todayStart.getTime())
      .map((doc: any) => ({
        id: doc.$id || doc.id,
        user_id: userId,
        quest_id: doc.quest_id || '',
        proof_link: doc.Instagram_URL || doc.Facebook_URL || doc.Twitter_URL || doc.Linkedin_URL || '',
        description: (doc.Description || '').replace(/\[\[[^\]]+\]\]/g, '').trim(),
        file_url: null,
        status: typeof doc.status === 'boolean' ? (doc.status ? 'approved' : 'pending') : (doc.status === 'approved' ? 'approved' : 'pending'),
        created_at: doc.$createdAt || doc.created_at || new Date().toISOString(),
      })) as QuestSubmission[];
  } catch (error) {
    console.error('fetchTodaySubmissions:', error);
    return [];
  }
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
  const platformUrls: Record<Platform, string | null> = {
    instagram: null,
    facebook: null,
    twitter: null,
    linkedin: null,
  };

  for (const segment of proofLink.split('|')) {
    const [rawPlatform, ...rest] = segment.split(':');
    const platform = rawPlatform?.trim().toLowerCase() as Platform;
    const url = rest.join(':').trim();

    if (platform in platformUrls && url) {
      platformUrls[platform] = url;
    }
  }

  try {
    // Get current user's email from Appwrite
    let userEmail: string | undefined;
    try {
      const { account } = await import('./appwrite');
      const user = await account.get();
      userEmail = user.email;
    } catch (e) {
      console.warn('Could not get user email:', e);
    }

    const response = await questsApi.submit(questId, {
      instagramUrl: platformUrls.instagram || undefined,
      facebookUrl: platformUrls.facebook || undefined,
      twitterUrl: platformUrls.twitter || undefined,
      linkedinUrl: platformUrls.linkedin || undefined,
      description: description || undefined,
      email: userEmail,
    });

    if (!response.success) {
      console.error('submitQuestProof:', response.error);
      return null;
    }

    const doc = response.data as any;

    return {
      id: doc?.$id || crypto.randomUUID(),
      user_id: userId,
      quest_id: questId,
      proof_link: proofLink,
      description,
      file_url: fileUrl ?? null,
      status: 'pending',
      created_at: doc?.$createdAt || new Date().toISOString(),
    };
  } catch (error) {
    console.error('submitQuestProof:', error);
    return null;
  }
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
