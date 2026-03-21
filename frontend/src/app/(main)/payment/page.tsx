'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, ArrowLeft, Lock, CreditCard, Smartphone } from 'lucide-react';
import SectionBadge from '@/components/ui/SectionBadge';
import GradientHeading from '@/components/ui/GradientHeading';

const planDetails: Record<string, { name: string; price: string; period: string; description: string; features: string[] }> = {
  creator: {
    name: 'Creator',
    price: '₹999',
    period: '/month',
    description: 'Private channels, mentorship, workshop recordings, and NFT membership card.',
    features: [
      'Community Discord access',
      'Private builder channels',
      'Mentorship access',
      'Workshop recordings',
      'NFT membership card',
      'Daily quests & leaderboard',
    ],
  },
  legend: {
    name: 'Legend',
    price: '₹2,499',
    period: '/month',
    description: 'Full access to everything AgentsClan has to offer — for serious builders only.',
    features: [
      'Everything in Creator',
      'Merch reward eligibility',
      'Priority event access',
      'NFT membership card',
      'Dedicated builder sprint access',
      'Direct team access via Discord',
    ],
  },
};

function PaymentForm() {
  const searchParams = useSearchParams();
  const planKey = (searchParams.get('plan') ?? 'creator').toLowerCase();
  const plan = planDetails[planKey] ?? planDetails['creator'];

  const [method, setMethod] = useState<'card' | 'upi'>('card');
  const [form, setForm] = useState({ name: '', email: '', card: '', expiry: '', cvv: '', upi: '' });
  const [success, setSuccess] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccess(true);
  }

  if (success) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <div className="flex flex-col items-center gap-6 text-center max-w-[440px]">
          <div className="w-16 h-16 rounded-full bg-[#00FF66]/15 border border-[#00FF66]/30 flex items-center justify-center">
            <CheckCircle size={32} className="text-[#00FF66]" />
          </div>
          <GradientHeading as="h2" className="text-[32px] md:text-[42px]">
            You&apos;re in.
          </GradientHeading>
          <p className="text-white/70 text-[16px] leading-relaxed">
            Welcome to the {plan.name} plan. Your NFT membership is being minted — check your email for next steps.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <Link
              href="/community"
              className="inline-flex items-center justify-center gap-2 bg-white text-black text-sm font-medium rounded-full px-6 py-3 hover:bg-white/90 transition-colors"
            >
              Go to Community
            </Link>
            <Link
              href="/rewards"
              className="inline-flex items-center justify-center gap-2 border border-white/30 text-white text-sm font-medium rounded-full px-6 py-3 hover:bg-white/8 transition-colors"
            >
              Explore Rewards
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-black min-h-screen">
      {/* Header */}
      <section className="px-6 md:px-[120px] pt-[140px] md:pt-[160px] pb-12 md:pb-16">
        <div className="flex flex-col items-start gap-5 max-w-[540px]">
          <Link
            href="/membership"
            className="inline-flex items-center gap-2 text-white/50 text-sm hover:text-white/80 transition-colors"
          >
            <ArrowLeft size={14} />
            Back to plans
          </Link>
          <SectionBadge text="Payment" />
          <GradientHeading className="text-[38px] md:text-[52px]">
            Get {plan.name} Access
          </GradientHeading>
          <p className="text-white/75 text-[17px] leading-relaxed">
            {plan.description}
          </p>
        </div>
      </section>

      {/* Main */}
      <section className="px-6 md:px-[120px] pb-20 border-t border-white/10 pt-12 md:pt-16">
        <div className="flex flex-col lg:flex-row gap-10 md:gap-16 items-start">

          {/* Left: Order Summary */}
          <div className="w-full lg:max-w-[360px] flex flex-col gap-5">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-5">
              {/* Plan name + price */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-white/50 text-xs font-semibold uppercase tracking-widest">Plan</span>
                  <span className="text-white text-lg font-semibold">{plan.name}</span>
                </div>
                <div className="flex flex-col items-end gap-0.5">
                  <span className="text-white text-2xl font-semibold">{plan.price}</span>
                  <span className="text-white/40 text-xs">{plan.period}</span>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-white/10" />

              {/* Features */}
              <ul className="flex flex-col gap-2.5">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-center gap-3">
                    <CheckCircle size={13} className="text-[#00FF66] shrink-0" />
                    <span className="text-white/70 text-sm">{feat}</span>
                  </li>
                ))}
              </ul>

              {/* Divider */}
              <div className="border-t border-white/10" />

              {/* Total */}
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-sm">Total due today</span>
                <span className="text-white text-base font-semibold">{plan.price}</span>
              </div>
            </div>

            {/* Trust badge */}
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
              <Lock size={13} className="text-[#00FF66] shrink-0" />
              <span className="text-white/55 text-xs leading-snug">
                Secure payment. Cancel anytime. NFT is yours to keep.
              </span>
            </div>
          </div>

          {/* Right: Payment Form */}
          <div className="flex-1 max-w-[540px]">
            {/* Method toggle */}
            <div className="flex gap-3 mb-6">
              <button
                type="button"
                onClick={() => setMethod('card')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium border transition-colors ${
                  method === 'card'
                    ? 'bg-white text-black border-white'
                    : 'bg-transparent text-white/60 border-white/20 hover:border-white/40'
                }`}
              >
                <CreditCard size={14} />
                Card
              </button>
              <button
                type="button"
                onClick={() => setMethod('upi')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium border transition-colors ${
                  method === 'upi'
                    ? 'bg-white text-black border-white'
                    : 'bg-transparent text-white/60 border-white/20 hover:border-white/40'
                }`}
              >
                <Smartphone size={14} />
                UPI
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Name + Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-white/50 text-xs font-medium uppercase tracking-wider">Full Name</label>
                  <input
                    name="name"
                    type="text"
                    placeholder="Arjun Sharma"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-white/40 transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-white/50 text-xs font-medium uppercase tracking-wider">Email</label>
                  <input
                    name="email"
                    type="email"
                    placeholder="arjun@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-white/40 transition-colors"
                  />
                </div>
              </div>

              {/* Card fields */}
              {method === 'card' && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-white/50 text-xs font-medium uppercase tracking-wider">Card Number</label>
                    <input
                      name="card"
                      type="text"
                      placeholder="4242 4242 4242 4242"
                      maxLength={19}
                      value={form.card}
                      onChange={handleChange}
                      required
                      className="bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-white/40 transition-colors"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-white/50 text-xs font-medium uppercase tracking-wider">Expiry</label>
                      <input
                        name="expiry"
                        type="text"
                        placeholder="MM / YY"
                        maxLength={7}
                        value={form.expiry}
                        onChange={handleChange}
                        required
                        className="bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-white/40 transition-colors"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-white/50 text-xs font-medium uppercase tracking-wider">CVV</label>
                      <input
                        name="cvv"
                        type="text"
                        placeholder="•••"
                        maxLength={4}
                        value={form.cvv}
                        onChange={handleChange}
                        required
                        className="bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-white/40 transition-colors"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* UPI field */}
              {method === 'upi' && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-white/50 text-xs font-medium uppercase tracking-wider">UPI ID</label>
                  <input
                    name="upi"
                    type="text"
                    placeholder="yourname@upi"
                    value={form.upi}
                    onChange={handleChange}
                    required
                    className="bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-white/40 transition-colors"
                  />
                  <p className="text-white/35 text-xs mt-1">
                    You&apos;ll receive a payment request on your UPI app.
                  </p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="group relative w-full mt-2"
              >
                <div className="absolute inset-0 rounded-full border border-[0.6px] border-white/60" />
                <div className="relative bg-white rounded-full px-[29px] py-[13px] overflow-hidden transition-transform active:scale-95 text-center">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-white blur-[2px] opacity-50" />
                  <span className="text-black text-sm font-semibold relative z-10">
                    Pay {plan.price} — Get {plan.name} Access
                  </span>
                </div>
              </button>

              <p className="text-white/30 text-xs text-center leading-relaxed">
                By continuing, you agree to AgentsClan&apos;s Terms of Service.
                You can cancel your subscription at any time.
              </p>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <PaymentForm />
    </Suspense>
  );
}
