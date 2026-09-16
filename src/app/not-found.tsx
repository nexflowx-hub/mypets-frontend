import Link from "next/link";
import { ArrowRight, HeartHandshake, Home, PawPrint, ShoppingBag } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export default function NotFoundPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-[72vh] bg-cream pt-[72px]">
        <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="overflow-hidden rounded-[2rem] border border-border bg-white shadow-sm">
            <div className="bg-petrol px-6 py-10 text-white sm:px-10 lg:px-12">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-coral"><PawPrint className="h-6 w-6" /></span>
              <p className="mt-6 text-xs font-black uppercase tracking-[0.18em] text-coral">Página não encontrada</p>
              <h1 className="mt-2 max-w-3xl text-balance text-4xl font-black tracking-tight sm:text-5xl">Este caminho mudou, mas a sua ajuda pode continuar daqui.</h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/68 sm:text-base">Algumas áreas do MyPets evoluem para páginas de apoio mais específicas. Escolha abaixo o destino que procura.</p>
            </div>

            <div className="grid gap-4 p-6 sm:grid-cols-2 sm:p-8 lg:grid-cols-4">
              <Link href="/apoiar/mypets" className="group rounded-3xl border border-[#ffe0db] bg-[#fff0ee] p-5 transition hover:-translate-y-1 hover:shadow-lg">
                <HeartHandshake className="h-6 w-6 text-coral" />
                <h2 className="mt-4 text-lg font-black text-petrol">Apoiar o MyPets</h2>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">Apoio institucional direto ao ecossistema.</p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-black text-coral">Continuar <ArrowRight className="h-3.5 w-3.5" /></span>
              </Link>

              <Link href="/causas" className="group rounded-3xl border border-border bg-white p-5 transition hover:-translate-y-1 hover:border-coral/30 hover:shadow-lg">
                <PawPrint className="h-6 w-6 text-[#0d6e6b]" />
                <h2 className="mt-4 text-lg font-black text-petrol">Ver causas</h2>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">Escolha uma causa concreta e acompanhável.</p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-black text-petrol">Explorar <ArrowRight className="h-3.5 w-3.5" /></span>
              </Link>

              <Link href="/loja" className="group rounded-3xl border border-border bg-white p-5 transition hover:-translate-y-1 hover:border-coral/30 hover:shadow-lg">
                <ShoppingBag className="h-6 w-6 text-coral" />
                <h2 className="mt-4 text-lg font-black text-petrol">Loja MyPets</h2>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">Conheça a nova experiência de produtos pet.</p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-black text-petrol">Abrir loja <ArrowRight className="h-3.5 w-3.5" /></span>
              </Link>

              <Link href="/" className="group rounded-3xl border border-border bg-white p-5 transition hover:-translate-y-1 hover:border-coral/30 hover:shadow-lg">
                <Home className="h-6 w-6 text-petrol" />
                <h2 className="mt-4 text-lg font-black text-petrol">Voltar ao início</h2>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">Retome a navegação principal do MyPets.</p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-black text-petrol">Início <ArrowRight className="h-3.5 w-3.5" /></span>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
