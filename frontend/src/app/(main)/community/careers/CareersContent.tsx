'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import SectionBadge from '@/components/ui/SectionBadge';
import GradientHeading from '@/components/ui/GradientHeading';
import JobCard from '@/components/careers/JobCard';
import JobDetailsModal from '@/components/careers/JobDetailsModal';
import MyApplications from '@/components/careers/MyApplications';
import {
  JOBS,
  fetchUserApplications,
  submitJobApplication,
  uploadResume,
} from '@/lib/jobs';
import type { Job, JobApplication, ApplicationStatus } from '@/lib/jobs';

const TEMP_USER_ID = 'demo-user-001';

export default function CareersContent() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  /* ── Load user applications ───────────────────────────── */
  const load = useCallback(async () => {
    const apps = await fetchUserApplications(TEMP_USER_ID);
    setApplications(apps);
  }, []);

  useEffect(() => { load(); }, [load]);

  /* ── Derived: status map (jobId → status) ─────────────── */
  const statusMap = useMemo(() => {
    const m = new Map<string, ApplicationStatus>();
    applications.forEach((a) => m.set(a.job_id, a.status));
    return m;
  }, [applications]);

  /* ── Apply handler ─────────────────────────────────────── */
  async function handleApply(data: {
    fullName: string;
    email: string;
    portfolioUrl: string;
    githubUrl: string;
    resumeFile: File | null;
    motivationText: string;
    recentBuild: string;
  }) {
    if (!selectedJob) return;

    let resumeUrl: string | undefined;
    if (data.resumeFile) {
      const url = await uploadResume(data.resumeFile, TEMP_USER_ID);
      if (url) resumeUrl = url;
    }

    const result = await submitJobApplication({
      userId: TEMP_USER_ID,
      jobId: selectedJob.id,
      fullName: data.fullName,
      email: data.email,
      portfolioUrl: data.portfolioUrl,
      githubUrl: data.githubUrl,
      resumeUrl,
      motivationText: data.motivationText,
      recentBuild: data.recentBuild,
    });

    if (result) {
      setApplications((prev) => [result, ...prev]);
      toast.success('Application submitted! We\'ll be in touch.');
      setSelectedJob(null);
    } else {
      toast.error('Something went wrong. Try again.');
    }
  }

  /* ── Open job from MyApplications ──────────────────────── */
  function openJobById(jobId: string) {
    const job = JOBS.find((j) => j.id === jobId);
    if (job) setSelectedJob(job);
  }

  return (
    <main className="bg-black min-h-screen">
      {/* Hero */}
      <section className="px-6 md:px-30 pt-35 md:pt-40 pb-16 md:pb-20">
        <div className="flex flex-col items-start gap-5 max-w-160">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <SectionBadge text="Community" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}>
            <GradientHeading className="text-[40px] md:text-[56px]">Careers Shared with the Community</GradientHeading>
          </motion.div>
          <motion.p className="text-white/75 text-[17px] leading-relaxed" initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.22 }}>
            A curated stream of roles, internships, and collaborations shared with AgentsClan members. Click any role to apply directly.
          </motion.p>
        </div>
      </section>

      {/* My Applications (if any) */}
      {applications.length > 0 && (
        <section className="px-6 md:px-30 pb-10">
          <MyApplications applications={applications} jobs={JOBS} onViewJob={openJobById} />
        </section>
      )}

      {/* Job Listings */}
      <section className="px-6 md:px-30 pb-16 md:pb-24 border-t border-white/10 pt-12 md:pt-16">
        <div className="flex flex-col gap-4">
          {JOBS.map((job, i) => (
            <JobCard
              key={job.id}
              job={job}
              applicationStatus={statusMap.get(job.id) ?? null}
              index={i}
              onClick={() => setSelectedJob(job)}
            />
          ))}
        </div>
      </section>

      {/* Job Details Modal */}
      <AnimatePresence>
        {selectedJob && (
          <JobDetailsModal
            job={selectedJob}
            applicationStatus={statusMap.get(selectedJob.id) ?? null}
            onClose={() => setSelectedJob(null)}
            onApply={handleApply}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
