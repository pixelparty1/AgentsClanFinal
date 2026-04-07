'use client';

import { useState } from 'react';
import { Loader2, Instagram, Facebook, Twitter, Linkedin } from 'lucide-react';

interface ProofSubmissionFormProps {
  onSubmit: (data: { proofLink: string; description: string; fileUrl?: string }) => Promise<void>;
  disabled?: boolean;
}

type Platform = 'instagram' | 'facebook' | 'twitter' | 'linkedin';

const PLATFORMS: { id: Platform; label: string; icon: React.ReactNode }[] = [
  { id: 'instagram', label: 'Instagram', icon: <Instagram size={16} /> },
  { id: 'facebook', label: 'Facebook', icon: <Facebook size={16} /> },
  { id: 'twitter', label: 'Twitter', icon: <Twitter size={16} /> },
  { id: 'linkedin', label: 'LinkedIn', icon: <Linkedin size={16} /> },
];

export default function ProofSubmissionForm({ onSubmit, disabled }: ProofSubmissionFormProps) {
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
  const [platformUrls, setPlatformUrls] = useState<Record<Platform, string>>({
    instagram: '',
    facebook: '',
    twitter: '',
    linkedin: '',
  });
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (selectedPlatforms.length === 0) return;
    
    // Check if all selected platforms have URLs
    const allUrlsFilled = selectedPlatforms.every((platform) => platformUrls[platform]?.trim());
    if (!allUrlsFilled) return;

    setSubmitting(true);
    try {
      const proofLink = selectedPlatforms
        .map((platform) => `${platform}:${platformUrls[platform].trim()}`)
        .join('|');
      await onSubmit({ proofLink, description: description.trim(), fileUrl: undefined });
    } finally {
      setSubmitting(false);
    }
  }

  function handlePlatformChange(platform: Platform) {
    setSelectedPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
    );
  }

  function handleUrlChange(platform: Platform, url: string) {
    setPlatformUrls((prev) => ({
      ...prev,
      [platform]: url,
    }));
  }

  const isDisabled = disabled || submitting;
  const allSelectedUrlsFilled = selectedPlatforms.every((platform) => platformUrls[platform]?.trim());

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Platform selection */}
      <div className="flex flex-col gap-1.5">
        <label className="text-white/50 text-xs font-medium uppercase tracking-wider">
          Where will you post?
        </label>
        <div className="grid grid-cols-2 gap-2">
          {PLATFORMS.map((platform) => (
            <button
              key={platform.id}
              type="button"
              onClick={() => handlePlatformChange(platform.id)}
              disabled={isDisabled}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border cursor-pointer transition-colors ${
                selectedPlatforms.includes(platform.id)
                  ? 'bg-[#00FF66]/15 border-[#00FF66]/40 text-[#00FF66]'
                  : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20'
              } ${isDisabled ? 'opacity-40 pointer-events-none' : ''}`}
            >
              <span className="flex items-center gap-1.5 text-sm font-medium">
                {platform.icon}
                {platform.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Social URLs */}
      {selectedPlatforms.length > 0 && (
        <div className="flex flex-col gap-3">
          {selectedPlatforms.map((platform) => {
            const platformLabel = PLATFORMS.find((p) => p.id === platform)?.label || platform;
            return (
              <div key={platform} className="flex flex-col gap-1.5">
                <label className="text-white/50 text-xs font-medium uppercase tracking-wider">
                  Submit {platformLabel} URL
                </label>
                <input
                  type="url"
                  placeholder={`https://${platform}.com/...`}
                  value={platformUrls[platform]}
                  onChange={(e) => handleUrlChange(platform, e.target.value)}
                  disabled={isDisabled}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-[#00FF66]/40 transition-colors disabled:opacity-40"
                />
              </div>
            );
          })}
        </div>
      )}

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

      {/* Submit */}
      <button
        type="submit"
        disabled={isDisabled || selectedPlatforms.length === 0 || !allSelectedUrlsFilled}
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
