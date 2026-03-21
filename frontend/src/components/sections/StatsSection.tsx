'use client';

import Reveal from '@/components/ui/Reveal';

const stats = [
  { value: '2,000+', label: 'Community Members' },
  { value: '50+', label: 'Events Hosted' },
  { value: '120+', label: 'Projects Shipped' },
  { value: '15+', label: 'City Chapters' },
];

const StatsSection = () => {
  return (
    <section className="bg-[#0b1a13] py-20 md:py-32 border-t border-[#00ff88]/[0.08] relative z-10">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
        {stats.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 0.1} className="flex flex-col items-center text-center gap-3">
            <span
              className="text-[48px] md:text-[64px] lg:text-[80px] font-bold leading-none tracking-tight text-transparent bg-clip-text"
              style={{
                backgroundImage: 'linear-gradient(145deg, #e6fff5 30%, rgba(0,255,136,0.5) 100%)',
              }}
            >
              {stat.value}
            </span>
            <span className="text-[#e6fff5]/50 text-[16px] md:text-[18px] font-medium tracking-wide uppercase">
              {stat.label}
            </span>
          </Reveal>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;
