import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export type LegalSection = { title: string; paragraphs: string[]; bullets?: string[] };

export function LegalDocument({ title, eyebrow, intro, sections, updated = "17 de setembro de 2026" }: { title: string; eyebrow: string; intro: string; sections: LegalSection[]; updated?: string }) {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-[#fbfcfc] pt-[72px]">
        <section className="border-b border-border bg-white">
          <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-coral">{eyebrow}</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-petrol sm:text-5xl">{title}</h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground">{intro}</p>
            <p className="mt-4 text-xs font-semibold text-petrol/50">Ultima atualizacao: {updated}</p>
          </div>
        </section>
        <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="space-y-8">
            {sections.map((section) => <section key={section.title} className="rounded-3xl border border-border bg-white p-6 sm:p-7"><h2 className="text-xl font-black text-petrol">{section.title}</h2><div className="mt-4 space-y-3 text-sm leading-7 text-muted-foreground">{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{section.bullets && <ul className="list-disc space-y-2 pl-5">{section.bullets.map((item) => <li key={item}>{item}</li>)}</ul>}</div></section>)}
          </div>
          <div className="mt-10 flex flex-wrap gap-3 text-sm font-bold"><Link href="/institucional/entidades" className="rounded-full border border-border bg-white px-4 py-2 text-petrol">Entidades e operadores</Link><Link href="/legal/privacidade" className="rounded-full border border-border bg-white px-4 py-2 text-petrol">Privacidade</Link><Link href="/legal/loja" className="rounded-full border border-border bg-white px-4 py-2 text-petrol">Loja</Link><a href="mailto:contact@mypets.lat" className="rounded-full bg-petrol px-4 py-2 text-white">contact@mypets.lat</a></div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
