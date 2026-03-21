"use client";

import { WorldMap } from "@/components/ui/map";
import { motion } from "framer-motion";

export function WorldMapDemo() {
  return (
    <div className="py-20 bg-black w-full">
      <div className="max-w-7xl mx-auto text-center">
        <p className="font-bold text-xl md:text-4xl text-white">
          Global{" "}
          <span className="text-neutral-400">
            {"Presence".split("").map((letter, idx) => (
              <motion.span
                key={idx}
                className="inline-block"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.04 }}
              >
                {letter}
              </motion.span>
            ))}
          </span>
        </p>
        <p className="text-sm md:text-lg text-neutral-500 max-w-2xl mx-auto py-4">
          Agents Clan operates across Asia and the Middle East — connecting
          talent and communities in six key cities.
        </p>
      </div>
      <WorldMap
        lineColor="#00FF66"
        showLabels={true}
        loop={true}
        dots={[
          {
            start: {
              lat: 22.3193,
              lng: 114.1694,
              label: "Hong Kong",
              labelOffset: { x: 55, y: -28 },
            },
            end: {
              lat: 25.276,
              lng: 55.2962,
              label: "Dubai",
              labelOffset: { x: -55, y: -28 },
            },
          },
          {
            start: {
              lat: 25.276,
              lng: 55.2962,
              label: "Dubai",
              labelOffset: { x: -55, y: -28 },
            },
            end: {
              lat: 20.5937,
              lng: 78.9629,
              label: "India",
              labelOffset: { x: -60, y: 25 },
            },
          },
          {
            start: {
              lat: 20.5937,
              lng: 78.9629,
              label: "India",
              labelOffset: { x: -60, y: 25 },
            },
            end: {
              lat: 13.7563,
              lng: 100.5018,
              label: "Thailand",
              labelOffset: { x: -35, y: 30 },
            },
          },
          {
            start: {
              lat: 13.7563,
              lng: 100.5018,
              label: "Thailand",
              labelOffset: { x: -35, y: 30 },
            },
            end: {
              lat: 14.0583,
              lng: 108.2772,
              label: "Vietnam",
              labelOffset: { x: 50, y: 8 },
            },
          },
          {
            start: {
              lat: 14.0583,
              lng: 108.2772,
              label: "Vietnam",
              labelOffset: { x: 50, y: 8 },
            },
            end: {
              lat: 1.3521,
              lng: 103.8198,
              label: "Singapore",
              labelOffset: { x: 10, y: 30 },
            },
          },
          {
            start: {
              lat: 1.3521,
              lng: 103.8198,
              label: "Singapore",
              labelOffset: { x: 10, y: 30 },
            },
            end: {
              lat: 22.3193,
              lng: 114.1694,
              label: "Hong Kong",
              labelOffset: { x: 55, y: -28 },
            },
          },
        ]}
      />
    </div>
  );
}
