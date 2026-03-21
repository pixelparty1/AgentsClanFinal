"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export const LayoutTextFlip = ({
  text = "Build Amazing",
  words = ["Landing Pages", "Component Blocks", "Page Sections", "3D Shaders"],
  duration = 3000,
  className,
}: {
  text: string;
  words: string[];
  duration?: number;
  className?: string;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, duration);

    return () => clearInterval(interval);
  }, [words.length, duration]);

  return (
    <span className={cn("inline-flex items-center gap-3 flex-wrap justify-center", className)}>
      <motion.span
        layoutId="subtext"
        className="text-2xl font-bold tracking-tight drop-shadow-lg md:text-4xl lg:text-5xl"
      >
        {text}
      </motion.span>

      <motion.span
        layout
        className="relative w-fit overflow-hidden rounded-lg border border-[#00FF66]/30 bg-[#00FF66]/10 px-5 py-2 font-sans text-2xl font-bold tracking-tight text-[#00FF66] md:text-4xl lg:text-5xl"
        style={{
          boxShadow:
            "0 0 20px rgba(0,255,102,0.15), inset 0 1px 0 rgba(0,255,102,0.1)",
        }}
      >
        {/* Animated glow bar at bottom */}
        <motion.span
          className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-[#00FF66] to-transparent"
          animate={{ width: ["0%", "100%", "0%"] }}
          transition={{
            duration: duration / 1000,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />
        <AnimatePresence mode="popLayout">
          <motion.span
            key={currentIndex}
            initial={{ y: -40, filter: "blur(10px)", opacity: 0 }}
            animate={{
              y: 0,
              filter: "blur(0px)",
              opacity: 1,
            }}
            exit={{ y: 50, filter: "blur(10px)", opacity: 0 }}
            transition={{
              duration: 0.45,
              ease: [0.16, 1, 0.3, 1],
            }}
            className={cn("inline-block whitespace-nowrap")}
          >
            {words[currentIndex]}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </span>
  );
};
