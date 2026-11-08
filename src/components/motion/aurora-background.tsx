import * as React from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

interface AuroraBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export function AuroraBackground({
  children,
  className,
  ...props
}: AuroraBackgroundProps) {
  const shouldReduce = useReducedMotion();

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center overflow-hidden bg-[var(--bg)]",
        className,
      )}
      {...props}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Layer 1: Mint Aurora Blob */}
        <div
          className={cn(
            "absolute -left-20 -top-20 h-96 w-96 rounded-full bg-[var(--primary)]/15 blur-[96px]",
            !shouldReduce && "animate-[pulse_18s_ease-in-out_infinite_alternate]",
          )}
        />
        {/* Layer 2: Cyan Aurora Blob */}
        <div
          className={cn(
            "absolute -right-20 top-20 h-96 w-96 rounded-full bg-[var(--secondary)]/12 blur-[100px]",
            !shouldReduce && "animate-[pulse_24s_ease-in-out_infinite_alternate-reverse]",
          )}
        />
        {/* Layer 3: Gold Core Blob */}
        <div
          className={cn(
            "absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-[var(--gold)]/6 blur-[110px]",
            !shouldReduce && "animate-[pulse_28s_ease-in-out_infinite_alternate]",
          )}
        />
      </div>

      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}
