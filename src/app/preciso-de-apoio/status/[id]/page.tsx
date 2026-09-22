import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BadgeCheck, CircleDashed, ExternalLink, HeartHandshake, MessageCircle, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { apiGet } from "@/lib/api";

export const metadata: Metadata = {
  title: "Estado da submissão | MyPets",
  robots: { index: false, follow: false },
};

type PublicStatus = {
  id: string;
  causeId: string;
  status: string;
  slug: string;
  publicUrl: string;
  verificationStatus: string;
  fundraisingStatus: string;
  promotionStatus: string | null;
  verificationWhatsappUrl: string;
};

type Envelope<T> = { data: T };

async function getStatus(id: string) {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) return null;
  try {
    return (await apiGet<Envelope<PublicStatus>>(`/cause-intake/${encodeURIComponent(id)}/public-status`)).data;
  } catch {
    return null;
  }
}

function human(value: string | null) {
  const labels: Record<string, string> = {
    PUBLISHED_UNVERIFIED: "Publicada · aguardando verificação",
    UNDER_REVIEW: "Em análise",
    VERIFICATION_REQUESTED: "Verificação solicitada",
    VERIFIED: "Verificada",
    HIDDEN: "Oculta durante revisão",
    REJECTED: "Não aprovada",
    UNVERIFIED: "Ainda não verificada",
    REVIEWING: "Em verificação",
    OWNER_LINKED: "Responsável vinculado",
    PLATFORM: "Projeto MyPets",
    REVIEW_REQUIRED: "Aguardando habilitação financeira",
    DISABLED: "Desativada",
    ENABLED: "Ativa",
    SUSPENDED: "Suspensa",
    QUEUED: "Na fila editorial",
    DRAFTED: "Conteúdo preparado",
    APPROVED: "Promoção aprovada",
    PUBLISHED: "Promoção publicada",
    FAILED: "Promoção requer atenção",
    CANCELLED: "Promoção cancelada",
  };
  return value ? labels[value] ?? value.replaceAll("_", " ") : "Não aplicável";
}

export default async function CauseIntakeStatusPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await getStatus(id);
  if (!item) notFound();

  const verified = ["VERIFIED", "PLATFORM", "OWNER_LINKED"].includes(item.verificationStatus);
  const fundraising = item.fundraisingStatus === "ENABLED";

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-cream pt-[72px]">
        <section className="bg-petrol text-white">
          <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <p className="text-xs font-black uppercase tracking-[.18em] text-coral">Acompanhamento MyPets</p>
            <h1 className="mt-3 max-w-3xl text-balance text-4xl font-black tracking-tight sm:text-5xl">Acompanhe a evolução da sua submissão.</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/68">Esta página mostra apenas estados públicos. Dados de contacto, documentos e notas internas não são expostos.</p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="grid gap-4 md:grid-cols-3">
            <article className="rounded-3xl border border-border bg-white p-6">
              <CircleDashed className="h-6 w-6 text-coral" />
              <p className="mt-4 text-xs font-black uppercase tracking-wide text-muted-foreground">Submissão</p>
              <h2 className="mt-1 text-lg font-black text-petrol">{human(item.status)}</h2>
            </article>
            <article className="rounded-3xl border border-border bg-white p-6">
              {verified ? <BadgeCheck className="h-6 w-6 text-emerald-600" /> : <ShieldCheck className="h-6 w-6 text-amber-700" />}
              <p className="mt-4 text-xs font-black uppercase tracking-wide text-muted-foreground">Verificação</p>
              <h2 className="mt-1 text-lg font-black text-petrol">{human(item.verificationStatus)}</h2>
            </article>
            <article className="rounded-3xl border border-border bg-white p-6">
              <HeartHandshake className={`h-6 w-6 ${fundraising ? "text-emerald-600" : "text-petrol"}`} />
              <p className="mt-4 text-xs font-black uppercase tracking-wide text-muted-foreground">Captação financeira</p>
              <h2 className="mt-1 text-lg font-black text-petrol">{human(item.fundraisingStatus)}</h2>
            </article>
          </div>

          <div className="mt-6 rounded-3xl border border-border bg-white p-6 sm:p-8">
            <p className="text-xs font-black uppercase tracking-[.15em] text-coral">Promoção</p>
            <h2 className="mt-2 text-2xl font-black text-petrol">{human(item.promotionStatus)}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">A fila editorial é independente da verificação financeira. Uma causa pode ganhar visibilidade antes de estar habilitada a receber apoios pelo MyPets.</p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a href={item.publicUrl} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-petrol px-5 text-sm font-black text-white">Ver página pública <ExternalLink className="h-4 w-4" /></a>
              {!verified && <a href={item.verificationWhatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#20b65a] px-5 text-sm font-black text-white"><MessageCircle className="h-4 w-4" /> Avançar com verificação</a>}
              <Link href="/projetos/apresentar" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-cream px-5 text-sm font-black text-petrol">Apresentar outro projeto <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
