'use client';

import { motion } from 'framer-motion';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { Calendar, Users, Zap, Star } from 'lucide-react';
import SectionBadge from '@/components/ui/SectionBadge';
import GradientHeading from '@/components/ui/GradientHeading';
import CalendlyWidget from '@/components/sections/CalendlyWidget';

const reasons = [
  { icon: Users, title: 'Tailored for You', description: 'Every call is personalised — no templates, no scripts, just a focused conversation about your goals.' },
  { icon: Zap, title: 'Fast Turnaround', description: 'Proposals and follow-ups delivered within 48 hours of the call.' },
  { icon: Calendar, title: 'Flexible Scheduling', description: 'Pick any available slot across weekdays and weekends.' },
  { icon: Star, title: 'Senior Team Only', description: 'You speak directly with senior members of the AgentsClan core team, not interns.' },
];

export default function BookACallContent() {
  return (
    <main className="bg-black min-h-screen">
      {/* Hero */}
      <section className="px-6 md:px-[120px] pt-[140px] md:pt-[160px] pb-16 md:pb-20">
        <div className="flex flex-col items-start gap-5 max-w-[640px]">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <SectionBadge text="Book a Call" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}>
            <GradientHeading className="text-[40px] md:text-[56px]">Let's Talk.</GradientHeading>
          </motion.div>
          <motion.p className="text-white/75 text-[17px] leading-relaxed" initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.22 }}>
            Whether you're an organisation looking to collaborate or a builder wanting to know more about AgentsClan, book a call and we'll take it from there.
          </motion.p>
        </div>
      </section>

      {/* Split layout */}
      <section className="px-6 md:px-[120px] pb-24 md:pb-32 border-t border-white/10 pt-12 md:pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
          {/* Why book */}
          <div className="flex flex-col gap-8">
            <motion.h2 className="text-white text-xl md:text-2xl font-semibold" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.5 }}>
              Why Book a Call?
            </motion.h2>
            <div className="flex flex-col gap-5">
              {reasons.map((reason, i) => {
                const Icon = reason.icon;
                return (
                  <motion.div
                    key={reason.title}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-30px' }}
                    transition={{ duration: 0.45, delay: i * 0.08 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-9 h-9 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon size={16} className="text-white/60" />
                    </div>
                    <div>
                      <p className="text-white text-[15px] font-semibold mb-1">{reason.title}</p>
                      <p className="text-white/55 text-[14px] leading-relaxed">{reason.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.45, delay: 0.35 }}
              className="relative bg-white/5 border border-white/10 rounded-2xl px-6 py-5"
            >
              <GlowingEffect spread={40} glow proximity={80} inactiveZone={0.02} borderWidth={2} />
              <p className="text-white/40 text-[13px] font-medium mb-1">Availability</p>
              <p className="text-white/70 text-[14px] leading-relaxed">Mon – Fri: 9 AM – 8 PM IST<br />Sat & Sun: 9 AM – 5 PM IST</p>
            </motion.div>
          </div>

          {/* Calendly Widget */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <CalendlyWidget />
          </motion.div>
        </div>
      </section>
    </main>
  );
}
