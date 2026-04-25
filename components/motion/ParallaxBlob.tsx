"use client";

import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { useRef } from "react";

type ParallaxBlobProps = {
  className?: string;
  color?: "cyan" | "violet";
  size?: number; // px
  /** parallax travel distance in px across full scroll */
  travel?: number;
  opacity?: number;
  style?: React.CSSProperties;
};

export default function ParallaxBlob({
  className,
  color = "cyan",
  size = 480,
  travel = 80,
  opacity = 0.35,
  style,
}: ParallaxBlobProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-travel, travel]);

  const tint =
    color === "violet"
      ? "radial-gradient(closest-side, color-mix(in oklch, var(--violet, #8b5cf6) 70%, transparent), transparent 70%)"
      : "radial-gradient(closest-side, color-mix(in oklch, var(--accent) 70%, transparent), transparent 70%)";

  return (
    <motion.div
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute -z-10 rounded-full ${className ?? ""}`}
      style={{
        width: size,
        height: size,
        background: tint,
        filter: "blur(80px)",
        opacity,
        y: reduce ? 0 : y,
        ...style,
      }}
    />
  );
}
