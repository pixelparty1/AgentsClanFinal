'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Filter, ChevronDown, ExternalLink, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import SectionBadge from '@/components/ui/SectionBadge';
import GradientHeading from '@/components/ui/GradientHeading';
import ApplicationStatusBadge from '@/components/careers/ApplicationStatusBadge';
import { JOBS, fetchAllApplications, updateApplicationStatus } from '@/lib/jobs';
import type { JobApplication, ApplicationStatus } from '@/lib/jobs';

const STATUS_OPTIONS: ApplicationStatus[] = ['pending', 'shortlisted', 'rejected', 'hired'];

export default function AdminContent() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [jobFilter, setJobFilter] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const apps = await fetchAllApplications(jobFilter || undefined);
      if (!cancelled) {
        setApplications(apps);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [jobFilter]);

  async function handleStatusChange(appId: string, newStatus: ApplicationStatus) {
    const ok = await updateApplicationStatus(appId, newStatus);
    if (ok) {
      setApplications((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a)),
      );
      toast.success(`Status updated to ${newStatus}`);
    } else {
      toast.error('Failed to update status');
    }
  }

  const jobMap = new Map(JOBS.map((j) => [j.id, j]));

  return (
    <main className="bg-black min-h-screen">
      {/* Hero */}
      <section className="px-6 md:px-30 pt-35 md:pt-40 pb-12">
        <div className="flex flex-col items-start gap-5 max-w-160">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <SectionBadge text="Admin" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}>
            <GradientHeading className="text-[36px] md:text-[48px]">Applications Dashboard</GradientHeading>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="px-6 md:px-30 pb-6 flex items-center gap-4">
        <div className="flex items-center gap-2 text-white/40 text-xs">
          <Filter size={12} />
          <span>Filter by role:</span>
        </div>
        <div className="relative">
          <select
            value={jobFilter}
            onChange={(e) => setJobFilter(e.target.value)}
            className="appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-2 pr-8 text-sm text-white outline-none focus:border-[#00FF66]/40 transition-colors cursor-pointer"
          >
            <option value="">All Roles</option>
            {JOBS.map((j) => (
              <option key={j.id} value={j.id}>{j.title}</option>
            ))}
          </select>
          <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
        </div>
        <div className="flex items-center gap-1.5 ml-auto text-white/30 text-xs">
          <Shield size={12} />
          <span>{applications.length} applications</span>
        </div>
      </section>

      {/* Table */}
      <section className="px-6 md:px-30 pb-24">
        {loading ? (
          <div className="text-white/30 text-sm py-12 text-center">Loading applications…</div>
        ) : applications.length === 0 ? (
          <div className="text-white/30 text-sm py-12 text-center">No applications found.</div>
        ) : (
          <div className="flex flex-col gap-3">
            {applications.map((app) => {
              const job = jobMap.get(app.job_id);
              return (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col gap-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-col gap-1 min-w-0">
                      <p className="text-white text-sm font-semibold">{app.full_name}</p>
                      <p className="text-white/40 text-xs">{app.email}</p>
                      <p className="text-[#00FF66]/60 text-xs mt-1">{job?.title ?? app.job_id}</p>
                    </div>
                    <ApplicationStatusBadge status={app.status} />
                  </div>

                  <p className="text-white/55 text-sm leading-relaxed line-clamp-3">{app.motivation_text}</p>

                  {/* Links */}
                  <div className="flex flex-wrap gap-3 text-xs">
                    {app.portfolio_url && (
                      <a href={app.portfolio_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[#00FF66]/60 hover:text-[#00FF66] transition-colors">
                        <ExternalLink size={11} />
                        <span>Portfolio</span>
                      </a>
                    )}
                    {app.github_url && (
                      <a href={app.github_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[#00FF66]/60 hover:text-[#00FF66] transition-colors">
                        <ExternalLink size={11} />
                        <span>GitHub</span>
                      </a>
                    )}
                    {app.resume_url && (
                      <a href={app.resume_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[#00FF66]/60 hover:text-[#00FF66] transition-colors">
                        <FileText size={11} />
                        <span>Resume</span>
                      </a>
                    )}
                  </div>

                  {/* Status controls */}
                  <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                    <span className="text-white/30 text-xs mr-2">Set status:</span>
                    {STATUS_OPTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => handleStatusChange(app.id, s)}
                        disabled={app.status === s}
                        className={`px-3 py-1 rounded-full text-[10px] font-medium border transition-colors ${
                          app.status === s
                            ? 'bg-[#00FF66]/15 border-[#00FF66]/30 text-[#00FF66]'
                            : 'bg-white/5 border-white/10 text-white/40 hover:border-white/25 hover:text-white/60'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>

                  <p className="text-white/25 text-[10px]">
                    Applied {new Date(app.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
