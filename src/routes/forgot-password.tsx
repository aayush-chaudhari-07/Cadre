import { useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, LoaderCircle, Mail } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [
    { title: "Reset your password — FlowMind AI" },
    { name: "description", content: "Request a secure password reset link for your FlowMind AI account." },
    { property: "og:title", content: "Reset your password — FlowMind AI" },
    { property: "og:description", content: "Request a secure password reset link for your FlowMind AI account." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    if (resetError) {
      setError("We couldn't send a reset link right now. Please try again in a moment.");
      return;
    }
    setSent(true);
  }

  return (
    <AuthShell>
      <Button asChild variant="ghost" className="-ml-3 mb-7 gap-2 px-3 text-muted-foreground"><Link to="/auth"><ArrowLeft aria-hidden="true" />Back to sign in</Link></Button>
      <div className="mb-7"><div className="mb-5 grid size-12 place-items-center rounded-2xl border border-primary/15 bg-primary/5 text-primary"><Mail className="size-5" aria-hidden="true" /></div><p className="text-sm font-semibold text-primary">Account recovery</p><h2 className="mt-2 font-display text-3xl font-semibold tracking-normal text-foreground">Forgot your password?</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Enter your account email and we’ll send you a secure reset link.</p></div>
      {sent ? (
        <div role="status" className="rounded-xl border border-success/20 bg-success/5 p-4 text-sm leading-6 text-foreground">If an account exists for <span className="font-semibold">{email.trim()}</span>, a password reset link is on its way. Check your inbox.</div>
      ) : (
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2"><Label htmlFor="email">Work email</Label><Input id="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" className="h-11" /></div>
          {error && <p role="alert" className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2.5 text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={busy || !email.trim()} className="h-11 w-full gap-2 rounded-lg font-semibold">{busy && <LoaderCircle className="animate-spin" aria-hidden="true" />}Send reset link</Button>
        </form>
      )}
    </AuthShell>
  );
}