import { motion, useScroll, useSpring } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

export function ScrollProgress({ className }: { className?: string }) {
  const shouldReduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 26,
    restDelta: 0.001,
  });

  if (shouldReduce) return null;

  return (
    <motion.div
      style={{ scaleX }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 h-[2px] origin-left bg-[image:var(--grad-aurora)] shadow-[0_0_10px_rgba(45,226,166,0.6)]",
        className,
      )}
    />
  );
}
