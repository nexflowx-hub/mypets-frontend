import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { LEGAL_PAGES } from "@/lib/legal/pages";

export function generateStaticParams() {
  return Object.keys(LEGAL_PAGES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = LEGAL_PAGES[slug];
  if (!page) return {};
  return {
    title: `${page.title} | MyPets`,
    description: page.description,
    alternates: { canonical: `/legal/${slug}` },
  };
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = LEGAL_PAGES[slug];
  if (!page) notFound();

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-[#fbfcfc] pt-[72px]">
        <section className="border-b border-border bg-white">
          <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-coral">Legal & transparência</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-petrol sm:text-5xl">{page.title}</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">{page.description}</p>
            <p className="mt-4 text-xs font-semibold text-petrol/45">Última atualização: {page.updated}</p>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="space-y-8">
            {page.sections.map((section) => (
              <article key={section.title} className="rounded-3xl border border-border bg-white p-6 sm:p-8">
                <h2 className="text-xl font-black text-petrol">{section.title}</h2>
                <div className="mt-4 space-y-4 text-sm leading-7 text-muted-foreground">
                  {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  {section.bullets && <ul className="list-disc space-y-2 pl-5">{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}
                </div>
              </article>
            ))}
          </div>

          <aside className="mt-10 rounded-3xl bg-[#073d3a] p-6 text-white sm:p-8">
            <h2 className="text-lg font-black">Entidades e contactos</h2>
            <p className="mt-2 text-sm leading-6 text-white/70">Consulte a identificação do operador aplicável no Brasil e nos mercados internacionais, bem como os canais oficiais de suporte e privacidade.</p>
            <Link href="/institucional" className="mt-5 inline-flex rounded-full bg-coral px-5 py-2.5 text-sm font-black text-white">Ver estrutura institucional</Link>
          </aside>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
