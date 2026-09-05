"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  HandHeart,
  ShieldCheck,
  Users,
  CircleCheck,
  LineChart,
  PawPrint,
  UserRound,
  Heart,
  Shield,
} from "lucide-react";
import { useLocale } from "@/lib/i18n/locale-context";
import { growthDestination } from "@/lib/growth-navigation";

const CARD_IMAGES = [
  { src: "/images/card-resgatou.jpg", alt: "Filhote dourado recém-resgatado ao colo" },
  { src: "/images/card-alimentou.jpg", alt: "Protetora a alimentar cães de rua" },
  { src: "/images/card-tratou.jpg", alt: "Gato resgatado tratado ao colo, envolto numa manta" },
  { src: "/images/card-acolheu.jpg", alt: "Cão preto acolhido em casa ao lado de pessoa" },
];

const STEP_ICONS = [HandHeart, ShieldCheck, Users, CircleCheck, LineChart];
const WAY_ICONS = [PawPrint, UserRound, Heart];
const WAY_DESTINATIONS = ["/causas", "/join/ajudar", "/join/ajudar"];

/**
 * Mission, trust and support paths. The support options route into measurable
 * growth funnels instead of opening a payment UI before live payments exist.
 */
export function MissionBand() {
  const { dict } = useLocale();
  const router = useRouter();

  return (
    <section id="missao" className="bg-cream">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-16 xl:grid-cols-[1.85fr_1fr_1.08fr] xl:gap-8">
        <div>
          <h2 className="max-w-lg text-balance text-[24px] font-extrabold leading-[1.15] tracking-tight text-petrol sm:text-[28px]">
            {dict.mission.title1}{" "}
            <span className="text-coral">{dict.mission.title2}</span>
          </h2>

          <div className="mt-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {dict.mission.cards.map((card, i) => (
              <article key={card.key} className="group">
                <div className="relative aspect-[4/3.4] overflow-hidden rounded-2xl bg-sand shadow-[0_14px_34px_-27px_rgba(16,32,42,0.45)]">
                  <Image
                    src={CARD_IMAGES[i].src}
                    alt={CARD_IMAGES[i].alt}
                    fill
                    quality={88}
                    sizes="(min-width:1280px) 160px, (min-width:1024px) 25vw, 45vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                  />
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-petrol/18 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </div>
                <h3 className="mt-3 text-[15px] font-extrabold text-petrol">{card.title}</h3>
                <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">{card.text}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="lg:border-l lg:border-border lg:pl-8 xl:pl-6">
          <h2 className="text-[21px] font-extrabold tracking-tight text-petrol">{dict.how.title}</h2>
          <ol className="mt-6 flex flex-col gap-5">
            {dict.how.steps.map((step, i) => {
              const Icon = STEP_ICONS[i];
              return (
                <li key={step.title} className="group flex items-start gap-3.5">
                  <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-coral-soft text-coral transition-transform duration-300 group-hover:scale-105">
                    <Icon className="h-[18px] w-[18px]" aria-hidden />
                  </span>
                  <div>
                    <h3 className="text-[14.5px] font-extrabold text-petrol">
                      <span className="mr-1.5 text-coral">{i + 1}.</span>
                      {step.title}
                    </h3>
                    <p className="mt-0.5 text-[12.5px] leading-relaxed text-muted-foreground">{step.text}</p>
                  </div>
                </li>
              );
            })}
          </ol>
          <p className="mt-7 text-[15px] font-extrabold tracking-tight text-petrol">{dict.how.closing}</p>
        </div>

        <div id="formas" className="lg:col-span-2 xl:col-span-1">
          <h2 className="text-[21px] font-extrabold tracking-tight text-petrol">{dict.ways.title}</h2>

          <div className="mt-6 flex flex-col gap-3">
            {dict.ways.cards.map((way, i) => {
              const Icon = WAY_ICONS[i];
              return (
                <button
                  key={way.title}
                  onClick={() => router.push(growthDestination(WAY_DESTINATIONS[i], { campaign: "support_paths", cta: `mission_support_${i + 1}` }))}
                  className="group flex items-center gap-4 rounded-2xl border border-border/70 bg-white p-4 text-left transition-all hover:-translate-y-1 hover:border-coral/40 hover:shadow-[0_16px_34px_-18px_rgba(16,32,42,0.28)] focus-visible:outline-2 focus-visible:outline-coral"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-coral transition-all group-hover:scale-105 group-hover:bg-coral group-hover:text-white">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[14.5px] font-extrabold text-petrol">{way.title}</span>
                    <span className="mt-0.5 block text-[12.5px] text-muted-foreground">{way.text}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-coral opacity-50 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                </button>
              );
            })}
          </div>

          <div className="relative mt-6 overflow-hidden rounded-2xl bg-petrol p-5 text-white shadow-[0_18px_38px_-24px_rgba(16,32,42,0.75)] sm:p-6">
            <div aria-hidden className="pointer-events-none absolute -right-10 -top-14 h-40 w-40 rounded-full bg-[#153847] blur-2xl" />
            <div className="relative flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1f4658] text-[#7fd1de]">
                <Shield className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <h3 className="text-[16px] font-extrabold tracking-tight">{dict.ways.guardians.title}</h3>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-white/70">{dict.ways.guardians.text}</p>
              </div>
            </div>
            <button
              onClick={() => router.push(growthDestination("/join/padrinho", { campaign: "guardians", cta: "mission_guardian" }))}
              className="relative mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-white px-4 text-[13.5px] font-bold text-petrol transition-all hover:-translate-y-0.5 hover:bg-cream hover:shadow-lg focus-visible:outline-2 focus-visible:outline-coral sm:w-auto"
            >
              {dict.ways.guardians.cta}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
