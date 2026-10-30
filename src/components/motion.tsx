/**
 * Motion for the app. Use THESE. Do not write animation code by hand.
 *
 *   <FadeIn>...</FadeIn>                  a block that fades and rises into view, once
 *   <Stagger><StaggerItem>...</StaggerItem></Stagger>
 *                                         a list or grid whose items appear one after another
 *   <PageTransition>...</PageTransition>  wrap a page's content once, at the top of the page
 *   <Pressable>...</Pressable>            a clickable card or tile: lifts on hover, presses on click
 *
 * Rules: at most one entrance per section, always short, never looping. Do not
 * animate things that update often (counters, tables that refresh).
 * Every one of these does nothing when the user's computer asks for reduced motion.
 */
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

const ease = [0.22, 1, 0.36, 1] as const;
const viewport = { once: true, margin: "-40px" } as const;

interface BoxProps {
  children: ReactNode;
  className?: string;
}

export function FadeIn({
  children,
  className,
  delay = 0,
}: BoxProps & { delay?: number }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{ duration: 0.35, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease } },
};

export function Stagger({ children, className }: BoxProps) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
    >
      {children}
    </motion.div>
  );
}

/** A direct child of <Stagger>. */
export function StaggerItem({ children, className }: BoxProps) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div className={className} variants={item}>
      {children}
    </motion.div>
  );
}

export function PageTransition({ children, className }: BoxProps) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease }}
    >
      {children}
    </motion.div>
  );
}

export function Pressable({ children, className }: BoxProps) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15, ease }}
    >
      {children}
    </motion.div>
  );
}
