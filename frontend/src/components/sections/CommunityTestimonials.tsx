'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { GlowingEffect } from '@/components/ui/glowing-effect';

const testimonials = [
  {
    id: 'Augustin_2618',
    name: 'Augustin Jerald',
    handle: '@Augustin_2618',
    avatar: 'https://pbs.twimg.com/profile_images/1794722133106364417/p__HFxiR_400x400.png',
    text: 'My key takeaways from this Dotconnect event is Had a great time at the #Polkadot Agents Club meetup in BLR! 🚀 Substrate 101 🔧 Builder pitches 🎤 Ecosystem updates 🌐 Community vibes & swag',
  },
  {
    id: 'rayan9064',
    name: 'MOHAMMED RAYAN A',
    handle: '@rayan9064',
    avatar: 'https://pbs.twimg.com/profile_images/1819657223909658629/MNOLCtWb_400x400.jpg',
    text: "Attended the polkadot event at Ornesta, Koramangala. @Vinithn10 explained about the dot ecosystem and I pitched an idea of IDE, hope to build soon! We'll soon have an MVP ready if the idea is selected and backed by polkadot!",
  },
  {
    id: 'Shreeyaps',
    name: 'Shreeya',
    handle: '@Shreeyaps',
    avatar: 'https://pbs.twimg.com/profile_images/1938305778030702592/i3NPHWzI_400x400.jpg',
    text: 'Networking made right by @AgentsClan2 @stellar_ind @Vinithn10 @neelesh_00 Web3 feels oddly gettable now 😎',
  },
  {
    id: 'ManojNandi_0110',
    name: 'Manoj_Nandi',
    handle: '@ManojNandi_0110',
    avatar: 'https://pbs.twimg.com/profile_images/1961798513710530560/XgJN3ygv_400x400.jpg',
    text: 'Had an absolute blast at the Game Night hosted by @avax and @AgentsClan2! 🎮🔥 From epic plays to non-stop hype, the energy was unreal. Big shoutout to @Vinithn10 for hosting like a pro!',
  },
  {
    id: 'NeeleshW3',
    name: 'Neelesh Balasubramani',
    handle: '@NeeleshW3',
    avatar: 'https://pbs.twimg.com/profile_images/1916510875504050176/g9qe4_PY_400x400.jpg',
    text: 'I played the @AvaxTeam1 game @BloodLoopGAME it was really cool, even though I kept dying 😭. The event hosted by @AgentsClan2 was an amazing experience #avalanche #Agentclans',
  },
  {
    id: '0xaitch',
    name: 'aitch',
    handle: '@0xaitch',
    avatar: 'https://pbs.twimg.com/profile_images/1954588657526226944/g9RzoXHf_400x400.jpg',
    text: 'from sharing my web3 hustle to how anyone can jump in and start building, it was fun interacting with future buildoors at @Polkadot meetup by @AgentsClan2 big shoutout to @Vinithn10 for making it happen',
  },
];

const row1 = testimonials.slice(0, 3);
const row2 = testimonials.slice(3, 6);

const TwitterIcon = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

interface TestimonialCardProps {
  t: (typeof testimonials)[number];
}

function TestimonialCard({ t }: TestimonialCardProps) {
  return (
    <div className="w-[340px] md:w-[400px] flex-shrink-0 testimonial-card-float group">
      <div className="relative h-full rounded-2xl border border-[#00ff88]/[0.1] bg-[#00ff88]/[0.03] backdrop-blur-xl p-6 transition-all duration-300 ease-out hover:scale-[1.03] hover:border-[#00ff88]/30 hover:shadow-[0_0_30px_rgba(0,255,136,0.08)] hover:bg-[#00ff88]/[0.06]">
        <GlowingEffect spread={40} glow proximity={80} inactiveZone={0.02} borderWidth={2} />
        {/* Green glow on hover */}
        <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-b from-[#00ff88]/0 via-[#00ff88]/0 to-[#00ff88]/0 group-hover:from-[#00ff88]/[0.08] group-hover:via-transparent group-hover:to-[#00ff88]/[0.04] transition-all duration-500 pointer-events-none" />

        <div className="relative z-10 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="relative h-11 w-11 rounded-full overflow-hidden ring-2 ring-[#00ff88]/10 group-hover:ring-[#00ff88]/30 transition-all duration-300 flex-shrink-0">
                <Image alt={t.name} fill className="object-cover" src={t.avatar} unoptimized />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#e6fff5] leading-tight">{t.name}</p>
                <p className="text-xs text-[#e6fff5]/40 mt-0.5">{t.handle}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-[#e6fff5]/30 hover:text-[#1DA1F2] transition-colors duration-200 cursor-pointer">
                <TwitterIcon />
              </span>
              <span className="text-[#e6fff5]/30 hover:text-[#0A66C2] transition-colors duration-200 cursor-pointer">
                <LinkedInIcon />
              </span>
            </div>
          </div>

          {/* Tweet content */}
          <p className="text-sm text-[#e6fff5]/60 leading-relaxed flex-grow mb-4">{t.text}</p>

          {/* Bottom accent */}
          <div className="mt-auto pt-4 border-t border-[#00ff88]/[0.08]">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00ff88]/60" />
              <span className="text-xs text-[#e6fff5]/30">Agents Clan Member</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CommunityTestimonials() {
  return (
    <section className="relative w-full bg-gradient-to-b from-[#0b1a13] via-[#071a0f] to-[#0b1a13] py-24 md:py-32 overflow-hidden">

      {/* Particle / glow background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#00FF66]/[0.04] rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-[#00FF66]/[0.03] rounded-full blur-[120px]" />
        <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-emerald-500/[0.04] rounded-full blur-[100px]" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[#00FF66]/30 rounded-full testimonial-particle"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 1.5}s`,
            }}
          />
        ))}
      </div>

      {/* Heading */}
      <div className="relative z-10 text-center mb-16 md:mb-20 px-4">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#e6fff5] tracking-tight"
        >
          What Our Community Says
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
          className="mt-4 text-[#e6fff5]/40 text-base md:text-lg tracking-wide"
        >
          Real words from Agents Clan members
        </motion.p>
      </div>

      {/* Row 1: Left to Right */}
      <div className="relative z-10 mb-6 md:mb-8 testimonial-marquee">
        {/* Fade masks on edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-[#0b1a13] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-[#0b1a13] to-transparent z-10 pointer-events-none" />

        <div className="testimonial-marquee-track testimonial-marquee--ltr flex gap-6 md:gap-8">
          {[...row1, ...row1, ...row1, ...row1].map((t, i) => (
            <TestimonialCard key={`r1-${t.id}-${i}`} t={t} />
          ))}
        </div>
      </div>

      {/* Row 2: Right to Left */}
      <div className="relative z-10 testimonial-marquee">
        {/* Fade masks on edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-[#0b1a13] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-[#0b1a13] to-transparent z-10 pointer-events-none" />

        <div className="testimonial-marquee-track testimonial-marquee--rtl flex gap-6 md:gap-8">
          {[...row2, ...row2, ...row2, ...row2].map((t, i) => (
            <TestimonialCard key={`r2-${t.id}-${i}`} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
