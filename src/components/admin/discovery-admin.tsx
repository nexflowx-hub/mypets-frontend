"use client";

import * as React from "react";
import { CheckCircle2, Clipboard, ExternalLink, Loader2, Mail, RefreshCw, Search, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { authApi } from "@/lib/auth-api";
import { getValidSession, onAuthChanged } from "@/lib/auth-client";
import { useUiStore } from "@/lib/stores";

type Envelope<T> = { data: T };

type Candidate = {
  id: string;
  sourceUrl: string;
  sourceType: string;
  title: string | null;
  summary: string | null;
  country: "PT" | "BR" | null;
  city: string | null;
  contactUrl: string | null;
  contactEmail: string | null;
  status: string;
  leadScore: number;
  reviewNotes: string | null;
  discoveredAt: string;
  evidenceCount: number;
  socialCount: number;
  claimCount: number;
};

type CandidateListPayload = {
  candidates: Candidate[];
  counts: Record<string, number>;
};

type DetailPayload = {
  candidate: Candidate;
  evidence: Array<Record<string, unknown>>;
  socialProfiles: Array<Record<string, unknown>>;
  claims: Array<Record<string, unknown>>;
  invites: Array<Record<string, unknown>>;
};

const statuses = ["DISCOVERED", "REVIEWED", "CONTACT_PENDING", "INVITED", "CLAIMED", "VERIFIED", "REJECTED", "DUPLICATE"];

const label: Record<string, string> = {
  DISCOVERED: "Descoberto",
  REVIEWED: "Revisto",
  CONTACT_PENDING: "Contactar",
  INVITED: "Convidado",
  CLAIMED: "Reivindicado",
  VERIFIED: "Verificado",
  REJECTED: "Rejeitado",
  DUPLICATE: "Duplicado",
};

export function DiscoveryAdmin() {
  const setAuthOpen = useUiStore((state) => state.setAuthOpen);
  const [admin, setAdmin] = React.useState<boolean | null>(null);
  const [items, setItems] = React.useState<Candidate[]>([]);
  const [counts, setCounts] = React.useState<Record<string, number>>({});
  const [status, setStatus] = React.useState("");
  const [query, setQuery] = React.useState("");
  const [selected, setSelected] = React.useState<string | null>(null);
  const [detail, setDetail] = React.useState<DetailPayload | null>(null);
  const [busy, setBusy] = React.useState("");
  const [error, setError] = React.useState("");
  const [notice, setNotice] = React.useState("");
  const [claimUrl, setClaimUrl] = React.useState("");

  const load = React.useCallback(async () => {
    setError("");
    const session = await getValidSession();
    if (!session) {
      setAdmin(false);
      setItems([]);
      return;
    }
    try {
      await authApi("/me/admin");
      setAdmin(true);
      const params = new URLSearchParams();
      if (status) params.set("status", status);
      if (query.trim()) params.set("q", query.trim());
      params.set("limit", "100");
      const response = await authApi<Envelope<CandidateListPayload>>(`/admin/discovery/candidates?${params.toString()}`);
      setItems(response.data.candidates);
      setCounts(response.data.counts);
    } catch (err) {
      setAdmin(false);
      setError(err instanceof Error ? err.message : "Não foi possível carregar o Admin.");
    }
  }, [query, status]);

  React.useEffect(() => {
    void load();
    return onAuthChanged(() => void load());
  }, [load]);

  async function loadDetail(id: string) {
    setSelected(id);
    setDetail(null);
    setClaimUrl("");
    setError("");
    try {
      const response = await authApi<Envelope<DetailPayload>>(`/admin/discovery/candidates/${id}`);
      setDetail(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível abrir o candidato.");
    }
  }

  async function updateCandidate(id: string, patch: Record<string, unknown>) {
    setBusy(`candidate:${id}`);
    setError("");
    setNotice("");
    try {
      await authApi(`/admin/discovery/candidates/${id}`, { method: "PATCH", body: JSON.stringify(patch) });
      setNotice("Candidato atualizado.");
      await load();
      if (selected === id) await loadDetail(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível atualizar.");
    } finally {
      setBusy("");
    }
  }

  async function invite(candidate: Candidate) {
    setBusy(`invite:${candidate.id}`);
    setError("");
    setNotice("");
    try {
      const response = await authApi<Envelope<{ claimUrl: string; expiresAt: string }>>(`/admin/discovery/candidates/${candidate.id}/invite`, {
        method: "POST",
        body: JSON.stringify({ contactEmail: candidate.contactEmail || null, expiresInDays: 14 }),
      });
      setClaimUrl(response.data.claimUrl);
      setNotice("Link de reivindicação criado. É válido por 14 dias.");
      await load();
      if (selected === candidate.id) await loadDetail(candidate.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível criar o convite.");
    } finally {
      setBusy("");
    }
  }

  if (admin === null) {
    return <div className="flex min-h-[55vh] items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-coral" /></div>;
  }

  if (!admin) {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 text-center">
        <ShieldCheck className="h-12 w-12 text-coral" />
        <h1 className="mt-5 text-3xl font-extrabold text-petrol">Admin MyPets</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Entre com uma conta autorizada para rever causas descobertas, contactar responsáveis e gerir reivindicações.</p>
        <Button className="mt-6 rounded-xl bg-coral text-white" onClick={() => setAuthOpen(true)}>Entrar</Button>
        {error && <p className="mt-4 text-sm font-medium text-red-700">{error}</p>}
      </section>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 border-b border-border pb-7 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-coral">Discovery Admin</p>
          <h1 className="mt-2 text-3xl font-extrabold text-petrol">Causas e organizações encontradas</h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">Nada descoberto automaticamente é tratado como parceiro ou perfil oficial até revisão, claim e verificação.</p>
        </div>
        <Button variant="outline" className="rounded-xl" onClick={() => void load()}><RefreshCw className="mr-2 h-4 w-4" />Atualizar</Button>
      </div>

      <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
        {statuses.map((value) => (
          <button key={value} onClick={() => setStatus(status === value ? "" : value)} className={`rounded-2xl border p-3 text-left transition ${status === value ? "border-coral bg-coral/5" : "border-border bg-white hover:border-coral/40"}`}>
            <span className="block text-[10px] font-extrabold uppercase tracking-wide text-muted-foreground">{label[value]}</span>
            <span className="mt-1 block text-xl font-extrabold text-petrol">{counts[value] ?? 0}</span>
          </button>
        ))}
      </div>

      <div className="mt-6 flex gap-2">
        <div className="relative flex-1"><Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") void load(); }} placeholder="Pesquisar por nome ou URL" className="h-11 rounded-xl pl-10" /></div>
        <Button variant="outline" className="h-11 rounded-xl" onClick={() => void load()}>Pesquisar</Button>
      </div>

      {(error || notice) && <div className="mt-5">{error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}{notice && <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">{notice}</p>}</div>}

      <div className="mt-7 grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(360px,.75fr)]">
        <div className="space-y-3">
          {items.length === 0 && <p className="rounded-2xl border border-dashed border-border bg-white p-8 text-sm text-muted-foreground">Nenhum candidato corresponde aos filtros.</p>}
          {items.map((candidate) => (
            <article key={candidate.id} className={`rounded-2xl border bg-white p-5 transition ${selected === candidate.id ? "border-coral shadow-md" : "border-border"}`}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2"><Status value={candidate.status} /><span className="text-xs font-bold text-muted-foreground">Score {candidate.leadScore}/100</span>{candidate.country && <span className="text-xs font-bold text-muted-foreground">{candidate.country}{candidate.city ? ` · ${candidate.city}` : ""}</span>}</div>
                  <h2 className="mt-2 truncate text-lg font-extrabold text-petrol">{candidate.title || candidate.sourceUrl}</h2>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{candidate.summary || "Sem resumo extraído."}</p>
                  <div className="mt-3 flex flex-wrap gap-3 text-xs font-semibold text-muted-foreground"><span>{candidate.socialCount} redes</span><span>{candidate.evidenceCount} evidências</span><span>{candidate.claimCount} claims</span></div>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <Button size="sm" variant="outline" className="rounded-xl" onClick={() => void loadDetail(candidate.id)}>Rever</Button>
                  {candidate.status !== "VERIFIED" && candidate.status !== "REJECTED" && candidate.status !== "DUPLICATE" && <Button size="sm" className="rounded-xl bg-coral text-white" disabled={busy === `invite:${candidate.id}`} onClick={() => void invite(candidate)}>{busy === `invite:${candidate.id}` ? "A criar..." : "Convidar"}</Button>}
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-border pt-4">
                <a href={candidate.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-extrabold text-coral hover:underline">Abrir fonte <ExternalLink className="h-3 w-3" /></a>
                {candidate.contactEmail && <a href={`mailto:${candidate.contactEmail}`} className="inline-flex items-center gap-1 text-xs font-extrabold text-petrol hover:underline"><Mail className="h-3 w-3" />{candidate.contactEmail}</a>}
              </div>
            </article>
          ))}
        </div>

        <aside className="h-fit rounded-3xl border border-border bg-white p-5 xl:sticky xl:top-24">
          {!detail ? <p className="py-12 text-center text-sm text-muted-foreground">Selecione “Rever” para abrir os detalhes, redes e evidências.</p> : <CandidateDetail detail={detail} busy={busy} claimUrl={claimUrl} onUpdate={updateCandidate} onInvite={invite} />}
        </aside>
      </div>
    </div>
  );
}

function CandidateDetail({ detail, busy, claimUrl, onUpdate, onInvite }: { detail: DetailPayload; busy: string; claimUrl: string; onUpdate: (id: string, patch: Record<string, unknown>) => Promise<void>; onInvite: (candidate: Candidate) => Promise<void> }) {
  const candidate = detail.candidate;
  const [score, setScore] = React.useState(String(candidate.leadScore ?? 0));
  const [notes, setNotes] = React.useState(candidate.reviewNotes ?? "");
  React.useEffect(() => { setScore(String(candidate.leadScore ?? 0)); setNotes(candidate.reviewNotes ?? ""); }, [candidate.id, candidate.leadScore, candidate.reviewNotes]);

  return (
    <div>
      <div className="flex items-center justify-between gap-3"><Status value={candidate.status} /><span className="text-xs font-bold text-muted-foreground">{candidate.country || "—"}</span></div>
      <h2 className="mt-3 text-xl font-extrabold text-petrol">{candidate.title || "Candidato sem título"}</h2>
      <a href={candidate.sourceUrl} target="_blank" rel="noreferrer" className="mt-2 block break-all text-xs font-bold text-coral hover:underline">{candidate.sourceUrl}</a>

      <div className="mt-5 grid grid-cols-2 gap-3"><div><label className="text-[10px] font-extrabold uppercase tracking-wide text-muted-foreground">Lead score</label><Input type="number" min="0" max="100" value={score} onChange={(event) => setScore(event.target.value)} className="mt-1 h-10 rounded-xl" /></div><div><label className="text-[10px] font-extrabold uppercase tracking-wide text-muted-foreground">Estado</label><select value={candidate.status} onChange={(event) => void onUpdate(candidate.id, { status: event.target.value })} className="mt-1 h-10 w-full rounded-xl border border-border bg-white px-3 text-sm">{statuses.map((value) => <option key={value} value={value}>{label[value]}</option>)}</select></div></div>
      <label className="mt-4 block text-[10px] font-extrabold uppercase tracking-wide text-muted-foreground">Notas internas</label>
      <Textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Qualidade do projeto, legitimidade aparente, prioridade de contacto..." className="mt-1 min-h-28 rounded-xl" />
      <Button variant="outline" className="mt-3 w-full rounded-xl" disabled={busy === `candidate:${candidate.id}`} onClick={() => void onUpdate(candidate.id, { leadScore: Number(score || 0), reviewNotes: notes || null, status: candidate.status === "DISCOVERED" ? "REVIEWED" : candidate.status })}>{busy === `candidate:${candidate.id}` ? "A guardar..." : "Guardar revisão"}</Button>

      <section className="mt-6 border-t border-border pt-5"><h3 className="text-sm font-extrabold text-petrol">Redes encontradas</h3>{detail.socialProfiles.length === 0 ? <p className="mt-2 text-xs text-muted-foreground">Nenhuma rede encontrada neste crawl.</p> : <div className="mt-3 space-y-2">{detail.socialProfiles.map((item) => <a key={String(item.id)} href={String(item.profile_url)} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-xl bg-sand/50 px-3 py-2 text-xs font-bold text-petrol"><span>{String(item.platform)}</span><ExternalLink className="h-3 w-3" /></a>)}</div>}</section>

      <section className="mt-6 border-t border-border pt-5"><h3 className="text-sm font-extrabold text-petrol">Evidências</h3><div className="mt-3 space-y-3">{detail.evidence.slice(0, 8).map((item) => <div key={String(item.id)} className="rounded-xl border border-border p-3"><p className="text-[10px] font-extrabold uppercase tracking-wide text-coral">{String(item.evidence_type)}</p><p className="mt-1 text-xs font-bold text-petrol">{String(item.title || item.source_url)}</p>{item.excerpt ? <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-muted-foreground">{String(item.excerpt)}</p> : null}</div>)}</div></section>

      <section className="mt-6 border-t border-border pt-5"><div className="flex items-center justify-between"><h3 className="text-sm font-extrabold text-petrol">Reivindicação</h3><span className="text-xs text-muted-foreground">{detail.claims.length} pedidos</span></div><Button className="mt-3 w-full rounded-xl bg-coral text-white" disabled={busy === `invite:${candidate.id}`} onClick={() => void onInvite(candidate)}>Gerar link de claim</Button>{claimUrl && <div className="mt-3 rounded-xl bg-emerald-50 p-3"><p className="text-xs font-bold text-emerald-900">Link criado</p><p className="mt-1 break-all text-xs text-emerald-800">{claimUrl}</p><Button size="sm" variant="outline" className="mt-2 rounded-lg" onClick={() => void navigator.clipboard.writeText(claimUrl)}><Clipboard className="mr-1 h-3 w-3" />Copiar</Button></div>}{detail.claims.map((claim) => <div key={String(claim.id)} className="mt-3 rounded-xl border border-border p-3"><div className="flex items-center justify-between"><span className="text-xs font-extrabold text-petrol">{String(claim.display_name || claim.contact_email || "Utilizador")}</span><span className="text-[10px] font-bold text-muted-foreground">{String(claim.status)}</span></div>{claim.message ? <p className="mt-2 text-xs text-muted-foreground">{String(claim.message)}</p> : null}</div>)}</section>
    </div>
  );
}

function Status({ value }: { value: string }) {
  const verified = value === "VERIFIED";
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide ${verified ? "bg-emerald-100 text-emerald-800" : value === "REJECTED" || value === "DUPLICATE" ? "bg-red-50 text-red-700" : "bg-sand text-petrol"}`}>{verified && <CheckCircle2 className="h-3 w-3" />}{label[value] || value}</span>;
}
