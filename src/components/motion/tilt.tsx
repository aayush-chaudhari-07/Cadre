import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

interface TiltProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  maxAngle?: number;
  glare?: boolean;
}

export function Tilt({
  children,
  className,
  maxAngle = 6,
  glare = true,
  ...props
}: TiltProps) {
  const shouldReduce = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);

  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(y, [0, 1], [maxAngle, -maxAngle]), {
    stiffness: 260,
    damping: 26,
  });
  const rotateY = useSpring(useTransform(x, [0, 1], [-maxAngle, maxAngle]), {
    stiffness: 260,
    damping: 26,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    x.set(0.5);
    y.set(0.5);
  };

  if (shouldReduce) {
    return (
      <div className={cn(className)} {...props}>
        {children}
      </div>
    );
  }

  return (
    <div style={{ perspective: 1000 }} className="inline-block w-full">
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className={cn("relative transition-transform duration-200 ease-out", className)}
      >
        {children}
        {glare && (
          <div
            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-20 transition-opacity"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%)",
            }}
          />
        )}
      </motion.div>
    </div>
  );
}
