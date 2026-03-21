'use client';

import { useState } from 'react';

const timeSlots = [
  '9:00 AM – 9:30 AM IST',
  '10:00 AM – 10:30 AM IST',
  '11:00 AM – 11:30 AM IST',
  '2:00 PM – 2:30 PM IST',
  '3:00 PM – 3:30 PM IST',
  '5:00 PM – 5:30 PM IST',
];

const topics = [
  'Membership enquiry',
  'Community partnership',
  'Event collaboration',
  'Sponsorship',
  'General question',
];

export default function BookCallForm() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    topic: '',
    slot: '',
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 flex flex-col items-center text-center gap-5">
        <div className="w-14 h-14 rounded-full bg-[#00FF66]/10 border border-[#00FF66]/30 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-[#00FF66] shadow-[0_0_8px_#00FF66]" />
        </div>
        <h3 className="text-white text-xl font-semibold">You&apos;re booked in!</h3>
        <p className="text-white/50 text-sm leading-relaxed max-w-[380px]">
          Thanks, <span className="text-white">{form.name}</span>. We&apos;ve received your request and will confirm your slot at <span className="text-white">{form.email}</span> within 24 hours.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="text-white/40 text-xs hover:text-white/70 transition-colors mt-2"
        >
          Submit another request
        </button>
      </div>
    );
  }

  const inputClass =
    'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors';

  return (
    <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col gap-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-white/60 text-xs font-medium uppercase tracking-wider">
            Full Name <span className="text-[#00FF66]">*</span>
          </label>
          <input
            required
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Arjun Mehta"
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-white/60 text-xs font-medium uppercase tracking-wider">
            Email <span className="text-[#00FF66]">*</span>
          </label>
          <input
            required
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="arjun@example.com"
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-white/60 text-xs font-medium uppercase tracking-wider">Company / Project</label>
        <input
          name="company"
          value={form.company}
          onChange={handleChange}
          placeholder="Your company or project name (optional)"
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-white/60 text-xs font-medium uppercase tracking-wider">
            Topic <span className="text-[#00FF66]">*</span>
          </label>
          <select
            required
            name="topic"
            value={form.topic}
            onChange={handleChange}
            className={`${inputClass} cursor-pointer`}
          >
            <option value="" disabled className="bg-black">Select a topic</option>
            {topics.map((t) => (
              <option key={t} value={t} className="bg-black">{t}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-white/60 text-xs font-medium uppercase tracking-wider">
            Preferred Slot <span className="text-[#00FF66]">*</span>
          </label>
          <select
            required
            name="slot"
            value={form.slot}
            onChange={handleChange}
            className={`${inputClass} cursor-pointer`}
          >
            <option value="" disabled className="bg-black">Select a time slot</option>
            {timeSlots.map((s) => (
              <option key={s} value={s} className="bg-black">{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-white/60 text-xs font-medium uppercase tracking-wider">Message</label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          rows={4}
          placeholder="Briefly tell us what you'd like to discuss..."
          className={`${inputClass} resize-none`}
        />
      </div>

      <button
        type="submit"
        className="group relative w-full mt-1"
      >
        <div className="absolute inset-0 rounded-full border border-[0.6px] border-white/60" />
        <div className="relative bg-white rounded-full px-[29px] py-[13px] overflow-hidden transition-transform active:scale-95">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-white blur-[2px] opacity-50" />
          <span className="text-black text-sm font-medium relative z-10">Book My Call</span>
        </div>
      </button>

      <p className="text-white/30 text-xs text-center">
        We&apos;ll confirm your slot by email within 24 hours. All calls are free.
      </p>
    </form>
  );
}
