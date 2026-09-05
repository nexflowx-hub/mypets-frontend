"use client";

import * as React from "react";
import Link from "next/link";
import { CheckCircle2, KeyRound, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { AuthDialog } from "@/components/layout/auth-dialog";
import { consumeImplicitSessionFromUrl, updatePassword } from "@/lib/auth-client";

type State = "loading" | "ready" | "invalid" | "success";

export default function UpdatePasswordPage() {
  const [state, setState] = React.useState<State>("loading");
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    void (async () => {
      try {
        const session = await consumeImplicitSessionFromUrl();
        setState(session ? "ready" : "invalid");
      } catch {
        setState("invalid");
      }
    })();
  }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("A palavra-passe deve ter pelo menos 8 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("As palavras-passe não coincidem.");
      return;
    }

    setBusy(true);
    try {
      await updatePassword(password);
      setPassword("");
      setConfirm("");
      setState("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível atualizar a palavra-passe.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="flex min-h-screen items-center justify-center bg-cream px-4 py-28">
        <section className="w-full max-w-md overflow-hidden rounded-3xl border border-border bg-white shadow-xl shadow-petrol/5">
          <div className="bg-petrol px-7 py-7 text-white">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-coral"><KeyRound className="h-5 w-5" /></span>
            <h1 className="mt-4 text-2xl font-extrabold tracking-tight">Nova palavra-passe</h1>
            <p className="mt-2 text-sm leading-relaxed text-white/65">Conclua a recuperação da sua conta MyPets.</p>
          </div>

          <div className="p-7">
            {state === "loading" && (
              <div className="flex min-h-48 flex-col items-center justify-center text-center">
                <Loader2 className="h-6 w-6 animate-spin text-coral" />
                <p className="mt-3 text-sm text-muted-foreground">A validar o link de recuperação…</p>
              </div>
            )}

            {state === "invalid" && (
              <div className="py-6 text-center">
                <ShieldCheck className="mx-auto h-9 w-9 text-muted-foreground" />
                <h2 className="mt-4 text-lg font-extrabold text-petrol">Link inválido ou expirado</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Solicite um novo link através de “Esqueci a palavra-passe” no início de sessão.</p>
                <Button asChild className="mt-6 h-11 rounded-xl bg-coral px-6 font-bold text-white hover:bg-coral-dark"><Link href="/">Voltar ao MyPets</Link></Button>
              </div>
            )}

            {state === "ready" && (
              <form onSubmit={submit} className="space-y-4">
                <div>
                  <label htmlFor="new-password" className="mb-1.5 block text-xs font-bold text-ink/80">Nova palavra-passe</label>
                  <Input id="new-password" type="password" autoComplete="new-password" minLength={8} required value={password} onChange={(e) => setPassword(e.target.value)} className="h-11 rounded-xl border-border" />
                </div>
                <div>
                  <label htmlFor="confirm-password" className="mb-1.5 block text-xs font-bold text-ink/80">Confirmar palavra-passe</label>
                  <Input id="confirm-password" type="password" autoComplete="new-password" minLength={8} required value={confirm} onChange={(e) => setConfirm(e.target.value)} className="h-11 rounded-xl border-border" />
                </div>
                {error && <p role="alert" className="rounded-xl bg-red-50 px-3.5 py-3 text-xs font-medium text-red-700">{error}</p>}
                <Button disabled={busy} className="h-12 w-full rounded-xl bg-coral font-bold text-white hover:bg-coral-dark disabled:opacity-60">
                  {busy ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />A atualizar…</> : "Atualizar palavra-passe"}
                </Button>
              </form>
            )}

            {state === "success" && (
              <div className="py-6 text-center">
                <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />
                <h2 className="mt-4 text-lg font-extrabold text-petrol">Palavra-passe atualizada</h2>
                <p className="mt-2 text-sm text-muted-foreground">A sua sessão está ativa e já pode continuar para o dashboard.</p>
                <Button asChild className="mt-6 h-11 rounded-xl bg-coral px-6 font-bold text-white hover:bg-coral-dark"><Link href="/dashboard">Continuar</Link></Button>
              </div>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
      <AuthDialog />
    </>
  );
}
