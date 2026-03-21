"use client";

import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const Globe = dynamic(() => import("@/components/ui/globe").then((mod) => mod.Globe), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gradient-to-b from-black to-[#0b1a13] flex items-center justify-center rounded-xl">
      <div className="text-white/40 text-lg">Loading globe...</div>
    </div>
  ),
});

interface Arc {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
}

interface City {
  lat: number;
  lng: number;
  name: string;
  region: string;
  flag: string;
  lead: string;
  twitter: string;
}

const ARCS: Arc[] = [
  { startLat: 28.6139, startLng: 77.2090, endLat: 1.3521, endLng: 103.8198 },
  { startLat: 28.6139, startLng: 77.2090, endLat: 25.2048, endLng: 55.2708 },
  { startLat: 1.3521, startLng: 103.8198, endLat: 22.3193, endLng: 114.1694 },
  { startLat: 22.3193, startLng: 114.1694, endLat: 21.0278, endLng: 105.8342 },
  { startLat: 21.0278, startLng: 105.8342, endLat: 13.7563, endLng: 100.5018 },
  { startLat: 13.7563, startLng: 100.5018, endLat: 28.6139, endLng: 77.2090 },
];

const CITIES_DATA: City[] = [
  { lat: 28.6139, lng: 77.2090, name: "New Delhi", region: "India", flag: "🇮🇳", lead: "A", twitter: "@agentsclan_a" },
  { lat: 1.3521, lng: 103.8198, name: "Singapore", region: "Singapore", flag: "🇸🇬", lead: "B", twitter: "@agentsclan_b" },
  { lat: 25.2048, lng: 55.2708, name: "Dubai", region: "UAE", flag: "🇦🇪", lead: "C", twitter: "@agentsclan_c" },
  { lat: 22.3193, lng: 114.1694, name: "Hong Kong", region: "Hong Kong", flag: "🇭🇰", lead: "D", twitter: "@agentsclan_d" },
  { lat: 21.0278, lng: 105.8342, name: "Hanoi", region: "Vietnam", flag: "🇻🇳", lead: "E", twitter: "@agentsclan_e" },
  { lat: 13.7563, lng: 100.5018, name: "Bangkok", region: "Thailand", flag: "🇹🇭", lead: "F", twitter: "@agentsclan_f" },
];

export default function GlobeDemo() {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  return (
    <section className="relative w-full py-24 bg-gradient-to-b from-black via-[#0a1410] to-black overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
          }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[800px] bg-[#00ff88]/[0.04] rounded-full blur-[200px]"
        />
        <motion.div
          animate={{
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            delay: 2,
          }}
          className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-[#6366f1]/[0.03] rounded-full blur-[200px]"
        />
        <motion.div
          animate={{
            opacity: [0.15, 0.35, 0.15],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            delay: 4,
          }}
          className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-[#00ff88]/[0.02] rounded-full blur-[200px]"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-block mb-4"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-[#00ff88]/10 border border-[#00ff88]/30 text-[#00ff88] text-sm font-semibold tracking-wider">
              GLOBAL NETWORK
            </span>
          </motion.div>

          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tight leading-none">
            Connected <span className="text-[#00ff88]">Across</span> Continents
          </h2>
          <p className="text-lg md:text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed font-light">
            Agents Clan operates across Asia and the Middle East — connecting talent and communities through six strategic hubs powering Web3 innovation. Click on any city to learn more.
          </p>
        </motion.div>

        {/* Countries Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mb-8 flex flex-wrap justify-center gap-3 md:gap-4"
        >
          {CITIES_DATA.map((city, idx) => (
            <motion.div
              key={city.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              whileHover={{ scale: 1.05, backgroundColor: "rgba(0, 255, 136, 0.15)" }}
              className="group px-4 md:px-5 py-2.5 md:py-3 rounded-full bg-gradient-to-r from-[#1a3a2e] to-[#0d1f14] border border-[#00ff88]/30 hover:border-[#00ff88]/60 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center gap-2 md:gap-3">
                <span className="text-2xl md:text-3xl">{city.flag}</span>
                <div className="text-center">
                  <p className="text-white font-semibold text-sm md:text-base">{city.name}</p>
                  <p className="text-[#00ff88] text-xs opacity-70 group-hover:opacity-100">{city.region}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Globe Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="relative w-full h-[800px] md:h-[900px] lg:h-screen max-h-[900px] mx-auto rounded-2xl overflow-hidden shadow-2xl"
        >
          <Globe arcs={ARCS} arcColor="#00ff88" onCitySelect={setSelectedCity} />

          {/* City Info Popup */}
          <AnimatePresence>
            {selectedCity && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                transition={{ duration: 0.3 }}
                className="absolute top-12 left-1/2 -translate-x-1/2 z-50 pointer-events-auto"
              >
                <div className="relative">
                  <div className="px-8 py-6 rounded-2xl bg-gradient-to-br from-[#1a3a2e] to-[#0d1f14] border border-[#00ff88]/40 backdrop-blur-lg shadow-2xl min-w-80 max-w-md">
                    {/* Header with flag */}
                    <div className="flex items-start gap-4 mb-5 pb-5 border-b border-[#00ff88]/20">
                      <span className="text-4xl">{selectedCity.flag}</span>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white">{selectedCity.name}</h3>
                        <p className="text-[#00ff88] text-sm font-medium">{selectedCity.region}</p>
                      </div>
                    </div>

                    {/* Country Lead */}
                    <div className="mb-4">
                      <p className="text-white/70 text-sm mb-2">Country Lead:</p>
                      <p className="text-white font-semibold text-lg">{selectedCity.lead}</p>
                    </div>

                    {/* Twitter */}
                    <div className="flex items-center gap-3">
                      <span className="text-white/50">𝕏</span>
                      <span className="text-[#00ff88] text-sm font-medium">{selectedCity.twitter}</span>
                    </div>

                    {/* Close hint */}
                    <p className="text-white/40 text-xs mt-5 text-center">Click elsewhere to close</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
        >
          {[
            { number: "6", label: "Strategic Cities", desc: "Across Asia & Middle East" },
            { number: "3,500+", label: "Active Members", desc: "Growing daily" },
            { number: "24/7", label: "Global Operations", desc: "Round-the-clock support" },
          ].map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.7 + idx * 0.1 }}
              className="p-8 rounded-xl bg-[#0a1410]/80 border border-[#00ff88]/20 backdrop-blur-sm"
            >
              <div className="text-4xl md:text-5xl font-black text-[#00ff88] mb-2">
                {stat.number}
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{stat.label}</h3>
              <p className="text-white/50 text-sm">{stat.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
