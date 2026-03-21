'use client';

import Link from 'next/link';
import { CheckCircle, X } from 'lucide-react';
import { motion } from 'framer-motion';
import SectionBadge from '@/components/ui/SectionBadge';
import GradientHeading from '@/components/ui/GradientHeading';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import MembershipNFTPreview from '@/components/MembershipNFTPreview';
import { GlowingEffect } from '@/components/ui/glowing-effect';

const plans = [
  {
    name: 'Creator',
    tier: 'creator' as const,
    price: '₹999',
    period: '/month',
    description: 'For serious builders who want deeper access, mentorship, and member-only events.',
    cta: 'Get Creator Access',
    ctaHref: '/payment?plan=creator',
    highlighted: true,
    badge: 'Most Popular',
    features: [
      { text: 'Community Discord access', included: true },
      { text: 'Attend public events', included: true },
      { text: 'Daily quests', included: true },
      { text: 'Public leaderboard', included: true },
      { text: 'Private builder channels', included: true },
      { text: 'Mentorship access', included: true },
      { text: 'Workshop recordings', included: true },
      { text: 'NFT membership card', included: true },
      { text: 'Merch reward eligibility', included: false },
    ],
  },
  {
    name: 'Legend',
    tier: 'legend' as const,
    price: '₹2,499',
    period: '/month',
    description: 'Full access to everything AgentsClan has to offer. For those who build seriously.',
    cta: 'Become a Legend',
    ctaHref: '/payment?plan=legend',
    highlighted: false,
    features: [
      { text: 'Community Discord access', included: true },
      { text: 'Attend public events', included: true },
      { text: 'Daily quests', included: true },
      { text: 'Public leaderboard', included: true },
      { text: 'Private builder channels', included: true },
      { text: 'Mentorship access', included: true },
      { text: 'Workshop recordings', included: true },
      { text: 'NFT membership card', included: true },
      { text: 'Merch reward eligibility', included: true },
    ],
  },
];

const globalBenefits = [
  'Cancel any plan at any time — no lock-in',
  'NFT membership is yours to keep, even if you cancel',
  'Upgrade or downgrade your plan whenever you want',
  'All plans include access to the builder community',
  'Annual billing available at 20% off',
];

const faqs = [
  { q: 'What blockchain is the NFT membership on?', a: 'All NFT memberships are minted on Polygon for low gas fees and fast transactions. Your on-chain identity is fully portable.' },
  { q: 'Can I upgrade my plan later?', a: 'Yes. You can upgrade or downgrade your plan at any time. Upgrades take effect immediately. Downgrades apply at the next billing cycle.' },
  { q: 'Is there a student discount?', a: 'Yes! Students with a valid institutional email can get 40% off the Creator plan. Reach out via Discord or book a call.' },
  { q: 'What payment methods are accepted?', a: 'We accept UPI, credit/debit cards, and popular wallets. Crypto payments (USDC/USDT) are available for Legend plan.' },
];

export default function MembershipContent() {
  return (
    <main className="bg-black min-h-screen">
      {/* Hero */}
      <section className="px-6 md:px-[120px] pt-[140px] md:pt-[160px] pb-16 md:pb-20 flex flex-col items-center text-center gap-5">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
          <SectionBadge text="Membership" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}>
          <GradientHeading className="text-[40px] md:text-[56px] max-w-[580px]">Choose Your Membership</GradientHeading>
        </motion.div>
        <motion.p className="text-white/75 text-[17px] leading-relaxed max-w-[540px]" initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.22 }}>
          Pick the plan that matches your builder journey.
        </motion.p>
        <motion.div className="flex flex-col md:flex-row items-center gap-6 md:gap-12 mt-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.32 }}>
          {['No lock-in contracts', 'NFT-backed identity', 'Cancel anytime'].map((text) => (
            <div key={text} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00FF66]/80" />
              <span className="text-white/50 text-xs md:text-sm font-medium">{text}</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Plans */}
      <section className="px-6 md:px-[120px] pb-16 md:pb-24 border-t border-white/10 pt-12 md:pt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-start max-w-[800px] mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 55 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className={`relative rounded-2xl p-6 md:p-8 flex flex-col gap-6 border transition-colors ${plan.highlighted ? 'bg-white/8 border-white/25 shadow-[0_0_40px_rgba(255,255,255,0.04)]' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
            >
              <GlowingEffect spread={40} glow proximity={80} inactiveZone={0.02} borderWidth={2} />
              {'badge' in plan && plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00FF66]">
                  <span className="text-black text-xs font-semibold">{plan.badge}</span>
                </div>
              )}

              {/* NFT Mint Preview — top of card */}
              <MembershipNFTPreview tier={plan.tier} />

              <div className="flex flex-col gap-2">
                <span className="text-white/60 text-xs font-semibold uppercase tracking-widest">{plan.name}</span>
                <div className="flex items-end gap-1">
                  <span className="text-[42px] font-semibold text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(144.5deg, #FFFFFF 28%, rgba(255, 255, 255, 0) 115%)' }}>
                    {plan.price}
                  </span>
                  {plan.period && <span className="text-white/40 text-sm pb-2">{plan.period}</span>}
                </div>
                <p className="text-white/65 text-[15px] leading-relaxed">{plan.description}</p>
              </div>
              <ul className="flex flex-col gap-3 py-6 border-y border-white/10">
                {plan.features.map((feat) => (
                  <li key={feat.text} className="flex items-center gap-3">
                    {feat.included ? <CheckCircle size={14} className="text-[#00FF66] shrink-0" /> : <X size={14} className="text-white/20 shrink-0" />}
                    <span className={`text-[15px] ${feat.included ? 'text-white/70' : 'text-white/25'}`}>{feat.text}</span>
                  </li>
                ))}
              </ul>
              {plan.highlighted ? (
                <Link href={plan.ctaHref} className="group relative w-full block">
                  <div className="absolute inset-0 rounded-full border border-[0.6px] border-white/60" />
                  <div className="relative bg-white rounded-full px-[29px] py-[11px] overflow-hidden transition-transform active:scale-95 text-center">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-white blur-[2px] opacity-50" />
                    <span className="text-black text-sm font-medium relative z-10">{plan.cta}</span>
                  </div>
                </Link>
              ) : (
                <Link href={plan.ctaHref} className="group relative w-full block">
                  <div className="absolute inset-0 rounded-full border border-[0.6px] border-white/40" />
                  <div className="relative bg-transparent hover:bg-white/10 transition-colors rounded-full px-[29px] py-[11px] overflow-hidden active:scale-95 text-center">
                    <span className="text-white text-sm font-medium relative z-10">{plan.cta}</span>
                  </div>
                </Link>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Global Benefits */}
      <section className="px-6 md:px-[120px] pb-16 md:pb-20 border-t border-white/10 pt-12 md:pt-16">
        <motion.div className="flex flex-col md:flex-row items-start gap-12" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.5 }}>
          <div className="flex flex-col gap-3 md:max-w-[280px]">
            <SectionBadge text="Always Included" />
            <h2 className="text-white text-xl font-semibold leading-snug">Applies to every plan</h2>
          </div>
          <ul className="flex flex-col gap-4 flex-1">
            {globalBenefits.map((benefit, i) => (
              <motion.li
                key={benefit}
                initial={{ opacity: 0, x: -25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="flex items-center gap-3"
              >
                <CheckCircle size={15} className="text-[#00FF66] shrink-0" />
                <span className="text-white/70 text-sm">{benefit}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </section>

      {/* FAQ */}
      <section className="px-6 md:px-[120px] pb-16 md:pb-24 border-t border-white/10 pt-12 md:pt-16">
        <motion.div className="flex flex-col items-center gap-4 text-center mb-12" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.5 }}>
          <SectionBadge text="FAQ" />
          <GradientHeading className="text-[28px] md:text-[40px]">Frequently Asked Questions</GradientHeading>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
          {faqs.map((faq, i) => (
            <motion.div
              key={faq.q}
              initial={{ opacity: 0, y: 45 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.09 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="relative bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-3 hover:border-white/20 transition-colors cursor-default"
            >
              <GlowingEffect spread={40} glow proximity={80} inactiveZone={0.02} borderWidth={2} />
              <h3 className="text-white text-[17px] font-semibold leading-snug">{faq.q}</h3>
              <p className="text-white/65 text-[15px] leading-relaxed">{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-6 md:px-[120px] pb-16 md:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl border border-white/10 bg-white/5 overflow-hidden px-8 md:px-16 py-12 md:py-16 flex flex-col items-center text-center gap-6"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <h2 className="text-white text-2xl md:text-3xl font-semibold max-w-[460px] leading-snug">Still not sure? Let&apos;s talk it through.</h2>
          <p className="text-white/65 text-[15px] max-w-[380px] leading-relaxed">Book a free 30-minute call with the team and we&apos;ll help you figure out the best plan for where you are in your journey.</p>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <PrimaryButton href="/book-a-call">Book a Free Call</PrimaryButton>
            <SecondaryButton href="/services">See All Services</SecondaryButton>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
