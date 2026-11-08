import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface BurstProps {
  active?: boolean;
  onComplete?: () => void;
  count?: number;
}

export function Burst({
  active = false,
  onComplete,
  count = 12,
}: BurstProps) {
  const shouldReduce = useReducedMotion();

  React.useEffect(() => {
    if (active) {
      const timer = setTimeout(() => {
        onComplete?.();
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [active, onComplete]);

  if (shouldReduce || !active) return null;

  const particles = Array.from({ length: count });

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-visible">
      <AnimatePresence>
        {particles.map((_, i) => {
          const angle = (i * 360) / count;
          const rad = (angle * Math.PI) / 180;
          const distance = 40 + (i % 3) * 15;
          const x = Math.cos(rad) * distance;
          const y = Math.sin(rad) * distance;

          return (
            <motion.span
              key={i}
              initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
              animate={{
                scale: [0, 1.2, 0],
                x,
                y,
                opacity: [1, 0.8, 0],
              }}
              transition={{
                duration: 0.7,
                ease: "easeOut",
              }}
              className="absolute h-2 w-2 rounded-full bg-[var(--primary)] shadow-[0_0_8px_var(--primary)]"
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
}
