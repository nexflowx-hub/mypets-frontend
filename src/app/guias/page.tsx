import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpenCheck, HeartHandshake } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { AuthDialog } from "@/components/layout/auth-dialog";

export const metadata: Metadata = {
  title: "Guias MyPets | Conteúdo prático para ajudar melhor",
  description: "Guias gratuitos MyPets com orientações práticas para resgate, proteção, adoção e apoio responsável.",
  alternates: { canonical: "/guias" },
};

export default function GuidesPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-cream pt-[72px]">
        <section className="bg-petrol text-white">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-coral">Guias MyPets</p>
            <h1 className="mt-3 max-w-4xl text-balance text-4xl font-black tracking-tight sm:text-5xl">Informação prática também salva tempo — e pode salvar vidas.</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-white/70">Conteúdo gratuito para transformar intenção em ação mais segura. Os guias são educativos e não substituem avaliação veterinária ou orientação das autoridades locais.</p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <article className="grid gap-6 rounded-3xl border border-border bg-white p-6 shadow-sm md:grid-cols-[auto_1fr_auto] md:items-center sm:p-8">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-coral/10 text-coral"><BookOpenCheck className="h-8 w-8" /></span>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-coral">Guia gratuito</p>
              <h2 className="mt-1 text-2xl font-black text-petrol">Encontrei um animal na rua. E agora?</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Um roteiro para as primeiras 24 horas: segurança, urgência, contenção, transporte, documentação e como pedir ajuda.</p>
            </div>
            <Link href="/guias/primeiras-24h" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-coral px-5 text-sm font-black text-white transition hover:bg-coral-dark">Abrir guia <ArrowRight className="h-4 w-4" /></Link>
          </article>

          <div className="mt-8 flex flex-col gap-4 rounded-3xl bg-petrol p-6 text-white sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div><p className="text-xs font-black uppercase tracking-[0.15em] text-coral">Precisa de apoio real?</p><h2 className="mt-1 text-2xl font-black">O conteúdo orienta. O MyPets também pode ajudar a organizar o pedido.</h2></div>
            <Link href="/preciso-de-apoio" className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-black text-petrol"><HeartHandshake className="h-4 w-4" /> Preciso de apoio</Link>
          </div>
        </section>
      </main>
      <SiteFooter />
      <AuthDialog />
    </>
  );
}
