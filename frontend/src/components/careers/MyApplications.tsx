'use client';

import { Briefcase, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Job, JobApplication } from '@/lib/jobs';
import ApplicationStatusBadge from './ApplicationStatusBadge';

interface MyApplicationsProps {
  applications: JobApplication[];
  jobs: Job[];
  onViewJob: (jobId: string) => void;
}

export default function MyApplications({ applications, jobs, onViewJob }: MyApplicationsProps) {
  if (applications.length === 0) return null;

  const jobMap = new Map(jobs.map((j) => [j.id, j]));

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-4"
    >
      <div className="flex items-center gap-2.5 mb-1">
        <div className="h-8 w-8 rounded-full bg-[#00FF66]/10 flex items-center justify-center">
          <Briefcase size={14} className="text-[#00FF66]" />
        </div>
        <h3 className="text-white text-lg font-semibold">My Applications</h3>
      </div>

      <div className="space-y-3">
        {applications.map((app) => {
          const job = jobMap.get(app.job_id);
          return (
            <motion.div
              key={app.id}
              whileHover={{ y: -2 }}
              onClick={() => onViewJob(app.job_id)}
              className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between gap-4 cursor-pointer hover:border-white/20 transition-colors"
            >
              <div className="flex flex-col gap-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{job?.title ?? 'Unknown Role'}</p>
                <p className="text-white/40 text-xs">
                  Applied {new Date(app.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <ApplicationStatusBadge status={app.status} />
                <ExternalLink size={14} className="text-white/25" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
