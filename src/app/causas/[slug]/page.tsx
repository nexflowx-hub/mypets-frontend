import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { apiGet } from "@/lib/api";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { AuthDialog } from "@/components/layout/auth-dialog";
import { SocialWall } from "@/components/social/social-wall";
import { ShareActions } from "@/components/share/share-actions";
import { CauseCheckout } from "@/components/payments/cause-checkout";
import { ArrowRight, HeartHandshake, MapPin, PawPrint, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

type Cause = {
  id: string;
  protectorId: string;
  slug: string;
  title: string;
  summary: string | null;
  story: string | null;
  country: string;
  city: string | null;
  primaryImage: string | null;
  supportMode: string;
  targetAmountCents: number | null;
  raisedAmountCents: number;
  currency: string | null;
  protector: { id: string; slug: string; displayName: string; verification: string; city: string | null; country: string } | null;
  pets: Array<{ id: string; facepetsId: string; name: string; status: string; primaryImage: string | null }>;
  needs: Array<{ id: string; type: string; title: string; description: string | null; supportMode: string; targetAmountCents: number | null; raisedAmountCents: number; currency: string | null; status: string }>;
  updates: Array<{ id: string; title: string | null; body: string; imageUrl: string | null; createdAt: string }>;
  followers: number;
  sponsors: number;
};

type SocialData = {
  profiles: Array<{ id: string; platform: string; profileUrl: string; handle: string | null; displayName: string | null; verificationStatus: string; scope: string }>;
  content: Array<{ id: string; socialProfileId: string; platform: string; canonicalUrl: string; contentType: string; captionExcerpt: string | null; thumbnailUrl: string | null; publishedAt: string | null; featured: boolean }>;
};

type PublicConfig = {
  paymentsLive: boolean;
  paymentProvider?: string | null;
  paymentCurrencies?: string[];
  embeddedCheckout?: boolean;
};

type Envelope<T> = { data: T };

async function getCause(slug: string) {
  try { return (await apiGet<Envelope<Cause>>(`/causes/${encodeURIComponent(slug)}`)).data; } catch { return null; }
}

async function getSocial(slug: string): Promise<SocialData> {
  try { return (await apiGet<Envelope<SocialData>>(`/causes/${encodeURIComponent(slug)}/social`)).data; } catch { return { profiles: [], content: [] }; }
}

async function getConfig(): Promise<PublicConfig> {
  try { return (await apiGet<Envelope<PublicConfig>>("/config")).data; } catch { return { paymentsLive: false, paymentCurrencies: [] }; }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cause = await getCause(slug);
  if (!cause) return { title: "Causa | MyPets" };
  return {
    title: cause.title,
    description: cause.summary ?? "Conheça esta causa no MyPets.",
    alternates: { canonical: `/causas/${cause.slug}` },
    openGraph: {
      title: cause.title,
      description: cause.summary ?? "Conheça esta causa no MyPets.",
      url: `https://mypets.lat/causas/${cause.slug}`,
      siteName: "MyPets",
      type: "article",
      images: cause.primaryImage ? [{ url: cause.primaryImage }] : [{ url: "/images/hero.jpg", width: 1440, height: 720 }],
    },
  };
}

function money(cents: number, currency: string) {
  return new Intl.NumberFormat(currency === "BRL" ? "pt-BR" : "pt-PT", { style: "currency", currency, maximumFractionDigits: 0 }).format(cents / 100);
}

export default async function CausePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [cause, social, config] = await Promise.all([getCause(slug), getSocial(slug), getConfig()]);
  if (!cause) notFound();

  const sponsorHref = `/join/padrinho?v=social&cause_id=${encodeURIComponent(cause.id)}&src_cta=cause_sponsor&utm_source=mypets&utm_medium=internal&utm_campaign=cause_${encodeURIComponent(cause.slug)}`;
  const paymentCurrency = cause.currency === "EUR" || cause.currency === "BRL" ? cause.currency : null;
  const financialCause = cause.supportMode !== "NON_FINANCIAL" && Boolean(paymentCurrency);
  const checkoutEnabled = Boolean(
    financialCause &&
    config.paymentsLive &&
    config.embeddedCheckout &&
    config.paymentProvider === "xpayments" &&
    paymentCurrency &&
    (config.paymentCurrencies ?? []).includes(paymentCurrency)
  );
  const progress = cause.targetAmountCents
    ? Math.min(100, Math.round((cause.raisedAmountCents / cause.targetAmountCents) * 100))
    : 0;

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-cream pt-[68px]">
        <section className="bg-petrol text-white">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8 lg:py-16">
            <div className="flex flex-col justify-center">
              <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-white/65">
                <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{cause.city ? `${cause.city}, ` : ""}{cause.country}</span>
                {cause.protector && <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />{cause.protector.displayName}</span>}
              </div>
              <h1 className="mt-4 text-balance text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">{cause.title}</h1>
              {cause.summary && <p className="mt-5 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">{cause.summary}</p>}

              <div className="mt-7 flex flex-wrap gap-3">
                {paymentCurrency && <CauseCheckout causeId={cause.id} causeTitle={cause.title} currency={paymentCurrency} enabled={checkoutEnabled} />}
                <Link href={sponsorHref} className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-coral px-5 text-sm font-extrabold text-white transition hover:bg-coral-dark">
                  <HeartHandshake className="h-4 w-4" /> Quero acompanhar / ser padrinho <ArrowRight className="h-4 w-4" />
                </Link>
                <ShareActions title={cause.title} text={cause.summary ?? "Conheça esta causa no MyPets."} path={`/causas/${cause.slug}`} />
              </div>
            </div>
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl shadow-black/10">
              {cause.primaryImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={cause.primaryImage} alt="" className="aspect-[4/3] h-full w-full object-cover" />
              ) : (
                <div className="flex aspect-[4/3] items-center justify-center"><PawPrint className="h-14 w-14 text-coral/70" /></div>
              )}
            </div>
          </div>
        </section>

        <div className="mx-auto grid max-w-7xl gap-7 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-8 lg:py-14">
          <div className="space-y-7">
            {(cause.story || cause.summary) && (
              <section className="rounded-3xl border border-border bg-white p-6 sm:p-8">
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-coral">A história</p>
                <h2 className="mt-2 text-2xl font-extrabold text-petrol">Por que esta causa existe</h2>
                <div className="mt-4 whitespace-pre-line text-[15px] leading-7 text-ink/80">{cause.story ?? cause.summary}</div>
              </section>
            )}

            <SocialWall profiles={social.profiles} content={social.content} />

            {cause.pets.length > 0 && (
              <section className="rounded-3xl border border-border bg-white p-6 sm:p-8">
                <h2 className="text-2xl font-extrabold text-petrol">Animais ligados a esta causa</h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {cause.pets.map((pet) => (
                    <Link key={pet.id} href={`/pets/${pet.facepetsId}`} className="flex items-center gap-4 rounded-2xl border border-border p-4 transition hover:border-coral/40">
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-sand">{pet.primaryImage ? <img src={pet.primaryImage} alt="" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center"><PawPrint className="h-5 w-5 text-coral" /></div>}</div>
                      <div><p className="font-extrabold text-petrol">{pet.name}</p><p className="mt-1 text-xs font-semibold text-muted-foreground">FacePets {pet.facepetsId}</p></div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {cause.updates.length > 0 && (
              <section className="rounded-3xl border border-border bg-white p-6 sm:p-8">
                <h2 className="text-2xl font-extrabold text-petrol">Atualizações</h2>
                <div className="mt-5 space-y-5">
                  {cause.updates.map((update) => (
                    <article key={update.id} className="border-l-2 border-coral/30 pl-4">
                      {update.title && <h3 className="font-extrabold text-petrol">{update.title}</h3>}
                      <p className="mt-1 whitespace-pre-line text-sm leading-6 text-ink/75">{update.body}</p>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="space-y-5">
            <div className="rounded-3xl border border-border bg-white p-6">
              <p className="text-xs font-extrabold uppercase tracking-wide text-coral">Impacto acompanhado</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-sand p-4"><p className="text-2xl font-extrabold text-petrol">{cause.followers}</p><p className="text-xs text-muted-foreground">seguidores</p></div>
                <div className="rounded-2xl bg-sand p-4"><p className="text-2xl font-extrabold text-petrol">{cause.sponsors}</p><p className="text-xs text-muted-foreground">padrinhos/interessados</p></div>
              </div>
              {cause.targetAmountCents && cause.currency && (
                <div className="mt-4 rounded-2xl bg-petrol p-4 text-white">
                  <div className="flex items-baseline justify-between gap-3"><div><p className="text-xs font-bold text-white/60">Apoio financeiro</p><p className="mt-1 text-xl font-extrabold">{money(cause.raisedAmountCents, cause.currency)}</p></div><p className="text-xs font-bold text-white/60">de {money(cause.targetAmountCents, cause.currency)}</p></div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-coral transition-[width]" style={{ width: `${progress}%` }} /></div>
                  <p className="mt-2 text-[11px] text-white/55">{checkoutEnabled ? "Pagamentos processados no checkout seguro XPAYMENTS." : "Pagamento online será disponibilizado quando a Store XPAYMENTS desta moeda estiver ativa."}</p>
                </div>
              )}
            </div>

            {cause.needs.length > 0 && (
              <div className="rounded-3xl border border-border bg-white p-6">
                <h2 className="text-lg font-extrabold text-petrol">Necessidades atuais</h2>
                <div className="mt-4 space-y-3">{cause.needs.map((need) => <div key={need.id} className="rounded-2xl bg-sand p-4"><p className="text-xs font-bold uppercase text-coral">{need.type}</p><p className="mt-1 font-extrabold text-petrol">{need.title}</p>{need.description && <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{need.description}</p>}</div>)}</div>
              </div>
            )}
          </aside>
        </div>
      </main>
      <SiteFooter />
      <AuthDialog />
    </>
  );
}
