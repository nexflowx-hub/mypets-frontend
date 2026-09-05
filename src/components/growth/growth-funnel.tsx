"use client";

import * as React from "react";
import { ArrowRight, CheckCircle2, Copy, HeartHandshake, MessageCircle, Share2, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { createGrowthLead, recordGrowthEvent, savePendingGrowthIntent, type GrowthCampaign, type GrowthTracking } from "@/lib/growth";
import { useUiStore } from "@/lib/stores";

const fieldClass = "h-12 rounded-xl border-border bg-white";
const selectClass = "h-12 w-full rounded-xl border border-border bg-white px-3 text-sm text-ink outline-none focus:ring-2 focus:ring-coral/30";

const INTENT_COPY: Record<GrowthCampaign["intent"], { eyebrow: string; formTitle: string; message: string; benefits: string[] }> = {
  SUPPORT: { eyebrow: "Apoiar", formTitle: "Como gostaria de ajudar?", message: "Conte-nos se prefere divulgar, oferecer tempo, bens ou outro tipo de apoio.", benefits: ["Sem compromisso", "Escolha como participar", "Acompanhe causas reais"] },
  VOLUNTEER: { eyebrow: "Voluntariado", formTitle: "Diga-nos onde pode fazer diferença", message: "Disponibilidade, transporte, acolhimento, fotografia, comunicação, apoio em eventos…", benefits: ["Ajuda perto de si", "Escolha a sua disponibilidade", "Competências também salvam vidas"] },
  SPONSOR: { eyebrow: "Padrinhos MyPets", formTitle: "Quero acompanhar uma história", message: "Se já viu um animal ou causa que gostaria de acompanhar, diga-nos qual.", benefits: ["Relação continuada", "Atualizações da causa", "Apoio financeiro será opcional"] },
  DONATE: { eyebrow: "Apoiar causas", formTitle: "Registe o seu interesse em apoiar", message: "Que tipo de causa gostaria de apoiar?", benefits: ["Causas concretas", "Transparência", "Pagamentos só quando XPAYMENTS estiver ativo"] },
  PROTECTOR: { eyebrow: "Para quem ajuda animais", formTitle: "Conte-nos o essencial", message: "Que trabalho realiza e de que tipo de apoio precisa neste momento?", benefits: ["Perfil público MyPets", "FacePets para os animais", "Necessidades e causas partilháveis"] },
  ADOPT: { eyebrow: "Adoção responsável", formTitle: "Que tipo de adoção procura?", message: "Conte-nos brevemente o que procura e a sua disponibilidade.", benefits: ["Interesse sem compromisso", "Perfis reais", "Acompanhamento responsável"] },
  PROJECT: { eyebrow: "Projetos & parceiros", formTitle: "Apresente o seu projeto", message: "Associação, iniciativa, clínica, empresa ou projeto: conte-nos o que faz e como imagina uma parceria.", benefits: ["Avaliação humana", "Potencial parceria", "Captação e visibilidade"] },
  FOUND_ANIMAL: { eyebrow: "Orientação", formTitle: "Onde encontrou o animal?", message: "Explique a situação e a localização aproximada. Não publique uma morada residencial completa.", benefits: ["Orientação inicial", "Encaminhamento", "Privacidade da localização"] },
};

export function GrowthFunnel({ campaign, tracking }: { campaign: GrowthCampaign; tracking: GrowthTracking }) {
  const openAuth = useUiStore((state) => state.openAuth);
  const copy = INTENT_COPY[campaign.intent];
  const [form, setForm] = React.useState({ name: "", email: "", phone: "", country: campaign.country ?? "PT", city: "", message: "", contactConsent: false, marketingConsent: false, website: "" });
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState("");
  const [leadId, setLeadId] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    void recordGrowthEvent({
      campaignSlug: campaign.slug,
      eventName: "LANDING_VIEW",
      source: tracking.source,
      medium: tracking.medium,
      campaign: tracking.campaign,
      content: tracking.content,
      landingPath: window.location.pathname,
      metadata: { intent: campaign.intent, variant: campaign.landingVariant },
    });
  }, [campaign, tracking]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const result = await createGrowthLead({
        campaignSlug: campaign.slug,
        intent: campaign.intent,
        name: form.name || null,
        email: form.email || null,
        phone: form.phone || null,
        country: form.country,
        city: form.city || null,
        message: form.message || null,
        source: tracking.source,
        medium: tracking.medium,
        campaign: tracking.campaign ?? campaign.slug,
        content: tracking.content,
        term: tracking.term,
        refCode: tracking.refCode,
        landingPath: window.location.pathname,
        contactConsent: form.contactConsent,
        marketingConsent: form.marketingConsent,
        website: form.website,
        metadata: { variant: campaign.landingVariant },
      });
      setLeadId(result.data.id);
      savePendingGrowthIntent(campaign.intent, result.data.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível guardar o contacto.");
    } finally {
      setBusy(false);
    }
  };

  const beginSignup = () => {
    savePendingGrowthIntent(campaign.intent, leadId);
    void recordGrowthEvent({ campaignSlug: campaign.slug, leadId, eventName: "SIGNUP_STARTED", source: tracking.source, medium: tracking.medium, campaign: tracking.campaign ?? campaign.slug, content: tracking.content, landingPath: window.location.pathname });
    openAuth({ mode: "signup", email: form.email });
  };

  const share = async () => {
    const url = new URL(window.location.href);
    if (!url.searchParams.get("utm_source")) url.searchParams.set("utm_source", "share");
    if (!url.searchParams.get("utm_medium")) url.searchParams.set("utm_medium", "organic_social");
    if (!url.searchParams.get("utm_campaign")) url.searchParams.set("utm_campaign", campaign.slug);
    const shareData = { title: campaign.headline, text: campaign.subheadline ?? "Conheça o MyPets", url: url.toString() };
    if (navigator.share) {
      await navigator.share(shareData).catch(() => undefined);
      return;
    }
    await navigator.clipboard.writeText(url.toString());
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const whatsapp = () => {
    const url = new URL(window.location.href);
    url.searchParams.set("utm_source", "whatsapp");
    url.searchParams.set("utm_medium", "organic_social");
    url.searchParams.set("utm_campaign", campaign.slug);
    const text = `${campaign.headline}\n${campaign.subheadline ?? ""}\n${url.toString()}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <main className="min-h-screen bg-cream">
      <section className="bg-petrol text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.75fr)] lg:px-8 lg:py-20">
          <div className="flex flex-col justify-center">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-coral">{copy.eyebrow}</p>
            <h1 className="mt-4 max-w-3xl text-balance text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">{campaign.headline}</h1>
            {campaign.subheadline && <p className="mt-5 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">{campaign.subheadline}</p>}

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {copy.benefits.map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm font-semibold text-white/85"><CheckCircle2 className="mb-2 h-5 w-5 text-coral" />{item}</div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              <Button type="button" variant="outline" onClick={() => void share()} className="rounded-xl border-white/30 bg-white/5 text-white hover:bg-white/10 hover:text-white"><Share2 className="mr-2 h-4 w-4" />Partilhar</Button>
              <Button type="button" variant="outline" onClick={whatsapp} className="rounded-xl border-white/30 bg-white/5 text-white hover:bg-white/10 hover:text-white"><MessageCircle className="mr-2 h-4 w-4" />WhatsApp</Button>
              {copied && <span className="inline-flex items-center text-xs font-bold text-white/70"><Copy className="mr-1.5 h-3.5 w-3.5" />Link copiado</span>}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 text-ink shadow-2xl sm:p-8">
            {!leadId ? (
              <>
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-coral/10 text-coral"><HeartHandshake className="h-5 w-5" /></span>
                  <div><p className="text-xs font-extrabold uppercase tracking-wide text-coral">Onboarding rápido</p><h2 className="text-xl font-extrabold text-petrol">{copy.formTitle}</h2></div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Deixe apenas o necessário. Pode completar o perfil depois.</p>

                <form onSubmit={submit} className="mt-6 grid gap-3 sm:grid-cols-2">
                  <Input placeholder="Nome" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className={`sm:col-span-2 ${fieldClass}`} />
                  <Input type="email" placeholder="Email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className={fieldClass} />
                  <Input inputMode="tel" placeholder="WhatsApp / telefone" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} className={fieldClass} />
                  <select value={form.country} onChange={(event) => setForm({ ...form, country: event.target.value })} className={selectClass}><option value="PT">Portugal</option><option value="BR">Brasil</option></select>
                  <Input placeholder="Cidade" value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} className={fieldClass} />
                  <Textarea placeholder={copy.message} value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} className="min-h-28 rounded-xl border-border sm:col-span-2" />
                  <input tabIndex={-1} autoComplete="off" aria-hidden className="hidden" value={form.website} onChange={(event) => setForm({ ...form, website: event.target.value })} />

                  <label className="flex gap-3 rounded-xl bg-sand/70 p-3 text-xs leading-relaxed text-ink/75 sm:col-span-2">
                    <input required type="checkbox" checked={form.contactConsent} onChange={(event) => setForm({ ...form, contactConsent: event.target.checked })} className="mt-0.5 h-4 w-4 accent-coral" />
                    <span>Autorizo o MyPets a usar estes dados para responder a este pedido ou interesse. Posso pedir a eliminação dos dados.</span>
                  </label>
                  <label className="flex gap-3 px-1 text-xs leading-relaxed text-muted-foreground sm:col-span-2">
                    <input type="checkbox" checked={form.marketingConsent} onChange={(event) => setForm({ ...form, marketingConsent: event.target.checked })} className="mt-0.5 h-4 w-4 accent-coral" />
                    <span>Também quero receber novidades, histórias e oportunidades do MyPets. Opcional.</span>
                  </label>

                  {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 sm:col-span-2">{error}</p>}
                  <Button disabled={busy || (!form.email && !form.phone)} className="h-12 rounded-xl bg-coral font-extrabold text-white hover:bg-coral-dark sm:col-span-2">{busy ? "A guardar..." : campaign.ctaLabel}<ArrowRight className="ml-2 h-4 w-4" /></Button>
                </form>
                <p className="mt-4 flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground"><ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-coral" />Não pedimos documentos, dados bancários ou pagamento neste formulário.</p>
              </>
            ) : (
              <div className="py-5 text-center">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-700"><CheckCircle2 className="h-8 w-8" /></span>
                <h2 className="mt-5 text-2xl font-extrabold text-petrol">Já demos o primeiro passo.</h2>
                <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">O seu interesse ficou registado. Criar uma conta agora permite acompanhar a próxima etapa sem voltar a preencher os mesmos dados.</p>
                <Button onClick={beginSignup} className="mt-6 h-12 w-full rounded-xl bg-coral font-extrabold text-white hover:bg-coral-dark"><Sparkles className="mr-2 h-4 w-4" />Criar conta e continuar</Button>
                <button type="button" onClick={() => void share()} className={cn("mt-4 text-sm font-bold text-coral hover:underline")}>Prefiro partilhar primeiro</button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
