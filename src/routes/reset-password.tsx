import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, Eye, EyeOff, LoaderCircle, LockKeyhole } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [
    { title: "Choose a new password — FlowMind AI" },
    { name: "description", content: "Securely choose a new password for your FlowMind AI account." },
    { property: "og:title", content: "Choose a new password — FlowMind AI" },
    { property: "og:description", content: "Securely choose a new password for your FlowMind AI account." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [recoverySession, setRecoverySession] = useState(false);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [updated, setUpdated] = useState(false);

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const isRecoveryLink = hashParams.get("type") === "recovery";
    let active = true;

    if (!isRecoveryLink) {
      setChecking(false);
      return () => { active = false; };
    }

    void supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (!active) return;
      setRecoverySession(!sessionError && Boolean(data.session));
      setChecking(false);
    });

    return () => { active = false; };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("The passwords don't match. Please check and try again.");
      return;
    }
    setBusy(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (updateError) {
      setError("We couldn't update your password. The reset link may have expired; request a new one and try again.");
      return;
    }
    setUpdated(true);
  }

  if (checking) {
    return <AuthShell><div className="flex items-center justify-center py-10 text-sm text-muted-foreground"><LoaderCircle className="mr-2 size-4 animate-spin" aria-hidden="true" />Checking your reset link…</div></AuthShell>;
  }

  if (updated) {
    return <AuthShell><div className="mb-5 grid size-12 place-items-center rounded-2xl border border-success/20 bg-success/10 text-success"><CheckCircle2 className="size-5" aria-hidden="true" /></div><p className="text-sm font-semibold text-success">Password updated</p><h2 className="mt-2 font-display text-3xl font-semibold tracking-normal text-foreground">You’re all set</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Your password has been changed. Sign in with your new password.</p><Button className="mt-7 h-11 w-full" onClick={() => void navigate({ to: "/auth" })}>Continue to sign in</Button></AuthShell>;
  }

  if (!recoverySession) {
    return <AuthShell><div className="mb-5 grid size-12 place-items-center rounded-2xl border border-primary/15 bg-primary/5 text-primary"><LockKeyhole className="size-5" aria-hidden="true" /></div><p className="text-sm font-semibold text-primary">Password recovery</p><h2 className="mt-2 font-display text-3xl font-semibold tracking-normal text-foreground">This link isn’t valid</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Request a fresh reset link and open it from your email to choose a new password.</p><Button asChild className="mt-7 h-11 w-full"><Link to="/forgot-password">Request a new link</Link></Button></AuthShell>;
  }

  return (
    <AuthShell>
      <div className="mb-7"><div className="mb-5 grid size-12 place-items-center rounded-2xl border border-primary/15 bg-primary/5 text-primary"><LockKeyhole className="size-5" aria-hidden="true" /></div><p className="text-sm font-semibold text-primary">Account recovery</p><h2 className="mt-2 font-display text-3xl font-semibold tracking-normal text-foreground">Choose a new password</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Use at least 8 characters for your new password.</p></div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2"><Label htmlFor="password">New password</Label><div className="relative"><Input id="password" type={showPassword ? "text" : "password"} autoComplete="new-password" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 8 characters" className="h-11 pr-11" /><Button type="button" variant="ghost" size="icon" aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} onClick={() => setShowPassword((value) => !value)} className="absolute right-1 top-1/2 size-9 -translate-y-1/2 text-muted-foreground">{showPassword ? <EyeOff /> : <Eye />}</Button></div></div>
        <div className="space-y-2"><Label htmlFor="confirm-password">Confirm new password</Label><Input id="confirm-password" type={showPassword ? "text" : "password"} autoComplete="new-password" required minLength={8} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Re-enter your password" className="h-11" /></div>
        {error && <p role="alert" className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2.5 text-sm text-destructive">{error}</p>}
        <Button type="submit" disabled={busy || password.length < 8 || confirmPassword.length < 8} className="h-11 w-full gap-2 rounded-lg font-semibold">{busy && <LoaderCircle className="animate-spin" aria-hidden="true" />}Update password</Button>
      </form>
    </AuthShell>
  );
}