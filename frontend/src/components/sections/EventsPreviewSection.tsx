'use client';

import Link from 'next/link';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import SecondaryButton from '@/components/ui/SecondaryButton';
import { GlowingEffect } from '@/components/ui/glowing-effect';

const upcomingEvents = [
  {
    type: 'Hackathon',
    title: 'BuildSphere 2026',
    date: 'Mar 15 – 16, 2026',
    location: 'Online + Hybrid',
    description: 'A 48-hour hackathon for builders tackling AI, Web3, and open-source challenges.',
  },
  {
    type: 'Workshop',
    title: 'Ship with AI Agents',
    date: 'Mar 22, 2026',
    location: 'Online — Discord Stage',
    description: 'Learn how to build and deploy autonomous AI agents from industry practitioners.',
  },
  {
    type: 'Networking',
    title: 'Founders & Builders Mixer',
    date: 'Apr 5, 2026',
    location: 'Bengaluru, India',
    description: 'An exclusive in-person mixer connecting startup founders and community builders.',
  },
];

const EventsPreviewSection = () => {
  return (
    <section className="bg-[#0b1a13] py-20 md:py-32 border-t border-[#00ff88]/[0.08]">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-16">
        <div className="flex flex-col gap-4">
          <Reveal>
            <h2 className="text-[36px] md:text-[56px] font-bold tracking-tight text-[#e6fff5] max-w-[500px] leading-[1.05]">
              Events Worth Showing Up For
            </h2>
          </Reveal>
        </div>
        <Reveal delay={0.2}>
          <SecondaryButton href="/events">View All Events</SecondaryButton>
        </Reveal>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {upcomingEvents.map((event, i) => (
          <Reveal key={event.title} delay={i * 0.15}>
            <div className="relative bg-[#00ff88]/[0.04] border border-[#00ff88]/10 rounded-3xl p-8 flex flex-col gap-6 hover:border-[#00ff88]/25 hover:-translate-y-1 hover:bg-[#00ff88]/[0.07] transition-all duration-300 group cursor-default h-full shadow-[0_0_0_rgba(0,255,136,0)] hover:shadow-[0_8px_32px_rgba(0,255,136,0.06)]">
              <GlowingEffect spread={40} glow proximity={80} inactiveZone={0.02} borderWidth={2} />
              {/* Type badge */}
              <div className="inline-flex w-fit items-center gap-2 px-4 py-1.5 rounded-full bg-[#00ff88]/10 border border-[#00ff88]/20">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00ff88]" />
                <span className="text-[#00ff88] text-[13px] font-semibold tracking-wide uppercase">{event.type}</span>
              </div>

              <div className="flex flex-col gap-3 flex-grow">
                <h3 className="text-[#e6fff5] text-[22px] font-semibold leading-tight">{event.title}</h3>
                <p className="text-[#e6fff5]/50 text-[16px] leading-relaxed">{event.description}</p>
              </div>

              <div className="flex flex-col gap-3 mt-6 pt-6 border-t border-[#00ff88]/10">
                <div className="flex items-center gap-3">
                  <Calendar size={15} className="text-[#00ff88]/50" />
                  <span className="text-[#e6fff5]/60 text-[14px] font-medium">{event.date}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={15} className="text-[#00ff88]/50" />
                  <span className="text-[#e6fff5]/60 text-[14px] font-medium">{event.location}</span>
                </div>
              </div>

              <Link
                href="/events"
                className="flex items-center gap-2 text-[#e6fff5]/40 text-[15px] font-medium group-hover:text-[#00ff88] transition-colors duration-300 mt-2"
              >
                Learn more <ArrowRight size={16} />
              </Link>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
};

export default EventsPreviewSection;
