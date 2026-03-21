'use client';

import { Trophy, Star, Code, Users, Award, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import SectionBadge from '@/components/ui/SectionBadge';
import GradientHeading from '@/components/ui/GradientHeading';
import { GlowingEffect } from '@/components/ui/glowing-effect';

const stats = [
  { value: '2,000+', label: 'Community Members' },
  { value: '50+', label: 'Events Hosted' },
  { value: '120+', label: 'Projects Shipped' },
  { value: '$25K+', label: 'Prizes Awarded' },
];

const milestones = [
  { icon: Users, title: '2,000 Member Milestone', description: 'AgentsClan crossed 2,000 active builders in the community — a testament to the quality of the network.', date: 'Feb 2026', highlight: true },
  { icon: Trophy, title: 'BuildSphere Hack v1 Completed', description: '380 participants. 47 projects submitted. 3 teams funded. Our first large-scale hackathon was a resounding success.', date: 'Jan 2026', highlight: false },
  { icon: Zap, title: '10 City Chapters Launched', description: 'AgentsClan chapters now active in Bengaluru, Mumbai, Delhi, Hyderabad, Chennai, and 5 more cities.', date: 'Dec 2025', highlight: false },
  { icon: Code, title: 'Open Source Sprint: 1,200 Contributions', description: 'Community members made 1,200+ pull requests during the inaugural Open Source Sprint across 8 projects.', date: 'Nov 2025', highlight: false },
  { icon: Star, title: 'AgentsClan NFT Membership Goes Live', description: 'Our on-chain membership identity launched on mainnet, giving builders verifiable community credentials.', date: 'Oct 2025', highlight: false },
  { icon: Award, title: 'Community Founded', description: 'AgentsClan was founded with a mission: build a home for serious builders where actions earn real rewards.', date: 'Sep 2025', highlight: false },
];

const topBuilders = [
  { rank: 1, name: 'Arjun Mehta', role: 'Full-Stack Dev', quests: 142, events: 12, projects: 8 },
  { rank: 2, name: 'Priya Sharma', role: 'AI Researcher', quests: 138, events: 10, projects: 6 },
  { rank: 3, name: 'Sahil Khan', role: 'Web3 Builder', quests: 127, events: 11, projects: 7 },
  { rank: 4, name: 'Divya Nair', role: 'Product Designer', quests: 119, events: 9, projects: 5 },
  { rank: 5, name: 'Rohan Gupta', role: 'Backend Engineer', quests: 112, events: 8, projects: 6 },
];

export default function AchievementsContent() {
  return (
    <main className="bg-black min-h-screen">
      {/* Page Hero */}
      <section className="px-6 md:px-[120px] pt-[140px] md:pt-[160px] pb-16 md:pb-20">
        <div className="flex flex-col items-start gap-5 max-w-[640px]">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <SectionBadge text="Achievements" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}>
            <GradientHeading className="text-[40px] md:text-[56px]">Built by the Community. Recognized by It.</GradientHeading>
          </motion.div>
          <motion.p className="text-white/75 text-[17px] leading-relaxed" initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.22 }}>
            Everything built, shipped, and celebrated by the AgentsClan community — milestones, top contributors, and community moments.
          </motion.p>
        </div>
      </section>

      {/* Stats row */}
      <section className="px-6 md:px-[120px] pb-16 md:pb-20 border-t border-white/10 pt-12 md:pt-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 45 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
              className="relative bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-2 hover:border-white/20 cursor-default"
            >
              <GlowingEffect spread={40} glow proximity={80} inactiveZone={0.02} borderWidth={2} />
              <span className="text-[36px] md:text-[42px] font-semibold text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(144.5deg, #FFFFFF 28%, rgba(255, 255, 255, 0) 115%)' }}>
                {stat.value}
              </span>
              <span className="text-white/65 text-[15px]">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Milestones */}
      <section className="px-6 md:px-[120px] pb-16 md:pb-24 border-t border-white/10 pt-12 md:pt-16">
        <motion.h2 className="text-white text-2xl md:text-[30px] font-semibold mb-8" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.5 }}>
          Community Milestones
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {milestones.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 55 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, delay: i * 0.09 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className={`relative bg-white/5 border rounded-2xl p-6 flex flex-col gap-4 transition-colors cursor-default ${item.highlight ? 'border-[#00FF66]/30 hover:border-[#00FF66]/50' : 'border-white/10 hover:border-white/20'}`}
              >
                <GlowingEffect spread={40} glow proximity={80} inactiveZone={0.02} borderWidth={2} />
                {item.highlight && (
                  <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00FF66]/10 border border-[#00FF66]/20">
                    <div className="w-1 h-1 rounded-full bg-[#00FF66] shadow-[0_0_4px_#00FF66]" />
                    <span className="text-[#00FF66] text-[10px] font-medium">Latest</span>
                  </div>
                )}
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <Icon size={18} className={item.highlight ? 'text-[#00FF66]' : 'text-white/70'} />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-white text-base font-semibold leading-snug">{item.title}</h3>
                  <p className="text-white/65 text-[15px] leading-relaxed">{item.description}</p>
                </div>
                <span className="text-white/30 text-xs mt-auto">{item.date}</span>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Top Builders */}
      <section className="px-6 md:px-[120px] pb-16 md:pb-24 border-t border-white/10 pt-12 md:pt-16">
        <motion.div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-8" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.5 }}>
          <h2 className="text-white text-xl md:text-2xl font-semibold">Top Builders — Feb 2026</h2>
          <span className="text-white/55 text-[14px]">Ranked by quests, events &amp; projects</span>
        </motion.div>
        <div className="flex flex-col gap-3">
          {topBuilders.map((builder, i) => (
            <motion.div
              key={builder.rank}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
              className="bg-white/5 border border-white/10 rounded-xl px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-white/20 transition-colors"
            >
              <div className="flex items-center gap-5">
                <span className={`text-xl font-bold w-8 shrink-0 text-center ${builder.rank === 1 ? 'text-[#00FF66]' : builder.rank === 2 ? 'text-white/70' : builder.rank === 3 ? 'text-white/50' : 'text-white/30'}`}>#{builder.rank}</span>
                <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                  <span className="text-white/50 text-xs font-semibold">{builder.name.split(' ').map((n) => n[0]).join('')}</span>
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{builder.name}</p>
                  <p className="text-white/40 text-xs">{builder.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-6 md:gap-10 text-xs text-white/50">
                <span><span className="text-white/70 font-medium">{builder.quests}</span> Quests</span>
                <span><span className="text-white/70 font-medium">{builder.events}</span> Events</span>
                <span><span className="text-white/70 font-medium">{builder.projects}</span> Projects</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
