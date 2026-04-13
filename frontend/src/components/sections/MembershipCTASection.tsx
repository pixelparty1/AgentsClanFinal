'use client';

import Reveal from '@/components/ui/Reveal';
import SecondaryButton from '@/components/ui/SecondaryButton';

import { MessageSquare, Ticket, Target, Trophy, Lock, Users, Video, IdCard, Gift, Crown } from 'lucide-react';

const benefits = [
  { text: 'Community Discord access', icon: MessageSquare, description: 'Join the builder conversation' },
  { text: 'Attend public events', icon: Ticket, description: 'Access to top technical meetups' },
  { text: 'Daily quests', icon: Target, description: 'Earn rewards by contributing' },
  { text: 'Public leaderboard', icon: Trophy, description: 'Rank among top Web3 builders' },
  { text: 'Private builder channels', icon: Lock, description: 'Exclusive networking groups' },
  { text: 'Mentorship access', icon: Users, description: 'Learn from industry experts' },
  { text: 'Workshop recordings', icon: Video, description: 'Unlimited access to past sessions' },
  { text: 'NFT membership card', icon: IdCard, description: 'On-chain proof of identity' },
  { text: 'Merch reward eligibility', icon: Gift, description: 'Exclusive AgentsClan swag' },
];

const MembershipCTASection = () => {
  return (
    <section className="bg-[#0b1a13] py-20 md:py-32 border-t border-[#00ff88]/[0.08] relative overflow-hidden bg-grid-pattern">
      
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-[800px] bg-[#00ff88]/[0.05] rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-[700px] mx-auto px-6 relative z-10 flex flex-col items-center">
        <Reveal className="w-full">
          {/* Main Card Container */}
          <div className="relative w-full rounded-[32px] border border-[#00ff88]/20 bg-gradient-to-b from-[#0b1a13] to-[#040a07] shadow-[0_0_40px_rgba(0,255,136,0.06)] p-4 md:p-8 pt-16 md:pt-20 mt-16 transition-transform hover:shadow-[0_0_60px_rgba(0,255,136,0.1)] duration-500">
            
            {/* Top decorative element mimicking the 3d gift/badge */}
            <div className="absolute -top-12 md:-top-16 left-1/2 -translate-x-1/2 w-24 h-24 md:w-32 md:h-32 bg-gradient-to-b from-[#0b1a13] to-[#0a140f] rounded-full flex items-center justify-center border-2 border-[#00ff88]/30 shadow-[0_0_30px_rgba(0,255,136,0.3)] backdrop-blur-md">
              <div className="absolute inset-0 rounded-full bg-[#00ff88]/5 animate-pulse" />
              <Crown className="w-10 h-10 md:w-14 md:h-14 text-[#00ff88] drop-shadow-[0_0_15px_rgba(0,255,136,0.8)]" />
            </div>

            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-[#e6fff5] to-[#00ff88] tracking-tight mb-3 flex items-center justify-center gap-2">
                AgentsClan VIP
              </h2>
              <p className="text-[#00ff88]/90 text-sm md:text-base font-medium">
                You are not an exclusive member yet. <br className="md:hidden" /> Join & Enjoy the benefits!
              </p>
            </div>

            {/* Inner Dark Container for Benefits */}
            <div className="bg-[#020503]/80 rounded-[20px] border border-[#00ff88]/10 p-3 md:p-6 flex flex-col gap-2 md:gap-3">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-4 bg-white/[0.02] hover:bg-[#00ff88]/[0.08] transition-colors border border-white/[0.02] hover:border-[#00ff88]/30 rounded-xl p-3 md:p-4 group">
                  <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-black/60 rounded-full flex items-center justify-center text-xl shadow-inner border border-white/5 group-hover:scale-110 group-hover:border-[#00ff88]/50 group-hover:shadow-[0_0_15px_rgba(0,255,136,0.2)] transition-all duration-300">
                    <benefit.icon className="w-5 h-5 md:w-6 md:h-6 text-[#00ff88]" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[#e6fff5] font-semibold text-[14px] md:text-[16px] tracking-wide">{benefit.text}</span>
                    <span className="text-[#00ff88]/60 text-[11px] md:text-[13px] font-medium">{benefit.description}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom CTA */}
            <div className="mt-8 flex justify-center w-full relative z-20">
              <div className="w-full relative group">
                <div className="absolute inset-0 bg-[#D8FF3F]/30 blur-[20px] rounded-full opacity-60 group-hover:opacity-100 group-hover:bg-[#00ff88]/40 transition-all duration-300 pointer-events-none" />
                <button className="w-full relative py-4 md:py-5 rounded-2xl bg-gradient-to-r from-[#00ff88] to-[#D8FF3F] text-black font-extrabold text-lg md:text-xl shadow-[0_0_20px_rgba(216,255,63,0.3)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(0,255,136,0.6)]">
                  Unlock Membership
                </button>
              </div>
            </div>

          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-12 transition-transform duration-300 hover:scale-[1.02]">
            <SecondaryButton href="/book-a-call">Talk to the Team</SecondaryButton>
          </div>
        </Reveal>

        <Reveal delay={0.3}>
           <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 mt-12 pt-8 border-t border-[#00ff88]/10 w-full opacity-70 hover:opacity-100 transition-opacity duration-300">
            {['No lock-in contracts', 'NFT-backed identity', 'Cancel anytime'].map((text) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#D8FF3F] shadow-[0_0_8px_rgba(216,255,63,0.6)]" />
                <span className="text-[#e6fff5]/70 text-[13px] md:text-[14px] font-medium tracking-wide uppercase">{text}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default MembershipCTASection;
