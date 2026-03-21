"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Layer = "all" | "layer1" | "layer2" | "ecosystem";

interface Sponsor {
  id: number;
  name: string;
  layer: "layer1" | "layer2" | "ecosystem";
}

const sponsors: Sponsor[] = [
  { id: 1, name: "Sandbox", layer: "layer2" },
  { id: 2, name: "BharatBox", layer: "ecosystem" },
  { id: 3, name: "Stellar", layer: "layer1" },
  { id: 4, name: "Avalanche", layer: "layer1" },
  { id: 5, name: "TURF.GG", layer: "ecosystem" },
  { id: 6, name: "P2P.ME", layer: "ecosystem" },
  { id: 7, name: "Peer2Play", layer: "layer2" },
  { id: 8, name: "Casper", layer: "layer1" },
  { id: 9, name: "ETHGlobal", layer: "ecosystem" },
  { id: 10, name: "dab.club", layer: "ecosystem" },
  { id: 11, name: "XDC", layer: "layer1" },
  { id: 12, name: "Polkadot", layer: "layer1" },
  { id: 13, name: "Mantle", layer: "layer2" },
  { id: 14, name: "zkSync", layer: "layer2" },
  { id: 15, name: "Arbitrum", layer: "layer2" },
];

const filters: { label: string; value: Layer }[] = [
  { label: "All", value: "all" },
  { label: "Layer 1", value: "layer1" },
  { label: "Layer 2", value: "layer2" },
  { label: "Ecosystem", value: "ecosystem" },
];

const TrustedBySection = () => {
  const [activeFilter, setActiveFilter] = useState<Layer>("all");

  const filtered = useMemo(
    () =>
      activeFilter === "all"
        ? sponsors
        : sponsors.filter((s) => s.layer === activeFilter),
    [activeFilter]
  );

  // Split into two rows for the marquee
  const mid = Math.ceil(filtered.length / 2);
  const row1 = filtered.slice(0, mid);
  const row2 = filtered.slice(mid);

  return (
    <section className="bg-[#0b1a13] py-12 md:py-20 lg:py-24 border-t border-[#00ff88]/[0.08]">
      <div className="flex flex-col items-center justify-center text-center mb-8 md:mb-12">
        <h2 className="text-[28px] md:text-[36px] lg:text-[40px] font-semibold text-[#e6fff5] mb-3 md:mb-4">
          Trusted by <span className="text-[#00ff88]">Industry Leaders</span>
        </h2>
        <p className="text-[#e6fff5]/50 text-[15px] md:text-[16px] lg:text-[18px] mb-6 md:mb-8">
          Partnering with the most innovative companies in blockchain and Web3
        </p>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 p-1 rounded-full bg-[#00ff88]/[0.05] border border-[#00ff88]/15">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={`relative px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${
                activeFilter === f.value
                  ? "text-[#0b1a13]"
                  : "text-[#e6fff5]/50 hover:text-[#e6fff5]"
              }`}
            >
              {activeFilter === f.value && (
                <motion.span
                  layoutId="activeFilter"
                  className="absolute inset-0 bg-[#00ff88] rounded-full"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{f.label}</span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeFilter}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="flex flex-col gap-6 md:gap-10 overflow-hidden w-full max-w-[100vw]"
        >
          {/* Row 1 */}
          <div
            className="scroller relative w-full overflow-hidden"
            style={{
              maskImage:
                "linear-gradient(to right, transparent, white 20%, white 80%, transparent)",
            }}
          >
            <div className="scroller-track flex w-max">
              {[...row1, ...row1, ...row1].map((sponsor, idx) => (
                <div
                  key={`row1-${idx}`}
                  className="shrink-0 w-40 md:w-56 flex items-center justify-center px-6 md:px-10 py-2"
                >
                  <img
                    alt={sponsor.name}
                    className="w-28 h-28 md:w-40 md:h-40 object-contain filter grayscale transition-all duration-300 transform hover:scale-110 hover:grayscale-0 cursor-pointer"
                    loading="lazy"
                    src={`/sponsors/${sponsor.id}.webp`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Row 2 */}
          {row2.length > 0 && (
            <div
              className="scroller scroller--reverse relative w-full overflow-hidden"
              style={{
                maskImage:
                  "linear-gradient(to right, transparent, white 20%, white 80%, transparent)",
              }}
            >
              <div className="scroller-track flex w-max">
                {[...row2, ...row2, ...row2].map((sponsor, idx) => (
                  <div
                    key={`row2-${idx}`}
                    className="shrink-0 w-40 md:w-56 flex items-center justify-center px-6 md:px-10 py-2"
                  >
                    <img
                      alt={sponsor.name}
                      className="w-28 h-28 md:w-40 md:h-40 object-contain filter grayscale transition-all duration-300 transform hover:scale-110 hover:grayscale-0 cursor-pointer"
                      loading="lazy"
                      src={`/sponsors/${sponsor.id}.webp`}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  );
};

export default TrustedBySection;
