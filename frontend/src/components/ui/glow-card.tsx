'use client';

import { cn } from '@/lib/utils';
import { GlowingEffect } from './glowing-effect';

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  /** Radius of the radial gradient in px */
  spread?: number;
  /** Show a soft outer glow behind the border */
  glow?: boolean;
  /** Completely disable the effect */
  disabled?: boolean;
  /** Distance (px) from card edge the glow starts appearing */
  proximity?: number;
  /** Centre dead-zone fraction */
  inactiveZone?: number;
  /** Border thickness in px */
  borderWidth?: number;
}

export function GlowCard({
  children,
  className,
  spread = 40,
  glow = true,
  disabled = false,
  proximity = 80,
  inactiveZone = 0.02,
  borderWidth = 2,
}: GlowCardProps) {
  return (
    <div className={cn('relative rounded-2xl', className)}>
      <GlowingEffect
        spread={spread}
        glow={glow}
        disabled={disabled}
        proximity={proximity}
        inactiveZone={inactiveZone}
        borderWidth={borderWidth}
      />
      {children}
    </div>
  );
}
