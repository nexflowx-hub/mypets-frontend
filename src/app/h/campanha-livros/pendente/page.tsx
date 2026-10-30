import type { Metadata } from "next";
import Link from "next/link";
import { Clock3, ArrowRight } from "lucide-react";
import { MyPetsLogo } from "@/components/brand/logo";

export const metadata: Metadata = {
  title: "Pagamento em processamento | MyPets",
  robots: { index: false, follow: false },
};
export default function PendingPage() {
  return (
    <main className="min-h-screen bg-[#faf6ee] text-[#092d39]">
      <header className="border-b border-[#e4e7dc] bg-white">
        <div className="mx-auto flex h-20 max-w-5xl items-center px-5"><Link href="/"><MyPetsLogo /></Link></div>
      </header>
      <section className="mx-auto flex max-w-2xl flex-col items-center px-5 py-24 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#f8ebd8] text-[#bd6e35]"><Clock3 aria-hidden="true" className="h-10 w-10" /></span>
        <h1 className="mt-8 font-serif text-4xl font-bold leading-tight tracking-[-.05em]">Estamos aguardando a confirmação do pagamento.</h1>
        <p className="mt-5 text-base leading-8 text-[#5f7268]">Alguns meios de pagamento não são confirmados imediatamente. Quando a Hotmart aprovar sua compra, você receberá as instruções de acesso pelo e-mail cadastrado.</p>
        <p className="mt-4 text-sm leading-7 text-[#5f7268]">Não é necessário comprar novamente enquanto o pagamento estiver em processamento. Confira o status no e-mail e na área de compras da Hotmart.</p>
        <Link href="/h/campanha-livros" className="mt-9 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#083f38] px-7 text-sm font-black text-white">Voltar à coleção <ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>
      </section>
    </main>
  );
}