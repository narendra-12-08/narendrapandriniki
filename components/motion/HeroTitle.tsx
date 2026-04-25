"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Children, isValidElement, type ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

type HeroTitleProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
};

function flattenToText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(flattenToText).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) {
    return flattenToText(node.props.children);
  }
  return "";
}

/**
 * Splits a heading's text content into word spans and animates each
 * with a subtle blur+rise stagger. Preserves inline formatting via
 * a className-based approach: nodes inside <span class="gradient-text">
 * are emitted with a wrapping styled span.
 */
function splitNode(
  node: ReactNode,
  result: { word: string; className?: string }[],
  inheritedClass?: string
) {
  if (typeof node === "string" || typeof node === "number") {
    const text = String(node);
    const tokens = text.split(/(\s+)/);
    for (const tok of tokens) {
      if (tok === "" || /^\s+$/.test(tok)) continue;
      result.push({ word: tok, className: inheritedClass });
    }
    return;
  }
  if (Array.isArray(node)) {
    for (const c of node) splitNode(c, result, inheritedClass);
    return;
  }
  if (isValidElement<{ children?: ReactNode; className?: string }>(node)) {
    const cls = node.props.className
      ? [inheritedClass, node.props.className].filter(Boolean).join(" ")
      : inheritedClass;
    splitNode(node.props.children, result, cls);
  }
}

export default function HeroTitle({
  children,
  className,
  delay = 0.1,
  stagger = 0.04,
}: HeroTitleProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <h1 className={className}>{children}</h1>;
  }

  const words: { word: string; className?: string }[] = [];
  Children.forEach(children, (c) => splitNode(c, words));

  // Fallback: if extraction failed, render plainly to avoid losing content.
  if (words.length === 0) {
    const text = flattenToText(children);
    text.split(/\s+/).forEach((w) => {
      if (w) words.push({ word: w });
    });
  }

  return (
    <motion.h1
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: stagger, delayChildren: delay },
        },
      }}
    >
      {words.map((w, i) => (
        <motion.span
          key={i}
          className="inline-block"
          style={{ marginRight: "0.25em", willChange: "transform, opacity, filter" }}
          variants={{
            hidden: { opacity: 0, y: 14, filter: "blur(4px)" },
            visible: {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              transition: { duration: 0.7, ease: EASE },
            },
          }}
        >
          {w.className ? <span className={w.className}>{w.word}</span> : w.word}
        </motion.span>
      ))}
    </motion.h1>
  );
}
