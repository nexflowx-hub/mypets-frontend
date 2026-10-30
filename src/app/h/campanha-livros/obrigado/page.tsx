import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, Mail } from "lucide-react";
import { MyPetsLogo } from "@/components/brand/logo";

export const metadata: Metadata = {
  title: "Obrigado pela confiança | MyPets",
  description: "Orientações de acesso aos eBooks MyPets adquiridos pela Hotmart.",
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return (
    <main className="flex min-h-screen flex-col bg-[#faf6ee] text-[#092d39]">
      <header className="border-b border-[#e4e7dc] bg-white">
        <div className="mx-auto flex h-20 max-w-5xl items-center px-5"><Link href="/"><MyPetsLogo /></Link></div>
      </header>
      <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-5 py-20 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#e5f3e9] text-[#117767]"><CheckCircle2 aria-hidden="true" className="h-10 w-10" /></span>
        <p className="mt-8 text-xs font-black uppercase tracking-[.2em] text-[#117767]">MyPets · Coleção Cuidar Melhor</p>
        <h1 className="mt-4 font-serif text-4xl font-bold leading-tight tracking-[-.05em] sm:text-6xl">Obrigado por escolher cuidar melhor.</h1>
        <p className="mt-6 max-w-xl text-base leading-8 text-[#577064]">Se o seu pagamento foi aprovado, a Hotmart enviará as informações de acesso ao e-mail usado na compra. Esta página não confirma por si só a aprovação da transação.</p>
        <div className="mt-9 grid w-full gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-[#dfe6dc] bg-white p-6 text-left">
            <Mail aria-hidden="true" className="h-7 w-7 text-[#117767]" />
            <h2 className="mt-4 text-sm font-extrabold">1. Confira seu e-mail</h2>
            <p className="mt-2 text-xs leading-6 text-[#5f7268]">Verifique a caixa de entrada e a pasta de spam. Se o pagamento estiver pendente, aguarde a confirmação.</p>
          </div>
          <div className="rounded-2xl border border-[#dfe6dc] bg-white p-6 text-left">
            <BookOpen aria-hidden="true" className="h-7 w-7 text-[#ff762f]" />
            <h2 className="mt-4 text-sm font-extrabold">2. Acesse seu eBook</h2>
            <p className="mt-2 text-xs leading-6 text-[#5f7268]">Siga as instruções de acesso enviadas pela Hotmart. Se precisar de suporte, use o canal indicado na confirmação da compra.</p>
          </div>
        </div>
        <Link href="/h/campanha-livros" className="mt-9 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#ff762f] px-7 text-sm font-black text-white">Conhecer os outros livros <ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>
        <p className="mt-8 max-w-xl text-xs leading-6 text-[#748078]">O compromisso MyPets de 1 kg de ração corresponde a uma compra base confirmada e depende da conciliação operacional; esta página não é comprovante de doação ou entrega.</p>
      </section>
    </main>
  );
}