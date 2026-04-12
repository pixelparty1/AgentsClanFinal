'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  CreditCard,
  Award,
  ShoppingCart,
  Activity,
  TrendingUp,
  FileText,
  Briefcase,
  Clock,
  ArrowUpRight,
  type LucideIcon,
} from 'lucide-react';
import { getDashboardStats, type DashboardStats } from '@/lib/admin';
import GradientHeading from '@/components/ui/GradientHeading';
import { GlowCard } from '@/components/ui/glow-card';
import { AnalyticsDashboard } from '@/components/admin/AnalyticsCharts';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: LucideIcon;
  color: 'emerald' | 'blue' | 'purple' | 'amber' | 'rose';
}

function StatCard({ title, value, change, icon: Icon, color }: StatCardProps) {
  const colorClasses = {
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  return (
    <GlowCard className="h-full">
      <div className="relative rounded-2xl border border-emerald-900/30 bg-emerald-950/20 p-6 h-full">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            {change && (
              <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {change}
              </p>
            )}
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </div>
    </GlowCard>
  );
}

interface QuickActionProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

function QuickAction({ title, description, href, icon: Icon }: QuickActionProps) {
  return (
    <a
      href={href}
      className="group flex items-center gap-4 p-4 rounded-xl border border-emerald-900/30 bg-emerald-950/10 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all"
    >
      <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
        <Icon className="w-5 h-5 text-emerald-400" />
      </div>
      <div className="flex-1">
        <p className="font-medium text-sm">{title}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-emerald-400 transition-colors" />
    </a>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount / 100);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <GradientHeading as="h1" className="text-3xl mb-2">
          Dashboard
        </GradientHeading>
        <p className="text-gray-400">
          Welcome back! Here&apos;s what&apos;s happening with AgentsClan.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatCard
            title="Total Users"
            value={loading ? '—' : stats?.totalUsers || 0}
            change="+12% this month"
            icon={Users}
            color="emerald"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatCard
            title="NFT Holders"
            value={loading ? '—' : stats?.totalNftHolders || 0}
            change="+8 this week"
            icon={Award}
            color="purple"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatCard
            title="Quests Completed"
            value={loading ? '—' : stats?.totalQuestsCompleted || 0}
            change="+24 today"
            icon={Activity}
            color="blue"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StatCard
            title="Pending Proofs"
            value={loading ? '—' : stats?.pendingSubmissions || 0}
            change="Action required"
            icon={FileText}
            color="rose"
          />
        </motion.div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <GlowCard>
            <div className="rounded-2xl border border-emerald-900/30 bg-emerald-950/20 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Pending Submissions</p>
                  <p className="text-2xl font-bold">{loading ? '—' : stats?.pendingSubmissions || 0}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-amber-400">
                <Clock className="w-3 h-3" />
                Awaiting review
              </div>
            </div>
          </GlowCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <GlowCard>
            <div className="rounded-2xl border border-emerald-900/30 bg-emerald-950/20 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Pending Applications</p>
                  <p className="text-2xl font-bold">{loading ? '—' : stats?.pendingApplications || 0}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-blue-400">
                <Clock className="w-3 h-3" />
                New job applicants
              </div>
            </div>
          </GlowCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <GlowCard>
            <div className="rounded-2xl border border-emerald-900/30 bg-emerald-950/20 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">System Status</p>
                  <p className="text-2xl font-bold">Optimal</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-emerald-400">
                <ArrowUpRight className="w-3 h-3" />
                All services active
              </div>
            </div>
          </GlowCard>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <GlowCard>
          <div className="rounded-2xl border border-emerald-900/30 bg-emerald-950/20 p-6">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <QuickAction
                title="Review Quest Submissions"
                description="Approve or reject pending proofs"
                href="/admin/quests"
                icon={Activity}
              />
              <QuickAction
                title="Review Job Applications"
                description="Check new applicants"
                href="/admin/applications"
                icon={Briefcase}
              />
              <QuickAction
                title="Create Announcement"
                description="Broadcast to all users"
                href="/admin/announcements"
                icon={FileText}
              />
              <QuickAction
                title="View Analytics"
                description="Deep dive into metrics"
                href="/admin/analytics"
                icon={TrendingUp}
              />
            </div>
          </div>
        </GlowCard>
      </motion.div>

      {/* Analytics Charts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="mt-8"
      >
        <h2 className="text-xl font-semibold mb-4">Analytics Overview</h2>
        <AnalyticsDashboard />
      </motion.div>
    </div>
  );
}
