"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const Globe = dynamic(() => import("@/components/ui/globe").then((mod) => mod.Globe), {
  ssr: false,
  loading: () => <div className="w-full h-96 flex items-center justify-center text-white/50">Loading globe...</div>,
});

const locations = [
  { name: "Hong Kong", emoji: "🇭🇰", description: "Asia-Pacific gateway. A key node for DeFi, NFT, and GameFi communities.", members: 620 },
  { name: "Dubai",     emoji: "🇦🇪", description: "Middle East operations center. AgentsClan hosts flagship events here.", members: 480 },
  { name: "India",     emoji: "🇮🇳", description: "Our largest hub — thriving Web3 developer community across Bangalore, Mumbai, and Delhi.", members: 1200 },
  { name: "Thailand",  emoji: "🇹🇭", description: "Fast-growing community of builders and gamers driving GameFi adoption.", members: 310 },
  { name: "Vietnam",   emoji: "🇻🇳", description: "One of the most active NFT and play-to-earn communities in the world.", members: 390 },
  { name: "Singapore", emoji: "🇸🇬", description: "Southeast Asia's Web3 capital. AgentsClan runs accelerator programs here.", members: 540 },
];

// Arc connections between cities
const ARCS = [
  { startLat: 28.6139, startLng: 77.2090, endLat: 1.3521, endLng: 103.8198 }, // India → Singapore
  { startLat: 28.6139, startLng: 77.2090, endLat: 25.2048, endLng: 55.2708 }, // India → Dubai
  { startLat: 1.3521, startLng: 103.8198, endLat: 22.3193, endLng: 114.1694 }, // Singapore → Hong Kong
  { startLat: 22.3193, startLng: 114.1694, endLat: 21.0278, endLng: 105.8342 }, // Hong Kong → Vietnam
  { startLat: 21.0278, startLng: 105.8342, endLat: 13.7563, endLng: 100.5018 }, // Vietnam → Thailand
  { startLat: 13.7563, startLng: 100.5018, endLat: 28.6139, endLng: 77.2090 }, // Thailand → India
];

export default function WorldMap() {
  return (
    <div className="py-16 bg-[#0b1a13] w-full">
      {/* Header */}
      <div className="max-w-7xl mx-auto text-center mb-6 px-4">
        <p className="font-bold text-xl md:text-4xl text-white">
          Global <span className="text-[#00ff88]">Presence</span>
        </p>
        <p className="text-sm md:text-lg text-neutral-400 max-w-2xl mx-auto mt-3">
          Agents Clan operates across Asia and the Middle East — connecting talent and communities in six key cities.
        </p>
      </div>

      {/* Location pills */}
      <div className="flex flex-wrap justify-center gap-2 mb-8 px-4">
        {locations.map((loc) => (
          <motion.button
            key={loc.name}
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border border-[#00ff88]/40 bg-black/40 text-[#00ff88] hover:bg-[#00ff88]/10 transition-all"
          >
            {loc.emoji} {loc.name}
          </motion.button>
        ))}
      </div>

      {/* Globe */}
      <div className="relative w-full max-w-5xl mx-auto px-4" style={{ minHeight: "500px" }}>
        <Globe arcs={ARCS} arcColor="#00ff88" />
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-b from-transparent to-[#0b1a13] pointer-events-none z-10" />
      </div>
    </div>
  );
}
