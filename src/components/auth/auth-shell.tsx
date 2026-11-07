import type { ReactNode } from "react";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-background lg:grid lg:grid-cols-[0.92fr_1.08fr]">
      <section className="relative hidden min-h-screen flex-col justify-between overflow-hidden bg-gradient-primary p-12 text-primary-foreground lg:flex xl:p-16">
        <div className="relative z-10 flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-primary-foreground text-primary shadow-soft">
            <Zap className="size-5" aria-hidden="true" />
          </div>
          <div>
            <p className="font-display text-base font-semibold">FlowMind AI</p>
            <p className="text-xs text-primary-foreground/75">Growth Engine</p>
          </div>
        </div>

        <div className="relative z-10 max-w-lg py-16">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground/75">
            Autonomous business growth
          </p>
          <h1 className="font-display text-4xl font-semibold leading-tight xl:text-5xl">
            A team of AI employees that grows your business automatically.
          </h1>
          <p className="mt-6 max-w-md text-base leading-7 text-primary-foreground/80">
            Your AI workforce, ready when you are.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-xs text-primary-foreground/75">
          <span className="size-2 rounded-full bg-primary-foreground" aria-hidden="true" />
          FlowMind AI · Autonomous Business Growth Engine
        </div>

        <svg
          aria-hidden="true"
          viewBox="0 0 620 560"
          className="pointer-events-none absolute -bottom-24 -right-32 w-[88%] opacity-20"
          fill="none"
        >
          <path d="M18 446C154 378 155 206 291 224s136 171 292 95" stroke="currentColor" strokeWidth="1.5" />
          <path d="M40 500C176 432 177 260 313 278s136 171 292 95" stroke="currentColor" strokeWidth="1.5" />
          <path d="M60 554C196 486 197 314 333 332s136 171 292 95" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="291" cy="224" r="7" fill="currentColor" />
          <circle cx="583" cy="319" r="7" fill="currentColor" />
        </svg>
      </section>

      <section className="flex min-h-screen flex-col px-5 py-8 sm:px-10 lg:px-12">
        <div className="mb-10 flex items-center gap-2.5 lg:hidden">
          <div className="grid size-9 place-items-center rounded-xl bg-gradient-primary text-primary-foreground">
            <Zap className="size-[18px]" aria-hidden="true" />
          </div>
          <span className="font-display text-sm font-semibold">FlowMind AI</span>
        </div>
        <div className="flex flex-1 items-center justify-center py-4">
          <div className="w-full max-w-[430px]">{children}</div>
        </div>
        <p className="pt-8 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} FlowMind AI
        </p>
      </section>
    </main>
  );
}

export function GoogleSignInButton({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      disabled={disabled}
      onClick={onClick}
      className="h-11 w-full gap-2.5 border-[#747775] bg-white px-3 text-sm font-medium text-[#1F1F1F] shadow-none hover:bg-[#F8F9FA] hover:text-[#1F1F1F]"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18">
        <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z" />
        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z" />
        <path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z" />
        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z" />
      </svg>
      <span>Continue with Google</span>
    </Button>
  );
}