import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Mail, ShieldCheck } from "lucide-react";
import { MyPetsLogo } from "@/components/brand/logo";

export const metadata: Metadata = {
  title: "Obrigado por escolher MyPets — Próximos passos",
  description: "Orientações para acessar o eBook adquirido na Hotmart.",
  robots: { index: false, follow: false },
};

export default function ObrigadoLivros() {
  return (
    <main className="flex min-h-screen flex-col bg-[#faf7f0] text-[#0b483c]">
      <header className="border-b border-[#e4ede5] px-6 py-5"><Link href="/"><MyPetsLogo compact /></Link></header>
      <section className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#e5f2e8]"><CheckCircle2 className="h-10 w-10 text-[#138368]" /></span>
        <p className="mt-7 text-xs font-extrabold uppercase tracking-[.2em] text-[#be6d42]">Obrigado por apoiar MyPets</p>
        <h1 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">Seu próximo capítulo começa aqui.</h1>
        <p className="mt-5 max-w-lg text-base leading-8 text-[#557065]">Se você concluiu uma compra, confira o e-mail utilizado na Hotmart. A plataforma informará o estado do pagamento e como acessar seu livro digital depois da confirmação.</p>
        <div className="mt-9 grid w-full gap-3 text-left sm:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow-sm"><Mail className="h-6 w-6 text-[#0e7661]"/><h2 className="mt-4 font-bold">Confira seu e-mail</h2><p className="mt-2 text-sm leading-6 text-[#547064]">Veja a caixa de entrada e spam; as instruções vêm da Hotmart.</p></div>
          <div className="rounded-2xl bg-white p-6 shadow-sm"><ShieldCheck className="h-6 w-6 text-[#0e7661]"/><h2 className="mt-4 font-bold">Pagamento em validação?</h2><p className="mt-2 text-sm leading-6 text-[#547064]">Algumas formas de pagamento precisam de confirmação antes do acesso.</p></div>
        </div>
        <p className="mt-7 text-xs leading-6 text-[#698076]">Esta página não confirma uma compra nem autoriza acesso por si só. O estado da transação deve ser consultado na Hotmart.</p>
        <Link href="/h/campanha-livros" className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#f4763b] px-7 py-3 font-extrabold text-white hover:bg-[#d75f2d]">Explorar outros livros <ArrowRight size={17}/></Link>
      </section>
    </main>
  );
}
