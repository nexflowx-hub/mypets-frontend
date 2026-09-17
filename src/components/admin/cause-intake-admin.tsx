"use client";

import * as React from "react";
import { BadgeCheck, ExternalLink, Loader2, MessageCircle, RefreshCw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { authApi } from "@/lib/auth-api";
import { getValidSession, onAuthChanged } from "@/lib/auth-client";
import { useUiStore } from "@/lib/stores";

type Envelope<T> = { data: T };

type Intake = {
  id: string;
  cause_id: string;
  contact_name: string;
  contact_email: string | null;
  whatsapp: string;
  public_whatsapp: boolean;
  country: string;
  region: string;
  city: string | null;
  cause_type: string;
  instagram_url: string | null;
  facebook_url: string | null;
  tiktok_url: string | null;
  media_links: Array<{ type?: string; url?: string; caption?: string | null }>;
  status: string;
  review_notes_private: string | null;
  created_at: string;
  slug: string;
  title: string;
  summary: string | null;
  verification_status: string;
  fundraising_status: string;
  is_public: boolean;
  protector_id: string | null;
  promotion_status: string | null;
  suggested_caption: string | null;
};

type Promotion = {
  id: string;
  cause_id: string;
  status: string;
  suggested_caption: string | null;
  slug: string;
  title: string;
  summary: string | null;
  country: string;
  region: string | null;
  primary_image: string | null;
};

const intakeStatuses = ["PUBLISHED_UNVERIFIED", "UNDER_REVIEW", "VERIFICATION_REQUESTED", "VERIFIED", "HIDDEN", "REJECTED"];
const promotionStatuses = ["QUEUED", "DRAFTED", "APPROVED", "PUBLISHED", "FAILED", "CANCELLED"];

export function CauseIntakeAdmin() {
  const setAuthOpen = useUiStore((s) => s.setAuthOpen);
  const [admin, setAdmin] = React.useState<boolean | null>(null);
  const [tab, setTab] = React.useState<"intake" | "promotion">("intake");
  const [status, setStatus] = React.useState("");
  const [intakes, setIntakes] = React.useState<Intake[]>([]);
  const [promotions, setPromotions] = React.useState<Promotion[]>([]);
  const [busy, setBusy] = React.useState("");
  const [error, setError] = React.useState("");
  const [notice, setNotice] = React.useState("");
  const [notes, setNotes] = React.useState<Record<string, string>>({});
  const [protectorIds, setProtectorIds] = React.useState<Record<string, string>>({});

  const load = React.useCallback(async () => {
    setError("");
    const session = await getValidSession();
    if (!session) { setAdmin(false); return; }
    try {
      await authApi("/me/admin");
      setAdmin(true);
      if (tab === "intake") {
        const q = status ? `?status=${encodeURIComponent(status)}&limit=100` : "?limit=100";
        const r = await authApi<Envelope<Intake[]>>(`/admin/cause-intake${q}`);
        setIntakes(r.data);
      } else {
        const q = status ? `?status=${encodeURIComponent(status)}&limit=100` : "?limit=100";
        const r = await authApi<Envelope<Promotion[]>>(`/admin/cause-promotion${q}`);
        setPromotions(r.data);
      }
    } catch (err) {
      setAdmin(false);
      setError(err instanceof Error ? err.message : "Não foi possível carregar o painel.");
    }
  }, [status, tab]);

  React.useEffect(() => { void load(); return onAuthChanged(() => void load()); }, [load]);

  async function review(item: Intake, action: string) {
    setBusy(`${item.id}:${action}`); setError(""); setNotice("");
    try {
      await authApi(`/admin/cause-intake/${item.id}/review`, {
        method: "PATCH",
        body: JSON.stringify({ action, note: notes[item.id]?.trim() || null, protectorId: action === "VERIFY_AND_LINK" ? protectorIds[item.id]?.trim() || null : null }),
      });
      setNotice(`Ação ${action} aplicada a ${item.title}.`);
      await load();
    } catch (err) { setError(err instanceof Error ? err.message : "Falha na revisão."); }
    finally { setBusy(""); }
  }

  async function updatePromotion(item: Promotion, next: string) {
    setBusy(`${item.id}:${next}`); setError(""); setNotice("");
    try {
      await authApi(`/admin/cause-promotion/${item.id}`, { method: "PATCH", body: JSON.stringify({ status: next }) });
      setNotice(`Promoção de ${item.title}: ${next}.`);
      await load();
    } catch (err) { setError(err instanceof Error ? err.message : "Falha ao atualizar promoção."); }
    finally { setBusy(""); }
  }

  if (admin === null) return <div className="flex min-h-[55vh] items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-coral" /></div>;
  if (!admin) return <section className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 text-center"><ShieldCheck className="h-12 w-12 text-coral" /><h1 className="mt-5 text-3xl font-black text-petrol">Admin de causas</h1><p className="mt-3 text-sm text-muted-foreground">Entre com uma conta administrativa para rever submissões e gerir promoção.</p><Button className="mt-6 bg-coral text-white" onClick={() => setAuthOpen(true)}>Entrar</Button>{error && <p className="mt-4 text-sm text-red-700">{error}</p>}</section>;

  const choices = tab === "intake" ? intakeStatuses : promotionStatuses;
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 border-b border-border pb-7 lg:flex-row lg:items-end lg:justify-between">
        <div><p className="text-xs font-black uppercase tracking-[.18em] text-coral">Cause Operations</p><h1 className="mt-2 text-3xl font-black text-petrol">Captação, verificação e promoção</h1><p className="mt-2 max-w-3xl text-sm text-muted-foreground">Submissões públicas entram sem captação financeira. A equipa controla verificação, visibilidade e promoção antes de habilitar qualquer fluxo financeiro.</p></div>
        <Button variant="outline" className="rounded-xl" onClick={() => void load()}><RefreshCw className="mr-2 h-4 w-4" />Atualizar</Button>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Button variant={tab === "intake" ? "default" : "outline"} className="rounded-xl" onClick={() => { setTab("intake"); setStatus(""); }}>Submissões</Button>
        <Button variant={tab === "promotion" ? "default" : "outline"} className="rounded-xl" onClick={() => { setTab("promotion"); setStatus(""); }}>Fila de promoção</Button>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-10 rounded-xl border border-border bg-white px-3 text-sm"><option value="">Todos os estados</option>{choices.map((v) => <option key={v} value={v}>{v}</option>)}</select>
      </div>
      {(error || notice) && <div className="mt-5">{error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}{notice && <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">{notice}</p>}</div>}

      {tab === "intake" ? (
        <div className="mt-7 space-y-4">
          {intakes.map((item) => (
            <article key={item.id} className="rounded-3xl border border-border bg-white p-5 sm:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0"><div className="flex flex-wrap gap-2 text-[11px] font-black uppercase tracking-wide"><span className="rounded-full bg-amber-50 px-2.5 py-1 text-amber-800">{item.status}</span><span className="rounded-full bg-sand px-2.5 py-1 text-petrol/70">{item.verification_status}</span><span className="rounded-full bg-sand px-2.5 py-1 text-petrol/70">{item.fundraising_status}</span></div><h2 className="mt-3 text-xl font-black text-petrol">{item.title}</h2><p className="mt-1 text-sm text-muted-foreground">{item.city ? `${item.city} · ` : ""}{item.region} · {item.country} · {item.cause_type}</p><p className="mt-3 text-sm leading-6 text-ink/75">{item.summary}</p></div>
                <a href={`/causas/${item.slug}`} target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center gap-2 text-sm font-black text-coral">Ver causa <ExternalLink className="h-4 w-4" /></a>
              </div>
              <div className="mt-5 grid gap-3 rounded-2xl bg-sand/60 p-4 text-sm sm:grid-cols-3"><div><p className="text-[10px] font-black uppercase text-petrol/45">Responsável</p><p className="mt-1 font-bold text-petrol">{item.contact_name}</p></div><div><p className="text-[10px] font-black uppercase text-petrol/45">WhatsApp</p><a href={`https://wa.me/${item.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 font-bold text-[#159447]"><MessageCircle className="h-4 w-4" />{item.whatsapp}</a></div><div><p className="text-[10px] font-black uppercase text-petrol/45">Email</p><p className="mt-1 break-all font-bold text-petrol">{item.contact_email ?? "—"}</p></div></div>
              <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_320px]"><Textarea value={notes[item.id] ?? item.review_notes_private ?? ""} onChange={(e) => setNotes({ ...notes, [item.id]: e.target.value })} placeholder="Notas internas da revisão" className="min-h-20 rounded-xl" /><Input value={protectorIds[item.id] ?? ""} onChange={(e) => setProtectorIds({ ...protectorIds, [item.id]: e.target.value })} placeholder="Protector UUID para verificar e ligar" className="h-11 rounded-xl" /></div>
              <div className="mt-4 flex flex-wrap gap-2">
                {[["UNDER_REVIEW","Rever"],["REQUEST_VERIFICATION","Solicitar verificação"],["VERIFY_AND_LINK","Verificar + ligar"],["HIDE","Ocultar"],["REJECT","Rejeitar"],["RESTORE","Restaurar"]].map(([action,label]) => <Button key={action} size="sm" variant={action === "VERIFY_AND_LINK" ? "default" : "outline"} className="rounded-xl" disabled={Boolean(busy)} onClick={() => void review(item, action)}>{busy === `${item.id}:${action}` ? "A aplicar..." : label}</Button>)}
              </div>
            </article>
          ))}
          {intakes.length === 0 && <p className="rounded-2xl border border-dashed border-border bg-white p-8 text-sm text-muted-foreground">Sem submissões neste filtro.</p>}
        </div>
      ) : (
        <div className="mt-7 grid gap-4 lg:grid-cols-2">
          {promotions.map((item) => <article key={item.id} className="rounded-3xl border border-border bg-white p-6"><div className="flex items-start justify-between gap-3"><div><span className="rounded-full bg-sand px-2.5 py-1 text-[11px] font-black text-petrol/70">{item.status}</span><h2 className="mt-3 text-lg font-black text-petrol">{item.title}</h2><p className="mt-1 text-xs text-muted-foreground">{item.region ? `${item.region} · ` : ""}{item.country}</p></div><BadgeCheck className="h-5 w-5 text-coral" /></div><p className="mt-4 whitespace-pre-line text-sm leading-6 text-ink/75">{item.suggested_caption ?? item.summary}</p><div className="mt-5 flex flex-wrap gap-2">{promotionStatuses.map((next) => <Button key={next} size="sm" variant={next === item.status ? "default" : "outline"} className="rounded-xl" disabled={Boolean(busy) || next === item.status} onClick={() => void updatePromotion(item, next)}>{next}</Button>)}</div></article>)}
          {promotions.length === 0 && <p className="rounded-2xl border border-dashed border-border bg-white p-8 text-sm text-muted-foreground">Sem itens nesta fila.</p>}
        </div>
      )}
    </div>
  );
}
