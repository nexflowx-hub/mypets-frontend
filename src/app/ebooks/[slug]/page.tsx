import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, BookOpen, Heart, PawPrint } from "lucide-react";
import { MyPetsLogo } from "@/components/brand/logo";
import { EbookPrintButton } from "@/components/conversion/ebook-print-button";
import { validateEbookReceipt } from "@/lib/ebook-access";
import { solidarityEbookBySlug, solidarityEbooks } from "@/lib/solidarity-ebooks";

export const dynamicParams = false;

export function generateStaticParams() {
  return solidarityEbooks.map((ebook) => ({ slug: ebook.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const ebook = solidarityEbookBySlug[slug];
  if (!ebook) return {};
  return {
    title: ebook.title + " | MyPets",
    description: ebook.description,
    robots: { index: false, follow: false },
  };
}

export default async function EbookPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ receipt?: string }>;
}) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const ebook = solidarityEbookBySlug[slug];
  if (!ebook) notFound();
  const payment = await validateEbookReceipt(query.receipt);
  if (!payment) redirect("/ajudar/ebooks?access=required");

  return (
    <main className="min-h-screen bg-[#f8f6ef] text-petrol print:bg-white">
      <header className="border-b border-border bg-white print:hidden">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link href="/"><MyPetsLogo /></Link>
          <Link href={`/ebooks/colecao?receipt=${encodeURIComponent(query.receipt!)}`} className="inline-flex items-center gap-2 text-xs font-black text-petrol">
            <ArrowLeft className="h-4 w-4" /> Campanha 1 eBook = Ração
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:py-14">
        <div className="overflow-hidden rounded-[2rem] bg-petrol text-white print:rounded-none">
          <div className="grid md:grid-cols-[1fr_.8fr]">
            <div className="p-7 sm:p-10">
              <p className="text-xs font-black uppercase tracking-[.16em] text-emerald-300">eBook solidário MyPets</p>
              <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight sm:text-5xl">{ebook.title}</h1>
              <p className="mt-4 text-base leading-7 text-white/70">{ebook.promise}</p>
              <div className="mt-7 flex flex-wrap gap-2">
                {ebook.tags.map((tag) => <span key={tag} className="rounded-full border border-white/15 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-white/70">{tag}</span>)}
              </div>
            </div>
            <div className="relative min-h-[280px]">
              <Image src={ebook.image} alt="" fill sizes="40vw" className="object-cover opacity-85" />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-petrol/30" />
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-5 print:hidden">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-emerald-700">Obrigado por participar</p>
            <p className="mt-1 text-sm font-semibold text-emerald-950/70">Este material faz parte da campanha 1 eBook = Ração.</p>
          </div>
          <EbookPrintButton />
        </div>

        <div className="mt-10 space-y-10">
          <section>
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700"><BookOpen className="h-5 w-5" /></span>
              <div>
                <h2 className="text-2xl font-black">Antes de começar</h2>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{ebook.description} Este conteúdo é educativo e geral; não substitui avaliação veterinária, comportamental ou nutricional individual.</p>
              </div>
            </div>
          </section>

          {ebook.chapters.map((chapter) => (
            <section key={chapter.title} className="break-inside-avoid">
              <h2 className="text-2xl font-black">{chapter.title}</h2>
              {chapter.intro && <p className="mt-3 text-sm leading-7 text-muted-foreground">{chapter.intro}</p>}
              <ul className="mt-4 space-y-3">
                {chapter.points.map((point) => (
                  <li key={point} className="flex gap-3 text-sm leading-7 text-petrol/80">
                    <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="mt-12 rounded-[2rem] bg-[#0d2a1d] p-7 text-white sm:p-9 print:border print:border-gray-300 print:bg-white print:text-black">
          <PawPrint className="h-7 w-7 text-emerald-300 print:text-black" />
          <h2 className="mt-4 text-2xl font-black">O conhecimento fica consigo. O gesto continua no MyPets.</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/68 print:text-black/70">Se este guia foi útil, partilhe a campanha com outra pessoa que goste de cães. Uma nova participação pode colocar mais uma cota de alimentação em movimento.</p>
          <Link href="/go/ebooks?utm_source=ebook&utm_medium=referral&utm_campaign=ebook_racao&utm_content=reader_footer" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-emerald-500 px-5 text-sm font-black text-white print:hidden">
            <Heart className="h-4 w-4 fill-white" /> Partilhar a campanha
          </Link>
        </div>
      </article>
    </main>
  );
}
