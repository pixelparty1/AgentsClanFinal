'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { LayoutTextFlip } from '@/components/ui/layout-text-flip';

const Hero = () => {
  return (
    <div className="relative h-screen min-h-[800px] w-full overflow-hidden bg-[#0b1a13] font-general flex flex-col items-center justify-center">
      {/* Layer 1: Background Video (lowest z-index) */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-[1]"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        src="/bg.mp4"
      />

      {/* Layer 2: Dark green gradient overlay */}
      <div
        className="absolute inset-0 z-[2]"
        style={{
          background:
            'radial-gradient(circle at center, rgba(0,255,120,0.15), rgba(0,0,0,0.85))',
        }}
      />

      {/* Layer 3: outer.png for depth */}
      <div className="absolute inset-0 z-[3] pointer-events-none">
        <Image
          src="/outer.png"
          alt=""
          fill
          className="object-cover opacity-60 mix-blend-screen"
          priority
        />
      </div>

      {/* Layer 4: Subtle blur glow for premium depth */}
      <div className="absolute inset-0 z-[4] pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vh] bg-[#00ff88]/[0.07] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-full h-[40%] bg-gradient-to-t from-[#0b1a13] to-transparent" />
      </div>

      {/* Hero Content (Layer 5: top) */}
      <div className="relative z-[5] flex flex-col items-center justify-center h-full px-6 text-center w-full max-w-[1200px] mx-auto mt-10 md:mt-20">
        <div className="flex flex-col items-center w-full">

          {/* AGENTS CLAN Wordmark */}
          <motion.div
            className="flex flex-col items-center gap-4 mb-4 md:mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span
              className="text-[24px] md:text-[32px] font-black tracking-[0.4em] uppercase leading-none"
              style={{
                backgroundImage: 'linear-gradient(135deg, #4a9 0%, #D8FF3F 25%, #e6fff5 50%, #00ff88 75%, #D8FF3F 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                filter: 'drop-shadow(0 0 28px rgba(216,255,63,0.5))',
              }}
            >
              AGENTS CLAN
            </span>
          </motion.div>

          {/* Heading */}
          <motion.div
            className="flex flex-col items-center gap-4 mb-8 md:mb-12"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-[clamp(36px,6vw,72px)] font-bold leading-[1.15] tracking-tight text-center">
              <span
                className="block"
                style={{
                  backgroundImage:
                    'linear-gradient(160deg, #e6fff5 20%, rgba(230,255,245,0.65) 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                The Smartest Human Agent for
              </span>
            </h1>
            <div className="flex items-center justify-center flex-wrap gap-3 text-white">
              <LayoutTextFlip
                text="Your"
                words={["Community", "Domain", "Network", "Ecosystem"]}
                duration={2500}
              />
              <motion.span
                className="text-2xl font-bold tracking-tight md:text-4xl lg:text-5xl"
                style={{
                  backgroundImage:
                    'linear-gradient(135deg, #D8FF3F 0%, #00ff88 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                  filter: 'drop-shadow(0 0 18px rgba(216,255,63,0.5))',
                }}
              >
                Growth
              </motion.span>
            </div>
          </motion.div>

          {/* Subtitle Paragraph */}
          <motion.p
            className="text-[18px] md:text-[22px] font-normal text-[#e6fff5]/80 max-w-[760px] leading-[1.6] mb-6 md:mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          >
            AgentsClan is a next-gen community built for builders, creators, and innovators.
            Get membership access, attend exclusive events &amp; conferences, earn rewards through quests, and
            unlock premium merch — powered by real connections and Web3 identity.
          </motion.p>

          {/* Conference Ticker */}
          <motion.div
            className="w-full max-w-[760px] mb-10 md:mb-14 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
          >
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#e6fff5]/40 font-medium text-center mb-3">
              Present at global conferences
            </p>
            <div
              className="relative overflow-hidden"
              style={{
                maskImage:
                  'linear-gradient(to right, transparent, white 15%, white 85%, transparent)',
              }}
            >
              <div className="flex w-max gap-3 animate-[scroll_25s_linear_infinite]">
                {[
                  'Token 2049 Dubai',
                  'Token 2049 Singapore',
                  'Consensus Hong Kong',
                  'Consensus Miami',
                  'India Blockchain Week',
                  'Coinfest Asia',
                  'Bitcoin Asia',
                  'ETH Global',
                  'Token 2049 Dubai',
                  'Token 2049 Singapore',
                  'Consensus Hong Kong',
                  'Consensus Miami',
                  'India Blockchain Week',
                  'Coinfest Asia',
                  'Bitcoin Asia',
                  'ETH Global',
                ].map((name, i) => (
                  <span
                    key={i}
                    className="shrink-0 whitespace-nowrap rounded-full border border-[#00ff88]/20 bg-[#00ff88]/5 px-4 py-1.5 text-[13px] font-medium text-[#e6fff5]/70 hover:text-[#00ff88] hover:border-[#00ff88]/40 transition-colors duration-200 cursor-default"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
          >
            <Link href="/sign-up" className="group relative w-full sm:w-auto">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#D8FF3F] to-[#00ff88] opacity-50 blur-lg group-hover:opacity-80 transition-opacity duration-300" />
              <div className="relative bg-gradient-to-r from-[#D8FF3F] to-[#00ff88] rounded-full px-10 py-4 overflow-hidden active:scale-95 hover:scale-[1.03] transition-all duration-300 shadow-[0_0_20px_rgba(216,255,63,0.3)]">
                <span className="text-[#0b1a13] text-[17px] font-semibold relative z-10">Join Community</span>
              </div>
            </Link>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Hero;

