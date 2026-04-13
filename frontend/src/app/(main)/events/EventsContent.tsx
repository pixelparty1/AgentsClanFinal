'use client';

import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import SectionBadge from '@/components/ui/SectionBadge';
import GradientHeading from '@/components/ui/GradientHeading';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { getEvents, type Event } from '@/lib/admin';
import { ExternalLink } from 'lucide-react';

const hardcodedPastEvents = [
  { title: "INTRO TO BLOCKCHAIN : by MST", location: "MYSORE", date: "2024", link: "https://luma.com/1lpl1zpq", socialLink: null },
  { title: "BYBIT CAMPUS CONNECT - RV UNI", location: "BENGALORE", date: "2024", link: "https://luma.com/l9ak6xxg", socialLink: null },
  { title: "BYBIT CAMPUS CONNECT GCET", location: "HYDERABAD", date: "2024", link: "https://luma.com/q5ku3mm8", socialLink: "https://x.com/AgentsClan2/status/2016790509101207999" },
  { title: "P2P.Foundation : Freedom Through Crypto", location: "BENGALORE", date: "2024", link: "https://luma.com/te8z4j11", socialLink: "https://x.com/AgentsClan2/status/2021598126969372989" },
  { title: "INDIA ONCHAIN TOUR: NORTHERN EDITION – 01", location: "DELHI", date: "2024", link: "https://luma.com/gva4m7fe", socialLink: "https://x.com/AgentsClan2/status/2012922666156769592" },
  { title: "DOT CONNECT (POLKADOT)", location: "BENGALORE", date: "2025", link: "https://lu.ma/iejuwntd", socialLink: "https://x.com/AgentsClan2/status/1952001367528149208" },
  { title: "ROAD TO SUB0 - BUILDERS PARTY MYSORE", location: "MYSORE", date: "2025", link: "https://luma.com/qu09pe8l", socialLink: "https://x.com/AgentsClan2/status/1976991321849033012" },
  { title: "STELLAR IGNITE", location: "GOA", date: "2025", link: "https://t.co/r4Mt13ccsJ", socialLink: "https://x.com/AgentsClan2/status/1967590370361159759" },
  { title: "DOT BITE (POLKADOT)", location: "BENGALURU", date: "2025", link: "https://lu.ma/j50ortrm", socialLink: "https://x.com/AgentsClan2/status/1926654859140297025" },
  { title: "STELLARVERSE (STELLAR)", location: "BENGALURU", date: "2025", link: "https://lu.ma/6szq1qup", socialLink: "https://x.com/AgentsClan2/status/1949799294703386814" },
  { title: "GAMENIGHT COIMBATORE", location: "COIMBATORE", date: "2025", link: "https://lu.ma/ugwuuscg", socialLink: "https://x.com/AgentsClan2/status/1944068108953571648" },
  { title: "GAMENIGHT CHANDIGHAR", location: "CHANDIGHAR", date: "2025", link: "https://lu.ma/dqgjoewk", socialLink: "https://x.com/AgentsClan2/status/1942965477069750678" },
  { title: "GAMENIGHT BENGALURU", location: "BENGALURU", date: "2025", link: "https://lu.ma/f4mcwwla", socialLink: "https://x.com/AgentsClan2/status/1942965477069750678" },
  { title: "NAMMA POLKADOT BLR EDITION", location: "BENGALURU", date: "2025", link: "https://lu.ma/t0oi8tvt", socialLink: "https://x.com/AgentsClan2/status/1917260809090261162" },
  { title: "Road to AssetHub Hackathon", location: "HYDERABAD", date: "2025", link: "https://lu.ma/7m7vn26g", socialLink: "https://x.com/AgentsClan2/status/1929936544049311935" },
  { title: "Road to AssetHub Hackathon", location: "BENGALORE", date: "2025", link: "https://lu.ma/79a7flh8", socialLink: "https://x.com/DOTmeetups/status/1938639250058064267" },
  { title: "STELLAR GOSSIPS ( WOMEN ONLY )", location: "BENGALURU", date: "2025", link: "https://lu.ma/zg1hxvs7", socialLink: "https://x.com/AgentsClan2/status/1903783023499178327" },
  { title: "ZERO TO STELLAR", location: "CHENNAI", date: "2025", link: "https://lu.ma/15uyvbcx", socialLink: "https://x.com/nithinanikin/status/1906192593857470472" },
  { title: "Team1 Game Night: Coimbatore", location: "COIMBATORE", date: "2025", link: "https://lu.ma/i1qhso2r", socialLink: "https://x.com/AgentsClan2/status/1931739330227433650" },
  { title: "Team1 Game Night: Bangalore", location: "BENGALURU", date: "2025", link: "https://lu.ma/mzdkb0th", socialLink: "https://x.com/AgentsClan2/status/1931739330227433650" },
  { title: "SANDBOX CREATORS CHALLENGE", location: "ONLINE", date: "2025", link: "https://lu.ma/5ftyf8a0", socialLink: "https://x.com/AgentsClan2/status/1904115977648034287" },
  { title: "P2Pdotme Movie Night", location: "BENGALURU", date: "2025", link: "https://lu.ma/in9zib3k", socialLink: "https://x.com/AgentsClan2/status/1931015166474527144" },
  { title: "SHAREUM INDIA", location: "BENGALURU", date: "2025", link: "https://lu.ma/m7vlzolz", socialLink: "https://x.com/tejaskiranm/status/1908518961534427601" },
  { title: "P2P.ME SUPPER", location: "BENGALURU", date: "2025", link: "https://lu.ma/2ndsfwft", socialLink: "https://www.linkedin.com/posts/vinith-n-775a37259_what-an-incredible-evening-had-activity" },
  { title: "CSPR Blockchain India - Meet and Greet", location: "BENGALURU", date: "2025", link: "https://lu.ma/rlrbc02g", socialLink: "https://www.linkedin.com/posts/vinith-n-775a37259_networking-community-collaboration-activity" }
];

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

  const combinedPastEvents = [
    ...pastEvents.map(e => ({
      id: e.$id,
      title: e.title,
      type: e.event_type || 'Event',
      date: formatDate(e.event_date),
      location: e.location || 'Online',
      lumaLink: null,
      socialLink: null
    })),
    ...hardcodedPastEvents.map((e, index) => ({
      id: `hardcoded-past-${index}`,
      title: e.title,
      type: 'Hosted Event',
      date: e.date,
      location: e.location,
      lumaLink: e.link,
      socialLink: e.socialLink
    }))
  ];
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
          {combinedPastEvents.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No past events yet</div>
          ) : (
            combinedPastEvents.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.45, delay: (i % 10) * 0.05 }}
                className="bg-white/5 border border-white/10 rounded-xl px-5 py-4 md:px-6 md:py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-white/20 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="inline-flex w-fit items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 shrink-0">
                    <span className="text-white/60 text-xs font-medium capitalize">{event.type}</span>
                  </div>
                  <div>
                    <h3 className="text-white text-sm md:text-[15px] font-semibold">{event.title}</h3>
                    <div className="flex items-center gap-4 mt-1.5 flex-wrap">
                      <div className="flex items-center gap-1.5"><Calendar size={12} className="text-[#00FF88]" /><span className="text-white/50 text-xs">{event.date}</span></div>
                      {event.location && (
                        <div className="flex items-center gap-1.5"><MapPin size={12} className="text-[#00FF88]" /><span className="text-white/50 text-xs">{event.location}</span></div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  {event.lumaLink && (
                    <a href={event.lumaLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 hover:text-indigo-200 transition-colors text-xs font-medium border border-indigo-500/20">
                      Luma <ExternalLink size={11} />
                    </a>
                  )}
                  {event.socialLink && (
                    <a href={event.socialLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 hover:text-blue-200 transition-colors text-xs font-medium border border-blue-500/20">
                      Social <ExternalLink size={11} />
                    </a>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
