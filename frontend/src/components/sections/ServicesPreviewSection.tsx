'use client';

import Reveal from '@/components/ui/Reveal';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import { CheckCircle } from 'lucide-react';
import { GlowingEffect } from '@/components/ui/glowing-effect';

const highlights = [
  'Access to exclusive events and workshops',
  'NFT-backed on-chain membership identity',
  'Quests, leaderboard, and merch rewards',
  'Private builder channels and mentorship',
  'Weekly tech deep dives and AMAs',
  'Grant programs and funding connections',
];

const ServicesPreviewSection = () => {
  return (
    <section className="bg-[#0b1a13] py-20 md:py-32 border-t border-[#00ff88]/[0.08] relative">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 flex flex-col items-center text-center">
        
        <Reveal>
          <h2 className="text-[40px] md:text-[56px] lg:text-[64px] font-bold tracking-tight text-[#e6fff5] max-w-[800px] leading-[1.05] mb-6">
            Everything We Offer to Help You Grow
          </h2>
        </Reveal>
        
        <Reveal delay={0.1}>
          <p className="text-[#e6fff5]/60 text-[18px] md:text-[20px] max-w-[600px] leading-relaxed mb-16">
            From mentorship and community access to hands-on workshops and custom development sprints — AgentsClan is your launchpad.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 w-full text-left mb-16">
          {highlights.map((item, i) => (
            <Reveal key={item} delay={i * 0.1}>
              <div className="relative flex items-start gap-4 bg-[#00ff88]/[0.04] border border-[#00ff88]/10 rounded-2xl p-6 hover:border-[#00ff88]/25 hover:bg-[#00ff88]/[0.07] transition-all duration-300 hover:scale-[1.02] shadow-[0_0_0_rgba(0,255,136,0)] hover:shadow-[0_4px_24px_rgba(0,255,136,0.06)]">
                <GlowingEffect spread={40} glow proximity={80} inactiveZone={0.02} borderWidth={2} />
                <CheckCircle size={24} className="text-[#00ff88] shrink-0 mt-0.5" />
                <span className="text-[#e6fff5]/70 text-[16px] md:text-[18px] font-medium leading-relaxed">{item}</span>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.4}>
          <div className="flex flex-col md:flex-row items-center gap-6 justify-center">
            <PrimaryButton href="/services">Explore Services</PrimaryButton>
            <SecondaryButton href="/book-a-call">Book a Call</SecondaryButton>
          </div>
        </Reveal>

      </div>
    </section>
  );
};

export default ServicesPreviewSection;
