import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, HeartHandshake, PackageCheck, ReceiptText, Vote } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { AuthDialog } from "@/components/layout/auth-dialog";

export const metadata: Metadata = {
  title: "Loja MyPets | Compras com impacto",
  description: "Conheça a futura Loja MyPets: produtos úteis, um fundo de impacto transparente e participação da comunidade na escolha das causas apoiadas.",
  alternates: { canonical: "/loja" },
  openGraph: {
    title: "Loja MyPets | Compras com impacto",
    description: "Uma loja pensada para transformar parte das compras em apoio transparente a causas verificadas.",
    url: "https://mypets.lat/loja",
    siteName: "MyPets",
    type: "website",
  },
};

const steps = [
  { icon: PackageCheck, title: "Comprar com propósito", text: "Produtos MyPets e de parceiros selecionados, com regras de impacto publicadas antes da compra." },
  { icon: HeartHandshake, title: "Fundo MyPets Impact", text: "A parcela elegível anunciada para cada campanha é acumulada num fundo separado e acompanhável." },
  { icon: Vote, title: "A comunidade participa", text: "Causas verificadas podem entrar numa votação periódica, com regras, período e resultado públicos." },
  { icon: ReceiptText, title: "Prova do impacto", text: "Valor apurado, causa escolhida e comprovativo da transferência ficam publicados após cada ciclo." },
];

export default function StorePage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-cream pt-[72px]">
        <section className="bg-petrol text-white">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-white/80"><BadgeCheck className="h-4 w-4 text-coral" /> Em preparação</span>
            <h1 className="mt-5 max-w-4xl text-balance text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">Loja MyPets: comprar também pode gerar impacto.</h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-white/72 sm:text-lg">Estamos a preparar uma loja em que a contribuição para o impacto é explícita, mensurável e publicada. Não prometemos percentagens vagas de “lucro”: a regra financeira será definida e visível antes do lançamento.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/apoiar" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-coral px-6 text-sm font-black text-white transition hover:bg-coral-dark">Apoiar agora <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/guias" className="inline-flex min-h-12 items-center rounded-full border border-white/20 bg-white/5 px-6 text-sm font-black text-white transition hover:bg-white/10">Conhecer os Guias MyPets</Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-4 md:grid-cols-2">
            {steps.map(({ icon: Icon, title, text }, index) => (
              <article key={title} className="rounded-3xl border border-border bg-white p-6 shadow-sm">
                <div className="flex items-center gap-4"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-coral/10 text-coral"><Icon className="h-6 w-6" /></span><span className="text-xs font-black uppercase tracking-[0.15em] text-petrol/45">Etapa {index + 1}</span></div>
                <h2 className="mt-5 text-2xl font-black text-petrol">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 rounded-3xl border border-[#cfe8e6] bg-[#eef8f7] p-6 sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.15em] text-[#0d6e6b]">Transparência primeiro</p>
            <h2 className="mt-2 text-2xl font-black text-petrol">A loja ainda não está a aceitar encomendas.</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-ink/75">Esta página existe para tornar o modelo público desde o início. Antes de abrir vendas, publicaremos a regra de cálculo do fundo, elegibilidade das causas, votação, tratamento de devoluções/estornos e prestação de contas.</p>
          </div>
        </section>
      </main>
      <SiteFooter />
      <AuthDialog />
    </>
  );
}
