'use client';

import { Zap, Users, Trophy, Globe } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import { GlowingEffect } from '@/components/ui/glowing-effect';

const features = [
  {
    icon: Users,
    title: 'Builder Network',
    description:
      'Connect with 2,000+ developers, designers, and founders building the future. Get peer support, collaborate on projects, and grow together.',
  },
  {
    icon: Zap,
    title: 'Exclusive Events',
    description:
      'Access hackathons, workshops, AMAs, and networking events curated for serious builders. Online and in-person across global hubs.',
  },
  {
    icon: Trophy,
    title: 'Quests & Rewards',
    description:
      'Complete daily quests, climb the leaderboard, and redeem rewards including limited-edition merch, credits, and community perks.',
  },
  {
    icon: Globe,
    title: 'Web3 Identity',
    description:
      'Your membership is powered by on-chain identity. Own your community access, prove your contributions, and unlock premium tiers.',
  },
];

const FeaturesSection = () => {
  return (
    <section className="bg-[#0b1a13] relative" id="features">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-20 md:py-32 flex flex-col lg:flex-row items-start gap-16 lg:gap-24 relative">
        
        {/* Sticky Left: Story Headline */}
        <div className="lg:w-1/2 lg:sticky lg:top-32 flex flex-col gap-6">
          <Reveal>
            <h2 className="text-[40px] md:text-[56px] lg:text-[72px] font-bold leading-[1.05] tracking-tight text-[#e6fff5]">
              Built for the <br className="hidden md:block"/> <span className="text-[#D8FF3F] lime-text-glow">Builders</span> Who Ship
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-[#e6fff5]/60 text-[18px] md:text-[20px] max-w-[480px] leading-relaxed">
              Everything you need to grow, collaborate, and be rewarded — all inside one premium community.
            </p>
          </Reveal>
        </div>

        {/* Scrolling Right: Feature Blocks */}
        <div className="lg:w-1/2 flex flex-col gap-8 md:gap-12 w-full pt-4 lg:pt-32 pb-4 lg:pb-32">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <Reveal key={feature.title} delay={0.1}>
                <div className="relative bg-[#00ff88]/[0.04] border border-[#00ff88]/10 rounded-3xl p-8 md:p-10 flex flex-col gap-6 hover:border-[#00ff88]/25 hover:bg-[#00ff88]/[0.07] transition-all duration-300 hover:scale-[1.01] shadow-[0_0_0_rgba(0,255,136,0)] hover:shadow-[0_8px_32px_rgba(0,255,136,0.06)]">
                  <GlowingEffect spread={40} glow proximity={80} inactiveZone={0.02} borderWidth={2} />
                  <div className="w-14 h-14 rounded-2xl bg-[#D8FF3F]/10 flex items-center justify-center">
                    <Icon size={26} className="text-[#D8FF3F]" />
                  </div>
                  <div className="flex flex-col gap-3">
                    <h3 className="text-[#e6fff5] text-[24px] md:text-[28px] font-semibold tracking-tight">{feature.title}</h3>
                    <p className="text-[#e6fff5]/50 text-[16px] md:text-[18px] leading-[1.7]">{feature.description}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
