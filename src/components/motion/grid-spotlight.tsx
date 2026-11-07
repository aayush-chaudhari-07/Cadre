import * as React from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

interface GridSpotlightProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export function GridSpotlight({
  children,
  className,
  ...props
}: GridSpotlightProps) {
  const shouldReduce = useReducedMotion();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = React.useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduce || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => !shouldReduce && setOpacity(1)}
      onMouseLeave={() => !shouldReduce && setOpacity(0)}
      className={cn("relative overflow-hidden bg-grid", className)}
      {...props}
    >
      {!shouldReduce && (
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300"
          style={{
            opacity,
            background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(45, 226, 166, 0.08), transparent 80%)`,
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
