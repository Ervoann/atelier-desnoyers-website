"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface SplitTextRevealProps {
  text: string;
  className?: string;
  delay?: number;
}

export function SplitTextReveal({ text, className = "", delay = 0 }: SplitTextRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px", amount: 0.3 });

  const words = text.split(" ");

  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={i} style={{ display: "inline-block", overflow: "hidden" }}>
          <motion.span
            style={{ display: "inline-block", willChange: "transform" }}
            initial={{ y: "100%" }}
            animate={isInView ? { y: 0 } : { y: "100%" }}
            transition={{
              delay: delay + i * 0.03,
              duration: 0.5,
              ease: [0.33, 1, 0.68, 1],
            }}
          >
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
