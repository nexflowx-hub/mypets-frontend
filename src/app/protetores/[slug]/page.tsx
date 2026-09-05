import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, HeartHandshake, MapPin, PawPrint } from "lucide-react";
import { apiGet } from "@/lib/api";
import type { CoreProtector } from "@/lib/core-types";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { AuthDialog } from "@/components/layout/auth-dialog";
import { Button } from "@/components/ui/button";

type Envelope<T> = { data: T };

export const dynamic = "force-dynamic";

export default async function ProtectorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let protector: CoreProtector;
  try {
    protector = (await apiGet<Envelope<CoreProtector>>(`/protectors/${encodeURIComponent(slug)}`)).data;
  } catch {
    notFound();
  }

  const pets = protector.pets ?? [];
  const needs = protector.needs ?? [];

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-cream">
        <section className="border-b border-border bg-petrol text-white">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-white/60">
              <span>Protetor MyPets</span>
              <span>•</span>
              <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{protector.city}, {protector.country}</span>
            </div>
            <div className="mt-4 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">{protector.displayName}</h1>
                <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold">
                  <BadgeCheck className="h-4 w-4 text-coral" /> {protector.verification.replaceAll("_", " ")}
                </div>
              </div>
              <Button asChild className="h-12 rounded-xl bg-coral px-6 font-bold text-white hover:bg-coral-dark">
                <Link href="/#historias"><HeartHandshake className="mr-2 h-4 w-4" />Quero ajudar</Link>
              </Button>
            </div>
            {protector.bio && <p className="mt-6 max-w-3xl text-[15px] leading-relaxed text-white/78">{protector.bio}</p>}
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <section className="grid gap-4 sm:grid-cols-3">
            <Stat label="Animais atualmente" value={String(protector.animalsCurrent)} />
            <Stat label="Anos de atividade" value={String(protector.yearsActive)} />
            <Stat label="Necessidades abertas" value={String(needs.filter((n) => n.status === "OPEN").length)} />
          </section>

          <section className="mt-10">
            <div className="flex items-center gap-2"><PawPrint className="h-5 w-5 text-coral" /><h2 className="text-2xl font-extrabold text-petrol">Animais</h2></div>
            {pets.length === 0 ? <Empty text="Ainda não existem animais públicos neste perfil." /> : (
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {pets.map((pet) => (
                  <Link key={pet.id} href={`/pets/${pet.facepetsId}`} className="rounded-2xl border border-border bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
                    <div className="flex items-center justify-between gap-2"><h3 className="font-extrabold text-petrol">{pet.name}</h3><span className="rounded-full bg-sand px-2.5 py-1 text-[10px] font-bold text-ink/60">{pet.status}</span></div>
                    <p className="mt-2 font-mono text-xs font-bold text-coral">{pet.facepetsId}</p>
                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{pet.story || "História a ser atualizada."}</p>
                  </Link>
                ))}
              </div>
            )}
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-extrabold text-petrol">Necessidades</h2>
            {needs.length === 0 ? <Empty text="Não existem necessidades públicas neste momento." /> : (
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {needs.map((need) => (
                  <article key={need.id} className="rounded-2xl border border-border bg-white p-5">
                    <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-extrabold uppercase tracking-wide text-coral">{need.type}</p><h3 className="mt-1 text-lg font-extrabold text-petrol">{need.title}</h3></div><span className="rounded-full bg-sand px-2.5 py-1 text-[10px] font-bold text-ink/60">{need.status}</span></div>
                    {need.description && <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{need.description}</p>}
                    {need.targetAmountCents && need.currency && <p className="mt-4 text-sm font-extrabold text-petrol">Objetivo: {new Intl.NumberFormat(need.currency === "EUR" ? "pt-PT" : "pt-BR", { style: "currency", currency: need.currency }).format(need.targetAmountCents / 100)}</p>}
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
      <SiteFooter />
      <AuthDialog />
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-border bg-white p-5"><p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{label}</p><p className="mt-2 text-2xl font-extrabold text-petrol">{value}</p></div>;
}

function Empty({ text }: { text: string }) {
  return <p className="mt-5 rounded-2xl border border-dashed border-border bg-white p-7 text-sm text-muted-foreground">{text}</p>;
}
