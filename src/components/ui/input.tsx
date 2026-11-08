import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", error = false, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-[var(--radius-sm)] border bg-[var(--surface-2)] px-3.5 py-2 text-sm text-[var(--text)] transition-colors",
          "placeholder:text-[var(--text-3)]",
          "border-[var(--border)] hover:border-[var(--text-3)]",
          "focus-ring focus:border-[var(--primary)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-[var(--danger)] focus:border-[var(--danger)] focus-visible:outline-[var(--danger)]",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";
