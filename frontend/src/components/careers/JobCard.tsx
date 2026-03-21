'use client';

import { Briefcase, MapPin, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Job, ApplicationStatus } from '@/lib/jobs';
import ApplicationStatusBadge from './ApplicationStatusBadge';
import { GlowingEffect } from '@/components/ui/glowing-effect';

interface JobCardProps {
  job: Job;
  applicationStatus: ApplicationStatus | null;
  index: number;
  onClick: () => void;
}

export default function JobCard({ job, applicationStatus, index, onClick }: JobCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.45, delay: index * 0.1 }}
      whileHover={{
        y: -5,
        boxShadow: '0 0 24px rgba(0,255,102,0.06)',
        borderColor: 'rgba(255,255,255,0.25)',
        transition: { duration: 0.2 },
      }}
      onClick={onClick}
      className="relative bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-4 hover:border-white/20 transition-colors cursor-pointer select-none"
    >
      <GlowingEffect spread={40} glow proximity={80} inactiveZone={0.02} borderWidth={2} />
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-white text-[17px] font-semibold">{job.title}</h2>
          <p className="text-white/60 text-xs">{job.company}</p>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white/60 text-[11px]">
            <Briefcase size={11} />
            <span>{job.roleType}</span>
          </div>
          {applicationStatus && <ApplicationStatusBadge status={applicationStatus} />}
        </div>
      </div>
      <p className="text-white/65 text-[15px] leading-relaxed line-clamp-2">{job.description}</p>

      {/* Skills */}
      <div className="flex flex-wrap gap-1.5">
        {job.skills.slice(0, 4).map((skill) => (
          <span key={skill} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-white/50 text-[10px] font-medium">
            {skill}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-4 text-xs text-white/40 mt-auto pt-2 border-t border-white/10">
        <div className="flex items-center gap-1.5">
          <MapPin size={11} />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock size={11} />
          <span>Shared via AgentsClan</span>
        </div>
      </div>
    </motion.div>
  );
}
