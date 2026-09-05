import type { Metadata } from "next";
import Link from "next/link";
import { apiGet } from "@/lib/api";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { AuthDialog } from "@/components/layout/auth-dialog";
import { ArrowRight, MapPin, PawPrint } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Causas | MyPets",
  description: "Descubra causas de proteção animal, acompanhe atualizações e ajude de forma concreta.",
  alternates: { canonical: "/causas" },
};

type Cause = {
  id: string;
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
};

type Envelope<T> = { data: T };

async function causes() {
  try {
    return (await apiGet<Envelope<Cause[]>>("/causes?limit=36")).data;
  } catch {
    return [];
  }
}

export default async function CausesPage() {
  const rows = await causes();
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-cream pt-[68px]">
        <section className="bg-petrol px-4 py-14 text-white sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-coral">Causas MyPets</p>
            <h1 className="mt-4 max-w-4xl text-balance text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">Ajuda concreta, histórias acompanháveis e pessoas reais no terreno.</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/70">Cada causa liga um protetor, animais, necessidades, atualizações e formas de participar — financeiras ou não.</p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          {rows.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border bg-white p-10 text-center">
              <PawPrint className="mx-auto h-8 w-8 text-coral" />
              <h2 className="mt-4 text-xl font-extrabold text-petrol">As primeiras causas verificadas estão a chegar.</h2>
              <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">Não publicamos causas descobertas automaticamente como se fossem oficiais. Primeiro são revistas e reivindicadas pelos responsáveis.</p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {rows.map((cause) => (
                <Link key={cause.id} href={`/causas/${cause.slug}`} className="group overflow-hidden rounded-3xl border border-border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
                  <div className="aspect-[16/10] bg-sand">
                    {cause.primaryImage ? <img src={cause.primaryImage} alt="" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center"><PawPrint className="h-9 w-9 text-coral/60" /></div>}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground"><MapPin className="h-3.5 w-3.5" />{cause.city ? `${cause.city}, ` : ""}{cause.country}</div>
                    <h2 className="mt-2 text-xl font-extrabold tracking-tight text-petrol group-hover:text-coral">{cause.title}</h2>
                    {cause.summary && <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{cause.summary}</p>}
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-extrabold text-coral">Conhecer causa <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
      <AuthDialog />
    </>
  );
}
