"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PawPrint, Info } from "lucide-react";
import { useLocale } from "@/lib/i18n/locale-context";
import { useUiStore } from "@/lib/stores";

/**
 * Sign-in dialog — demo environment.
 * Production auth (Supabase: email/password, magic link, verification)
 * is documented in docs/architecture.md and wired server-side later.
 */
export function AuthDialog() {
  const { authOpen, setAuthOpen } = useUiStore();
  const { dict } = useLocale();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    // mock latency — real implementation: Supabase Auth signInWithPassword
    await new Promise((r) => setTimeout(r, 700));
    setBusy(false);
    setAuthOpen(false);
  };

  return (
    <Dialog open={authOpen} onOpenChange={setAuthOpen}>
      <DialogContent className="rounded-2xl border-border bg-white p-0 sm:max-w-[400px]">
        <div className="bg-petrol px-6 pb-6 pt-6 text-white sm:rounded-t-2xl">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-coral text-white">
            <PawPrint className="h-5.5 w-5.5" aria-hidden />
          </span>
          <DialogHeader className="mt-3 space-y-1 text-left">
            <DialogTitle className="text-[19px] font-extrabold tracking-tight text-white">
              {dict.auth.title}
            </DialogTitle>
            <DialogDescription className="text-[12.5px] leading-relaxed text-white/65">
              {dict.auth.subtitle}
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-3 px-6 py-6">
          <div>
            <label htmlFor="auth-email" className="mb-1.5 block text-[12px] font-bold text-ink/80">
              {dict.auth.email}
            </label>
            <Input
              id="auth-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ola@exemplo.com"
              autoComplete="email"
              className="h-11 rounded-xl border-border"
            />
          </div>
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="auth-pass" className="text-[12px] font-bold text-ink/80">
                {dict.auth.password}
              </label>
              <button type="button" className="text-[11.5px] font-bold text-coral hover:underline">
                {dict.auth.forgot}
              </button>
            </div>
            <Input
              id="auth-pass"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              className="h-11 rounded-xl border-border"
            />
          </div>

          <Button
            type="submit"
            disabled={busy}
            className="mt-2 h-12 rounded-xl bg-coral text-[14px] font-bold text-white hover:bg-coral-dark disabled:opacity-60"
          >
            {busy ? dict.common.loading : dict.auth.submit}
          </Button>

          <p className="text-center text-[12.5px] text-muted-foreground">
            {dict.auth.noAccount}{" "}
            <button type="button" className="font-bold text-coral hover:underline">
              {dict.auth.signUp}
            </button>
          </p>

          <p className="mt-1 flex items-start gap-2 rounded-xl bg-sand px-3.5 py-3 text-[11.5px] leading-relaxed text-ink/70">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
            {dict.auth.demoNote}
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
