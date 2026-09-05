import type { Metadata } from "next";
import { apiGet } from "@/lib/api";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { AuthDialog } from "@/components/layout/auth-dialog";
import { ClaimClient } from "@/components/claim/claim-client";
import { ExternalLink, MapPin, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Reivindicar presença | MyPets",
  robots: { index: false, follow: false },
};

type ClaimInfo = {
  title: string | null;
  summary: string | null;
  sourceUrl: string;
  country: string | null;
  city: string | null;
  expiresAt: string;
};

type Envelope<T> = { data: T };

async function getClaimInfo(token: string) {
  try {
    return (await apiGet<Envelope<ClaimInfo>>(`/claim/${encodeURIComponent(token)}`)).data;
  } catch {
    return null;
  }
}

export default async function ClaimPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const info = await getClaimInfo(token);

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-cream pt-[68px]">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[.85fr_1.15fr] lg:px-8 lg:py-16">
          <section className="rounded-3xl bg-petrol p-7 text-white sm:p-9">
            <div className="flex items-center gap-2 text-coral"><ShieldCheck className="h-5 w-5" /><span className="text-xs font-extrabold uppercase tracking-[0.16em]">MyPets Verified Network</span></div>
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight">Transforme uma presença encontrada num perfil oficial.</h1>
            <p className="mt-4 text-sm leading-7 text-white/70">O MyPets pode encontrar websites e perfis públicos durante a descoberta de projetos que ajudam animais. Esses registos permanecem não verificados até um responsável os reivindicar e a equipa confirmar a ligação.</p>

            {info && <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5"><p className="text-xs font-extrabold uppercase tracking-wide text-coral">Presença encontrada</p><h2 className="mt-2 text-xl font-extrabold">{info.title || "Organização / causa"}</h2>{(info.city || info.country) && <p className="mt-2 flex items-center gap-1.5 text-xs text-white/65"><MapPin className="h-3.5 w-3.5" />{info.city ? `${info.city}, ` : ""}{info.country}</p>}<a href={info.sourceUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-xs font-extrabold text-white hover:text-coral">Ver fonte pública <ExternalLink className="h-3 w-3" /></a></div>}
          </section>

          {info ? <ClaimClient token={token} info={info} /> : <section className="rounded-3xl border border-border bg-white p-7 sm:p-9"><h2 className="text-2xl font-extrabold text-petrol">Este convite já não está disponível</h2><p className="mt-3 text-sm leading-relaxed text-muted-foreground">O link pode ter expirado, já ter sido utilizado ou ter sido revogado. Peça à equipa MyPets um novo convite de reivindicação.</p></section>}
        </div>
      </main>
      <SiteFooter />
      <AuthDialog />
    </>
  );
}
