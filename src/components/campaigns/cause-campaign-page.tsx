import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  HeartHandshake,
  MapPin,
  PawPrint,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { AuthDialog } from "@/components/layout/auth-dialog";
import { CauseCheckout } from "@/components/payments/cause-checkout";
import { ShareActions } from "@/components/share/share-actions";
import { CampaignTracker } from "@/components/campaigns/campaign-tracker";
import {
  CAMPAIGN_VERTICALS,
  campaignRoute,
  getCampaignCause,
  getCampaignConfig,
  getCampaignSummary,
  type CampaignRouteSegment,
} from "@/lib/campaign-landings";

function money(cents: number, currency: "EUR" | "BRL") {
  return new Intl.NumberFormat(currency === "BRL" ? "pt-BR" : "pt-PT", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function dateLabel(value: string) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
}

export async function campaignLandingMetadata(segment: CampaignRouteSegment, campaignKey: string): Promise<Metadata> {
  const summary = await getCampaignSummary(campaignKey);
  const ecosystem = CAMPAIGN_VERTICALS[segment];
  if (!summary || summary.vertical !== ecosystem.vertical) return { title: `${ecosystem.label} | MyPets` };

  const headline = summary.campaignMeta?.headline || summary.title;
  const description = summary.campaignMeta?.subheadline || summary.summary || `Conheça esta campanha ${ecosystem.label}.`;
  const canonical = campaignRoute(segment, campaignKey);

  return {
    title: `${headline} | ${ecosystem.label}`,
    description,
    alternates: { canonical },
    openGraph: {
      title: headline,
      description,
      url: `https://mypets.lat${canonical}`,
      siteName: "MyPets",
      type: "article",
      images: summary.primaryImage ? [{ url: summary.primaryImage }] : [{ url: "/images/hero.jpg", width: 1440, height: 720 }],
    },
  };
}

export async function CauseCampaignPage({ segment, campaignKey }: { segment: CampaignRouteSegment; campaignKey: string }) {
  const ecosystem = CAMPAIGN_VERTICALS[segment];
  const summary = await getCampaignSummary(campaignKey);
  if (!summary || summary.vertical !== ecosystem.vertical) notFound();

  const [cause, config] = await Promise.all([getCampaignCause(summary.slug), getCampaignConfig()]);
  if (!cause || cause.vertical !== ecosystem.vertical) notFound();

  const meta = cause.campaignMeta ?? {};
  const headline = meta.headline || cause.title;
  const subheadline = meta.subheadline || cause.summary;
  const paymentCurrency = cause.currency === "EUR" || cause.currency === "BRL" ? cause.currency : null;
  const financialCause = cause.supportMode !== "NON_FINANCIAL" && Boolean(paymentCurrency);
  const checkoutEnabled = Boolean(
    financialCause &&
      config.paymentsLive &&
      config.embeddedCheckout &&
      config.paymentProvider === "xpayments" &&
      paymentCurrency &&
      (config.paymentCurrencies ?? []).includes(paymentCurrency),
  );
  const progress = cause.targetAmountCents
    ? Math.max(0, Math.min(100, Math.round((cause.raisedAmountCents / cause.targetAmountCents) * 100)))
    : 0;
  const canonicalPath = campaignRoute(segment, campaignKey);
  const sponsorHref = `/join/padrinho?cause_id=${encodeURIComponent(cause.id)}&utm_source=mypets&utm_medium=campaign_landing&utm_campaign=${encodeURIComponent(campaignKey)}&utm_content=sponsor&vertical=${ecosystem.vertical}&src_cta=campaign_sponsor`;

  return (
    <>
      <Suspense fallback={null}>
        <CampaignTracker campaignKey={campaignKey} causeId={cause.id} vertical={ecosystem.vertical} />
      </Suspense>
      <SiteHeader />
      <main className="min-h-screen bg-cream pt-[72px]">
        <section className="relative overflow-hidden bg-petrol text-white">
          {cause.primaryImage && (
            <div className="absolute inset-0">
              <img src={cause.primaryImage} alt="" className="h-full w-full object-cover opacity-28" />
              <div className="absolute inset-0 bg-gradient-to-r from-petrol via-petrol/92 to-petrol/45" />
            </div>
          )}
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,98,88,0.18),transparent_28%)]" />

          <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-8 lg:py-16">
            <div className="flex flex-col justify-center">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs font-extrabold">
                  <BadgeCheck className="h-4 w-4 text-emerald-400" /> Campanha no ecossistema MyPets
                </span>
                {meta.urgencyLabel && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-coral px-3 py-1.5 text-xs font-black text-white">
                    <Sparkles className="h-3.5 w-3.5" /> {meta.urgencyLabel}
                  </span>
                )}
              </div>

              <p className="mt-6 text-xs font-black uppercase tracking-[0.17em] text-coral">{meta.eyebrow || ecosystem.eyebrow}</p>
              <h1 className="mt-2 max-w-4xl text-balance text-4xl font-black leading-[1.02] tracking-[-0.035em] sm:text-5xl lg:text-[62px]">{headline}</h1>
              {subheadline && <p className="mt-5 max-w-2xl text-base leading-7 text-white/76 sm:text-lg">{subheadline}</p>}

              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs font-bold text-white/65">
                <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-coral" />{cause.city ? `${cause.city}, ` : ""}{cause.country}</span>
                {cause.protector && (
                  <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />{cause.protector.displayName}{cause.protector.verification === "VERIFIED" ? " · verificado" : ""}</span>
                )}
                {meta.beneficiaryLabel && <span className="inline-flex items-center gap-1.5"><UsersRound className="h-3.5 w-3.5 text-coral" />{meta.beneficiaryLabel}</span>}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#apoio"
                  data-growth-event="SUPPORT_STARTED"
                  data-growth-content="hero_primary"
                  className="inline-flex min-h-12 items-center gap-2 rounded-full bg-coral px-6 text-sm font-black text-white shadow-[0_14px_30px_-15px_rgba(255,98,88,0.8)] transition hover:-translate-y-0.5 hover:bg-coral-dark"
                >
                  {meta.primaryCtaLabel || "Apoiar esta causa"} <ArrowRight className="h-4 w-4" />
                </a>
                <Link
                  href={sponsorHref}
                  data-growth-event="SPONSORSHIP_STARTED"
                  data-growth-content="hero_sponsor"
                  className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/25 bg-white/8 px-6 text-sm font-black text-white transition hover:bg-white/14"
                >
                  <HeartHandshake className="h-4 w-4" /> {meta.secondaryCtaLabel || "Acompanhar esta história"}
                </Link>
              </div>

              {meta.trustNote && <p className="mt-5 max-w-2xl text-xs leading-5 text-white/55">{meta.trustNote}</p>}
            </div>

            <div className="flex items-end">
              <div className="w-full overflow-hidden rounded-3xl border border-white/12 bg-white/8 shadow-2xl shadow-black/20 backdrop-blur-sm">
                {cause.primaryImage ? (
                  <div className="aspect-[4/3] overflow-hidden"><img src={cause.primaryImage} alt={cause.title} className="h-full w-full object-cover" /></div>
                ) : (
                  <div className="flex aspect-[4/3] items-center justify-center"><PawPrint className="h-16 w-16 text-coral/70" /></div>
                )}
                {cause.targetAmountCents && paymentCurrency && (
                  <div className="p-5 sm:p-6">
                    <div className="flex items-end justify-between gap-4">
                      <div><p className="text-xs font-bold text-white/55">Já mobilizado</p><p className="mt-1 text-2xl font-black">{money(cause.raisedAmountCents, paymentCurrency)}</p></div>
                      <div className="text-right"><p className="text-xs font-bold text-white/55">Meta</p><p className="mt-1 font-black">{money(cause.targetAmountCents, paymentCurrency)}</p></div>
                    </div>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/12"><div className="h-full rounded-full bg-coral" style={{ width: `${progress}%` }} /></div>
                    <p className="mt-2 text-right text-xs font-black text-coral">{progress}%</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-white">
          <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-border px-4 sm:px-6 md:grid-cols-4 lg:px-8">
            <div className="px-3 py-5 text-center"><p className="text-2xl font-black text-petrol">{cause.followers}</p><p className="mt-1 text-[11px] font-bold text-muted-foreground">pessoas acompanhando</p></div>
            <div className="px-3 py-5 text-center"><p className="text-2xl font-black text-petrol">{cause.sponsors}</p><p className="mt-1 text-[11px] font-bold text-muted-foreground">padrinhos / interessados</p></div>
            <div className="px-3 py-5 text-center"><p className="text-2xl font-black text-petrol">{cause.pets.length}</p><p className="mt-1 text-[11px] font-bold text-muted-foreground">animais ligados</p></div>
            <div className="px-3 py-5 text-center"><p className="text-2xl font-black text-petrol">{cause.needs.length}</p><p className="mt-1 text-[11px] font-bold text-muted-foreground">necessidades acompanhadas</p></div>
          </div>
        </section>

        <div className="mx-auto grid max-w-7xl gap-7 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8 lg:py-14">
          <div className="space-y-7">
            {(cause.story || cause.summary) && (
              <section className="rounded-3xl border border-border bg-white p-6 sm:p-8">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-coral">A história por trás da campanha</p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-petrol">Entenda por que este apoio é necessário</h2>
                <div className="mt-5 whitespace-pre-line text-[15px] leading-7 text-ink/80">{cause.story || cause.summary}</div>
              </section>
            )}

            {cause.needs.length > 0 && (
              <section className="rounded-3xl border border-border bg-white p-6 sm:p-8">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-coral">Necessidades atuais</p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-petrol">O que esta campanha precisa resolver</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {cause.needs.map((need) => (
                    <article key={need.id} className="rounded-2xl bg-cream p-5">
                      <p className="text-[10px] font-black uppercase tracking-[0.12em] text-coral">{need.type}</p>
                      <h3 className="mt-2 font-black text-petrol">{need.title}</h3>
                      {need.description && <p className="mt-2 text-sm leading-6 text-muted-foreground">{need.description}</p>}
                    </article>
                  ))}
                </div>
              </section>
            )}

            {meta.videoUrl && (
              <section className="overflow-hidden rounded-3xl border border-border bg-white">
                <div className="p-6 sm:p-8"><p className="text-xs font-black uppercase tracking-[0.16em] text-coral">Veja de perto</p><h2 className="mt-2 text-2xl font-black text-petrol">Vídeo da campanha</h2></div>
                <video controls playsInline preload="metadata" className="aspect-video w-full bg-petrol object-cover"><source src={meta.videoUrl} /></video>
              </section>
            )}

            {(meta.galleryUrls ?? []).length > 0 && (
              <section className="rounded-3xl border border-border bg-white p-6 sm:p-8">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-coral">Registros da campanha</p>
                <h2 className="mt-2 text-2xl font-black text-petrol">Imagens e contexto</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {(meta.galleryUrls ?? []).map((url, index) => <div key={url} className="aspect-[4/3] overflow-hidden rounded-2xl bg-sand"><img src={url} alt={`${cause.title} — imagem ${index + 1}`} loading="lazy" className="h-full w-full object-cover" /></div>)}
                </div>
              </section>
            )}

            {cause.updates.length > 0 && (
              <section className="rounded-3xl border border-border bg-white p-6 sm:p-8">
                <div className="flex items-end justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[0.16em] text-coral">Transparência</p><h2 className="mt-2 text-2xl font-black text-petrol">Atualizações da campanha</h2></div><CalendarDays className="h-6 w-6 text-coral" /></div>
                <div className="mt-6 space-y-5">
                  {cause.updates.map((update) => (
                    <article key={update.id} className="border-l-2 border-coral/30 pl-5">
                      <p className="text-[11px] font-bold text-muted-foreground">{dateLabel(update.createdAt)}</p>
                      {update.title && <h3 className="mt-1 font-black text-petrol">{update.title}</h3>}
                      <p className="mt-2 whitespace-pre-line text-sm leading-6 text-ink/75">{update.body}</p>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside id="apoio" className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-3xl bg-petrol p-6 text-white shadow-[0_24px_50px_-34px_rgba(16,32,42,0.9)]">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-coral">Faça parte desta história</p>
              <h2 className="mt-2 text-2xl font-black">O seu apoio entra pela campanha certa.</h2>
              <p className="mt-3 text-sm leading-6 text-white/65">Origem e campanha são preservadas no checkout. A confirmação financeira só é reconhecida após validação segura no servidor.</p>

              {cause.targetAmountCents && paymentCurrency && (
                <div className="mt-5 rounded-2xl bg-white/8 p-4">
                  <div className="flex items-baseline justify-between gap-3"><p className="text-xl font-black">{money(cause.raisedAmountCents, paymentCurrency)}</p><p className="text-xs font-bold text-white/55">de {money(cause.targetAmountCents, paymentCurrency)}</p></div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/12"><div className="h-full rounded-full bg-coral" style={{ width: `${progress}%` }} /></div>
                </div>
              )}

              <div className="mt-5" data-growth-event="SUPPORT_STARTED" data-growth-content="support_card_checkout">
                {paymentCurrency && <CauseCheckout causeId={cause.id} causeTitle={cause.title} currency={paymentCurrency} enabled={checkoutEnabled} />}
              </div>

              {!checkoutEnabled && (
                <Link href={sponsorHref} data-growth-event="SPONSORSHIP_STARTED" data-growth-content="support_card_sponsor" className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-coral px-5 text-sm font-black text-white transition hover:bg-coral-dark">
                  <HeartHandshake className="h-4 w-4" /> Acompanhar / ser padrinho
                </Link>
              )}

              <div className="mt-5 border-t border-white/10 pt-4"><ShareActions title={cause.title} text={cause.summary ?? "Conheça esta campanha no MyPets."} path={canonicalPath} /></div>
            </div>

            <div className="rounded-3xl border border-border bg-white p-6">
              <p className="text-xs font-black uppercase tracking-[0.15em] text-coral">Camada de confiança</p>
              <div className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
                <p className="flex gap-2"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> Necessidades ligadas à causa e acompanháveis.</p>
                <p className="flex gap-2"><BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-petrol" /> Origem de tráfego preservada para atribuição.</p>
                <p className="flex gap-2"><HeartHandshake className="mt-0.5 h-4 w-4 shrink-0 text-coral" /> Pagamento e confirmação separados do conteúdo editorial.</p>
              </div>
              <Link href={`/projetos/${ecosystem.projectSlug}`} className="mt-5 inline-flex items-center gap-2 text-sm font-black text-coral">Conhecer {ecosystem.label} <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </aside>
        </div>
      </main>
      <SiteFooter />
      <AuthDialog />
    </>
  );
}
