'use client';

import { motion } from 'framer-motion';
import { Rocket, Globe, Code2, ShieldCheck, Megaphone, GraduationCap, CheckCircle2 } from 'lucide-react';
import SectionBadge from '@/components/ui/SectionBadge';
import GradientHeading from '@/components/ui/GradientHeading';
import { GlowingEffect } from '@/components/ui/glowing-effect';

const services = [
  {
    icon: Rocket,
    title: 'Hackathon Design & Management',
    description: 'End-to-end hackathon strategy, logistics, judging, and rewards for corporations, universities, and communities.',
    features: ['Participant acquisition', 'Judging infrastructure', 'Prize & rewards management'],
  },
  {
    icon: Globe,
    title: 'Community Building & Growth',
    description: 'We help brands and institutions build thriving, engaged technical communities from the ground up.',
    features: ['Audience strategy', 'Content & event calendar', 'Platform setup & moderation'],
  },
  {
    icon: Code2,
    title: 'Tech Event Production',
    description: 'From DEMODays to knowledge transfers, we produce high-quality technical events that leave an impression.',
    features: ['Venue & logistics', 'Live demo showcases', 'Speaker management'],
  },
  {
    icon: ShieldCheck,
    title: 'Startup Acceleration Support',
    description: 'Connecting high-potential teams from our community with mentors, capital, and early customers.',
    features: ['Founder matching', 'Demo Day preparation', 'Investor intros'],
  },
  {
    icon: Megaphone,
    title: 'Developer Marketing',
    description: 'Reach technical audiences authentically via our community channels, events, and content engine.',
    features: ['Sponsored campaigns', 'Hackathon sponsorships', 'Content partnerships'],
  },
  {
    icon: GraduationCap,
    title: 'Campus & University Programs',
    description: 'Plug-and-play programs to engage students: bootcamps, quests, and community-to-career pipelines.',
    features: ['Campus chapters', 'Internship pipelines', 'Coding bootcamps'],
  },
];

const steps = [
  { number: '01', title: 'Discovery Call', description: 'We understand your goals, audience, and constraints.' },
  { number: '02', title: 'Strategy & Proposal', description: 'Receive a custom proposal with timeline and pricing within 48 hours.' },
  { number: '03', title: 'Execution', description: 'Our team handles the full operational lift so you can stay focused on your core work.' },
  { number: '04', title: 'Results & Recap', description: 'Post-event reports, metrics, and community insights delivered to your team.' },
];

export default function ServicesContent() {
  return (
    <main className="bg-black min-h-screen">
      {/* Hero */}
      <section className="px-6 md:px-[120px] pt-[140px] md:pt-[160px] pb-16 md:pb-20">
        <div className="flex flex-col items-start gap-5 max-w-[640px]">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <SectionBadge text="Services" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}>
            <GradientHeading className="text-[40px] md:text-[56px]">We Build. We Execute. We Deliver.</GradientHeading>
          </motion.div>
          <motion.p className="text-white/75 text-[17px] leading-relaxed" initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.22 }}>
            AgentsClan offers a suite of community and event services for organisations that want to engage developers, students, and builders at scale.
          </motion.p>
        </div>
      </section>

      {/* Services grid */}
      <section className="px-6 md:px-[120px] pb-16 md:pb-24 border-t border-white/10 pt-12 md:pt-16">
        <motion.h2 className="text-white text-2xl md:text-[30px] font-semibold mb-8" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.5 }}>
          What We Offer
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 55 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, delay: i * 0.08 }}
                whileHover={{ y: -7, transition: { duration: 0.2 } }}
                className="relative bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-4 hover:border-white/20 cursor-default"
              >
                <GlowingEffect spread={40} glow proximity={80} inactiveZone={0.02} borderWidth={2} />
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-white/70" />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-white text-[17px] font-semibold leading-snug">{service.title}</h3>
                  <p className="text-white/65 text-[15px] leading-relaxed">{service.description}</p>
                </div>
                <ul className="flex flex-col gap-2 mt-auto">
                  {service.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-white/50 text-[13px]">
                      <CheckCircle2 size={13} className="text-[#00FF66] shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 md:px-[120px] pb-16 md:pb-24 border-t border-white/10 pt-12 md:pt-16">
        <motion.h2 className="text-white text-2xl md:text-[30px] font-semibold mb-8" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.5 }}>
          How It Works
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 55 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              className="relative bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-3"
            >
              <GlowingEffect spread={40} glow proximity={80} inactiveZone={0.02} borderWidth={2} />
              <span className="text-[#00FF66]/60 text-[13px] font-mono font-semibold">{step.number}</span>
              <h3 className="text-white text-base font-semibold">{step.title}</h3>
              <p className="text-white/55 text-[14px] leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-6 md:px-[120px] pb-24 md:pb-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="bg-white/5 border border-white/10 rounded-3xl px-8 md:px-16 py-12 md:py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
        >
          <div className="flex flex-col gap-3 max-w-[520px]">
            <h2 className="text-white text-2xl md:text-[32px] font-semibold leading-snug">Ready to work with us?</h2>
            <p className="text-white/60 text-[16px] leading-relaxed">Book a discovery call and we'll have a proposal in your inbox within 48 hours.</p>
          </div>
          <a href="/book-a-call" className="inline-flex items-center justify-center h-11 px-7 rounded-xl bg-white text-black text-[15px] font-semibold hover:bg-white/90 transition-colors shrink-0">
            Book a Call
          </a>
        </motion.div>
      </section>
    </main>
  );
}
