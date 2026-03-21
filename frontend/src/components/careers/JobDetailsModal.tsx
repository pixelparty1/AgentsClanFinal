'use client';

import { Fragment, useRef } from 'react';
import { X, MapPin, Briefcase, DollarSign, Calendar } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import type { Job, ApplicationStatus } from '@/lib/jobs';
import ApplicationStatusBadge from './ApplicationStatusBadge';
import JobApplicationForm from './JobApplicationForm';

interface JobDetailsModalProps {
  job: Job | null;
  applicationStatus: ApplicationStatus | null;
  onClose: () => void;
  onApply: (data: {
    fullName: string;
    email: string;
    portfolioUrl: string;
    githubUrl: string;
    resumeFile: File | null;
    motivationText: string;
    recentBuild: string;
  }) => Promise<void>;
}

/* Stagger variant for each section */
const sectionVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 0.12 * i, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

export default function JobDetailsModal({ job, applicationStatus, onClose, onApply }: JobDetailsModalProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  /* scroll-linked progress bar at top */
  const { scrollYProgress } = useScroll({ container: scrollRef });
  const scaleX = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1]), {
    stiffness: 200,
    damping: 30,
  });

  if (!job) return null;

  const hasApplied = applicationStatus !== null;

  return (
    <AnimatePresence>
      <Fragment>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Drawer */}
        <motion.aside
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 32 }}
          className="fixed top-0 right-0 z-51 h-full w-full max-w-135 bg-[#0a0a0a]/95 border-l border-white/10 flex flex-col"
        >
          {/* Scroll progress bar */}
          <motion.div
            style={{ scaleX, transformOrigin: '0% 0%' }}
            className="h-0.5 bg-[#00FF66] shrink-0"
          />

          <div ref={scrollRef} className="flex-1 overflow-y-auto scroll-smooth">
            <div className="p-6 md:p-8 flex flex-col gap-6">
              {/* Header */}
              <motion.div
                variants={sectionVariant}
                initial="hidden"
                animate="visible"
                custom={0}
                className="flex items-start justify-between gap-4"
              >
                <div className="flex flex-col gap-1">
                  <h2 className="text-white text-xl font-bold">{job.title}</h2>
                  <p className="text-white/50 text-sm">{job.company}</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full border border-white/10 bg-white/5 text-white/50 hover:text-white hover:border-white/20 transition-colors"
                >
                  <X size={16} />
                </button>
              </motion.div>

              {/* Status badge if applied */}
              {hasApplied && (
                <motion.div variants={sectionVariant} initial="hidden" animate="visible" custom={1} className="flex items-center gap-2">
                  <ApplicationStatusBadge status={applicationStatus} />
                </motion.div>
              )}

              {/* Meta grid */}
              <motion.div variants={sectionVariant} initial="hidden" animate="visible" custom={2} className="grid grid-cols-2 gap-3">
                {[
                  { icon: <Briefcase size={14} className="text-[#00FF66]/60" />, label: 'Role Type', value: job.roleType },
                  { icon: <MapPin size={14} className="text-[#00FF66]/60" />, label: 'Location', value: job.location },
                  { icon: <DollarSign size={14} className="text-[#00FF66]/60" />, label: 'Compensation', value: job.compensation },
                  { icon: <Calendar size={14} className="text-[#00FF66]/60" />, label: 'Posted', value: new Date(job.postedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) },
                ].map((meta, i) => (
                  <motion.div
                    key={meta.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.35, delay: 0.3 + i * 0.07 }}
                    className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3"
                  >
                    {meta.icon}
                    <div className="flex flex-col">
                      <span className="text-white/40 text-[10px] uppercase tracking-wider">{meta.label}</span>
                      <span className="text-white text-xs font-medium">{meta.value}</span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Description — scroll-reveal */}
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px', root: scrollRef }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col gap-2"
              >
                <h3 className="text-white/60 text-xs font-semibold uppercase tracking-wider">About This Role</h3>
                <p className="text-white/65 text-[15px] leading-relaxed whitespace-pre-line">{job.description}</p>
              </motion.div>

              {/* Skills — staggered pill reveal */}
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px', root: scrollRef }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col gap-2"
              >
                <h3 className="text-white/60 text-xs font-semibold uppercase tracking-wider">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, i) => (
                    <motion.span
                      key={skill}
                      initial={{ opacity: 0, scale: 0.7 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, root: scrollRef }}
                      transition={{ duration: 0.3, delay: i * 0.06 }}
                      className="px-3 py-1 rounded-full bg-[#00FF66]/10 border border-[#00FF66]/20 text-[#00FF66] text-xs font-medium"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>

              {/* Responsibilities — staggered line reveal */}
              {job.responsibilities && job.responsibilities.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-20px', root: scrollRef }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col gap-2"
                >
                  <h3 className="text-white/60 text-xs font-semibold uppercase tracking-wider">Responsibilities</h3>
                  <ul className="space-y-1.5">
                    {job.responsibilities.map((r, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -15 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, root: scrollRef }}
                        transition={{ duration: 0.35, delay: i * 0.08 }}
                        className="text-white/60 text-sm flex items-start gap-2"
                      >
                        <span className="text-[#00FF66] mt-1.5 shrink-0">•</span>
                        <span>{r}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Application form or status */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px', root: scrollRef }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="mt-2 border-t border-white/10 pt-6 flex flex-col gap-4"
              >
                {hasApplied ? (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                    <p className="text-white/60 text-sm">
                      You&apos;ve already applied for this role. We&apos;ll reach out if your profile matches!
                    </p>
                  </div>
                ) : (
                  <>
                    <h3 className="text-white text-base font-semibold">Apply for this Role</h3>
                    <JobApplicationForm onSubmit={onApply} />
                  </>
                )}
              </motion.div>
            </div>
          </div>
        </motion.aside>
      </Fragment>
    </AnimatePresence>
  );
}
