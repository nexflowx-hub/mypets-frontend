import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock3, PawPrint, Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { AuthDialog } from "@/components/layout/auth-dialog";
import { GuideCover } from "@/components/library/guide-cover";
import { getDigitalLibraryIndex } from "@/lib/digital-library";

export const metadata: Metadata = {
  title: "Biblioteca Digital MyPets | Guias para cuidar melhor",
  description: "Guias digitais práticos sobre cuidados, filhotes, treino, raças e alimentação. Leia uma amostra e participe da campanha 1 eBook = 1 kg de ração.",
  alternates: { canonical: "/biblioteca" },
};

export const revalidate = 300;

export default async function LibraryPage() {
  const library = await getDigitalLibraryIndex();

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-[#f8f6ef] pt-[72px] text-petrol">
        <section className="overflow-hidden bg-[#0f241b] text-white">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[.16em] text-emerald-200">
              <BookOpen className="h-3.5 w-3.5" /> Biblioteca Digital MyPets
            </span>
            <h1 className="mt-5 max-w-4xl text-balance text-4xl font-black leading-tight tracking-[-.035em] sm:text-6xl">
              Uma biblioteca para cuidar melhor. <span className="text-emerald-300">Cada guia desbloqueado também garante 1 kg.</span>
            </h1>
            <p className="mt-5 max-w-3xl text-base font-semibold leading-8 text-white/68 sm:text-lg">
              Explore 13 guias, leia amostras gratuitas e escolha apenas o que faz sentido para o seu momento. O acesso completo é liberado depois da participação confirmada, sem obrigar a criar conta no checkout.
            </p>
            <div className="mt-7 flex flex-wrap gap-3 text-xs font-black">
              <span className="rounded-full bg-white/8 px-4 py-2">{library.guides.length} guias disponíveis</span>
              <span className="rounded-full bg-white/8 px-4 py-2">Atlas com 64 raças</span>
              <span className="rounded-full bg-white/8 px-4 py-2">Leitura web + PDF</span>
              <span className="rounded-full bg-white/8 px-4 py-2">R$ {library.collection.basePriceBrl.toFixed(2).replace(".", ",")} = 1 guia + 1 kg</span>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[.14em] text-emerald-700">Coleção Cuidar Melhor</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Escolha por necessidade, não por impulso.</h2>
            </div>
            <Link href="/ajudar/ebooks" className="inline-flex items-center gap-2 text-sm font-black text-emerald-700">
              Participar da campanha <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {library.guides.map((guide) => (
              <article key={guide.id} className="group overflow-hidden rounded-[1.75rem] border border-border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <Link href={"/biblioteca/" + guide.slug} className="block">
                  <GuideCover
                    slug={guide.slug}
                    title={guide.title}
                    image={guide.image}
                    compact
                    className="aspect-[4/3] transition duration-500 group-hover:scale-[1.01]"
                  />
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-[11px] font-bold text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" /> ~{guide.readingMinutes} min</span>
                      <span className="inline-flex items-center gap-1"><PawPrint className="h-3.5 w-3.5 text-emerald-600" /> 1 kg</span>
                    </div>
                    <h3 className="mt-3 text-2xl font-black leading-tight">{guide.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{guide.description}</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-emerald-700">
                      Ver guia e amostra <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </article>
            ))}

            <div className="flex min-h-[320px] flex-col justify-between rounded-[1.75rem] bg-petrol p-7 text-white md:col-span-2 xl:col-span-1">
              <Sparkles className="h-8 w-8 text-emerald-300" />
              <div>
                <p className="text-xs font-black uppercase tracking-[.14em] text-emerald-300">A biblioteca vai crescer</p>
                <h3 className="mt-2 text-3xl font-black">Mais temas, a mesma missão.</h3>
                <p className="mt-3 text-sm leading-7 text-white/65">Novos guias podem cobrir passeios, cão idoso, adoção adulta, enriquecimento, crianças e cães e outras necessidades do dia a dia.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <AuthDialog />
    </>
  );
}
