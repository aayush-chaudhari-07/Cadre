import * as React from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

interface AnimatedBorderProps extends React.HTMLAttributes<HTMLDivElement> {
  containerClassName?: string;
  duration?: number;
}

export function AnimatedBorder({
  children,
  className,
  containerClassName,
  duration = 6,
  ...props
}: AnimatedBorderProps) {
  const shouldReduce = useReducedMotion();

  if (shouldReduce) {
    return (
      <div
        className={cn(
          "rounded-[var(--radius-md)] border-2 border-[var(--primary)] bg-[var(--surface)]",
          containerClassName,
        )}
      >
        <div className={cn("rounded-[calc(var(--radius-md)-2px)]", className)} {...props}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn("relative p-[1px] overflow-hidden rounded-[var(--radius-md)]", containerClassName)}
    >
      <div
        className="absolute inset-[-100%] animate-[spin_6s_linear_infinite]"
        style={{
          animationDuration: `${duration}s`,
          background: "conic-gradient(from 0deg, transparent 0 300deg, var(--primary) 360deg)",
        }}
      />
      <div
        className={cn(
          "relative rounded-[calc(var(--radius-md)-1px)] bg-[var(--surface)]",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}
