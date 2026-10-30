import type { Metadata } from "next";
import Link from "next/link";
import { Clock3, Mail, ArrowLeft } from "lucide-react";
import { MyPetsLogo } from "@/components/brand/logo";

export const metadata: Metadata = { title: "Pagamento pendente — MyPets", robots: { index: false, follow: false } };

export default function PagamentoPendente() {
  return (
    <main className="flex min-h-screen flex-col bg-[#faf7f0] text-[#0b483c]">
      <header className="border-b border-[#e4ede5] px-6 py-5"><Link href="/"><MyPetsLogo compact /></Link></header>
      <section className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#f8ede1]"><Clock3 className="h-10 w-10 text-[#bc7340]" /></span>
        <h1 className="mt-7 font-serif text-4xl leading-tight">Aguardando a confirmação do pagamento</h1>
        <p className="mt-5 text-base leading-8 text-[#557065]">Se você iniciou uma compra, acompanhe o estado da transação na Hotmart. Assim que ela for confirmada, a Hotmart informará como acessar o conteúdo digital.</p>
        <div className="mt-7 flex items-center gap-2 text-sm text-[#507064]"><Mail size={18}/>Confira o e-mail utilizado na compra.</div>
        <p className="mt-8 text-xs leading-6 text-[#6b8278]">Não interpretamos parâmetros na URL como comprovante de pagamento.</p>
        <Link href="/h/campanha-livros" className="mt-7 inline-flex items-center gap-2 font-bold text-[#0d735e] hover:underline"><ArrowLeft size={17}/>Voltar para a coleção</Link>
      </section>
    </main>
  );
}
