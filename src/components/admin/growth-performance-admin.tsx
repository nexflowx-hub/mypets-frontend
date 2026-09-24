"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, BarChart3, Check, Copy, Download, Heart, Loader2, MousePointerClick, RefreshCw, Share2, ShieldCheck, WalletCards } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authApi } from "@/lib/auth-api";
import { getValidSession, onAuthChanged } from "@/lib/auth-client";
import { useUiStore } from "@/lib/stores";

type Envelope<T> = { data: T };
type PublicConfig = {
  environment: string;
  paymentsLive: boolean;
  paymentProvider: string | null;
  paymentCurrencies: string[];
  paymentWebhookCurrencies: string[];
  paymentFinalityModes: Record<string, string>;
  paymentNativeMethods: Record<string, string[]>;
  degradedPaymentCurrencies: string[];
  causeIntakeEnabled: boolean;
  growthEnabled: boolean;
};
type Overview = {
  windowDays: number;
  path: string | null;
  totals: {
    landingViews: number;
    supportStarted: number;
    donationStarted: number;
    donationCompleted: number;
    shareClicks: number;
    landingToSupportPct: number;
    supportToDonationStartedPct: number;
    donationCompletionPct: number;
    landingToDonationPct: number;
  };
  amounts: Array<{ currency: string; donationCompleted: number; amountCents: number; averageCents: number }>;
  breakdown: Array<{
    source: string;
    medium: string;
    campaign: string;
    content: string;
    landingPath: string;
    landingViews: number;
    supportStarted: number;
    donationStarted: number;
    donationCompleted: number;
    shareClicks: number;
    amountCents: number;
    landingToDonationPct: number;
    donationCompletionPct: number;
  }>;
  daily: Array<{
    day: string;
    landingViews: number;
    supportStarted: number;
    donationStarted: number;
    donationCompleted: number;
    shareClicks: number;
    amountCents: number;
  }>;
};

function money(cents: number, currency: string) {
  if (currency === "UNKNOWN") return (cents / 100).toFixed(2) + " · moeda não identificada";
  try {
    return new Intl.NumberFormat(currency === "BRL" ? "pt-BR" : "pt-PT", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(cents / 100);
  } catch {
    return (cents / 100).toFixed(2) + " " + currency;
  }
}

export function GrowthPerformanceAdmin() {
  const setAuthOpen = useUiStore((state) => state.setAuthOpen);
  const [admin, setAdmin] = React.useState<boolean | null>(null);
  const [days, setDays] = React.useState(7);
  const [path, setPath] = React.useState("/ajudar");
  const [data, setData] = React.useState<Overview | null>(null);
  const [config, setConfig] = React.useState<PublicConfig | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState("");
  const [copiedLink, setCopiedLink] = React.useState("");

  const load = React.useCallback(async () => {
    setBusy(true);
    setError("");
    try {
      const session = await getValidSession();
      if (!session) {
        setAdmin(false);
        setData(null);
        return;
      }
      await authApi("/me/admin");
      setAdmin(true);
      const params = new URLSearchParams({ days: String(days) });
      if (path.trim()) params.set("path", path.trim());
      const [response, configResponse] = await Promise.all([
        authApi<Envelope<Overview>>("/admin/growth/overview?" + params.toString()),
        authApi<Envelope<PublicConfig>>("/config"),
      ]);
      setData(response.data);
      setConfig(configResponse.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível carregar a performance.");
    } finally {
      setBusy(false);
    }
  }, [days, path]);

  React.useEffect(() => {
    void load();
    return onAuthChanged(() => void load());
  }, [load]);

  if (admin === null) return <div className="flex min-h-[55vh] items-center justify-center"><Loader2 className="h-7 w-7 animate-spin text-coral" /></div>;

  if (!admin) {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 text-center">
        <ShieldCheck className="h-12 w-12 text-coral" />
        <h1 className="mt-5 text-3xl font-black text-petrol">Growth Performance</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">Entre com uma conta administrativa para consultar dados first-party do funil financeiro.</p>
        <Button className="mt-6 rounded-xl bg-coral text-white" onClick={() => setAuthOpen(true)}>Entrar</Button>
      </section>
    );
  }

  const totals = data?.totals;
  const brl = data?.amounts.find((item) => item.currency === "BRL");
  const confirmedKg = path.startsWith("/ajudar/ebooks")
    ? Math.round((brl?.amountCents ?? 0) / 1290)
    : null;
  const launchLinks = [
    {
      id: "meta-institutional",
      label: "Meta · Institucional",
      url: "https://mypets.lat/ajudar?utm_source=meta&utm_medium=paid_social&utm_campaign=mypets_survival_br&utm_content=myp_surv_01",
    },
    {
      id: "meta-petskids",
      label: "Meta · PetsKids",
      url: "https://mypets.lat/ajudar/petskids?utm_source=meta&utm_medium=paid_social&utm_campaign=petskids_story_br&utm_content=pk_story_01",
    },
    {
      id: "meta-ebook-1kg",
      label: "Meta · 1 eBook = 1 kg",
      url: "https://mypets.lat/ajudar/ebooks?utm_source=meta&utm_medium=paid_social&utm_campaign=ebook_racao_1kg_br&utm_content=er_1kg_01",
    },
    {
      id: "instagram-organic",
      label: "Instagram · Orgânico",
      url: "https://mypets.lat/go/ajudar?utm_source=instagram&utm_medium=organic_social&utm_campaign=mypets_support",
    },
    {
      id: "whatsapp-petskids",
      label: "WhatsApp · PetsKids",
      url: "https://mypets.lat/go/petskids?utm_source=whatsapp&utm_medium=referral&utm_campaign=petskids_story",
    },
  ];

  async function copyLaunchLink(id: string, url: string) {
    await navigator.clipboard.writeText(url);
    setCopiedLink(id);
    window.setTimeout(() => setCopiedLink(""), 1800);
  }


  function exportBreakdownCsv() {
    if (!data) return;
    const headers = [
      "source", "medium", "campaign", "content", "landingPath",
      "landingViews", "supportStarted", "donationStarted", "donationCompleted",
      "shareClicks", "amountCents", "landingToDonationPct", "donationCompletionPct",
    ];
    const escape = (value: unknown) => {
      const text = String(value ?? "");
      return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
    };
    const rows = data.breakdown.map((row) => headers.map((key) => escape((row as unknown as Record<string, unknown>)[key])).join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `mypets-growth-${data.windowDays}d.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  const cards = [
    { label: "Landing views", value: totals?.landingViews ?? 0, detail: "Entradas no funil", icon: BarChart3 },
    { label: "Checkout aberto", value: totals?.supportStarted ?? 0, detail: String(totals?.landingToSupportPct ?? 0) + "% das visitas", icon: MousePointerClick },
    { label: "Pix iniciado", value: totals?.donationStarted ?? 0, detail: String(totals?.supportToDonationStartedPct ?? 0) + "% dos checkouts", icon: WalletCards },
    { label: "Apoio confirmado", value: totals?.donationCompleted ?? 0, detail: String(totals?.donationCompletionPct ?? 0) + "% dos intents", icon: Heart },
    { label: "Partilhas", value: totals?.shareClicks ?? 0, detail: "Landing + pós-doação", icon: Share2 },
  ];


  const funnelStages = totals ? [
    {
      id: "landing-support",
      label: "Landing → checkout",
      rate: totals.landingToSupportPct,
      denominator: totals.landingViews,
      action: "Trabalhar hero, promessa, prova, valor pré-selecionado e CTA acima da dobra.",
    },
    {
      id: "support-intent",
      label: "Checkout → Pix",
      rate: totals.supportToDonationStartedPct,
      denominator: totals.supportStarted,
      action: "Rever fricção do formulário, CPF/titular, copy de confiança e seleção de valor.",
    },
    {
      id: "intent-complete",
      label: "Pix → confirmado",
      rate: totals.donationCompletionPct,
      denominator: totals.donationStarted,
      action: "Auditar provider, QR/Copia e Cola, reconciliação, tempo de confirmação e feedback pós-pagamento.",
    },
  ].filter((stage) => stage.denominator > 0) : [];
  const bottleneck = funnelStages.length > 0
    ? [...funnelStages].sort((a, b) => a.rate - b.rate)[0]
    : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-5 border-b border-border pb-7 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-coral">MyPets Growth</p>
          <h1 className="mt-2 text-3xl font-black text-petrol">Performance do funil</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">A conversão principal é pagamento confirmado no backend, não apenas clique ou abertura do checkout.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/ajudar" target="_blank" className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-border bg-white px-3 text-xs font-black text-petrol">Landing A <ArrowUpRight className="h-3.5 w-3.5" /></Link>
            <Link href="/ajudar/petskids" target="_blank" className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-border bg-white px-3 text-xs font-black text-petrol">Landing PetsKids <ArrowUpRight className="h-3.5 w-3.5" /></Link>
            <Link href="/admin/campaigns" className="inline-flex min-h-9 items-center rounded-full border border-border bg-white px-3 text-xs font-black text-petrol">Campanhas</Link>
          </div>
        </div>
        <div className="grid gap-2 sm:grid-cols-[120px_180px_auto]">
          <select value={days} onChange={(event) => setDays(Number(event.target.value))} className="h-11 rounded-xl border border-border bg-white px-3 text-sm font-bold text-petrol">
            <option value={1}>24 horas</option><option value={3}>3 dias</option><option value={7}>7 dias</option><option value={14}>14 dias</option><option value={30}>30 dias</option><option value={90}>90 dias</option>
          </select>
          <select value={path} onChange={(event) => setPath(event.target.value)} className="h-11 rounded-xl border border-border bg-white px-3 text-sm font-bold text-petrol">
            <option value="/ajudar">Todas /ajudar</option><option value="/ajudar/petskids">PetsKids</option><option value="/ajudar/ebooks">1 eBook = 1 kg</option><option value="">Todo o Growth</option>
          </select>
          <div className="flex gap-2">
            <Button variant="outline" className="h-11 flex-1 rounded-xl" disabled={busy} onClick={() => void load()}>
              {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />} Atualizar
            </Button>
            <Button variant="outline" className="h-11 rounded-xl" disabled={!data?.breakdown.length} onClick={exportBreakdownCsv} aria-label="Exportar CSV">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {error && <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}

      <section className="mt-6 rounded-3xl border border-border bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-coral">Launch readiness</p>
            <h2 className="mt-1 text-xl font-black text-petrol">Estado técnico para aquisição paga</h2>
          </div>
          <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wide ${
            config?.paymentsLive && config.paymentCurrencies.includes("BRL") && config.paymentNativeMethods?.BRL?.includes("pix")
              ? "bg-emerald-50 text-emerald-700"
              : "bg-amber-50 text-amber-800"
          }`}>
            {config?.paymentsLive && config.paymentCurrencies.includes("BRL") && config.paymentNativeMethods?.BRL?.includes("pix") ? "Financeiro pronto" : "Verificar financeiro"}
          </span>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
          {[
            ["Ambiente", config?.environment === "production", config?.environment ?? "—"],
            ["Payments", Boolean(config?.paymentsLive), config?.paymentsLive ? "LIVE" : "OFF"],
            ["BRL", Boolean(config?.paymentCurrencies.includes("BRL")), config?.paymentCurrencies.includes("BRL") ? "Ativo" : "Ausente"],
            ["PIX S2S", Boolean(config?.paymentNativeMethods?.BRL?.includes("pix")), config?.paymentNativeMethods?.BRL?.includes("pix") ? "Ativo" : "Ausente"],
            ["Finalidade", config?.paymentFinalityModes?.BRL === "webhook", config?.paymentFinalityModes?.BRL ?? "—"],
            ["Cause intake", Boolean(config?.causeIntakeEnabled), config?.causeIntakeEnabled ? "Ativo" : "OFF"],
          ].map(([label, ok, detail]) => (
            <article key={String(label)} className={`rounded-2xl border p-4 ${ok ? "border-emerald-100 bg-emerald-50/70" : "border-amber-100 bg-amber-50/70"}`}>
              <p className="text-[10px] font-black uppercase tracking-wide text-muted-foreground">{String(label)}</p>
              <p className={`mt-2 text-sm font-black ${ok ? "text-emerald-800" : "text-amber-900"}`}>{String(detail)}</p>
            </article>
          ))}
        </div>
        {config?.degradedPaymentCurrencies?.includes("BRL") && (
          <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-xs font-semibold leading-5 text-amber-900">BRL aparece em modo de finalidade degradada. Não escalar mídia paga até confirmar reconciliação e um PIX real até SUCCEEDED.</p>
        )}
      </section>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map(({ label, value, detail, icon: Icon }) => (
          <article key={label} className="rounded-2xl border border-border bg-white p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-petrol/5 text-petrol"><Icon className="h-5 w-5" /></span>
            <p className="mt-4 text-[10px] font-black uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
            <p className="mt-1 text-3xl font-black text-petrol">{value.toLocaleString("pt-BR")}</p>
            <p className="mt-1 text-xs font-semibold text-muted-foreground">{detail}</p>
          </article>
        ))}
      </div>

      <section className="mt-6 rounded-3xl border border-border bg-white p-5 sm:p-6">
        <div className="grid gap-5 lg:grid-cols-[.72fr_1.28fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-coral">Diagnóstico automático</p>
            <h2 className="mt-1 text-xl font-black text-petrol">Onde o funil está perdendo mais gente?</h2>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">Leitura puramente baseada nas taxas desta janela; não usa benchmark externo.</p>
          </div>
          {bottleneck ? (
            <div className="rounded-2xl bg-amber-50 p-5 ring-1 ring-amber-100">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wide text-amber-700">Maior gargalo observado</p>
                  <p className="mt-1 text-xl font-black text-amber-950">{bottleneck.label}</p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-sm font-black text-amber-900 shadow-sm">{bottleneck.rate}%</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-amber-950/75">{bottleneck.action}</p>
            </div>
          ) : (
            <div className="rounded-2xl bg-sand/60 p-5 text-sm font-semibold text-muted-foreground">Ainda não há eventos suficientes para localizar um gargalo. Primeiro valide o tracking e gere tráfego real.</div>
          )}
        </div>
      </section>

      <div className={`mt-4 grid gap-4 ${confirmedKg !== null ? "md:grid-cols-4" : "md:grid-cols-3"}`}>
        <article className="rounded-3xl bg-petrol p-6 text-white">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-white/55">Conversão final</p>
          <p className="mt-2 text-4xl font-black">{totals?.landingToDonationPct ?? 0}%</p>
          <p className="mt-2 text-sm text-white/65">DONATION_COMPLETED / LANDING_VIEW</p>
        </article>
        <article className="rounded-3xl border border-emerald-100 bg-emerald-50 p-6">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-emerald-700">Valor confirmado · BRL</p>
          <p className="mt-2 text-3xl font-black text-emerald-950">{money(brl?.amountCents ?? 0, "BRL")}</p>
          <p className="mt-2 text-sm text-emerald-900/65">Ticket médio {money(brl?.averageCents ?? 0, "BRL")}</p>
        </article>
        <article className="rounded-3xl border border-border bg-white p-6">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-muted-foreground">Janela analisada</p>
          <p className="mt-2 text-3xl font-black text-petrol">{data?.windowDays ?? days} dias</p>
          <p className="mt-2 truncate text-sm text-muted-foreground">{data?.path ?? "Todo o Growth"}</p>
        </article>
        {confirmedKg !== null && (
          <article className="rounded-3xl border border-emerald-100 bg-emerald-50 p-6">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-emerald-700">Ração confirmada</p>
            <p className="mt-2 text-3xl font-black text-emerald-950">{confirmedKg.toLocaleString("pt-BR")} kg</p>
            <p className="mt-2 text-sm text-emerald-900/65">Derivado apenas de DONATION_COMPLETED desta landing a R$ 12,90/kg.</p>
          </article>
        )}
      </div>

      <section className="mt-8 rounded-3xl border border-border bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-coral">Launch kit</p>
            <h2 className="mt-1 text-xl font-black text-petrol">Links prontos para distribuição</h2>
            <p className="mt-1 text-xs text-muted-foreground">Use URLs diferentes por canal/criativo para preservar atribuição até o pagamento confirmado.</p>
          </div>
          <Link href="/docs" className="hidden text-xs font-bold text-muted-foreground" aria-hidden="true">Docs</Link>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {launchLinks.map((item) => (
            <div key={item.id} className="rounded-2xl border border-border bg-cream/60 p-4">
              <p className="text-xs font-black text-petrol">{item.label}</p>
              <p className="mt-2 break-all font-mono text-[10px] leading-4 text-muted-foreground">{item.url}</p>
              <button
                type="button"
                onClick={() => void copyLaunchLink(item.id, item.url)}
                className="mt-3 inline-flex min-h-9 items-center gap-2 rounded-lg bg-petrol px-3 text-xs font-black text-white"
              >
                {copiedLink === item.id ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedLink === item.id ? "Copiado" : "Copiar link"}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 overflow-hidden rounded-3xl border border-border bg-white">
        <div className="border-b border-border px-5 py-4 sm:px-6"><h2 className="text-xl font-black text-petrol">Campanhas e criativos</h2><p className="mt-1 text-xs text-muted-foreground">Ordenados no backend por conversão e intenção.</p></div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left text-xs">
            <thead className="bg-sand/60 text-[10px] uppercase tracking-wide text-muted-foreground">
              <tr><th className="px-4 py-3">Origem</th><th className="px-4 py-3">Campanha / criativo</th><th className="px-4 py-3">Landing</th><th className="px-4 py-3 text-right">Views</th><th className="px-4 py-3 text-right">Checkout</th><th className="px-4 py-3 text-right">Pix</th><th className="px-4 py-3 text-right">Confirmados</th><th className="px-4 py-3 text-right">CVR</th><th className="px-4 py-3 text-right">Shares</th></tr>
            </thead>
            <tbody>
              {(data?.breakdown ?? []).map((row, index) => (
                <tr key={index} className="border-t border-border/70">
                  <td className="px-4 py-3 font-bold text-petrol">{row.source}<span className="block text-[10px] font-medium text-muted-foreground">{row.medium}</span></td>
                  <td className="px-4 py-3"><span className="font-bold text-petrol">{row.campaign}</span><span className="block max-w-[220px] truncate text-[10px] text-muted-foreground">{row.content}</span></td>
                  <td className="max-w-[250px] truncate px-4 py-3 text-muted-foreground">{row.landingPath}</td>
                  <td className="px-4 py-3 text-right font-bold">{row.landingViews}</td><td className="px-4 py-3 text-right font-bold">{row.supportStarted}</td><td className="px-4 py-3 text-right font-bold">{row.donationStarted}</td><td className="px-4 py-3 text-right font-black text-emerald-700">{row.donationCompleted}</td><td className="px-4 py-3 text-right font-black">{row.landingToDonationPct}%</td><td className="px-4 py-3 text-right font-bold">{row.shareClicks}</td>
                </tr>
              ))}
              {(data?.breakdown.length ?? 0) === 0 && <tr><td colSpan={9} className="px-6 py-12 text-center text-sm text-muted-foreground">Ainda não existem eventos nesta janela/filtro.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-black text-petrol">Série diária</h2>
        <div className="mt-4 grid gap-3">
          {(data?.daily ?? []).map((day) => {
            const max = Math.max(1, ...((data?.daily ?? []).map((item) => item.landingViews)));
            const width = Math.max(4, Math.round((day.landingViews / max) * 100));
            return (
              <article key={day.day} className="grid gap-3 rounded-2xl border border-border bg-white p-4 md:grid-cols-[120px_1fr_auto] md:items-center">
                <div><p className="text-sm font-black text-petrol">{new Date(day.day).toLocaleDateString("pt-BR")}</p><p className="text-[10px] text-muted-foreground">{day.donationCompleted} confirmados</p></div>
                <div><div className="h-2.5 overflow-hidden rounded-full bg-sand"><div className="h-full rounded-full bg-petrol" style={{ width: width + "%" }} /></div><p className="mt-1 text-[10px] text-muted-foreground">{day.landingViews} views · {day.supportStarted} checkouts · {day.donationStarted} intents · {day.shareClicks} shares</p></div>
                <p className="text-sm font-black text-emerald-700">{money(day.amountCents, "BRL")}</p>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
