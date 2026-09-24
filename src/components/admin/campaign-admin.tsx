"use client";

import * as React from "react";
import Link from "next/link";
import { ExternalLink, Loader2, Megaphone, RefreshCw, Search, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { authApi } from "@/lib/auth-api";
import { getValidSession, onAuthChanged } from "@/lib/auth-client";
import { useUiStore } from "@/lib/stores";

type Envelope<T> = { data: T };
type Vertical = "GENERAL" | "FOOD" | "VET" | "RESCUE" | "SHELTER" | "EMERGENCY";

type CampaignMeta = {
  eyebrow?: string | null;
  headline?: string | null;
  subheadline?: string | null;
  urgencyLabel?: string | null;
  beneficiaryLabel?: string | null;
  trustNote?: string | null;
  primaryCtaLabel?: string | null;
  secondaryCtaLabel?: string | null;
  videoUrl?: string | null;
  galleryUrls?: string[];
};

type Cause = {
  id: string;
  protectorId: string;
  protectorName: string | null;
  protectorVerification: string | null;
  slug: string;
  title: string;
  summary: string | null;
  country: string;
  city: string | null;
  primaryImage: string | null;
  supportMode: string;
  targetAmountCents: number | null;
  raisedAmountCents: number;
  currency: string | null;
  status: string;
  isPublic: boolean;
  vertical: Vertical;
  campaignKey: string | null;
  campaignMeta: CampaignMeta;
  publishedAt: string | null;
  updatedAt: string;
};

type ListPayload = { causes: Cause[]; counts: Record<string, number> };

const verticals: Array<{ value: Vertical; label: string; route?: string }> = [
  { value: "GENERAL", label: "Geral" },
  { value: "FOOD", label: "Alimentação" },
  { value: "VET", label: "Vet Help", route: "vet-help" },
  { value: "RESCUE", label: "Rescue", route: "rescue" },
  { value: "SHELTER", label: "Shelter", route: "shelter" },
  { value: "EMERGENCY", label: "Emergency", route: "emergency" },
];
const statuses = ["DRAFT", "ACTIVE", "PAUSED", "FUNDED", "CLOSED"];

function campaignHref(cause: Cause) {
  const route = verticals.find((item) => item.value === cause.vertical)?.route;
  return route && cause.campaignKey ? `/${route}/${cause.campaignKey}` : null;
}

function money(cause: Cause) {
  if (!cause.targetAmountCents || !cause.currency) return "Sem meta financeira";
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: cause.currency }).format(cause.targetAmountCents / 100);
}

function empty(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

export function CampaignAdmin() {
  const setAuthOpen = useUiStore((state) => state.setAuthOpen);
  const [admin, setAdmin] = React.useState<boolean | null>(null);
  const [items, setItems] = React.useState<Cause[]>([]);
  const [counts, setCounts] = React.useState<Record<string, number>>({});
  const [query, setQuery] = React.useState("");
  const [verticalFilter, setVerticalFilter] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("");
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState("");
  const [notice, setNotice] = React.useState("");

  const [vertical, setVertical] = React.useState<Vertical>("GENERAL");
  const [campaignKey, setCampaignKey] = React.useState("");
  const [eyebrow, setEyebrow] = React.useState("");
  const [headline, setHeadline] = React.useState("");
  const [subheadline, setSubheadline] = React.useState("");
  const [urgencyLabel, setUrgencyLabel] = React.useState("");
  const [beneficiaryLabel, setBeneficiaryLabel] = React.useState("");
  const [trustNote, setTrustNote] = React.useState("");
  const [primaryCtaLabel, setPrimaryCtaLabel] = React.useState("");
  const [secondaryCtaLabel, setSecondaryCtaLabel] = React.useState("");
  const [videoUrl, setVideoUrl] = React.useState("");
  const [galleryUrls, setGalleryUrls] = React.useState("");

  const selected = items.find((item) => item.id === selectedId) ?? null;

  function fill(cause: Cause) {
    const meta = cause.campaignMeta ?? {};
    setSelectedId(cause.id);
    setVertical(cause.vertical);
    setCampaignKey(cause.campaignKey ?? "");
    setEyebrow(meta.eyebrow ?? "");
    setHeadline(meta.headline ?? "");
    setSubheadline(meta.subheadline ?? "");
    setUrgencyLabel(meta.urgencyLabel ?? "");
    setBeneficiaryLabel(meta.beneficiaryLabel ?? "");
    setTrustNote(meta.trustNote ?? "");
    setPrimaryCtaLabel(meta.primaryCtaLabel ?? "");
    setSecondaryCtaLabel(meta.secondaryCtaLabel ?? "");
    setVideoUrl(meta.videoUrl ?? "");
    setGalleryUrls((meta.galleryUrls ?? []).join("\n"));
    setNotice("");
    setError("");
  }

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
      const params = new URLSearchParams({ limit: "100" });
      if (query.trim()) params.set("q", query.trim());
      if (verticalFilter) params.set("vertical", verticalFilter);
      if (statusFilter) params.set("status", statusFilter);
      const response = await authApi<Envelope<ListPayload>>(`/admin/campaigns/causes?${params.toString()}`);
      setItems(response.data.causes);
      setCounts(response.data.counts);
      if (selectedId) {
        const refreshed = response.data.causes.find((item) => item.id === selectedId);
        if (refreshed) fill(refreshed);
      }
    } catch (err) {
      setAdmin(false);
      setError(err instanceof Error ? err.message : "Não foi possível carregar as campanhas.");
    }
  }, [query, selectedId, statusFilter, verticalFilter]);

  React.useEffect(() => {
    void load();
    return onAuthChanged(() => void load());
  }, [load]);

  async function save() {
    if (!selected) return;
    if (vertical !== "GENERAL" && vertical !== "FOOD" && !campaignKey.trim()) {
      setError("Defina um campaign key antes de publicar num vertical de aquisição.");
      return;
    }
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const urls = galleryUrls.split(/\r?\n/).map((value) => value.trim()).filter(Boolean);
      if (urls.length > 8) throw new Error("A galeria aceita no máximo 8 imagens.");
      const response = await authApi<Envelope<Cause>>(`/admin/campaigns/causes/${selected.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          vertical,
          campaignKey: empty(campaignKey),
          campaignMeta: {
            eyebrow: empty(eyebrow),
            headline: empty(headline),
            subheadline: empty(subheadline),
            urgencyLabel: empty(urgencyLabel),
            beneficiaryLabel: empty(beneficiaryLabel),
            trustNote: empty(trustNote),
            primaryCtaLabel: empty(primaryCtaLabel),
            secondaryCtaLabel: empty(secondaryCtaLabel),
            videoUrl: empty(videoUrl),
            galleryUrls: urls,
          },
        }),
      });
      setItems((current) => current.map((item) => item.id === response.data.id ? response.data : item));
      fill(response.data);
      setNotice("Configuração da campanha guardada.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível guardar a campanha.");
    } finally {
      setBusy(false);
    }
  }

  if (admin === null) return <div className="flex min-h-[55vh] items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-coral" /></div>;

  if (!admin) {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 text-center">
        <ShieldCheck className="h-12 w-12 text-coral" />
        <h1 className="mt-5 text-3xl font-extrabold text-petrol">Campaign Admin</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Entre com uma conta administrativa para classificar causas e configurar os funis Vet Help, Rescue, Shelter e Emergency.</p>
        <Button className="mt-6 rounded-xl bg-coral text-white" onClick={() => setAuthOpen(true)}>Entrar</Button>
        {error && <p className="mt-4 text-sm font-medium text-red-700">{error}</p>}
      </section>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 border-b border-border pb-7 lg:flex-row lg:items-end lg:justify-between">
        <div><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-coral">MyPets Growth</p><h1 className="mt-2 text-3xl font-extrabold text-petrol">Campanhas e verticais</h1><p className="mt-2 max-w-3xl text-sm text-muted-foreground">Transforme uma causa real numa landing de aquisição sem duplicar dados, checkout ou confirmação financeira.</p></div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/growth" className="inline-flex min-h-10 items-center rounded-xl border border-border bg-white px-4 text-sm font-black text-petrol transition hover:border-coral/40">Growth performance</Link>
          <Button variant="outline" className="rounded-xl" onClick={() => void load()}><RefreshCw className="mr-2 h-4 w-4" />Atualizar</Button>
        </div>
      </div>

      <div className="mt-6 grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {verticals.map((item) => <button key={item.value} onClick={() => setVerticalFilter(verticalFilter === item.value ? "" : item.value)} className={`rounded-2xl border p-3 text-left transition ${verticalFilter === item.value ? "border-coral bg-coral/5" : "border-border bg-white hover:border-coral/40"}`}><span className="block text-[10px] font-extrabold uppercase tracking-wide text-muted-foreground">{item.label}</span><span className="mt-1 block text-xl font-extrabold text-petrol">{counts[item.value] ?? 0}</span></button>)}
      </div>

      <div className="mt-6 grid gap-2 md:grid-cols-[1fr_180px_180px_auto]">
        <div className="relative"><Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") void load(); }} placeholder="Pesquisar causa, slug ou protetor" className="h-11 rounded-xl pl-10" /></div>
        <select value={verticalFilter} onChange={(event) => setVerticalFilter(event.target.value)} className="h-11 rounded-xl border border-border bg-white px-3 text-sm"><option value="">Todos os verticais</option>{verticals.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select>
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="h-11 rounded-xl border border-border bg-white px-3 text-sm"><option value="">Todos os estados</option>{statuses.map((item) => <option key={item} value={item}>{item}</option>)}</select>
        <Button variant="outline" className="h-11 rounded-xl" onClick={() => void load()}>Pesquisar</Button>
      </div>

      {(error || notice) && <div className="mt-5">{error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}{notice && <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">{notice}</p>}</div>}

      <div className="mt-7 grid gap-6 xl:grid-cols-[minmax(0,.8fr)_minmax(520px,1.2fr)]">
        <div className="space-y-3">
          {items.length === 0 && <p className="rounded-2xl border border-dashed border-border bg-white p-8 text-sm text-muted-foreground">Nenhuma causa corresponde aos filtros.</p>}
          {items.map((cause) => {
            const href = campaignHref(cause);
            return <button key={cause.id} onClick={() => fill(cause)} className={`block w-full rounded-2xl border bg-white p-5 text-left transition ${selectedId === cause.id ? "border-coral shadow-md" : "border-border hover:border-coral/35"}`}><div className="flex gap-4">{cause.primaryImage ? <img src={cause.primaryImage} alt="" className="h-20 w-24 rounded-xl object-cover" /> : <div className="flex h-20 w-24 items-center justify-center rounded-xl bg-sand"><Megaphone className="h-5 w-5 text-petrol/40" /></div>}<div className="min-w-0 flex-1"><div className="flex flex-wrap gap-2"><span className="rounded-full bg-petrol/5 px-2 py-1 text-[9px] font-black uppercase text-petrol">{verticals.find((item) => item.value === cause.vertical)?.label}</span><span className="rounded-full bg-coral/8 px-2 py-1 text-[9px] font-black uppercase text-coral">{cause.status}</span></div><h2 className="mt-2 truncate text-base font-extrabold text-petrol">{cause.title}</h2><p className="mt-1 truncate text-xs text-muted-foreground">{cause.protectorName || "Protetor"} · {cause.city || cause.country}</p><p className="mt-2 text-xs font-bold text-petrol">{money(cause)}</p>{href && <span className="mt-2 block truncate text-[10px] font-bold text-coral">mypets.lat{href}</span>}</div></div></button>;
          })}
        </div>

        <aside className="h-fit rounded-3xl border border-border bg-white p-6 xl:sticky xl:top-24">
          {!selected ? <div className="py-16 text-center"><Megaphone className="mx-auto h-10 w-10 text-coral/60" /><p className="mt-4 text-sm text-muted-foreground">Selecione uma causa para configurar o funil.</p></div> : <div>
            <div className="flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-[10px] font-black uppercase tracking-[0.15em] text-coral">{selected.country} {selected.city ? `· ${selected.city}` : ""}</p><h2 className="mt-1 text-2xl font-black text-petrol">{selected.title}</h2><p className="mt-1 text-xs text-muted-foreground">{selected.protectorName || "Protetor"} · {selected.protectorVerification || "sem verificação"}</p></div><div className="flex gap-2"><Link href={`/causas/${selected.slug}`} target="_blank" className="inline-flex h-9 items-center gap-1 rounded-xl border border-border px-3 text-xs font-bold text-petrol">Causa <ExternalLink className="h-3 w-3" /></Link>{campaignHref({ ...selected, vertical, campaignKey: campaignKey || null }) && <Link href={campaignHref({ ...selected, vertical, campaignKey: campaignKey || null })!} target="_blank" className="inline-flex h-9 items-center gap-1 rounded-xl border border-coral/30 px-3 text-xs font-bold text-coral">Landing <ExternalLink className="h-3 w-3" /></Link>}</div></div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2"><Field label="Vertical"><select value={vertical} onChange={(event) => setVertical(event.target.value as Vertical)} className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm">{verticals.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></Field><Field label="Campaign key"><Input value={campaignKey} onChange={(event) => setCampaignKey(event.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))} placeholder="luna-cirurgia" className="h-11 rounded-xl" /></Field></div>
            <div className="mt-4"><Field label="Eyebrow"><Input value={eyebrow} onChange={(event) => setEyebrow(event.target.value)} placeholder="Cirurgia urgente · Goiânia" className="h-11 rounded-xl" /></Field></div>
            <div className="mt-4"><Field label="Headline"><Input value={headline} onChange={(event) => setHeadline(event.target.value)} placeholder="Ajude a Luna a voltar a andar sem dor" className="h-11 rounded-xl" /></Field></div>
            <div className="mt-4"><Field label="Subheadline"><Textarea value={subheadline} onChange={(event) => setSubheadline(event.target.value)} placeholder="Explique o caso em uma frase clara, específica e verificável." className="min-h-24 rounded-xl" /></Field></div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2"><Field label="Urgência"><Input value={urgencyLabel} onChange={(event) => setUrgencyLabel(event.target.value)} placeholder="Cirurgia recomendada para esta semana" className="h-11 rounded-xl" /></Field><Field label="Beneficiário"><Input value={beneficiaryLabel} onChange={(event) => setBeneficiaryLabel(event.target.value)} placeholder="Luna · 4 anos" className="h-11 rounded-xl" /></Field></div>
            <div className="mt-4"><Field label="Nota de confiança"><Input value={trustNote} onChange={(event) => setTrustNote(event.target.value)} placeholder="Caso acompanhado por protetor verificado" className="h-11 rounded-xl" /></Field></div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2"><Field label="CTA principal"><Input value={primaryCtaLabel} onChange={(event) => setPrimaryCtaLabel(event.target.value)} placeholder="Ajudar agora" className="h-11 rounded-xl" /></Field><Field label="CTA secundário"><Input value={secondaryCtaLabel} onChange={(event) => setSecondaryCtaLabel(event.target.value)} placeholder="Compartilhar" className="h-11 rounded-xl" /></Field></div>
            <div className="mt-4"><Field label="Vídeo"><Input value={videoUrl} onChange={(event) => setVideoUrl(event.target.value)} placeholder="https://..." className="h-11 rounded-xl" /></Field></div>
            <div className="mt-4"><Field label="Galeria · uma URL por linha · máximo 8"><Textarea value={galleryUrls} onChange={(event) => setGalleryUrls(event.target.value)} placeholder={"https://.../foto-1.jpg\nhttps://.../foto-2.jpg"} className="min-h-28 rounded-xl font-mono text-xs" /></Field></div>

            <div className="mt-6 rounded-2xl bg-cream p-4"><p className="text-[10px] font-black uppercase tracking-[0.14em] text-petrol/55">Prévia do destino</p><p className="mt-2 break-all text-sm font-black text-petrol">{campaignHref({ ...selected, vertical, campaignKey: campaignKey || null }) ? `https://mypets.lat${campaignHref({ ...selected, vertical, campaignKey: campaignKey || null })}` : "Classifique como VET, RESCUE, SHELTER ou EMERGENCY e defina o campaign key."}</p><p className="mt-2 text-xs leading-5 text-muted-foreground">A landing continua ligada à causa original, às necessidades, atualizações, partilhas e ao checkout MyPets.</p></div>
            <Button className="mt-6 h-12 w-full rounded-xl bg-coral font-extrabold text-white" disabled={busy} onClick={() => void save()}>{busy ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />A guardar...</> : "Guardar campanha"}</Button>
          </div>}
        </aside>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-[10px] font-extrabold uppercase tracking-[0.12em] text-muted-foreground">{label}</span>{children}</label>;
}
