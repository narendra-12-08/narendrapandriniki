"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

type StaggerItemProps = {
  children: ReactNode;
  className?: string;
  y?: number;
  duration?: number;
};

export default function StaggerItem({
  children,
  className,
  y = 20,
  duration = 0.55,
}: StaggerItemProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration, ease: EASE },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
