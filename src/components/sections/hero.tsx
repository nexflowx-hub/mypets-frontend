"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useLocale } from "@/lib/i18n/locale-context";
import { Button } from "@/components/ui/button";
import { FacePetsPanel } from "./facepets-panel";

const AVATARS = [
  { src: "/images/avatar-1.jpg", alt: "Membro da comunidade MyPets" },
  { src: "/images/avatar-2.jpg", alt: "Membro da comunidade MyPets" },
  { src: "/images/avatar-3.jpg", alt: "Membro da comunidade MyPets" },
  { src: "/images/avatar-4.jpg", alt: "Membro da comunidade MyPets" },
];

export function HeroSection() {
  const { dict } = useLocale();
  const router = useRouter();

  return (
    <section id="top" className="xl:grid xl:grid-cols-[minmax(0,1fr)_330px] 2xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="relative isolate min-h-[92svh] overflow-hidden bg-petrol sm:min-h-[86svh] xl:min-h-[calc(100svh-68px)] xl:max-h-[860px]">
        <Image
          src="/images/hero.jpg"
          alt="Protetora a alimentar dois cães resgatados numa rua urbana"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[74%_18%] sm:object-[center_38%]"
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-[#0b161d]/92 via-[#0b161d]/62 to-black/10" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/60 to-transparent" />

        <p className="font-hand absolute right-6 top-[26%] z-10 hidden rotate-[8deg] text-right text-[26px] leading-[1.05] text-white/95 drop-shadow-lg md:block lg:right-12">
          {dict.hero.handwritten}
          <span aria-hidden className="mt-1 block text-2xl">♡</span>
        </p>

        <p className="absolute bottom-8 right-6 z-10 hidden max-w-[210px] text-right text-[13.5px] font-medium leading-snug text-white/80 lg:block lg:right-12">
          {dict.hero.moreThan}
        </p>

        <div className="relative z-10 mx-auto flex h-full max-w-[1440px] flex-col justify-center px-4 py-24 sm:px-6 lg:px-8 xl:py-0">
          <div className="max-w-xl lg:max-w-2xl">
            <h1 className="text-balance text-[34px] font-extrabold leading-[1.06] tracking-tight text-white sm:text-5xl lg:text-[58px]">
              {dict.hero.title}
            </h1>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/85 sm:text-base">{dict.hero.subtitle}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                onClick={() => router.push("/join/ajudar?utm_source=mypets&utm_medium=onsite&utm_campaign=always_on&utm_content=hero_primary")}
                className="group h-12 min-w-[190px] justify-between rounded-md bg-coral px-6 text-[15px] font-bold text-white shadow-[0_10px_28px_-10px_rgba(255,98,88,0.65)] transition-all hover:bg-coral-dark hover:shadow-[0_14px_34px_-10px_rgba(255,98,88,0.7)] focus-visible:outline-2 focus-visible:outline-white"
              >
                {dict.hero.ctaPrimary}
                <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-1" aria-hidden />
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/join/protetor?utm_source=mypets&utm_medium=onsite&utm_campaign=protectors&utm_content=hero_secondary")}
                className="h-12 rounded-md border-white/70 bg-white/5 px-6 text-[15px] font-bold text-white backdrop-blur-sm transition-all hover:border-white hover:bg-white/15 hover:text-white focus-visible:outline-2 focus-visible:outline-white"
              >
                {dict.hero.ctaSecondary}
              </Button>
            </div>

            <div className="mt-9 flex items-center gap-3.5">
              <div className="flex -space-x-2.5" aria-hidden>
                {AVATARS.map((a) => (
                  <span key={a.src} className="relative block h-9 w-9 overflow-hidden rounded-full ring-2 ring-white/70">
                    <Image src={a.src} alt="" fill sizes="36px" className="object-cover" />
                  </span>
                ))}
              </div>
              <p className="max-w-[240px] text-[12.5px] font-medium leading-snug text-white/85">{dict.hero.community}</p>
            </div>
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
