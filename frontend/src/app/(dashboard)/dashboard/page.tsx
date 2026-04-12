'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { account } from '@/lib/appwrite';
import type { Models } from 'appwrite';
import SectionBadge from '@/components/ui/SectionBadge';
import GradientHeading from '@/components/ui/GradientHeading';
import {
  User,
  Trophy,
  Calendar,
  ShoppingBag,
  Star,
  ArrowRight,
  LogOut,
  Zap,
  Target,
  Clock,
} from 'lucide-react';

/* ─── Quick-link cards ────────────────────────────────────────────────────── */
const quickLinks = [
  {
    title: 'Membership',
    description: 'View your membership tier and NFT details.',
    href: '/membership',
    icon: Star,
    color: '#00ff88',
  },
  {
    title: 'Events',
    description: 'Browse upcoming community events.',
    href: '/events',
    icon: Calendar,
    color: '#00cc66',
  },
  {
    title: 'Quests',
    description: 'Complete daily quests and earn rewards.',
    href: '/rewards/daily-quests',
    icon: Target,
    color: '#00ff88',
  },
  {
    title: 'Achievements',
    description: 'Track your badges and milestones.',
    href: '/achievements',
    icon: Trophy,
    color: '#00ff88',
  },
  {
    title: 'Book a Call',
    description: 'Schedule a 1-on-1 with a mentor.',
    href: '/book-a-call',
    icon: Zap,
    color: '#00cc66',
  },
];

/* ─── Stat card data (static demo) ───────────────────────────────────────── */
const stats = [
  { label: 'Quests Completed', value: '0', icon: Target },
  { label: 'Events Attended', value: '0', icon: Calendar },
  { label: 'Achievements', value: '0', icon: Trophy },
  { label: 'Member Since', value: '—', icon: Clock },
];

/* ─── Component ───────────────────────────────────────────────────────────── */
export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const session = await account.get();
        setUser(session);

        // Update "Member Since" stat with actual date
        const joined = new Date(session.$createdAt);
        stats[3].value = joined.toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric',
        });
      } catch {
        // Not logged in — redirect to sign-up
        router.replace('/sign-up');
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  const handleLogout = async () => {
    try {
      await account.deleteSession('current');
      router.replace('/sign-up');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  /* Loading skeleton */
  if (loading) {
    return (
      <main className="bg-[#0b1a13] min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#00ff88]/30 border-t-[#00ff88] rounded-full animate-spin" />
      </main>
    );
  }

  if (!user) return null;

  const initials = (user.name || user.email || '?')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <main className="bg-[#0b1a13] min-h-screen pt-20 pb-20 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto flex flex-col gap-10">

        {/* ── Header / Profile ────────────────────────────────────────────── */}
        <section className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* Avatar */}
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00ff88] to-[#00cc66] flex items-center justify-center text-[#0b1a13] text-xl font-bold shadow-[0_0_24px_rgba(0,255,136,0.25)]">
                {initials}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#00ff88] border-2 border-[#0b1a13] shadow-[0_0_6px_#00ff88]" />
            </div>

            <div className="flex flex-col gap-1">
              <SectionBadge text="Dashboard" />
              <GradientHeading className="text-[28px] md:text-[36px]" as="h1">
                {user.name ? `Welcome, ${user.name.split(' ')[0]}` : 'Welcome back'}
              </GradientHeading>
              <p className="text-white/40 text-sm">{user.email}</p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 text-white/50 text-sm font-medium hover:border-red-500/40 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200"
          >
            <LogOut size={15} />
            Sign Out
          </button>
        </section>

        {/* ── Stats Row ───────────────────────────────────────────────────── */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="premium-card rounded-2xl p-5 flex flex-col gap-3"
            >
              <div className="flex items-center gap-2 text-white/40">
                <s.icon size={15} />
                <span className="text-xs font-medium uppercase tracking-wider">{s.label}</span>
              </div>
              <span className="text-2xl font-semibold text-[#e6fff5]">{s.value}</span>
            </div>
          ))}
        </section>

        {/* ── Quick Links Grid ────────────────────────────────────────────── */}
        <section className="flex flex-col gap-4">
          <h2 className="text-white/60 text-xs font-semibold uppercase tracking-widest">
            Explore
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickLinks.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="group premium-card rounded-2xl p-6 flex flex-col gap-4 hover:border-[#00ff88]/25 transition-all duration-300"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `${link.color}10`, border: `1px solid ${link.color}20` }}
                >
                  <link.icon size={18} style={{ color: link.color }} />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[#e6fff5] text-[15px] font-semibold group-hover:text-[#00ff88] transition-colors duration-200">
                    {link.title}
                  </span>
                  <span className="text-white/40 text-sm leading-relaxed">
                    {link.description}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[#00ff88]/0 group-hover:text-[#00ff88]/80 transition-all duration-300 text-xs font-medium mt-auto">
                  Explore <ArrowRight size={12} />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Activity placeholder ────────────────────────────────────────── */}
        <section className="premium-card rounded-2xl p-6 flex flex-col gap-4">
          <h2 className="text-white/60 text-xs font-semibold uppercase tracking-widest">
            Recent Activity
          </h2>
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <User size={20} className="text-white/30" />
            </div>
            <p className="text-white/30 text-sm text-center max-w-xs">
              Your recent activity will appear here once you start exploring the community.
            </p>
            <Link
              href="/rewards/daily-quests"
              className="mt-2 px-5 py-2 rounded-full bg-[#00ff88]/10 border border-[#00ff88]/20 text-[#00ff88] text-sm font-medium hover:bg-[#00ff88]/20 transition-all duration-200"
            >
              Start a Quest
            </Link>
          </div>
        </section>

      </div>
    </main>
  );
}
