/* ──────────────────────────────────────────────────────────
   Job types, catalogue & Supabase helpers
   ────────────────────────────────────────────────────────── */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

/* ── Types ───────────────────────────────────────────────── */

export type RoleType = 'Internship' | 'Full-time' | 'Part-time' | 'Contributor';
export type LocationType = 'Remote' | 'Onsite' | 'Hybrid';
export type ApplicationStatus = 'pending' | 'shortlisted' | 'rejected' | 'hired';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  locationType: LocationType;
  roleType: RoleType;
  description: string;
  skills: string[];
  compensation: string;
  responsibilities?: string[];
  postedAt: string;
}

export interface JobApplication {
  id: string;
  user_id: string;
  job_id: string;
  full_name: string;
  email: string;
  portfolio_url: string;
  github_url: string;
  resume_url: string | null;
  motivation_text: string;
  recent_build: string;
  status: ApplicationStatus;
  admin_notes: string | null;
  created_at: string;
}

/* ── Job catalogue ───────────────────────────────────────── */

export const JOBS: Job[] = [
  {
    id: 'job-community-mgr',
    title: 'Community Manager (Part-time)',
    company: 'AgentsClan',
    location: 'Remote — India',
    locationType: 'Remote',
    roleType: 'Part-time',
    description: 'Help run events, manage channels, and support builders across the community. You\'ll be the pulse of AgentsClan — facilitating discussions, onboarding new members, and coordinating with the core team to execute community initiatives.',
    skills: ['Community Management', 'Discord', 'Event Planning', 'Communication'],
    compensation: '₹15,000 – ₹25,000/month',
    responsibilities: [
      'Moderate Discord channels and foster meaningful conversations',
      'Plan and execute weekly community events and AMAs',
      'Onboard new members and create welcoming experiences',
      'Coordinate with the core team on community initiatives',
    ],
    postedAt: '2025-01-15T00:00:00Z',
  },
  {
    id: 'job-founding-eng',
    title: 'Founding Engineer (Platform)',
    company: 'Stealth Community Tooling Startup',
    location: 'Bengaluru, India',
    locationType: 'Onsite',
    roleType: 'Full-time',
    description: 'Join a small team building tools for online communities. You\'ll work across the stack — from database design to frontend polish — shipping features weekly. Shared via AgentsClan partners.',
    skills: ['React', 'Node.js', 'PostgreSQL', 'TypeScript', 'System Design'],
    compensation: '₹12–18 LPA + equity',
    responsibilities: [
      'Design and build core platform features end-to-end',
      'Collaborate directly with founders on product direction',
      'Ship production features on a weekly cadence',
      'Set up CI/CD, monitoring, and infrastructure as needed',
    ],
    postedAt: '2025-01-10T00:00:00Z',
  },
  {
    id: 'job-design-intern',
    title: 'Design Intern (Product)',
    company: 'Early-stage SaaS Company',
    location: 'Hybrid — Bengaluru',
    locationType: 'Hybrid',
    roleType: 'Internship',
    description: 'Work with a senior designer on real product screens and ship to production. You\'ll learn design systems, user research, and how to collaborate with engineers in a fast-moving startup.',
    skills: ['Figma', 'UI/UX', 'Design Systems', 'Prototyping'],
    compensation: '₹10,000/month stipend',
    responsibilities: [
      'Create high-fidelity mockups and prototypes in Figma',
      'Participate in user research and usability testing',
      'Build and maintain a design system library',
      'Work closely with engineers to ship pixel-perfect UIs',
    ],
    postedAt: '2025-01-20T00:00:00Z',
  },
];

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

/* ── Application CRUD ────────────────────────────────────── */

/** Fetch all applications for a user */
export async function fetchUserApplications(userId: string): Promise<JobApplication[]> {
  const client = safeClient();
  if (!client) return [];

  const { data, error } = await client
    .from('job_applications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) { console.error('fetchUserApplications:', error); return []; }
  return (data as JobApplication[]) ?? [];
}

/** Fetch all applications (admin) */
export async function fetchAllApplications(jobFilter?: string): Promise<JobApplication[]> {
  const client = safeClient();
  if (!client) return [];

  let query = client
    .from('job_applications')
    .select('*')
    .order('created_at', { ascending: false });

  if (jobFilter) {
    query = query.eq('job_id', jobFilter);
  }

  const { data, error } = await query;
  if (error) { console.error('fetchAllApplications:', error); return []; }
  return (data as JobApplication[]) ?? [];
}

/** Submit a new application */
export async function submitJobApplication(app: {
  userId: string;
  jobId: string;
  fullName: string;
  email: string;
  portfolioUrl: string;
  githubUrl: string;
  resumeUrl?: string;
  motivationText: string;
  recentBuild: string;
}): Promise<JobApplication | null> {
  const client = safeClient();
  if (!client) {
    console.warn('Supabase not configured — simulating application');
    return {
      id: crypto.randomUUID(),
      user_id: app.userId,
      job_id: app.jobId,
      full_name: app.fullName,
      email: app.email,
      portfolio_url: app.portfolioUrl,
      github_url: app.githubUrl,
      resume_url: app.resumeUrl ?? null,
      motivation_text: app.motivationText,
      recent_build: app.recentBuild,
      status: 'pending',
      admin_notes: null,
      created_at: new Date().toISOString(),
    };
  }

  const { data, error } = await client
    .from('job_applications')
    .insert([{
      user_id: app.userId,
      job_id: app.jobId,
      full_name: app.fullName,
      email: app.email,
      portfolio_url: app.portfolioUrl,
      github_url: app.githubUrl,
      resume_url: app.resumeUrl ?? null,
      motivation_text: app.motivationText,
      recent_build: app.recentBuild,
      status: 'pending',
    }])
    .select()
    .single();

  if (error) { console.error('submitJobApplication:', error); return null; }
  return data as JobApplication;
}

/** Upload resume to Supabase Storage. Returns public URL or null. */
export async function uploadResume(file: File, userId: string): Promise<string | null> {
  const client = safeClient();
  if (!client) {
    console.warn('Supabase not configured — skipping resume upload');
    return `mock://resume/${file.name}`;
  }

  const ext = file.name.split('.').pop() ?? 'pdf';
  const path = `resumes/${userId}/${Date.now()}.${ext}`;

  const { error } = await client.storage
    .from('job-files')
    .upload(path, file, { upsert: true });

  if (error) { console.error('uploadResume:', error); return null; }

  const { data: urlData } = client.storage
    .from('job-files')
    .getPublicUrl(path);

  return urlData.publicUrl;
}

/** Update application status (admin) */
export async function updateApplicationStatus(
  applicationId: string,
  status: ApplicationStatus,
  adminNotes?: string,
): Promise<boolean> {
  const client = safeClient();
  if (!client) return false;

  const updates: Record<string, unknown> = { status };
  if (adminNotes !== undefined) updates.admin_notes = adminNotes;

  const { error } = await client
    .from('job_applications')
    .update(updates)
    .eq('id', applicationId);

  if (error) { console.error('updateApplicationStatus:', error); return false; }
  return true;
}
