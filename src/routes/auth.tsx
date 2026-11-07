import { useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, LoaderCircle, LockKeyhole, Mail } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { AuthShell, GoogleSignInButton } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { lovable } from "@/integrations/lovable";
import { supabase } from "@/integrations/supabase/client";
import { setRememberSession } from "@/lib/auth-session";

const authSearch = z.object({ redirect: z.string().optional() });
const appDestinations = ["/", "/leads", "/revenue", "/churn", "/meetings", "/competitors", "/agents", "/insights", "/ceo", "/settings"] as const;

function safeDestination(value: string | undefined): (typeof appDestinations)[number] {
  if (!value || typeof window === "undefined") return "/";
  try {
    const url = new URL(value, window.location.origin);
    if (url.origin !== window.location.origin) return "/";
    return appDestinations.find((path) => path === url.pathname) ?? "/";
  } catch {
    return "/";
  }
}

export const Route = createFileRoute("/auth")({
  validateSearch: (search) => authSearch.parse(search),
  head: () => ({
    meta: [
      { title: "Sign in — FlowMind AI" },
      { name: "description", content: "Sign in to your FlowMind AI workspace." },
      { property: "og:title", content: "Sign in — FlowMind AI" },
      { property: "og:description", content: "Access your FlowMind AI workspace." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SignInPage,
});

function SignInPage() {
  const { redirect: destination } = Route.useSearch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setRememberSession(remember);

    const { error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (signInError) {
      setError(signInError.message.includes("Email not confirmed")
        ? "Please confirm your email using the link we sent before signing in."
        : "We couldn't sign you in with those details. Check your email and password and try again.");
      return;
    }

    toast.success("Welcome back");
    await navigate({ to: safeDestination(destination) });
  }

  async function handleOAuth(provider: "google" | "lovable") {
    setBusy(true);
    setError("");
    const result = await lovable.auth.signInWithOAuth(provider, {
      redirect_uri: typeof window === "undefined" ? undefined : window.location.origin,
      ...(provider === "google" ? { extraParams: { prompt: "select_account" } } : {}),
    });
    if (result.error) {
      setBusy(false);
      setError("We couldn't connect to that sign-in provider. Please try again.");
      return;
    }
    if (result.redirected) return;
    await navigate({ to: safeDestination(destination) });
    setBusy(false);
  }

  return (
    <AuthShell>
      <div className="mb-8">
        <div className="mb-5 grid size-12 place-items-center rounded-2xl border border-primary/15 bg-primary/5 text-primary">
          <LockKeyhole className="size-5" aria-hidden="true" />
        </div>
        <p className="text-sm font-semibold text-primary">Welcome back</p>
        <h2 className="mt-2 font-display text-3xl font-semibold tracking-normal text-foreground">Sign in to continue</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Your AI workforce is ready when you are.</p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <div className="space-y-2">
          <Label htmlFor="email">Work email</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input id="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" className="h-11 pl-10" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="password">Password</Label>
            <Link to="/forgot-password" className="text-xs font-semibold text-primary underline-offset-4 hover:underline">Forgot password?</Link>
          </div>
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input id="password" type={showPassword ? "text" : "password"} autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" className="h-11 pl-10 pr-11" />
            <Button type="button" variant="ghost" size="icon" aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} onClick={() => setShowPassword((value) => !value)} className="absolute right-1 top-1/2 size-9 -translate-y-1/2 text-muted-foreground">
              {showPassword ? <EyeOff /> : <Eye />}
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox id="remember" checked={remember} onCheckedChange={(value) => setRemember(value === true)} />
          <Label htmlFor="remember" className="cursor-pointer text-sm font-normal text-muted-foreground">Remember me</Label>
        </div>

        {error && <p role="alert" className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2.5 text-sm text-destructive">{error}</p>}

        <Button type="submit" disabled={busy || !email.trim() || !password} className="h-11 w-full gap-2 rounded-lg font-semibold">
          {busy && <LoaderCircle className="animate-spin" aria-hidden="true" />}
          Sign in
        </Button>
      </form>

      <div className="my-6 flex items-center gap-4">
        <span className="h-px flex-1 bg-border" />
        <span className="text-[10px] font-semibold uppercase tracking-[0.13em] text-muted-foreground">Or continue with</span>
        <span className="h-px flex-1 bg-border" />
      </div>
      <div className="space-y-3">
        <GoogleSignInButton onClick={() => void handleOAuth("google")} disabled={busy} />
        <Button type="button" variant="outline" disabled={busy} onClick={() => void handleOAuth("lovable")} className="h-11 w-full border-border bg-background font-medium">
          Continue with Lovable
        </Button>
      </div>

      <p className="mt-7 text-center text-sm text-muted-foreground">
        New to FlowMind? <Link to="/signup" search={{ redirect: destination }} className="font-semibold text-primary underline-offset-4 hover:underline">Create an account</Link>
      </p>
    </AuthShell>
  );
}