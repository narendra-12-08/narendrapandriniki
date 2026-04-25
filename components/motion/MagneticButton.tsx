"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { useRef, type ReactNode, type MouseEvent } from "react";

type MagneticButtonProps = {
  children: ReactNode;
  className?: string;
  strength?: number; // max drift in px
  as?: "div" | "span";
};

export default function MagneticButton({
  children,
  className,
  strength = 6,
  as = "span",
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  function handleMove(e: MouseEvent<HTMLDivElement>) {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const max = Math.max(rect.width, rect.height) / 2;
    const nx = Math.max(-1, Math.min(1, dx / max));
    const ny = Math.max(-1, Math.min(1, dy / max));
    x.set(nx * strength);
    y.set(ny * strength);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  const MotionTag = as === "span" ? motion.span : motion.div;

  if (reduce) {
    return <span className={className}>{children}</span>;
  }

  return (
    <MotionTag
      ref={ref as React.RefObject<HTMLDivElement & HTMLSpanElement>}
      className={`inline-flex ${className ?? ""}`}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </MotionTag>
  );
}
