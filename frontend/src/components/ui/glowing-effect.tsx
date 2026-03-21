'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface GlowingEffectProps {
  /** Radius of the radial gradient in px */
  spread?: number;
  /** Show a soft outer glow behind the border */
  glow?: boolean;
  /** Completely disable the effect (SSR-safe) */
  disabled?: boolean;
  /** Distance (px) from the card edge at which the glow begins to appear */
  proximity?: number;
  /** Fraction of the card diagonal that counts as a "dead zone" in the centre */
  inactiveZone?: number;
  /** Border thickness in px */
  borderWidth?: number;
}

export function GlowingEffect({
  spread = 40,
  glow = true,
  disabled = false,
  proximity = 80,
  inactiveZone = 0.02,
  borderWidth = 2,
}: GlowingEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrame = useRef(0);
  const [isActive, setIsActive] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  /* ── Detect touch / small-screen devices ────────────── */
  useEffect(() => {
    const check = () =>
      setIsMobile(
        window.matchMedia('(hover: none)').matches || window.innerWidth < 768,
      );
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  /* ── Mouse tracking ─────────────────────────────────── */
  const handleMove = useCallback(
    (e: MouseEvent) => {
      const el = containerRef.current;
      if (!el) return;

      cancelAnimationFrame(animationFrame.current);
      animationFrame.current = requestAnimationFrame(() => {
        const parent = el.parentElement;
        if (!parent) return;

        const rect = parent.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        /* proximity gate */
        const isNear =
          e.clientX >= rect.left - proximity &&
          e.clientX <= rect.right + proximity &&
          e.clientY >= rect.top - proximity &&
          e.clientY <= rect.bottom + proximity;

        if (isNear) {
          /* inactive zone (normalised distance from center) */
          const nx = x / rect.width - 0.5;
          const ny = y / rect.height - 0.5;
          if (Math.sqrt(nx * nx + ny * ny) < inactiveZone) {
            setIsActive(false);
            return;
          }
        }

        setIsActive(isNear);
        el.style.setProperty('--glow-x', `${x}px`);
        el.style.setProperty('--glow-y', `${y}px`);
      });
    },
    [proximity, inactiveZone],
  );

  useEffect(() => {
    if (disabled || isMobile) return;
    document.addEventListener('mousemove', handleMove, { passive: true });
    return () => {
      document.removeEventListener('mousemove', handleMove);
      cancelAnimationFrame(animationFrame.current);
    };
  }, [disabled, isMobile, handleMove]);

  if (disabled || isMobile) return null;

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 rounded-[inherit] z-10"
      style={{ opacity: isActive ? 1 : 0, transition: 'opacity 300ms ease' }}
    >
      {/* Border-only glow — uses mask-composite to cut out the interior */}
      <div
        className="absolute inset-0 rounded-[inherit]"
        style={{
          background: `radial-gradient(${spread * 2}px ${spread * 2}px at var(--glow-x,50%) var(--glow-y,50%), rgba(0,255,102,0.65), rgba(0,204,102,0.35), transparent 70%)`,
          WebkitMask:
            'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          padding: `${borderWidth}px`,
        }}
      />
      {/* Optional outer soft bloom */}
      {glow && (
        <div
          className="absolute -inset-2 rounded-[inherit]"
          style={{
            background: `radial-gradient(${spread * 3}px ${spread * 3}px at var(--glow-x,50%) var(--glow-y,50%), rgba(0,255,102,0.10), transparent 70%)`,
            filter: 'blur(8px)',
          }}
        />
      )}
    </div>
  );
}
