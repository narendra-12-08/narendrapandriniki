"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState, type ReactNode } from "react";

type MarqueeProps = {
  children: ReactNode;
  speed?: number; // seconds for one full loop
  className?: string;
  itemClassName?: string;
};

/**
 * Infinite horizontal scroller. Renders the children twice and
 * animates x from 0% to -50% on a continuous loop. Pauses on hover.
 */
export default function Marquee({
  children,
  speed = 40,
  className,
  itemClassName,
}: MarqueeProps) {
  const reduce = useReducedMotion();
  const [paused, setPaused] = useState(false);

  if (reduce) {
    return (
      <div className={className}>
        <div className={itemClassName}>{children}</div>
      </div>
    );
  }

  return (
    <div
      className={`overflow-hidden ${className ?? ""}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-hidden
    >
      <motion.div
        className="flex w-max"
        animate={paused ? { x: undefined } : { x: ["0%", "-50%"] }}
        transition={{
          duration: speed,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        <div className={`flex shrink-0 ${itemClassName ?? ""}`}>{children}</div>
        <div className={`flex shrink-0 ${itemClassName ?? ""}`} aria-hidden>
          {children}
        </div>
      </motion.div>
    </div>
  );
}
