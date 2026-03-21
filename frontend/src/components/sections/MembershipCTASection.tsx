'use client';

import Reveal from '@/components/ui/Reveal';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';

const MembershipCTASection = () => {
  return (
    <section className="bg-[#0b1a13] py-24 md:py-36 border-t border-[#00ff88]/[0.08] relative overflow-hidden bg-grid-pattern">
      
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-[800px] bg-[#00FF66]/[0.08] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1000px] mx-auto px-6 md:px-12 flex flex-col items-center text-center relative z-10">
        
        <Reveal>
          <h2 className="text-[clamp(2.5rem,6vw,5.5rem)] font-bold tracking-tight text-[#e6fff5] leading-[1.05] mb-8">
            Find Us At
          </h2>
        </Reveal>
        
        <Reveal delay={0.1}>
          <p className="text-[#e6fff5]/60 text-[18px] md:text-[22px] max-w-[620px] leading-relaxed mb-14">
            Join the AgentsClan and get access to exclusive events, the builder network, quests, merch, and your on-chain community identity.
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="flex flex-col md:flex-row items-center gap-6 justify-center w-full">
            <div className="relative group w-full md:w-auto">
              {/* Primary CTA Glow */}
              <div className="absolute inset-0 bg-[#00FF66]/40 blur-xl rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <div className="relative transition-transform duration-300 group-hover:scale-[1.02]">
                <PrimaryButton href="/membership">View Membership Plans</PrimaryButton>
              </div>
            </div>
            
            <div className="w-full md:w-auto transition-transform duration-300 hover:scale-[1.02]">
              <SecondaryButton href="/book-a-call">Talk to the Team</SecondaryButton>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.35}>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 mt-16 pt-12 border-t border-[#00ff88]/10 w-full max-w-[800px]">
            {['No lock-in contracts', 'NFT-backed identity', 'Cancel anytime'].map((text, i) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#00ff88] shadow-[0_0_8px_rgba(0,255,136,0.6)]" />
                <span className="text-[#e6fff5]/50 text-[14px] md:text-[15px] font-medium tracking-wide uppercase">{text}</span>
              </div>
            ))}
          </div>
        </Reveal>

      </div>
    </section>
  );
};

export default MembershipCTASection;
