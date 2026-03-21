'use client';

import dynamic from 'next/dynamic';

const WorldMap = dynamic(() => import('@/components/WorldMap'), { ssr: false });

const EarthSection = () => (
  <section className="bg-[#0b1a13] w-full">
    <WorldMap />
  </section>
);

export default EarthSection;
