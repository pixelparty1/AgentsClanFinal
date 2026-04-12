'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { GlowingEffect } from '@/components/ui/glowing-effect';

const mentors = [
  {
    id: 0,
    name: 'Alex Rivera',
    role: 'DeFi Protocol Architect',
    bio: 'Former lead engineer at top DEXs. Designs secure tokenomics and scalable smart contract architectures.',
    image: '/mentors/1.jpeg',
  },
  {
    id: 1,
    name: 'Sarah Chen',
    role: 'AI Autonomous Agents Lead',
    bio: 'Pioneer bridging on-chain identity with LLMs. Mentors founders on AI-powered decentralized apps.',
    image: '/mentors/2.jpeg',
  },
  {
    id: 2,
    name: 'Marcus Vance',
    role: 'Web3 Growth & Community',
    bio: 'Scaled multiple DAOs to 100k+ members. Specializes in viral growth loops and community design.',
    image: '/mentors/3.jpeg',
  },
  {
    id: 3,
    name: 'Rohit Waghela',
    role: 'Head of Ecosystem Growth @Agents Clan',
    bio: 'Brand Strategy, GTM & Fundraising | Agentic AI · SaaS · Fintech · Web3',
    image: '/mentors/4.jpeg',
  },
];

function MentorCard({ mentor }: { mentor: (typeof mentors)[number] }) {
  return (
    <div className="w-[200px] sm:w-[220px] md:w-[240px] flex-shrink-0 group">
      <div className="relative rounded-xl border border-[#00ff88]/[0.08] bg-[#00ff88]/[0.03] backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-[#00ff88]/30 hover:shadow-[0_0_30px_rgba(0,255,136,0.08)] hover:bg-[#00ff88]/[0.06] hover:scale-[1.02]">
        <GlowingEffect spread={40} glow proximity={80} inactiveZone={0.02} borderWidth={2} />

        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={mentor.image}
            alt={mentor.name}
            fill
            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
            sizes="240px"
          />
          {/* Bottom fade */}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0b1a13]/90 to-transparent pointer-events-none" />

          {/* Hover glow overlay */}
          <div className="absolute inset-0 bg-[#00ff88]/0 group-hover:bg-[#00ff88]/[0.03] transition-colors duration-500 pointer-events-none" />
        </div>

        {/* Details */}
        <div className="p-3.5">
          <h3 className="text-sm md:text-base font-bold text-[#e6fff5] tracking-tight">
            {mentor.name}
          </h3>
          <p className="text-[#00ff88]/80 text-[11px] md:text-xs font-medium mt-0.5">
            {mentor.role}
          </p>
          <p className="text-[#e6fff5]/40 text-[11px] md:text-xs leading-relaxed mt-1.5 line-clamp-2">
            {mentor.bio}
          </p>
        </div>
      </div>
    </div>
  );
}

const MentorSection = () => {
  return (
    <section className="relative w-full bg-gradient-to-b from-[#0b1a13] via-emerald-950/15 to-[#0b1a13] py-14 md:py-20 overflow-hidden">

      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#00ff88]/[0.035] rounded-full blur-[160px]" />
      </div>

      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="relative z-10 text-center mb-10 md:mb-12 px-6"
      >
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#e6fff5] tracking-tight">
          Our Mentors
        </h2>
        <p className="mt-2 text-[#e6fff5]/40 text-xs md:text-sm max-w-sm mx-auto">
          Learn from elite Web3 builders shaping the decentralized future.
        </p>
      </motion.div>

      <div className="relative z-10 px-6">
        <div className="mx-auto flex flex-wrap justify-center gap-4 md:gap-5 max-w-6xl">
          {mentors.map((mentor) => (
            <MentorCard key={`m-${mentor.id}`} mentor={mentor} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MentorSection;
