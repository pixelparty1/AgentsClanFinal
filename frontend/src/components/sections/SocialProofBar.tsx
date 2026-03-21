'use client';

import Reveal from '@/components/ui/Reveal';

const stats = [
  '2000+ Community Builders',
  '50+ Events & Collaborations',
  'NFT Membership Access',
];

const SocialProofBar = () => {
  return (
    <section className="bg-[#0b1a13] py-8 md:py-12 border-b border-[#00ff88]/[0.08] relative z-20">
      <Reveal>
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-16 lg:gap-24">
          {stats.map((text, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#00ff88] shadow-[0_0_8px_rgba(0,255,136,0.6)]" />
              <span className="text-[#e6fff5]/80 text-[16px] md:text-[18px] font-medium tracking-wide">
                {text}
              </span>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
};

export default SocialProofBar;
