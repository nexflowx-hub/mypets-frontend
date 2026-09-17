"use client";

import * as React from "react";
import { ArrowRight, CheckCircle2, ExternalLink, HeartHandshake, ImagePlus, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { publishCommunityCause, type CommunityCauseResult, type CommunityCauseType } from "@/lib/cause-intake";

const typeOptions: Array<{ value: CommunityCauseType; label: string }> = [
  { value: "VET_HELP", label: "Tratamento veterinário" },
  { value: "RESCUE", label: "Resgate" },
  { value: "SHELTER", label: "Abrigo / protetor" },
  { value: "FEEDING", label: "Alimentação" },
  { value: "ADOPTION", label: "Adoção" },
  { value: "EMERGENCY", label: "Emergência coletiva" },
  { value: "NGO_PROJECT", label: "ONG / associação / projeto" },
  { value: "OTHER", label: "Outro" },
];

const countries = [
  ["BR", "Brasil"], ["PT", "Portugal"], ["ES", "Espanha"], ["FR", "França"], ["GB", "Reino Unido"],
  ["DE", "Alemanha"], ["IT", "Itália"], ["NL", "Países Baixos"], ["BE", "Bélgica"], ["IE", "Irlanda"],
  ["AT", "Áustria"], ["LU", "Luxemburgo"], ["CH", "Suíça"], ["US", "Estados Unidos"], ["CA", "Canadá"],
] as const;

const field = "h-12 rounded-xl border-border bg-white";
const select = "h-12 w-full rounded-xl border border-border bg-white px-3 text-sm text-ink outline-none focus:ring-2 focus:ring-coral/30";

function cleanUrl(value: string) {
  return value.trim() || null;
}

export function CommunityCauseIntake({ initialType = "OTHER" }: { initialType?: CommunityCauseType }) {
  const [form, setForm] = React.useState({
    projectName: "",
    contactName: "",
    contactEmail: "",
    whatsapp: "",
    publicWhatsapp: false,
    country: "BR",
    region: "",
    city: "",
    causeType: initialType,
    details: "",
    publicMessage: "",
    instagramUrl: "",
    facebookUrl: "",
    tiktokUrl: "",
    primaryImageUrl: "",
    mediaLinks: "",
    contactConsent: false,
    publicationConsent: false,
    accuracyConfirmed: false,
    marketingConsent: false,
    website: "",
  });
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState("");
  const [result, setResult] = React.useState<CommunityCauseResult | null>(null);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const links = form.mediaLinks
        .split(/\n+/)
        .map((value) => value.trim())
        .filter(Boolean)
        .slice(0, 8)
        .map((url) => ({ type: "LINK" as const, url, caption: null }));
      const response = await publishCommunityCause({
        projectName: form.projectName,
        contactName: form.contactName,
        contactEmail: cleanUrl(form.contactEmail),
        whatsapp: form.whatsapp,
        publicWhatsapp: form.publicWhatsapp,
        country: form.country,
        region: form.region,
        city: cleanUrl(form.city),
        causeType: form.causeType,
        details: form.details,
        publicMessage: form.publicMessage,
        instagramUrl: cleanUrl(form.instagramUrl),
        facebookUrl: cleanUrl(form.facebookUrl),
        tiktokUrl: cleanUrl(form.tiktokUrl),
        primaryImageUrl: cleanUrl(form.primaryImageUrl),
        mediaLinks: links,
        source: new URLSearchParams(window.location.search).get("utm_source"),
        medium: new URLSearchParams(window.location.search).get("utm_medium"),
        campaign: new URLSearchParams(window.location.search).get("utm_campaign"),
        content: new URLSearchParams(window.location.search).get("utm_content"),
        landingPath: `${window.location.pathname}${window.location.search}`.slice(0, 500),
        contactConsent: true,
        publicationConsent: true,
        accuracyConfirmed: true,
        marketingConsent: form.marketingConsent,
        website: form.website,
      });
      setResult(response);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível publicar a causa.");
    } finally {
      setBusy(false);
    }
  };

  if (result) {
    return (
      <div className="rounded-[2rem] border border-emerald-200 bg-white p-6 shadow-sm sm:p-8">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-700"><CheckCircle2 className="h-7 w-7" /></span>
        <p className="mt-6 text-xs font-black uppercase tracking-[0.16em] text-emerald-700">Publicada</p>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-petrol">A sua causa já tem presença no MyPets.</h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">Ela entrou como conteúdo enviado pela comunidade, com pagamentos desativados até verificação. Também entrou na fila editorial para promoção nos canais MyPets.</p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-sand p-4"><p className="text-xs font-black uppercase text-petrol/45">Confiança</p><p className="mt-1 font-black text-petrol">Ainda não verificada</p></div>
          <div className="rounded-2xl bg-sand p-4"><p className="text-xs font-black uppercase text-petrol/45">Apoios financeiros</p><p className="mt-1 font-black text-petrol">Desativados</p></div>
          <div className="rounded-2xl bg-sand p-4"><p className="text-xs font-black uppercase text-petrol/45">Promoção</p><p className="mt-1 font-black text-petrol">Na fila editorial</p></div>
        </div>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <a href={result.publicUrl} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-petrol px-5 text-sm font-black text-white hover:bg-petrol/90">Ver causa publicada <ExternalLink className="h-4 w-4" /></a>
          <a href={result.verificationWhatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#20b65a] px-5 text-sm font-black text-white hover:bg-[#19994b]"><MessageCircle className="h-4 w-4" /> Solicitar selo e captação</a>
        </div>

        <div className="mt-7 rounded-2xl border border-coral/20 bg-coral/5 p-5">
          <div className="flex gap-3"><Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-coral" /><div><p className="font-black text-petrol">Próximo nível: MyPets Verificado</p><p className="mt-1 text-sm leading-6 text-muted-foreground">A nossa equipa valida o responsável, documentos e dados necessários. Depois disso podemos preparar a habilitação financeira, painel de valores a repassar e payouts através dos prestadores de pagamento integrados.</p></div></div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <section className="rounded-[2rem] border border-border bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-start gap-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-coral/10 text-coral"><HeartHandshake className="h-5 w-5" /></span><div><p className="text-xs font-black uppercase tracking-[0.14em] text-coral">1 · A causa</p><h2 className="mt-1 text-2xl font-black text-petrol">Conte o essencial para quem vai conhecer a história.</h2></div></div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2"><label className="text-xs font-black text-petrol">Nome do projeto / causa</label><Input required minLength={4} maxLength={160} value={form.projectName} onChange={(e) => setForm({ ...form, projectName: e.target.value })} placeholder="Ex.: Ajuda para tratamento da Luna" className={`mt-2 ${field}`} /></div>
          <div><label className="text-xs font-black text-petrol">Tipo de causa</label><select value={form.causeType} onChange={(e) => setForm({ ...form, causeType: e.target.value as CommunityCauseType })} className={`mt-2 ${select}`}>{typeOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></div>
          <div><label className="text-xs font-black text-petrol">País</label><select value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className={`mt-2 ${select}`}>{countries.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
          <div><label className="text-xs font-black text-petrol">Região / Estado</label><Input required value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} placeholder="Ex.: Goiás" className={`mt-2 ${field}`} /></div>
          <div><label className="text-xs font-black text-petrol">Cidade</label><Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Ex.: Anápolis" className={`mt-2 ${field}`} /></div>
          <div className="sm:col-span-2"><label className="text-xs font-black text-petrol">Descritivo / detalhes</label><Textarea required minLength={40} maxLength={8000} value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })} placeholder="Explique o que aconteceu, quem está a cuidar, de que apoio precisa e qualquer contexto importante." className="mt-2 min-h-40 rounded-xl border-border" /></div>
          <div className="sm:col-span-2"><label className="text-xs font-black text-petrol">Mensagem principal para o site MyPets</label><Textarea required minLength={20} maxLength={500} value={form.publicMessage} onChange={(e) => setForm({ ...form, publicMessage: e.target.value })} placeholder="Uma mensagem curta, humana e objetiva que aparecerá em destaque na página pública." className="mt-2 min-h-28 rounded-xl border-border" /></div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-border bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-start gap-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#eef8f7] text-[#0d6e6b]"><ImagePlus className="h-5 w-5" /></span><div><p className="text-xs font-black uppercase tracking-[0.14em] text-[#0d6e6b]">2 · Provas sociais e media</p><h2 className="mt-1 text-2xl font-black text-petrol">Ligue a causa ao que já existe nas redes.</h2></div></div>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">Os links ficam identificados como informações fornecidas na submissão até serem verificados pelo MyPets. Para ficheiros grandes ou vídeos sem URL pública, pode enviá-los por WhatsApp depois de publicar.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Input type="url" value={form.instagramUrl} onChange={(e) => setForm({ ...form, instagramUrl: e.target.value })} placeholder="https://instagram.com/..." className={field} />
          <Input type="url" value={form.facebookUrl} onChange={(e) => setForm({ ...form, facebookUrl: e.target.value })} placeholder="https://facebook.com/..." className={field} />
          <Input type="url" value={form.tiktokUrl} onChange={(e) => setForm({ ...form, tiktokUrl: e.target.value })} placeholder="https://tiktok.com/@..." className={field} />
          <Input type="url" value={form.primaryImageUrl} onChange={(e) => setForm({ ...form, primaryImageUrl: e.target.value })} placeholder="Link público da imagem principal" className={field} />
          <div className="sm:col-span-2"><label className="text-xs font-black text-petrol">Outros links de fotos, vídeos ou publicações</label><Textarea value={form.mediaLinks} onChange={(e) => setForm({ ...form, mediaLinks: e.target.value })} placeholder="Um link por linha (até 8)" className="mt-2 min-h-28 rounded-xl border-border" /></div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-border bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-start gap-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sand text-petrol"><MessageCircle className="h-5 w-5" /></span><div><p className="text-xs font-black uppercase tracking-[0.14em] text-petrol/55">3 · Responsável</p><h2 className="mt-1 text-2xl font-black text-petrol">Um contacto privado para podermos falar consigo.</h2></div></div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Input required value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} placeholder="Nome do responsável" className={field} />
          <Input required inputMode="tel" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} placeholder="WhatsApp com DDI" className={field} />
          <Input type="email" value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} placeholder="Email (opcional)" className={`sm:col-span-2 ${field}`} />
          <input tabIndex={-1} autoComplete="off" aria-hidden className="hidden" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
        </div>
        <label className="mt-4 flex gap-3 rounded-xl bg-sand/70 p-4 text-xs leading-5 text-ink/75"><input type="checkbox" checked={form.publicWhatsapp} onChange={(e) => setForm({ ...form, publicWhatsapp: e.target.checked })} className="mt-0.5 h-4 w-4 accent-coral" /><span>Quero também tornar este WhatsApp público na página da causa. <strong>Opcional.</strong> Se não marcar, o número fica apenas para a equipa MyPets.</span></label>
      </section>

      <section className="rounded-[2rem] border border-border bg-white p-6 shadow-sm sm:p-8">
        <div className="space-y-3 text-xs leading-5 text-ink/75">
          <label className="flex gap-3"><input required type="checkbox" checked={form.contactConsent} onChange={(e) => setForm({ ...form, contactConsent: e.target.checked })} className="mt-0.5 h-4 w-4 accent-coral" /><span>Autorizo o MyPets a usar os meus dados de contacto para tratar esta submissão e falar comigo sobre a causa.</span></label>
          <label className="flex gap-3"><input required type="checkbox" checked={form.publicationConsent} onChange={(e) => setForm({ ...form, publicationConsent: e.target.checked })} className="mt-0.5 h-4 w-4 accent-coral" /><span>Autorizo a publicação do nome, localização aproximada, narrativa, mensagem e links/media que indiquei como conteúdo público da causa.</span></label>
          <label className="flex gap-3"><input required type="checkbox" checked={form.accuracyConfirmed} onChange={(e) => setForm({ ...form, accuracyConfirmed: e.target.checked })} className="mt-0.5 h-4 w-4 accent-coral" /><span>Confirmo que as informações são verdadeiras segundo o meu conhecimento e que tenho autorização para divulgar o conteúdo enviado.</span></label>
          <label className="flex gap-3"><input type="checkbox" checked={form.marketingConsent} onChange={(e) => setForm({ ...form, marketingConsent: e.target.checked })} className="mt-0.5 h-4 w-4 accent-coral" /><span>Quero receber novidades e oportunidades da rede MyPets. Opcional.</span></label>
        </div>

        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-6 text-amber-950"><ShieldCheck className="mr-2 inline h-4 w-4" /><strong>Publicação não é verificação.</strong> Nesta primeira etapa não pedimos documentos nem dados bancários e não ativamos recebimentos financeiros. O selo MyPets Verificado e a captação de apoios são uma etapa separada.</div>
        {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}
        <Button disabled={busy || !form.contactConsent || !form.publicationConsent || !form.accuracyConfirmed} className="mt-6 h-13 w-full rounded-xl bg-coral text-base font-black text-white hover:bg-coral-dark">{busy ? "A publicar..." : "Publicar a minha causa no MyPets"}<ArrowRight className="ml-2 h-5 w-5" /></Button>
        <p className="mt-3 text-center text-[11px] leading-5 text-muted-foreground">O conteúdo pode ser moderado ou removido se houver denúncia, fraude, risco, violação de direitos ou informação manifestamente inadequada.</p>
      </section>
    </form>
  );
}