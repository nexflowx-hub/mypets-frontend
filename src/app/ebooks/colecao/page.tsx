import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, BookOpen, CheckCircle2, Heart } from "lucide-react";
import { MyPetsLogo } from "@/components/brand/logo";
import { getEbookAccessPayment } from "@/lib/ebook-access";
import { solidarityEbookBySlug, solidarityEbooks } from "@/lib/solidarity-ebooks";

export const metadata: Metadata = {
  title: "A sua Biblioteca MyPets",
  description: "Acesso aos guias digitais da campanha 1 eBook = 1 kg de ração.",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export const dynamic = "force-dynamic";

export default async function EbookCollectionPage({
  searchParams,
}: {
  searchParams: Promise<{ books?: string; via?: string; receipt?: string }>;
}) {
  const params = await searchParams;

  // Backward compatibility: old emailed/shared receipt links are upgraded once
  // to an HttpOnly access session, then the receipt disappears from the URL.
  if (params.receipt) {
    const target = new URLSearchParams({
      receipt: params.receipt,
      next: "/ebooks/colecao",
    });
    if (params.books) target.set("books", params.books);
    if (params.via) target.set("via", params.via);
    redirect("/ebooks/acesso?" + target.toString());
  }

  const payment = await getEbookAccessPayment();
  if (!payment) redirect("/ajudar/ebooks?access=required");

  const entitledSlugs = (payment.rewardKeys ?? []).filter((slug) => Boolean(solidarityEbookBySlug[slug]));
  if (entitledSlugs.length === 0) redirect("/ajudar/ebooks?access=invalid");

  const requested = (params.books ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter((slug) => entitledSlugs.includes(slug));

  const selectedSlugs = requested.length ? requested : entitledSlugs;
  const selected = selectedSlugs.map((slug) => solidarityEbookBySlug[slug]).filter(Boolean);

  return (
    <main className="min-h-screen bg-[#f8f6ef] text-petrol">
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/"><MyPetsLogo /></Link>
          <div className="flex items-center gap-4">
            <Link href="/ajudar/ebooks" className="text-xs font-black text-emerald-700">Campanha 1 eBook = 1 kg</Link>
            <Link href="/ebooks/sair" className="text-[10px] font-bold text-petrol/45 hover:text-petrol">Sair deste dispositivo</Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
        <div className="rounded-[2rem] bg-petrol p-7 text-white sm:p-10">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
            <CheckCircle2 className="h-6 w-6" />
          </span>
          <p className="mt-5 text-xs font-black uppercase tracking-[.16em] text-emerald-300">Coleção MyPets</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">A sua biblioteca está pronta.</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/68">
            Leia online com índice e progresso de leitura. Se quiser, use “Guardar / imprimir em PDF” dentro de cada guia.
          </p>
          {params.via === "apoio-confirmado" && (
            <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-400/10 px-3 py-1.5 text-xs font-bold text-emerald-200">
              <Heart className="h-3.5 w-3.5 fill-emerald-300" /> Obrigado por colocar alimento em movimento.
            </p>
          )}
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-2">
          {selected.map((ebook) => (
            <Link
              key={ebook.slug}
              href={`/biblioteca/${ebook.slug}/ler`}
              className="group grid overflow-hidden rounded-3xl border border-border bg-white sm:grid-cols-[150px_1fr] transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="relative min-h-40">
                <Image src={ebook.image} alt="" fill sizes="150px" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-petrol/40 to-transparent" />
              </div>
              <div className="p-5">
                <p className="text-[10px] font-black uppercase tracking-wide text-emerald-700"><BookOpen className="mr-1 inline h-3.5 w-3.5" /> eBook MyPets</p>
                <h2 className="mt-2 text-xl font-black">{ebook.title}</h2>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">{ebook.promise}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-xs font-black text-emerald-700">
                  Abrir eBook <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
          <p className="text-sm font-black text-emerald-950">1 eBook = 1 kg</p>
          <p className="mt-1 text-xs leading-5 text-emerald-900/70">A coleção digital é a recompensa de agradecimento. A unidade alimentar só conta depois da confirmação financeira no backend.</p>
        </div>
      </section>
    </main>
  );
}
