'use client';

import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import SectionBadge from '@/components/ui/SectionBadge';
import GradientHeading from '@/components/ui/GradientHeading';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { getEvents, type Event } from '@/lib/admin';

export default function EventsContent() {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const events = await getEvents();
        // All events created by admin are now visible to users
        setAllEvents(events);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const upcomingEvents = allEvents.filter(e => new Date(e.event_date) >= new Date());
  const pastEvents = allEvents.filter(e => new Date(e.event_date) < new Date());

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };
  return (
    <main className="bg-black min-h-screen">
      {/* Page Hero */}
      <section className="px-6 md:px-[120px] pt-[140px] md:pt-[160px] pb-16 md:pb-20">
        <div className="flex flex-col items-start gap-5 max-w-[640px]">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: 'easeOut' }}>
            <SectionBadge text="Events" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}>
            <GradientHeading className="text-[40px] md:text-[56px]">Events Worth Showing Up For</GradientHeading>
          </motion.div>
          <motion.p className="text-white/75 text-[17px] leading-relaxed" initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.22 }}>
            Hackathons, workshops, AMAs, and networking events — curated exclusively for the AgentsClan builder community. Online and in-person.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.34 }}>
            <PrimaryButton href="/membership">Get Member Access</PrimaryButton>
          </motion.div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="px-6 md:px-[120px] pb-16 md:pb-24 border-t border-white/10 pt-12 md:pt-16">
        <motion.h2 className="text-white text-xl md:text-2xl font-semibold mb-8" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.5 }}>
          Upcoming Events
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {loading ? (
            <div className="col-span-full text-center py-12 text-gray-500">Loading events...</div>
          ) : upcomingEvents.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">No upcoming events yet</div>
          ) : (
            upcomingEvents.map((event, i) => (
              <motion.div
                key={event.$id}
                initial={{ opacity: 0, y: 55 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, delay: i * 0.08, ease: 'easeOut' }}
                whileHover={{ y: -7, transition: { duration: 0.2 } }}
                className="relative bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-5 hover:border-white/25 hover:bg-white/8 transition-colors"
              >
                <GlowingEffect spread={40} glow proximity={80} inactiveZone={0.02} borderWidth={2} />
                <div className="inline-flex w-fit items-center gap-2 px-3 py-1 rounded-full bg-[#00FF66]/10 border border-[#00FF66]/20">
                  <div className="w-1 h-1 rounded-full bg-[#00FF66]" />
                  <span className="text-[#00FF66] text-xs font-medium capitalize">{event.event_type}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-white text-[17px] font-semibold leading-snug">{event.title}</h3>
                  <p className="text-white/65 text-[15px] leading-relaxed">{event.description}</p>
                </div>
                <div className="flex flex-col gap-2 mt-auto pt-2 border-t border-white/10">
                  <div className="flex items-center gap-2"><Calendar size={13} className="text-white/40" /><span className="text-white/50 text-xs">{formatDate(event.event_date)}</span></div>
                  <div className="flex items-center gap-2"><Clock size={13} className="text-white/40" /><span className="text-white/50 text-xs">{formatTime(event.event_date)}</span></div>
                  {event.location && (
                    <div className="flex items-center gap-2"><MapPin size={13} className="text-white/40" /><span className="text-white/50 text-xs">{event.location}</span></div>
                  )}
                  {event.location_type && (
                    <div className="flex items-center gap-2"><Users size={13} className="text-white/40" /><span className="text-white/50 text-xs capitalize">{event.location_type}</span></div>
                  )}
                </div>
                {event.meeting_link && (
                  <a
                    href={event.meeting_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative w-full mt-1"
                  >
                    <div className="absolute inset-0 rounded-full border border-[0.6px] border-white/60" />
                    <div className="relative bg-transparent hover:bg-white/10 transition-colors rounded-full px-[29px] py-[11px] overflow-hidden active:scale-95">
                      <span className="text-white text-sm font-medium relative z-10">Register</span>
                    </div>
                  </a>
                )}
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* Past Events */}
      <section id="past" className="px-6 md:px-[120px] pb-16 md:pb-24 border-t border-white/10 pt-12 md:pt-16">
        <motion.h2 className="text-white text-xl md:text-2xl font-semibold mb-8" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.5 }}>
          Past Events
        </motion.h2>
        <div className="flex flex-col gap-3">
          {pastEvents.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No past events yet</div>
          ) : (
            pastEvents.map((event, i) => (
              <motion.div
                key={event.$id}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.45, delay: i * 0.07 }}
                className="bg-white/5 border border-white/10 rounded-xl px-6 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-white/20 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="inline-flex w-fit items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10">
                    <span className="text-white/60 text-xs font-medium capitalize">{event.event_type}</span>
                  </div>
                  <div>
                    <h3 className="text-white text-sm font-semibold">{event.title}</h3>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1.5"><Calendar size={11} className="text-white/30" /><span className="text-white/40 text-xs">{formatDate(event.event_date)}</span></div>
                      {event.location && (
                        <div className="flex items-center gap-1.5"><MapPin size={11} className="text-white/30" /><span className="text-white/40 text-xs">{event.location}</span></div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-white/40 text-xs">{event.event_type}</span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
