"use client";

import * as React from "react";
import { BadgeCheck, Loader2, LogIn, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { authApi } from "@/lib/auth-api";
import { getValidSession, onAuthChanged } from "@/lib/auth-client";
import { useUiStore } from "@/lib/stores";

type ClaimInfo = {
  title: string | null;
  summary: string | null;
  sourceUrl: string;
  country: string | null;
  city: string | null;
  expiresAt: string;
};

type Props = { token: string; info: ClaimInfo };

export function ClaimClient({ token, info }: Props) {
  const setAuthOpen = useUiStore((state) => state.setAuthOpen);
  const [authenticated, setAuthenticated] = React.useState<boolean | null>(null);
  const [email, setEmail] = React.useState("");
  const [proofUrl, setProofUrl] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState("");
  const [done, setDone] = React.useState(false);

  const check = React.useCallback(async () => {
    const session = await getValidSession();
    setAuthenticated(Boolean(session));
    if (session?.user?.email && !email) setEmail(session.user.email);
  }, [email]);

  React.useEffect(() => {
    void check();
    return onAuthChanged(() => void check());
  }, [check]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      await authApi(`/claim/${encodeURIComponent(token)}`, {
        method: "POST",
        body: JSON.stringify({ contactEmail: email || null, proofUrl: proofUrl || null, message: message || null }),
      });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível enviar a reivindicação.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-7 sm:p-9">
        <BadgeCheck className="h-10 w-10 text-emerald-700" />
        <h2 className="mt-4 text-2xl font-extrabold text-petrol">Reivindicação enviada</h2>
        <p className="mt-3 text-sm leading-relaxed text-emerald-950/75">A equipa MyPets irá rever a relação com esta organização ou causa antes de marcar qualquer informação como oficial. Até lá, nada encontrado automaticamente será apresentado como perfil verificado.</p>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-border bg-white p-6 sm:p-8">
      <div className="flex items-center gap-2 text-coral"><ShieldCheck className="h-5 w-5" /><p className="text-xs font-extrabold uppercase tracking-[0.16em]">Claim Center</p></div>
      <h2 className="mt-3 text-2xl font-extrabold text-petrol">Confirme a sua relação com esta presença</h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">O MyPets encontrou publicamente <strong className="text-petrol">{info.title || info.sourceUrl}</strong>. A reivindicação permite corrigir dados, ligar redes oficiais e, depois da revisão, assumir a gestão da presença.</p>

      {authenticated === null ? <div className="mt-7 flex justify-center"><Loader2 className="h-5 w-5 animate-spin text-coral" /></div> : !authenticated ? (
        <div className="mt-7 rounded-2xl bg-sand/60 p-5">
          <p className="text-sm font-bold text-petrol">Primeiro entre ou crie gratuitamente uma conta MyPets.</p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">Depois do login, este mesmo formulário fica disponível sem perder o link de convite.</p>
          <Button className="mt-4 rounded-xl bg-coral text-white" onClick={() => setAuthOpen(true)}><LogIn className="mr-2 h-4 w-4" />Entrar / criar conta</Button>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-7 space-y-4">
          <div><label className="text-xs font-extrabold text-petrol">Email de contacto</label><Input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1 h-11 rounded-xl" placeholder="email@organizacao.org" /></div>
          <div><label className="text-xs font-extrabold text-petrol">Prova pública opcional</label><Input type="url" value={proofUrl} onChange={(event) => setProofUrl(event.target.value)} className="mt-1 h-11 rounded-xl" placeholder="https://site-ou-rede-social/..." /><p className="mt-1 text-[11px] text-muted-foreground">Por exemplo, uma página oficial onde o seu nome/função seja visível. Não envie documentos de identidade neste campo.</p></div>
          <div><label className="text-xs font-extrabold text-petrol">Mensagem</label><Textarea value={message} onChange={(event) => setMessage(event.target.value)} className="mt-1 min-h-28 rounded-xl" placeholder="Explique brevemente a sua função ou relação com a organização/causa." /></div>
          {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}
          <Button disabled={busy} className="h-12 w-full rounded-xl bg-coral font-extrabold text-white hover:bg-coral-dark">{busy ? "A enviar..." : "Reivindicar esta presença"}</Button>
        </form>
      )}
    </section>
  );
}
