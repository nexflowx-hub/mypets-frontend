import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, Heart, PawPrint } from "lucide-react";
import { MyPetsLogo } from "@/components/brand/logo";
import { EbookPrintButton } from "@/components/conversion/ebook-print-button";
import { LibraryMarkdown } from "@/components/library/library-markdown";
import { LibraryToc } from "@/components/library/library-toc";
import { validateEbookReceipt } from "@/lib/ebook-access";
import {
  entitlementKeysForGuide,
  extractGuideHeadings,
  getDigitalLibraryContent,
  resolveDigitalLibraryGuide,
} from "@/lib/digital-library";

export const metadata: Metadata = {
  title: "Leitor da Biblioteca MyPets",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function DigitalLibraryReaderPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ receipt?: string }>;
}) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const guide = await resolveDigitalLibraryGuide(slug);
  if (!guide) notFound();

  const payment = await validateEbookReceipt(query.receipt);
  if (!payment) redirect("/ajudar/ebooks?access=required");

  const allowedKeys = entitlementKeysForGuide(guide);
  if (!(payment.rewardKeys ?? []).some((key) => allowedKeys.includes(key))) {
    redirect("/ebooks/colecao?receipt=" + encodeURIComponent(query.receipt!));
  }

  const markdown = await getDigitalLibraryContent(guide);
  const headings = extractGuideHeadings(markdown);

  return (
    <main className="min-h-screen bg-[#f8f6ef] text-petrol print:bg-white">
      <header className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur print:hidden">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/"><MyPetsLogo /></Link>
          <div className="flex items-center gap-3">
            <Link
              href={"/ebooks/colecao?receipt=" + encodeURIComponent(query.receipt!)}
              className="hidden items-center gap-2 text-xs font-black text-petrol/60 sm:inline-flex"
            >
              <ArrowLeft className="h-4 w-4" /> Minha coleção
            </Link>
            <EbookPrintButton />
          </div>
        </div>
      </header>

      <section className="border-b border-border bg-white print:hidden">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-[10px] font-black uppercase tracking-[.15em] text-emerald-700">Biblioteca MyPets · Guia desbloqueado</p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black leading-tight sm:text-3xl">{guide.title}</h1>
              <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">{guide.subtitle}</p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-emerald-700">
              <PawPrint className="h-3.5 w-3.5" /> 1 kg em movimento
            </span>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[250px_minmax(0,760px)_1fr] lg:px-8 lg:py-12">
        <LibraryToc headings={headings.filter((heading) => heading.level === 2)} />

        <article className="min-w-0 rounded-[2rem] border border-border bg-white p-5 shadow-sm sm:p-8 lg:p-10 print:border-0 print:p-0 print:shadow-none">
          <LibraryMarkdown
            markdown={markdown}
            headings={headings.filter((heading) => heading.level === 2)}
            progressKey={"mypets-library:" + guide.id + ":v2"}
          />

          <div className="mt-14 rounded-[2rem] bg-[#0f241b] p-7 text-white sm:p-9 print:border print:border-gray-300 print:bg-white print:text-black">
            <BookOpen className="h-7 w-7 text-emerald-300 print:text-black" />
            <h2 className="mt-4 text-2xl font-black">Terminou este guia? Escolha o próximo quando fizer sentido.</h2>
            <p className="mt-3 text-sm leading-7 text-white/65 print:text-black/70">
              Cada nova participação confirmada na oferta-base pode desbloquear outro guia e colocar mais 1 kg de ração no compromisso da campanha.
            </p>
            <div className="mt-5 flex flex-wrap gap-3 print:hidden">
              <Link href="/biblioteca" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-black text-petrol">
                Explorar biblioteca <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/ajudar/ebooks" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-emerald-400 px-5 text-sm font-black text-[#092017]">
                <Heart className="h-4 w-4" /> Garantir +1 kg
              </Link>
            </div>
          </div>
        </article>

        <aside className="hidden lg:block print:hidden">
          <div className="sticky top-24 space-y-4">
            <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5">
              <p className="text-[10px] font-black uppercase tracking-[.14em] text-emerald-700">Como usar</p>
              <p className="mt-2 text-xs font-semibold leading-6 text-emerald-950/70">Marque cada seção concluída. O progresso fica salvo localmente neste primeiro leitor e poderá migrar para a sua conta MyPets.</p>
            </div>
            <div className="rounded-3xl border border-border bg-white p-5">
              <p className="text-[10px] font-black uppercase tracking-[.14em] text-petrol/50">Limite do conteúdo</p>
              <p className="mt-2 text-xs font-semibold leading-6 text-petrol/65">Informação educativa geral. Questões de saúde, alimentação terapêutica ou comportamento de risco precisam de avaliação profissional individual.</p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
