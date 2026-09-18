"use client";

import * as React from "react";
import {
  AlertTriangle,
  BellRing,
  CheckCircle2,
  CircleDot,
  Loader2,
  MessageCircle,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  Siren,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { authApi } from "@/lib/auth-api";
import { getValidSession, onAuthChanged } from "@/lib/auth-client";
import { useUiStore } from "@/lib/stores";

type Envelope<T> = { data: T };

type AlertSummary = {
  total: number;
  open: number;
  acknowledged: number;
  today: number;
  telegram_failed: number;
};

type AlertConfig = {
  enabled: boolean;
  configured: boolean;
  events: string;
};

type InternalAlert = {
  id: string;
  event_type: string;
  category: "PAYMENT" | "CAUSE" | "SUPPORT" | "MESSAGE" | "LEAD" | "REPORT" | "SYSTEM";
  severity: "INFO" | "NOTICE" | "WARNING" | "CRITICAL";
  title: string;
  summary: string | null;
  entity_type: string | null;
  entity_id: string | null;
  public_url: string | null;
  admin_url: string | null;
  ticket_status: "LOGGED" | "OPEN" | "ACKNOWLEDGED" | "RESOLVED" | "IGNORED";
  action_required: boolean;
  metadata: Record<string, unknown> | null;
  created_at: string;
  telegram_status: string | null;
  telegram_attempts: number | null;
  telegram_sent_at: string | null;
  telegram_last_error: string | null;
};

const statuses = ["", "OPEN", "ACKNOWLEDGED", "LOGGED", "RESOLVED", "IGNORED"];
const categories = ["", "PAYMENT", "CAUSE", "SUPPORT", "MESSAGE", "LEAD", "REPORT", "SYSTEM"];

function categoryLabel(category: InternalAlert["category"]) {
  return {
    PAYMENT: "Pagamento",
    CAUSE: "Causa",
    SUPPORT: "Pedido de apoio",
    MESSAGE: "Mensagem",
    LEAD: "Lead",
    REPORT: "Reporte",
    SYSTEM: "Sistema",
  }[category];
}

function severityClasses(severity: InternalAlert["severity"]) {
  if (severity === "CRITICAL") return "border-red-200 bg-red-50 text-red-800";
  if (severity === "WARNING") return "border-amber-200 bg-amber-50 text-amber-800";
  if (severity === "NOTICE") return "border-blue-200 bg-blue-50 text-blue-800";
  return "border-slate-200 bg-slate-50 text-slate-700";
}

function statusClasses(status: InternalAlert["ticket_status"]) {
  if (status === "OPEN") return "bg-coral/10 text-coral";
  if (status === "ACKNOWLEDGED") return "bg-amber-100 text-amber-800";
  if (status === "RESOLVED") return "bg-emerald-100 text-emerald-800";
  if (status === "IGNORED") return "bg-slate-100 text-slate-600";
  return "bg-blue-50 text-blue-700";
}

function dateLabel(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export function InternalAlertsAdmin() {
  const setAuthOpen = useUiStore((s) => s.setAuthOpen);
  const [admin, setAdmin] = React.useState<boolean | null>(null);
  const [alerts, setAlerts] = React.useState<InternalAlert[]>([]);
  const [summary, setSummary] = React.useState<AlertSummary | null>(null);
  const [config, setConfig] = React.useState<AlertConfig | null>(null);
  const [status, setStatus] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [busy, setBusy] = React.useState("");
  const [error, setError] = React.useState("");
  const [notice, setNotice] = React.useState("");

  const load = React.useCallback(async () => {
    setError("");
    const session = await getValidSession();
    if (!session) {
      setAdmin(false);
      return;
    }
    try {
      await authApi("/me/admin");
      setAdmin(true);
      const params = new URLSearchParams({ limit: "100" });
      if (status) params.set("status", status);
      if (category) params.set("category", category);

      const [alertsResponse, summaryResponse, configResponse] = await Promise.all([
        authApi<Envelope<InternalAlert[]>>(`/admin/internal-alerts?${params.toString()}`),
        authApi<Envelope<AlertSummary>>("/admin/internal-alerts/summary"),
        authApi<Envelope<AlertConfig>>("/admin/internal-alerts/config"),
      ]);

      setAlerts(alertsResponse.data);
      setSummary(summaryResponse.data);
      setConfig(configResponse.data);
    } catch (err) {
      setAdmin(false);
      setError(err instanceof Error ? err.message : "Não foi possível carregar os alertas.");
    }
  }, [status, category]);

  React.useEffect(() => {
    void load();
    return onAuthChanged(() => void load());
  }, [load]);

  async function updateAlert(item: InternalAlert, action: "ACKNOWLEDGE" | "RESOLVE" | "IGNORE" | "REOPEN") {
    setBusy(`${item.id}:${action}`);
    setError("");
    setNotice("");
    try {
      await authApi(`/admin/internal-alerts/${item.id}`, {
        method: "PATCH",
        body: JSON.stringify({ action }),
      });
      setNotice(`Alerta atualizado: ${action}.`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível atualizar o alerta.");
    } finally {
      setBusy("");
    }
  }

  async function retryTelegram(item: InternalAlert) {
    setBusy(`${item.id}:TELEGRAM`);
    setError("");
    setNotice("");
    try {
      await authApi(`/admin/internal-alerts/${item.id}/retry-telegram`, { method: "POST" });
      setNotice("Reenvio Telegram colocado na fila.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível reenviar no Telegram.");
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
        <h1 className="mt-5 text-3xl font-black text-petrol">Alertas internos</h1>
        <p className="mt-3 text-sm text-muted-foreground">Entre com uma conta administrativa para consultar tickets, logs e entregas Telegram.</p>
        <Button className="mt-6 bg-coral text-white" onClick={() => setAuthOpen(true)}>Entrar</Button>
        {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-coral/20 bg-coral/5 px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-coral">
            <BellRing className="h-3.5 w-3.5" />
            Operations
          </div>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-petrol">Tickets e alertas internos</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            Eventos operacionais do MyPets ficam registados aqui. O Telegram funciona como canal de push, mas este histórico continua a ser a fonte auditável.
          </p>
        </div>
        <Button variant="outline" onClick={() => void load()}><RefreshCw className="mr-2 h-4 w-4" />Atualizar</Button>
      </div>

      <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Metric label="Hoje" value={summary?.today ?? 0} icon={<BellRing className="h-5 w-5" />} />
        <Metric label="Abertos" value={summary?.open ?? 0} icon={<Siren className="h-5 w-5" />} />
        <Metric label="Em análise" value={summary?.acknowledged ?? 0} icon={<CircleDot className="h-5 w-5" />} />
        <Metric label="Total" value={summary?.total ?? 0} icon={<CheckCircle2 className="h-5 w-5" />} />
        <Metric label="Falhas Telegram" value={summary?.telegram_failed ?? 0} icon={<AlertTriangle className="h-5 w-5" />} />
      </div>

      <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-border bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <MessageCircle className="h-5 w-5 text-[#229ED9]" />
          <div>
            <p className="text-sm font-black text-petrol">Telegram interno</p>
            <p className="text-xs text-muted-foreground">
              {config?.configured ? "Configurado e pronto para entrega." : config?.enabled ? "Ativado, mas falta configuração." : "Desativado — os tickets continuam a ser registados."}
            </p>
          </div>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-black ${config?.configured ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"}`}>
          {config?.configured ? "ONLINE" : "OFFLINE"}
        </span>
      </div>

      <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-border bg-white p-4 sm:flex-row">
        <label className="flex-1 text-xs font-black uppercase tracking-wide text-muted-foreground">
          Estado
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="mt-2 min-h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-semibold normal-case tracking-normal text-petrol">
            {statuses.map((value) => <option key={value || "ALL"} value={value}>{value || "Todos"}</option>)}
          </select>
        </label>
        <label className="flex-1 text-xs font-black uppercase tracking-wide text-muted-foreground">
          Categoria
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="mt-2 min-h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-semibold normal-case tracking-normal text-petrol">
            {categories.map((value) => <option key={value || "ALL"} value={value}>{value ? categoryLabel(value as InternalAlert["category"]) : "Todas"}</option>)}
          </select>
        </label>
      </div>

      {error && <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800">{error}</div>}
      {notice && <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">{notice}</div>}

      <div className="mt-6 space-y-4">
        {alerts.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-border bg-white p-12 text-center">
            <BellRing className="mx-auto h-9 w-9 text-muted-foreground/50" />
            <p className="mt-4 font-black text-petrol">Nenhum alerta neste filtro.</p>
          </div>
        ) : alerts.map((item) => (
          <article key={item.id} className="rounded-[2rem] border border-border bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full border px-2.5 py-1 text-[11px] font-black ${severityClasses(item.severity)}`}>{item.severity}</span>
                  <span className="rounded-full bg-sand px-2.5 py-1 text-[11px] font-black text-petrol">{categoryLabel(item.category)}</span>
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-black ${statusClasses(item.ticket_status)}`}>{item.ticket_status}</span>
                  {item.action_required && <span className="rounded-full bg-coral/10 px-2.5 py-1 text-[11px] font-black text-coral">AÇÃO NECESSÁRIA</span>}
                </div>
                <h2 className="mt-3 text-xl font-black text-petrol">{item.title}</h2>
                {item.summary && <p className="mt-2 whitespace-pre-line text-sm leading-6 text-muted-foreground">{item.summary}</p>}
                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
                  <span>{dateLabel(item.created_at)}</span>
                  <span>{item.event_type}</span>
                  {item.entity_type && item.entity_id && <span>{item.entity_type} · {item.entity_id}</span>}
                  <span>Telegram: {item.telegram_status ?? "não enfileirado"}</span>
                </div>
                {item.telegram_last_error && <p className="mt-2 text-xs font-semibold text-red-700">Telegram: {item.telegram_last_error}</p>}
              </div>

              <div className="flex shrink-0 flex-wrap gap-2">
                {item.admin_url && <Button asChild size="sm" variant="outline"><a href={item.admin_url}>Abrir</a></Button>}
                {!item.admin_url && item.public_url && <Button asChild size="sm" variant="outline"><a href={item.public_url} target="_blank" rel="noreferrer">Ver</a></Button>}
                {item.ticket_status === "OPEN" && <Button size="sm" variant="outline" disabled={busy !== ""} onClick={() => void updateAlert(item, "ACKNOWLEDGE")}>Assumir</Button>}
                {["OPEN", "ACKNOWLEDGED"].includes(item.ticket_status) && <Button size="sm" className="bg-emerald-700 text-white hover:bg-emerald-800" disabled={busy !== ""} onClick={() => void updateAlert(item, "RESOLVE")}>Resolver</Button>}
                {["RESOLVED", "IGNORED", "LOGGED"].includes(item.ticket_status) && <Button size="sm" variant="outline" disabled={busy !== ""} onClick={() => void updateAlert(item, "REOPEN")}><RotateCcw className="mr-1.5 h-3.5 w-3.5" />Reabrir</Button>}
                {["FAILED", "CANCELLED"].includes(item.telegram_status ?? "") && <Button size="sm" variant="outline" disabled={busy !== ""} onClick={() => void retryTelegram(item)}>Retry Telegram</Button>}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Metric({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
      <div className="text-coral">{icon}</div>
      <p className="mt-3 text-2xl font-black text-petrol">{value}</p>
      <p className="mt-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">{label}</p>
    </div>
  );
}
