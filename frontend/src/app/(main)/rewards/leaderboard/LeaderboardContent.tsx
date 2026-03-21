'use client';

import { motion } from 'framer-motion';
import SectionBadge from '@/components/ui/SectionBadge';
import GradientHeading from '@/components/ui/GradientHeading';

const leaderboard = [
  { rank: 1, name: 'Arjun Mehta', role: 'Full-Stack Dev', points: 1420, quests: 142, events: 12, projects: 8 },
  { rank: 2, name: 'Priya Sharma', role: 'AI Researcher', points: 1355, quests: 138, events: 10, projects: 6 },
  { rank: 3, name: 'Sahil Khan', role: 'Web3 Builder', points: 1290, quests: 127, events: 11, projects: 7 },
  { rank: 4, name: 'Divya Nair', role: 'Product Designer', points: 1180, quests: 119, events: 9, projects: 5 },
  { rank: 5, name: 'Rohan Gupta', role: 'Backend Engineer', points: 1115, quests: 112, events: 8, projects: 6 },
  { rank: 6, name: 'Neha Verma', role: 'Frontend Dev', points: 1020, quests: 101, events: 7, projects: 4 },
  { rank: 7, name: 'Aditya Rao', role: 'Founder', points: 980, quests: 92, events: 6, projects: 5 },
  { rank: 8, name: 'Meera Iyer', role: 'Data Scientist', points: 960, quests: 88, events: 7, projects: 4 },
];

export default function LeaderboardContent() {
  return (
    <main className="bg-black min-h-screen">
      {/* Hero */}
      <section className="px-6 md:px-[120px] pt-[140px] md:pt-[160px] pb-16 md:pb-20">
        <div className="flex flex-col items-start gap-5 max-w-[640px]">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <SectionBadge text="Rewards" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}>
            <GradientHeading className="text-[40px] md:text-[56px]">Community Leaderboard</GradientHeading>
          </motion.div>
          <motion.p className="text-white/75 text-[17px] leading-relaxed" initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.22 }}>
            Top builders, ranked by points earned from quests, events, and shipped projects. Built to celebrate consistent action.
          </motion.p>
        </div>
      </section>

      {/* Leaderboard */}
      <section className="px-6 md:px-[120px] pb-16 md:pb-24 border-t border-white/10 pt-12 md:pt-16">
        <div className="flex flex-col gap-3">
          {leaderboard.map((entry, i) => (
            <motion.div
              key={entry.rank}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
              className="bg-white/5 border border-white/10 rounded-xl px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-white/20 transition-colors"
            >
              <div className="flex items-center gap-5">
                <span className={`text-xl font-bold w-8 shrink-0 text-center ${entry.rank === 1 ? 'text-[#00FF66]' : entry.rank === 2 ? 'text-white/70' : entry.rank === 3 ? 'text-white/50' : 'text-white/30'}`}>
                  #{entry.rank}
                </span>
                <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                  <span className="text-white/50 text-xs font-semibold">{entry.name.split(' ').map((n) => n[0]).join('')}</span>
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{entry.name}</p>
                  <p className="text-white/40 text-xs">{entry.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-6 md:gap-10 text-xs text-white/50">
                <span><span className="text-white/70 font-medium">{entry.points}</span> pts</span>
                <span><span className="text-white/70 font-medium">{entry.quests}</span> Quests</span>
                <span><span className="text-white/70 font-medium">{entry.events}</span> Events</span>
                <span><span className="text-white/70 font-medium">{entry.projects}</span> Projects</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
