"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ComponentProps } from "react";

type RevealProps = ComponentProps<typeof motion.div> & {
  delay?: number;
  /** Animate once the element scrolls into view instead of on mount. */
  inView?: boolean;
};

/**
 * Small entrance animation. Without JavaScript the element renders in its
 * final state, and with `prefers-reduced-motion` the animation is skipped.
 */
export function Reveal({ delay = 0, inView = false, children, ...props }: RevealProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <motion.div {...props}>{children}</motion.div>;
  }

  const hidden = { opacity: 0, y: 14 };
  const shown = { opacity: 1, y: 0 };

  return (
    <motion.div
      initial={hidden}
      {...(inView ? { whileInView: shown, viewport: { once: true, margin: "-48px" } } : { animate: shown })}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
