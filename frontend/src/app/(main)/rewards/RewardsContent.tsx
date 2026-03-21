'use client';

import Link from 'next/link';
import { Gift, Target, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import SectionBadge from '@/components/ui/SectionBadge';
import GradientHeading from '@/components/ui/GradientHeading';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';

const pillars = [
  { icon: Target, title: 'Daily Quests', description: 'Complete small, focused actions every day — ship tasks, help others, or learn something new.', href: '/rewards/daily-quests', label: 'View Daily Quests' },
  { icon: Trophy, title: 'Leaderboard', description: 'Climb the community leaderboard as you earn points from quests, events, and shipped projects.', href: '/rewards/leaderboard', label: 'View Leaderboard' },
  { icon: Gift, title: 'Store', description: 'Redeem your hard-earned points for limited-edition merch, perks, and community unlocks.', href: '/store', label: 'Open Store' },
];

export default function RewardsContent() {
  return (
    <main className="bg-black min-h-screen">
      {/* Hero */}
      <section className="px-6 md:px-[120px] pt-[140px] md:pt-[160px] pb-16 md:pb-20">
        <div className="flex flex-col items-start gap-5 max-w-[640px]">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <SectionBadge text="Rewards" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}>
            <GradientHeading className="text-[40px] md:text-[56px]">Do the Work. Earn the Rewards.</GradientHeading>
          </motion.div>
          <motion.p className="text-white/75 text-[17px] leading-relaxed" initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.22 }}>
            The AgentsClan rewards system is built for consistent builders — complete quests, show up to events, help the community, and redeem what you earn.
          </motion.p>
          <motion.div className="flex flex-col md:flex-row items-center gap-4 mt-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.32 }}>
            <PrimaryButton href="/rewards/daily-quests">Start with Daily Quests</PrimaryButton>
            <SecondaryButton href="/rewards/leaderboard">View Leaderboard</SecondaryButton>
          </motion.div>
        </div>
      </section>

      {/* Three pillars */}
      <section className="px-6 md:px-[120px] pb-16 md:pb-24 border-t border-white/10 pt-12 md:pt-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {pillars.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 55 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, delay: i * 0.1 }}
                whileHover={{ y: -7, transition: { duration: 0.2 } }}
              >
                <Link href={item.href} className="relative bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-4 hover:border-white/20 transition-colors block h-full">
                  <GlowingEffect spread={40} glow proximity={80} inactiveZone={0.02} borderWidth={2} />
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <Icon size={18} className="text-[#00FF66]" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h2 className="text-white text-base font-semibold">{item.title}</h2>
                    <p className="text-white/65 text-[15px] leading-relaxed">{item.description}</p>
                  </div>
                  <span className="text-white/60 text-xs mt-auto">{item.label}</span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
