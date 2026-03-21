'use client';

import { useState } from 'react';
import { Upload, Link2, Loader2 } from 'lucide-react';

interface ProofSubmissionFormProps {
  onSubmit: (data: { proofLink: string; description: string; fileUrl?: string }) => Promise<void>;
  disabled?: boolean;
}

export default function ProofSubmissionForm({ onSubmit, disabled }: ProofSubmissionFormProps) {
  const [proofLink, setProofLink] = useState('');
  const [description, setDescription] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!proofLink.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit({ proofLink: proofLink.trim(), description: description.trim(), fileUrl: undefined });
    } finally {
      setSubmitting(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setFileName(file.name);
  }

  const isDisabled = disabled || submitting;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Proof link */}
      <div className="flex flex-col gap-1.5">
        <label className="text-white/50 text-xs font-medium uppercase tracking-wider">
          Proof Link <span className="text-white/30">(GitHub / Notion / Social)</span>
        </label>
        <div className="relative">
          <Link2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="url"
            placeholder="https://github.com/..."
            value={proofLink}
            onChange={(e) => setProofLink(e.target.value)}
            required
            disabled={isDisabled}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-[#00FF66]/40 transition-colors disabled:opacity-40"
          />
        </div>
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <label className="text-white/50 text-xs font-medium uppercase tracking-wider">
          Brief Description
        </label>
        <textarea
          placeholder="What did you do?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          disabled={isDisabled}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-[#00FF66]/40 transition-colors resize-none disabled:opacity-40"
        />
      </div>

      {/* File upload */}
      <div className="flex flex-col gap-1.5">
        <label className="text-white/50 text-xs font-medium uppercase tracking-wider">
          Screenshot <span className="text-white/30">(optional)</span>
        </label>
        <label
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed border-white/15 bg-white/5 cursor-pointer hover:border-white/25 transition-colors ${isDisabled ? 'opacity-40 pointer-events-none' : ''}`}
        >
          <Upload size={14} className="text-white/40" />
          <span className="text-sm text-white/40">{fileName ?? 'Choose file…'}</span>
          <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={isDisabled} />
        </label>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isDisabled || !proofLink.trim()}
        className="group relative w-full mt-1"
      >
        <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-[#00ff88] to-[#00cc66] opacity-40 blur-md group-hover:opacity-70 transition-opacity duration-300" />
        <div className="relative bg-gradient-to-r from-[#00ff88] to-[#00cc66] rounded-full px-6 py-3 overflow-hidden transition-all duration-300 active:scale-95 hover:scale-[1.02] shadow-[0_0_16px_rgba(0,255,136,0.2)] flex items-center justify-center gap-2 disabled:opacity-50">
          {submitting ? (
            <>
              <Loader2 size={14} className="text-[#0b1a13] animate-spin" />
              <span className="text-[#0b1a13] text-sm font-semibold">Submitting…</span>
            </>
          ) : (
            <span className="text-[#0b1a13] text-sm font-semibold">Submit Proof</span>
          )}
        </div>
      </button>
    </form>
  );
}
