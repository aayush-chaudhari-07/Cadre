import * as React from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  children: React.ReactNode;
  speed?: number;
  pauseOnHover?: boolean;
  className?: string;
}

export function Marquee({
  children,
  speed = 40,
  pauseOnHover = true,
  className,
}: MarqueeProps) {
  const shouldReduce = useReducedMotion();

  if (shouldReduce) {
    return (
      <div className={cn("flex flex-wrap items-center justify-center gap-8 py-4", className)}>
        {children}
      </div>
    );
  }

  return (
    <div
      className={cn("group flex overflow-hidden select-none [mask-image:linear-gradient(to_right,transparent_0%,black_10%,black_90%,transparent_100%)]", className)}
    >
      <div
        className={cn(
          "flex shrink-0 items-center justify-around gap-8 animate-[marquee_var(--duration)_linear_infinite]",
          pauseOnHover && "group-hover:[animation-play-state:paused]",
        )}
        style={{ "--duration": `${speed}s` } as React.CSSProperties}
      >
        {children}
        {children}
      </div>
      <div
        aria-hidden="true"
        className={cn(
          "flex shrink-0 items-center justify-around gap-8 animate-[marquee_var(--duration)_linear_infinite]",
          pauseOnHover && "group-hover:[animation-play-state:paused]",
        )}
        style={{ "--duration": `${speed}s` } as React.CSSProperties}
      >
        {children}
        {children}
      </div>
    </div>
  );
}
