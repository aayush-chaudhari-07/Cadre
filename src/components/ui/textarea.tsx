import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error = false, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[96px] w-full rounded-[var(--radius-sm)] border bg-[var(--surface-2)] px-3.5 py-2 text-sm text-[var(--text)] transition-colors",
          "placeholder:text-[var(--text-3)]",
          "border-[var(--border)] hover:border-[var(--text-3)]",
          "focus-ring focus:border-[var(--primary)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-[var(--danger)] focus:border-[var(--danger)]",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";
