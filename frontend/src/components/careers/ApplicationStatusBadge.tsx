'use client';

import { CheckCircle, Clock, XCircle, Trophy } from 'lucide-react';
import type { ApplicationStatus } from '@/lib/jobs';

interface ApplicationStatusBadgeProps {
  status: ApplicationStatus;
}

const config: Record<ApplicationStatus, { label: string; icon: React.ReactNode; classes: string }> = {
  pending: {
    label: 'Application Submitted',
    icon: <Clock size={11} />,
    classes: 'bg-yellow-500/15 border-yellow-500/30 text-yellow-400',
  },
  shortlisted: {
    label: 'Shortlisted 🎯',
    icon: <CheckCircle size={11} />,
    classes: 'bg-[#00FF66]/15 border-[#00FF66]/30 text-[#00FF66]',
  },
  rejected: {
    label: 'Not Selected',
    icon: <XCircle size={11} />,
    classes: 'bg-red-500/15 border-red-500/30 text-red-400',
  },
  hired: {
    label: 'Welcome to the Team 🎉',
    icon: <Trophy size={11} />,
    classes: 'bg-[#00FF66]/15 border-[#00FF66]/30 text-[#00FF66]',
  },
};

export default function ApplicationStatusBadge({ status }: ApplicationStatusBadgeProps) {
  const c = config[status];
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-semibold ${c.classes}`}>
      {c.icon}
      <span>{c.label}</span>
    </div>
  );
}
