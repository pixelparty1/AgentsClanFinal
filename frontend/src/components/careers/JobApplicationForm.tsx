'use client';

import { useState } from 'react';
import { Link2, Github, Upload, Loader2 } from 'lucide-react';

interface JobApplicationFormProps {
  onSubmit: (data: {
    fullName: string;
    email: string;
    portfolioUrl: string;
    githubUrl: string;
    resumeFile: File | null;
    motivationText: string;
    recentBuild: string;
  }) => Promise<void>;
  disabled?: boolean;
}

export default function JobApplicationForm({ onSubmit, disabled }: JobApplicationFormProps) {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    portfolioUrl: '',
    githubUrl: '',
    motivationText: '',
    recentBuild: '',
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Only PDF files are accepted.');
        return;
      }
      setResumeFile(file);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.fullName.trim() || !form.email.trim() || !form.motivationText.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit({ ...form, resumeFile });
    } finally {
      setSubmitting(false);
    }
  }

  const isDisabled = disabled || submitting;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Name & Email row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-white/50 text-xs font-medium uppercase tracking-wider">Full Name *</label>
          <input
            name="fullName"
            type="text"
            placeholder="Your full name"
            value={form.fullName}
            onChange={handleChange}
            required
            disabled={isDisabled}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-[#00FF66]/40 transition-colors disabled:opacity-40"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-white/50 text-xs font-medium uppercase tracking-wider">Email *</label>
          <input
            name="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            required
            disabled={isDisabled}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-[#00FF66]/40 transition-colors disabled:opacity-40"
          />
        </div>
      </div>

      {/* Portfolio link */}
      <div className="flex flex-col gap-1.5">
        <label className="text-white/50 text-xs font-medium uppercase tracking-wider">Portfolio Link</label>
        <div className="relative">
          <Link2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            name="portfolioUrl"
            type="url"
            placeholder="https://yourportfolio.com"
            value={form.portfolioUrl}
            onChange={handleChange}
            disabled={isDisabled}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-[#00FF66]/40 transition-colors disabled:opacity-40"
          />
        </div>
      </div>

      {/* GitHub link */}
      <div className="flex flex-col gap-1.5">
        <label className="text-white/50 text-xs font-medium uppercase tracking-wider">GitHub Link</label>
        <div className="relative">
          <Github size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            name="githubUrl"
            type="url"
            placeholder="https://github.com/yourname"
            value={form.githubUrl}
            onChange={handleChange}
            disabled={isDisabled}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-[#00FF66]/40 transition-colors disabled:opacity-40"
          />
        </div>
      </div>

      {/* Resume upload */}
      <div className="flex flex-col gap-1.5">
        <label className="text-white/50 text-xs font-medium uppercase tracking-wider">Resume (PDF) *</label>
        <label
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed border-white/15 bg-white/5 cursor-pointer hover:border-white/25 transition-colors ${isDisabled ? 'opacity-40 pointer-events-none' : ''}`}
        >
          <Upload size={14} className="text-white/40" />
          <span className="text-sm text-white/40">{resumeFile ? resumeFile.name : 'Choose PDF file…'}</span>
          <input type="file" accept=".pdf,application/pdf" className="hidden" onChange={handleFileChange} disabled={isDisabled} />
        </label>
      </div>

      {/* Motivation */}
      <div className="flex flex-col gap-1.5">
        <label className="text-white/50 text-xs font-medium uppercase tracking-wider">Why do you want this role? *</label>
        <textarea
          name="motivationText"
          placeholder="Tell us what excites you about this opportunity…"
          value={form.motivationText}
          onChange={handleChange}
          rows={4}
          required
          disabled={isDisabled}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-[#00FF66]/40 transition-colors resize-none disabled:opacity-40"
        />
      </div>

      {/* Recent build */}
      <div className="flex flex-col gap-1.5">
        <label className="text-white/50 text-xs font-medium uppercase tracking-wider">
          What have you built recently? <span className="text-white/30">(optional)</span>
        </label>
        <textarea
          name="recentBuild"
          placeholder="Share a project, side-hustle, or contribution…"
          value={form.recentBuild}
          onChange={handleChange}
          rows={3}
          disabled={isDisabled}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-[#00FF66]/40 transition-colors resize-none disabled:opacity-40"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isDisabled || !form.fullName.trim() || !form.email.trim() || !form.motivationText.trim()}
        className="group relative w-full mt-2"
      >
        <div className="absolute -inset-0.5 rounded-full bg-linear-to-r from-[#00ff88] to-[#00cc66] opacity-40 blur-md group-hover:opacity-70 transition-opacity duration-300" />
        <div className="relative bg-linear-to-r from-[#00ff88] to-[#00cc66] rounded-full px-6 py-3 overflow-hidden transition-all duration-300 active:scale-95 hover:scale-[1.02] shadow-[0_0_16px_rgba(0,255,136,0.2)] flex items-center justify-center gap-2 disabled:opacity-50">
          {submitting ? (
            <>
              <Loader2 size={14} className="text-[#0b1a13] animate-spin" />
              <span className="text-[#0b1a13] text-sm font-semibold">Submitting…</span>
            </>
          ) : (
            <span className="text-[#0b1a13] text-sm font-semibold">Submit Application</span>
          )}
        </div>
      </button>
    </form>
  );
}
