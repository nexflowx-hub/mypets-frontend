"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, HeartHandshake, Megaphone, PawPrint } from "lucide-react";
import { useLocale } from "@/lib/i18n/locale-context";
import { Button } from "@/components/ui/button";
import { FacePetsPanel } from "./facepets-panel";
import { growthDestination } from "@/lib/growth-navigation";

const AVATARS = [
  { src: "/images/avatar-1.jpg", alt: "Membro da comunidade MyPets" },
  { src: "/images/avatar-2.jpg", alt: "Membro da comunidade MyPets" },
  { src: "/images/avatar-3.jpg", alt: "Membro da comunidade MyPets" },
  { src: "/images/avatar-4.jpg", alt: "Membro da comunidade MyPets" },
];

const heroTrust = {
  "pt-PT": [
    [PawPrint, "Causas e animais num só lugar"],
    [HeartHandshake, "Apoio com intenção clara"],
    [Megaphone, "Partilhar também é ajudar"],
  ],
  "pt-BR": [
    [PawPrint, "Causas e animais em um só lugar"],
    [HeartHandshake, "Apoio com intenção clara"],
    [Megaphone, "Compartilhar também é ajudar"],
  ],
  en: [
    [PawPrint, "Causes and animals in one place"],
    [HeartHandshake, "Support with a clear purpose"],
    [Megaphone, "Sharing is helping too"],
  ],
} as const;

export function HeroSection() {
  const { dict, locale } = useLocale();
  const router = useRouter();
  const trust = heroTrust[locale as keyof typeof heroTrust] ?? heroTrust["pt-PT"];

  return (
    <section id="top" className="xl:grid xl:grid-cols-[minmax(0,1fr)_330px] 2xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="relative isolate min-h-[92svh] overflow-hidden bg-petrol sm:min-h-[86svh] xl:min-h-[calc(100svh-68px)] xl:max-h-[900px]">
        <motion.div initial={{ scale: 1.035, opacity: 0.86 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }} className="absolute inset-0">
          <Image
            src="/images/hero.jpg"
            alt="Protetora a alimentar dois cães resgatados numa rua urbana"
            fill
            priority
            quality={92}
            sizes="(min-width:1280px) calc(100vw - 330px), 100vw"
            className="object-cover object-[74%_18%] sm:object-[center_38%]"
          />
        </motion.div>
        <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-[#071218]/95 via-[#0b161d]/67 to-black/8" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div aria-hidden className="absolute -left-28 top-1/3 h-72 w-72 rounded-full bg-coral/10 blur-3xl" />

        <motion.p initial={{ opacity: 0, x: 18, rotate: 5 }} animate={{ opacity: 1, x: 0, rotate: 8 }} transition={{ duration: 0.7, delay: 0.55 }} className="font-hand absolute right-6 top-[24%] z-10 hidden text-right text-[26px] leading-[1.05] text-white/95 drop-shadow-lg md:block lg:right-12">
          {dict.hero.handwritten}
          <span aria-hidden className="mt-1 block text-2xl">♡</span>
        </motion.p>

        <p className="absolute bottom-8 right-6 z-10 hidden max-w-[210px] text-right text-[13.5px] font-medium leading-snug text-white/80 lg:block lg:right-12">
          {dict.hero.moreThan}
        </p>

        <div className="relative z-10 mx-auto flex h-full max-w-[1440px] flex-col justify-center px-4 py-24 sm:px-6 lg:px-8 xl:py-0">
          <div className="max-w-xl lg:max-w-2xl">
            <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.12 } } }}>
              <motion.div variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } } }} className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/8 px-3.5 py-2 text-[11px] font-extrabold uppercase tracking-[0.15em] text-white/85 backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-coral shadow-[0_0_0_5px_rgba(255,98,88,0.16)]" />
                MyPets · Pessoas a ajudar quem ajuda animais
              </motion.div>

              <motion.h1 variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.62, ease: [0.22, 1, 0.36, 1] } } }} className="text-balance text-[36px] font-extrabold leading-[1.03] tracking-[-0.035em] text-white sm:text-5xl lg:text-[62px]">
                {dict.hero.title}
              </motion.h1>
              <motion.p variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.55 } } }} className="mt-5 max-w-lg text-[15px] leading-relaxed text-white/84 sm:text-base lg:text-[17px] lg:leading-7">{dict.hero.subtitle}</motion.p>

              <motion.div variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }} className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button
                  onClick={() => router.push(growthDestination("/join/ajudar", { campaign: "always_on", cta: "hero_primary" }))}
                  className="group h-12 min-w-[200px] justify-between rounded-xl bg-coral px-6 text-[15px] font-bold text-white shadow-[0_12px_30px_-11px_rgba(255,98,88,0.7)] transition-all hover:-translate-y-0.5 hover:bg-coral-dark hover:shadow-[0_17px_38px_-12px_rgba(255,98,88,0.72)] focus-visible:outline-2 focus-visible:outline-white"
                >
                  {dict.hero.ctaPrimary}
                  <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-1" aria-hidden />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push(growthDestination("/join/protetor", { campaign: "protectors", cta: "hero_secondary" }))}
                  className="h-12 rounded-xl border-white/55 bg-white/8 px-6 text-[15px] font-bold text-white backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-white hover:bg-white/15 hover:text-white focus-visible:outline-2 focus-visible:outline-white"
                >
                  {dict.hero.ctaSecondary}
                </Button>
              </motion.div>

              <motion.div variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }} className="mt-8 grid max-w-xl gap-2 sm:grid-cols-3">
                {trust.map(([Icon, text]) => (
                  <div key={text} className="flex items-center gap-2 rounded-xl border border-white/12 bg-black/12 px-3 py-2.5 text-[11px] font-semibold leading-snug text-white/78 backdrop-blur-sm">
                    <Icon className="h-4 w-4 shrink-0 text-coral" />
                    <span>{text}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85, duration: 0.6 }} className="mt-8 flex items-center gap-3.5">
              <div className="flex -space-x-2.5" aria-hidden>
                {AVATARS.map((a) => (
                  <span key={a.src} className="relative block h-9 w-9 overflow-hidden rounded-full ring-2 ring-white/70 shadow-lg">
                    <Image src={a.src} alt="" fill sizes="36px" className="object-cover" />
                  </span>
                ))}
              </div>
              <p className="max-w-[280px] text-[12.5px] font-medium leading-snug text-white/82">{dict.hero.community}</p>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 xl:hidden">
          <ChevronDown className="h-6 w-6 animate-bounce text-white/70" aria-hidden />
        </div>
      </div>

      <FacePetsPanel className="hidden xl:flex xl:max-h-[calc(100svh-68px)]" />
    </section>
  );
}

export function FacePetsSection() {
  return (
    <section className="xl:hidden" aria-label="FacePets">
      <FacePetsPanel className="w-full" />
    </section>
  );
}
