import { useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, LoaderCircle, Mail, UserRound } from "lucide-react";
import { z } from "zod";
import { AuthShell, GoogleSignInButton } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { lovable } from "@/integrations/lovable";
import { supabase } from "@/integrations/supabase/client";
import { setRememberSession } from "@/lib/auth-session";

const signupSearch = z.object({ redirect: z.string().optional() });

export const Route = createFileRoute("/signup")({
  validateSearch: (search) => signupSearch.parse(search),
  head: () => ({
    meta: [
      { title: "Create your account — FlowMind AI" },
      { name: "description", content: "Create a FlowMind AI account for your business growth workspace." },
      { property: "og:title", content: "Create your account — FlowMind AI" },
      { property: "og:description", content: "Create a FlowMind AI account for your business growth workspace." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SignUpPage,
});

function SignUpPage() {
  const { redirect: destination } = Route.useSearch();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [confirmationSent, setConfirmationSent] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: typeof window === "undefined" ? undefined : window.location.origin,
        data: { display_name: displayName.trim() },
      },
    });
    setBusy(false);

    if (signUpError) {
      setError(signUpError.message.includes("already registered")
        ? "An account with this email already exists. Try signing in instead."
        : signUpError.message);
      return;
    }
    if (data.session) {
      setRememberSession(true);
      await navigate({ to: "/" });
      return;
    }
    setConfirmationSent(true);
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
    const safePath = destination?.startsWith("/") && !destination.startsWith("//") ? destination : "/";
    if (safePath === "/" || safePath === "/leads" || safePath === "/revenue" || safePath === "/churn" || safePath === "/meetings" || safePath === "/competitors" || safePath === "/agents" || safePath === "/insights" || safePath === "/ceo" || safePath === "/settings") {
      await navigate({ to: safePath });
    } else {
      await navigate({ to: "/" });
    }
    setBusy(false);
  }

  if (confirmationSent) {
    return (
      <AuthShell>
        <div className="mb-8 grid size-12 place-items-center rounded-2xl border border-success/20 bg-success/10 text-success" aria-hidden="true">
          <Mail className="size-5" />
        </div>
        <p className="text-sm font-semibold text-primary">One last step</p>
        <h2 className="mt-2 font-display text-3xl font-semibold tracking-normal text-foreground">Check your inbox</h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          We sent an account confirmation link to <span className="font-medium text-foreground">{email.trim()}</span>. Confirm your email before signing in.
        </p>
        <Button asChild variant="outline" className="mt-7 h-11 w-full"><Link to="/auth">Back to sign in</Link></Button>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <div className="mb-7">
        <div className="mb-5 grid size-12 place-items-center rounded-2xl border border-primary/15 bg-primary/5 text-primary"><UserRound className="size-5" aria-hidden="true" /></div>
        <p className="text-sm font-semibold text-primary">Get started</p>
        <h2 className="mt-2 font-display text-3xl font-semibold tracking-normal text-foreground">Create your account</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Set up your workspace and meet your AI workforce.</p>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <div className="space-y-2"><Label htmlFor="display-name">Display name</Label><Input id="display-name" autoComplete="name" required minLength={2} maxLength={80} value={displayName} onChange={(event) => setDisplayName(event.target.value)} placeholder="Your name" className="h-11" /></div>
        <div className="space-y-2"><Label htmlFor="email">Work email</Label><div className="relative"><Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" /><Input id="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" className="h-11 pl-10" /></div></div>
        <div className="space-y-2"><Label htmlFor="password">Password</Label><div className="relative"><Input id="password" type={showPassword ? "text" : "password"} autoComplete="new-password" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 8 characters" className="h-11 pr-11" /><Button type="button" variant="ghost" size="icon" aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} onClick={() => setShowPassword((value) => !value)} className="absolute right-1 top-1/2 size-9 -translate-y-1/2 text-muted-foreground">{showPassword ? <EyeOff /> : <Eye />}</Button></div></div>
        {error && <p role="alert" className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2.5 text-sm text-destructive">{error}</p>}
        <Button type="submit" disabled={busy || displayName.trim().length < 2 || !email.trim() || password.length < 8} className="h-11 w-full gap-2 rounded-lg font-semibold">{busy && <LoaderCircle className="animate-spin" aria-hidden="true" />}Create account</Button>
      </form>
      <div className="my-6 flex items-center gap-4"><span className="h-px flex-1 bg-border" /><span className="text-[10px] font-semibold uppercase tracking-[0.13em] text-muted-foreground">Or sign up with</span><span className="h-px flex-1 bg-border" /></div>
      <div className="space-y-3"><GoogleSignInButton onClick={() => void handleOAuth("google")} disabled={busy} /><Button type="button" variant="outline" disabled={busy} onClick={() => void handleOAuth("lovable")} className="h-11 w-full border-border bg-background font-medium">Continue with Lovable</Button></div>
      <p className="mt-7 text-center text-sm text-muted-foreground">Already have an account? <Link to="/auth" search={{ redirect: destination }} className="font-semibold text-primary underline-offset-4 hover:underline">Sign in</Link></p>
    </AuthShell>
  );
}