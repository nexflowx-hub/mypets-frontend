import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, Clock3, LockKeyhole, PawPrint, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { AuthDialog } from "@/components/layout/auth-dialog";
import { MyPetsRoundSeal } from "@/components/brand/round-seal";
import { LibraryMarkdown } from "@/components/library/library-markdown";
import {
  extractGuideHeadings,
  getDigitalLibraryIndex,
  getDigitalLibraryPreview,
  getGuideMediaBundle,
  resolveDigitalLibraryGuide,
} from "@/lib/digital-library";

export const revalidate = 300;

export async function generateStaticParams() {
  const index = await getDigitalLibraryIndex();
  return index.guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = await resolveDigitalLibraryGuide(slug);
  if (!guide) return {};
  return {
    title: guide.title + " | Biblioteca MyPets",
    description: guide.description,
    alternates: { canonical: "/biblioteca/" + guide.slug },
  };
}

export default async function LibraryGuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = await resolveDigitalLibraryGuide(slug);
  if (!guide) notFound();
  const [preview, mediaBundle] = await Promise.all([
    getDigitalLibraryPreview(guide),
    getGuideMediaBundle(guide),
  ]);
  const previewHeadings = extractGuideHeadings(preview);

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-[#f8f6ef] pt-[72px] text-petrol">
        <section className="border-b border-border bg-white">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <Link href="/biblioteca" className="inline-flex items-center gap-2 text-xs font-black text-petrol/55 hover:text-emerald-700">
              <ArrowLeft className="h-4 w-4" /> Biblioteca
            </Link>
            <div className="mt-7 grid gap-8 lg:grid-cols-[minmax(0,1fr)_430px] lg:items-center">
              <div>
                <p className="text-xs font-black uppercase tracking-[.16em] text-emerald-700">Coleção MyPets — Cuidar Melhor</p>
                <h1 className="mt-3 max-w-4xl text-4xl font-black leading-[1.05] tracking-[-.035em] sm:text-6xl">{guide.title}</h1>
                <p className="mt-5 max-w-3xl text-lg font-semibold leading-8 text-petrol/65">{guide.subtitle}</p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {guide.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-border bg-[#f8f6ef] px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-petrol/60">{tag}</span>
                  ))}
                </div>

                <div className="mt-7 flex flex-wrap items-center gap-5 text-xs font-black text-petrol/60">
                  <span className="inline-flex items-center gap-1.5"><Clock3 className="h-4 w-4" /> ~{guide.readingMinutes} min</span>
                  <span className="inline-flex items-center gap-1.5"><BookOpen className="h-4 w-4" /> leitura web</span>
                  <span className="inline-flex items-center gap-1.5"><PawPrint className="h-4 w-4 text-emerald-600" /> 1 eBook = 1 kg</span>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <a href="#amostra" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-petrol px-5 text-sm font-black text-white">
                    Ler amostra <ArrowRight className="h-4 w-4" />
                  </a>
                  <Link href="/ajudar/ebooks#participar" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-emerald-500 px-5 text-sm font-black text-white">
                    R$ 12,90 · desbloquear + garantir 1 kg <PawPrint className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-petrol">
                <Image src={guide.image} alt="" fill priority sizes="430px" className="object-cover opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-petrol/65 via-transparent to-transparent" />
                <MyPetsRoundSeal className="absolute right-5 top-5 h-16 w-16" />
                <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-white/15 bg-black/20 p-4 text-white backdrop-blur-sm">
                  <p className="text-[10px] font-black uppercase tracking-[.15em] text-emerald-200">Incluído no guia completo</p>
                  <p className="mt-1 text-sm font-bold leading-6">{guide.description}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="amostra" className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8 lg:py-16">
          <article className="rounded-[2rem] border border-border bg-white p-6 shadow-sm sm:p-10">
            <p className="mb-6 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[.14em] text-emerald-700">
              <BookOpen className="h-3.5 w-3.5" /> Amostra gratuita
            </p>
            <LibraryMarkdown
              markdown={preview}
              headings={previewHeadings}
              mediaPlacements={mediaBundle.placements}
              mediaRecords={mediaBundle.mediaRecords}
            />
            <div className="mt-12 rounded-[1.5rem] bg-[#0f241b] p-6 text-white sm:p-8">
              <LockKeyhole className="h-6 w-6 text-emerald-300" />
              <h2 className="mt-4 text-2xl font-black">Continue no guia completo.</h2>
              <p className="mt-3 text-sm leading-7 text-white/65">A participação confirmada libera a versão completa e associa 1 kg de ração ao compromisso da campanha.</p>
              <Link href="/ajudar/ebooks" className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-full bg-emerald-400 px-5 text-sm font-black text-[#092017]">
                Quero este guia + 1 kg <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </article>

          <aside className="space-y-4">
            <div className="rounded-3xl border border-border bg-white p-6">
              <ShieldCheck className="h-6 w-6 text-emerald-700" />
              <h2 className="mt-3 text-lg font-black">Conteúdo educativo</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Os guias organizam informação prática e fontes de referência. Não substituem avaliação veterinária, nutricional ou comportamental individual quando necessária.</p>
            </div>
            <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-6">
              <PawPrint className="h-6 w-6 text-emerald-700" />
              <h2 className="mt-3 text-lg font-black">O guia também move alimento.</h2>
              <p className="mt-2 text-sm leading-6 text-emerald-950/65">Na oferta-base da campanha, cada eBook confirmado cria o compromisso MyPets de 1 kg de ração.</p>
            </div>
          </aside>
        </section>
      </main>
      <SiteFooter />
      <AuthDialog />
    </>
  );
}
