"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PawPrint, ShieldCheck } from "lucide-react";
import { useLocale } from "@/lib/i18n/locale-context";
import { useUiStore, type AuthMode } from "@/lib/stores";
import { requestPasswordReset, signIn, signUp } from "@/lib/auth-client";

export function AuthDialog() {
  const { authOpen, setAuthOpen, authMode, authEmail } = useUiStore();
  const { dict, locale } = useLocale();
  const router = useRouter();
  const [mode, setMode] = React.useState<AuthMode>("login");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState("");
  const [message, setMessage] = React.useState("");

  const text = {
    signupTitle: locale === "en" ? "Create your MyPets account" : locale === "pt-BR" ? "Crie sua conta MyPets" : "Crie a sua conta MyPets",
    recoverTitle: locale === "en" ? "Recover access" : locale === "pt-BR" ? "Recuperar acesso" : "Recuperar acesso",
    confirmEmail: locale === "en" ? "Check your email to confirm your account." : locale === "pt-BR" ? "Confira seu e-mail para confirmar sua conta." : "Verifique o seu email para confirmar a conta.",
    resetSent: locale === "en" ? "Password recovery instructions were sent by email." : locale === "pt-BR" ? "Enviamos as instruções de recuperação por e-mail." : "Enviámos as instruções de recuperação por email.",
    back: locale === "en" ? "Back to sign in" : locale === "pt-BR" ? "Voltar ao login" : "Voltar ao login",
    create: locale === "en" ? "Create account" : locale === "pt-BR" ? "Criar conta" : "Criar conta",
    recover: locale === "en" ? "Send recovery email" : locale === "pt-BR" ? "Enviar e-mail de recuperação" : "Enviar email de recuperação",
    secure: locale === "en" ? "Authentication is provided by Supabase Auth. MyPets never exposes database credentials in the browser." : locale === "pt-BR" ? "A autenticação é feita pelo Supabase Auth. O MyPets nunca expõe credenciais do banco de dados no navegador." : "A autenticação é feita pelo Supabase Auth. O MyPets nunca expõe credenciais da base de dados no browser.",
  };

  React.useEffect(() => {
    if (!authOpen) return;
    setMode(authMode);
    if (authEmail) setEmail(authEmail);
    setPassword("");
    setError("");
    setMessage("");
  }, [authOpen, authMode, authEmail]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      if (mode === "login") {
        await signIn(email, password);
        setAuthOpen(false);
        router.push("/dashboard");
        router.refresh();
      } else if (mode === "signup") {
        const result = await signUp(email, password);
        if (result.access_token) {
          setAuthOpen(false);
          router.push("/dashboard");
          router.refresh();
        } else {
          setMessage(text.confirmEmail);
        }
      } else {
        await requestPasswordReset(email);
        setMessage(text.resetSent);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setBusy(false);
    }
  };

  const title = mode === "login" ? dict.auth.title : mode === "signup" ? text.signupTitle : text.recoverTitle;

  return (
    <Dialog open={authOpen} onOpenChange={setAuthOpen}>
      <DialogContent className="rounded-2xl border-border bg-white p-0 sm:max-w-[420px]">
        <div className="bg-petrol px-6 pb-6 pt-6 text-white sm:rounded-t-2xl">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-coral text-white">
            <PawPrint className="h-5.5 w-5.5" aria-hidden />
          </span>
          <DialogHeader className="mt-3 space-y-1 text-left">
            <DialogTitle className="text-[19px] font-extrabold tracking-tight text-white">{title}</DialogTitle>
            <DialogDescription className="text-[12.5px] leading-relaxed text-white/65">{dict.auth.subtitle}</DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-3 px-6 py-6">
          <div>
            <label htmlFor="auth-email" className="mb-1.5 block text-[12px] font-bold text-ink/80">{dict.auth.email}</label>
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

          {mode !== "recover" && (
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="auth-pass" className="text-[12px] font-bold text-ink/80">{dict.auth.password}</label>
                {mode === "login" && (
                  <button type="button" onClick={() => setMode("recover")} className="text-[11.5px] font-bold text-coral hover:underline">
                    {dict.auth.forgot}
                  </button>
                )}
              </div>
              <Input
                id="auth-pass"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                className="h-11 rounded-xl border-border"
              />
            </div>
          )}

          {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-[12px] font-medium text-red-700">{error}</p>}
          {message && <p className="rounded-lg bg-emerald-50 px-3 py-2 text-[12px] font-medium text-emerald-800">{message}</p>}

          <Button type="submit" disabled={busy} className="mt-2 h-12 rounded-xl bg-coral text-[14px] font-bold text-white hover:bg-coral-dark disabled:opacity-60">
            {busy ? dict.common.loading : mode === "login" ? dict.auth.submit : mode === "signup" ? text.create : text.recover}
          </Button>

          {mode === "login" ? (
            <p className="text-center text-[12.5px] text-muted-foreground">
              {dict.auth.noAccount}{" "}
              <button type="button" onClick={() => setMode("signup")} className="font-bold text-coral hover:underline">{dict.auth.signUp}</button>
            </p>
          ) : (
            <button type="button" onClick={() => setMode("login")} className="text-center text-[12.5px] font-bold text-coral hover:underline">{text.back}</button>
          )}

          <p className="mt-1 flex items-start gap-2 rounded-xl bg-sand px-3.5 py-3 text-[11.5px] leading-relaxed text-ink/70">
            <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
            {text.secure}
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
