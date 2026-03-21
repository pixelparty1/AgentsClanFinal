'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import SectionBadge from '@/components/ui/SectionBadge';
import GradientHeading from '@/components/ui/GradientHeading';

interface TestimonialData {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  role: string;
  testimonial: string;
  avatar: string;
  backgroundColor: string;
  borderColor?: string;
}

const testimonials: TestimonialData[] = [
  {
    id: 'augustin',
    title: 'AUGUSTIN JERALD',
    subtitle: 'Web3 Builder',
    author: 'Augustin Jerald',
    role: 'Web3 Developer',
    testimonial: 'Had a great time at the #Polkadot Agents Club meetup! Substrate 101 🔧 Builder pitches 🎤 Ecosystem updates 🌐',
    avatar: 'https://pbs.twimg.com/profile_images/1794722133106364417/p__HFxiR_400x400.png',
    backgroundColor: 'from-blue-900 to-blue-800',
    borderColor: '#00ff88',
  },
  {
    id: 'rayan',
    title: 'MOHAMMED RAYAN',
    subtitle: 'Blockchain Enthusiast',
    author: 'Mohammed Rayan A',
    role: 'Developer',
    testimonial: 'Attended the polkadot event at Ornesta. @Vinithn10 explained about the dot ecosystem and I pitched an idea of IDE!',
    avatar: 'https://pbs.twimg.com/profile_images/1819657223909658629/MNOLCtWb_400x400.jpg',
    backgroundColor: 'from-slate-900 to-slate-800',
    borderColor: '#6366f1',
  },
  {
    id: 'shreeya',
    title: 'SHREEYA SHARMA',
    subtitle: 'Web3 Enthusiast',
    author: 'Shreeya',
    role: 'Product Manager',
    testimonial: 'Networking made right by @AgentsClan2! Web3 feels oddly gettable now 😎',
    avatar: 'https://pbs.twimg.com/profile_images/1938305778030702592/i3NPHWzI_400x400.jpg',
    backgroundColor: 'from-purple-900 to-purple-800',
    borderColor: '#a78bfa',
  },
  {
    id: 'manoj',
    title: 'MANOJ NANDI',
    subtitle: 'Community Builder',
    author: 'Manoj Nandi',
    role: 'Community Manager',
    testimonial: 'Had an absolute blast at the Game Night hosted by @avax and @AgentsClan2! 🎮🔥 The energy was unreal.',
    avatar: 'https://pbs.twimg.com/profile_images/1961798513710530560/XgJN3ygv_400x400.jpg',
    backgroundColor: 'from-indigo-900 to-indigo-800',
    borderColor: '#3b82f6',
  },
  {
    id: 'neelesh',
    title: 'NEELESH BALASUBRAMANI',
    subtitle: 'Avalanche Builder',
    author: 'Neelesh Balasubramani',
    role: 'Blockchain Dev',
    testimonial: 'I played the @AvaxTeam1 game, it was really cool! The event hosted by @AgentsClan2 was amazing #avalanche',
    avatar: 'https://pbs.twimg.com/profile_images/1916510875504050176/g9qe4_PY_400x400.jpg',
    backgroundColor: 'from-cyan-900 to-cyan-800',
    borderColor: '#06b6d4',
  },
  {
    id: 'aitch',
    title: 'AITCH',
    subtitle: 'Web3 Builder',
    author: 'aitch',
    role: 'Builder',
    testimonial: 'from sharing my web3 hustle to how anyone can jump in and start building, it was fun interacting with future buildoors',
    avatar: 'https://pbs.twimg.com/profile_images/1954588657526226944/g9RzoXHf_400x400.jpg',
    backgroundColor: 'from-amber-900 to-amber-800',
    borderColor: '#f59e0b',
  },
];

interface TestimonialCardProps {
  testimonial: TestimonialData;
  index: number;
}

function TestimonialCard({ testimonial, index }: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className="w-full mb-6 group cursor-pointer"
    >
      <div
        className={`relative bg-gradient-to-r ${testimonial.backgroundColor} rounded-3xl overflow-hidden h-full min-h-[200px] md:min-h-[240px] flex items-center transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]`}
        style={{
          borderLeft: `4px solid ${testimonial.borderColor}`,
        }}
      >
        {/* Content Container - Left Side */}
        <div className="flex-1 px-6 md:px-10 py-6 md:py-8 flex flex-col justify-center relative z-10">
          {/* Title */}
          <h3 className="text-2xl md:text-4xl font-bold text-white tracking-tight mb-2">
            {testimonial.title}
          </h3>

          {/* Subtitle */}
          <p className="text-sm md:text-base text-white/80 mb-4 md:mb-5 font-medium">
            {testimonial.subtitle}
          </p>

          {/* Quote */}
          <p className="text-sm md:text-base text-white/90 leading-relaxed italic mb-5 line-clamp-2 md:line-clamp-none">
            "{testimonial.testimonial}"
          </p>

          {/* Author Info */}
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-white/20">
              <Image
                src={testimonial.avatar}
                alt={testimonial.author}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{testimonial.author}</p>
              <p className="text-xs text-white/70">{testimonial.role}</p>
            </div>
          </div>
        </div>

        {/* Open Arrow Icon - Top Right */}
        <div className="absolute top-4 md:top-6 right-4 md:right-6 z-20">
          <button
            className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
            aria-label="Open"
          >
            <svg
              className="w-4 h-4 md:w-5 md:h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h10v10M7 17L17 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function TestimonialsContent() {
  return (
    <main className="bg-black min-h-screen">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#00FF66]/[0.04] rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-0 w-[600px] h-[600px] bg-[#6366f1]/[0.03] rounded-full blur-[150px]" />
      </div>

      {/* Hero */}
      <section className="relative z-10 px-6 md:px-[120px] pt-[140px] md:pt-[160px] pb-16 md:pb-20">
        <div className="flex flex-col items-center gap-5 text-center max-w-[800px] mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <SectionBadge text="Community" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}>
            <GradientHeading className="text-[40px] md:text-[56px]">Built Together, Talked About Honestly</GradientHeading>
          </motion.div>
          <motion.p className="text-white/75 text-base md:text-lg leading-relaxed" initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.22 }}>
            A few words from builders who spend time inside AgentsClan.
          </motion.p>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="relative z-10 px-6 md:px-[120px] pb-20 md:pb-32 pt-12 md:pt-16">
        <div className="max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
          ))}
        </div>
      </section>
    </main>
  );
}
