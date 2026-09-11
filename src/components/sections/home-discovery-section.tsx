"use client";

import Link from "next/link";
import { ArrowRight, BadgeCheck, Heart, MapPin, PawPrint } from "lucide-react";
import type { StoryDTO } from "@/lib/types";
import { useLocale } from "@/lib/i18n/locale-context";
import { useDonateStore } from "@/lib/stores";

export type HomeCause = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  country: string;
  city: string | null;
  primaryImage: string | null;
  supportMode: string;
  targetAmountCents: number | null;
  raisedAmountCents: number;
  currency: "EUR" | "BRL" | null;
};

function causeProgress(cause: HomeCause) {
  if (!cause.targetAmountCents || cause.targetAmountCents <= 0) return null;
  return Math.max(0, Math.min(100, Math.round((cause.raisedAmountCents / cause.targetAmountCents) * 100)));
}

export function HomeDiscoverySection({ causes, stories }: { causes: HomeCause[]; stories: StoryDTO[] }) {
  const { locale, money } = useLocale();
  const openDonate = useDonateStore((s) => s.openDonate);
  const featuredCauses = causes.slice(0, 4);
  const featuredStories = stories.slice(0, 3);
  const storyDescription = (story: StoryDTO) => locale === "pt-BR" ? story.descPtBR : locale === "en" ? story.descEn : story.descPtPT;

  return (
    <section id="historias" className="bg-white pb-5 pt-1 lg:pb-7">
      <div className="mx-auto grid max-w-[1440px] gap-7 px-4 sm:px-6 lg:grid-cols-[1.55fr_1fr] lg:px-8">
        <div>
          <div className="mb-3 flex items-center justify-between gap-4">
            <h2 className="text-[22px] font-black tracking-tight text-petrol sm:text-[25px]">Causas em destaque</h2>
            <Link href="/causas" className="group inline-flex items-center gap-1.5 text-xs font-extrabold text-petrol/70 hover:text-coral">Ver todas as causas <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" /></Link>
          </div>

          {featuredCauses.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {featuredCauses.map((cause) => {
                const progress = causeProgress(cause);
                const currency: "EUR" | "BRL" = cause.currency ?? (cause.country === "BR" ? "BRL" : "EUR");
                return (
                  <article key={cause.id} className="group overflow-hidden rounded-xl border border-border/80 bg-white shadow-[0_3px_16px_-13px_rgba(16,32,42,0.4)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_28px_-20px_rgba(16,32,42,0.4)]">
                    <Link href={`/causas/${cause.slug}`} className="block">
                      <div className="relative aspect-[16/9] overflow-hidden bg-sand">
                        {cause.primaryImage ? <img src={cause.primaryImage} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" /> : <div className="flex h-full items-center justify-center"><PawPrint className="h-8 w-8 text-coral/50" /></div>}
                        <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-coral px-2 py-1 text-[9px] font-black uppercase tracking-wide text-white"><Heart className="h-2.5 w-2.5 fill-current" /> Apoio</span>
                      </div>
                    </Link>
                    <div className="p-3">
                      <p className="flex items-center gap-1 text-[9.5px] font-bold text-muted-foreground"><MapPin className="h-3 w-3" />{cause.city ? `${cause.city}, ` : ""}{cause.country}</p>
                      <Link href={`/causas/${cause.slug}`}><h3 className="mt-1.5 line-clamp-2 text-[13px] font-black leading-[1.25] text-petrol transition group-hover:text-coral">{cause.title}</h3></Link>
                      {cause.summary && <p className="mt-1.5 line-clamp-2 text-[10px] leading-[1.4] text-muted-foreground">{cause.summary}</p>}
                      {cause.targetAmountCents ? (
                        <div className="mt-2.5">
                          <div className="flex items-baseline justify-between gap-2 text-[9.5px]"><span className="font-black text-petrol">{money(cause.raisedAmountCents, currency)} <span className="font-medium text-muted-foreground">de {money(cause.targetAmountCents, currency)}</span></span>{progress !== null && <span className="font-black text-petrol">{progress}%</span>}</div>
                          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-sand"><div className="h-full rounded-full bg-coral" style={{ width: `${progress ?? 0}%` }} /></div>
                        </div>
                      ) : <div className="mt-2.5 rounded-lg bg-sand px-2 py-1.5 text-[9.5px] font-bold text-ink/60">Apoio financeiro e/ou material</div>}
                      <Link href={`/causas/${cause.slug}`} className="mt-2.5 flex min-h-9 items-center justify-center rounded-lg bg-[#075f58] px-3 text-[11px] font-black text-white transition hover:bg-[#064d48]">Apoiar esta causa</Link>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <Link href="/projetos/together-we-feed" className="group flex min-h-[238px] overflow-hidden rounded-2xl border border-border bg-petrol text-white shadow-sm">
              <div className="relative hidden w-[42%] overflow-hidden sm:block"><img src="https://twf-help.vercel.app/media/images/hero-desktop.webp" alt="Together We Feed" className="absolute inset-0 h-full w-full object-cover" /></div>
              <div className="flex flex-1 flex-col justify-center p-6"><span className="inline-flex w-fit items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-white"><BadgeCheck className="h-3.5 w-3.5 text-emerald-400" /> Primeiro projeto real</span><h3 className="mt-3 text-2xl font-black">Together We Feed</h3><p className="mt-2 max-w-lg text-sm leading-6 text-white/70">Enquanto as primeiras causas verificadas são publicadas, conheça o primeiro projeto real apoiado pelo ecossistema MyPets.</p><span className="mt-4 inline-flex items-center gap-2 text-sm font-black text-coral">Conhecer projeto <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span></div>
            </Link>
          )}
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between gap-4">
            <h2 className="relative pl-7 text-[22px] font-black tracking-tight text-petrol sm:text-[25px]"><span className="absolute left-0 top-1/2 h-1 w-5 -translate-y-1/2 rounded-full bg-coral" />Histórias que precisam de você agora</h2>
            <Link href="/causas" className="group hidden items-center gap-1.5 text-xs font-extrabold text-petrol/70 hover:text-coral xl:inline-flex">Ver histórias <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" /></Link>
          </div>

          {featuredStories.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {featuredStories.map((story) => (
                <article key={story.id} className="group overflow-hidden rounded-xl border border-border/80 bg-white shadow-[0_3px_16px_-13px_rgba(16,32,42,0.4)]">
                  <div className="relative aspect-[16/9] overflow-hidden bg-sand"><img src={story.image} alt={story.imageAlt} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" />{story.isDemo && <span className="absolute left-2 top-2 rounded-full bg-black/50 px-2 py-1 text-[8px] font-black uppercase tracking-wide text-white">Editorial</span>}</div>
                  <div className="p-3"><h3 className="line-clamp-2 text-[12.5px] font-black leading-[1.25] text-petrol">{story.name}</h3><p className="mt-1.5 line-clamp-3 text-[10px] leading-[1.45] text-muted-foreground">{storyDescription(story)}</p><button onClick={() => openDonate({ type: story.kind === "ANIMAL" ? "ANIMAL" : "PROTECTOR", storyId: story.id, label: story.name })} className="mt-2.5 inline-flex items-center gap-1.5 text-[10.5px] font-black text-coral hover:text-coral-dark">Apoiar história <ArrowRight className="h-3.5 w-3.5" /></button></div>
                </article>
              ))}
            </div>
          ) : (
            <div className="flex min-h-[238px] items-center justify-center rounded-2xl border border-dashed border-border bg-cream p-8 text-center"><div><PawPrint className="mx-auto h-7 w-7 text-coral" /><p className="mt-3 text-sm font-black text-petrol">Novas histórias verificadas em breve.</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Preferimos uma área vazia a apresentar histórias fictícias como casos reais.</p></div></div>
          )}
        </div>
      </div>
    </section>
  );
}
