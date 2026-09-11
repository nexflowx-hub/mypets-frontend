"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, HeartHandshake, House, PawPrint, Sprout, UsersRound } from "lucide-react";
import { useLocale } from "@/lib/i18n/locale-context";
import { Button } from "@/components/ui/button";
import { FacePetsPanel } from "./facepets-panel";
import { growthDestination } from "@/lib/growth-navigation";

const purposeItems = [
  { icon: House, label: "ADOTAR", caption: "É AMOR" },
  { icon: HeartHandshake, label: "AJUDAR", caption: "SALVA" },
  { icon: UsersRound, label: "CONECTAR", caption: "MULTIPLICA" },
  { icon: PawPrint, label: "APOIAR", caption: "TRANSFORMA" },
  { icon: Sprout, label: "JUNTOS", caption: "VAMOS MAIS LONGE" },
];

function heroCopy(locale: string) {
  if (locale === "en") return {
    title: "Together, every pet has a future.",
    subtitle: "We connect people, protectors, NGOs and companies to transform the lives of animals in vulnerable situations.",
    primary: "Make a difference now",
    secondary: "I need support",
    leftNote: "A kinder world for every pet.",
    rightNote: "A kinder world is possible.",
  };
  if (locale === "pt-PT") return {
    title: "Juntos, cada animal tem futuro.",
    subtitle: "Ligamos pessoas, protetores, associações e empresas para transformar a vida de animais em situação de vulnerabilidade.",
    primary: "Faça a diferença agora",
    secondary: "Preciso de apoio",
    leftNote: "Um mundo mais gentil para todos os animais.",
    rightNote: "Um mundo mais gentil é possível.",
  };
  return {
    title: "Juntos, cada pet tem futuro.",
    subtitle: "Conectamos pessoas, protetores, ONGs e empresas para transformar a vida de animais em situação de vulnerabilidade.",
    primary: "Faça a diferença agora",
    secondary: "Preciso de apoio",
    leftNote: "Um mundo mais gentil para todos os pets.",
    rightNote: "Um mundo mais gentil é possível.",
  };
}

export function HeroSection() {
  const { locale } = useLocale();
  const router = useRouter();
  const copy = heroCopy(locale);

  return (
    <section id="top" className="relative overflow-hidden bg-[#eff4f0] pt-[72px]">
      <div className="relative min-h-[520px] sm:min-h-[500px] lg:min-h-[470px]">
        <motion.div initial={{ scale: 1.025, opacity: 0.92 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.9, ease: "easeOut" }} className="absolute inset-0">
          <Image src="/images/hero.jpg" alt="Animais e pessoas ligados pela comunidade MyPets" fill priority quality={92} sizes="100vw" className="object-cover object-[72%_center] sm:object-[68%_center]" />
        </motion.div>
        <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-white via-white/92 to-white/10 sm:from-white/98 sm:via-white/82 sm:to-white/5" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/65 to-transparent" />

        <p className="font-hand absolute left-5 top-20 z-10 hidden max-w-[170px] -rotate-6 text-[25px] leading-[1.05] text-petrol/80 lg:block xl:left-16">{copy.leftNote}<span className="mt-1 block text-coral">♡</span></p>
        <p className="font-hand absolute right-7 top-16 z-10 hidden max-w-[170px] rotate-3 text-right text-[24px] leading-[1.05] text-petrol/85 lg:block xl:right-16">{copy.rightNote}<span className="mt-1 block text-coral">♡</span></p>

        <div className="relative z-10 mx-auto flex min-h-[520px] max-w-[1440px] items-center px-4 pb-12 pt-10 sm:min-h-[500px] sm:px-6 lg:min-h-[470px] lg:px-8 lg:pb-8 lg:pt-6">
          <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.08 } } }} className="w-full max-w-2xl lg:ml-[14%] xl:ml-[18%]">
            <motion.p variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }} className="text-[44px] font-black leading-none tracking-[-0.055em] text-petrol sm:text-[58px] lg:text-[66px]">My<span className="text-coral">Pets</span><sup className="ml-1 align-top text-sm text-petrol">®</sup></motion.p>
            <motion.h1 variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }} className="mt-2 max-w-2xl text-balance text-[32px] font-black leading-[1.06] tracking-[-0.035em] text-petrol sm:text-[40px] lg:text-[44px]">{copy.title}</motion.h1>
            <motion.p variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }} className="mt-3 max-w-xl text-[15px] font-medium leading-6 text-ink/75 sm:text-base">{copy.subtitle}</motion.p>

            <motion.div variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }} className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button onClick={() => router.push(growthDestination("/join/ajudar", { campaign: "always_on", cta: "hero_primary" }))} className="group h-12 rounded-full bg-gradient-to-r from-[#ff7466] to-[#ed554a] px-7 text-[14px] font-extrabold text-white shadow-[0_12px_26px_-12px_rgba(232,79,69,0.75)] hover:from-coral hover:to-coral-dark">
                {copy.primary}<ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <button onClick={() => router.push(growthDestination("/join/protetor", { campaign: "need_support", cta: "hero_secondary" }))} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-petrol/15 bg-white/75 px-6 text-sm font-extrabold text-petrol backdrop-blur-sm transition hover:border-coral/40 hover:text-coral">{copy.secondary}</button>
            </motion.div>

            <motion.div variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }} className="mt-7 grid max-w-2xl grid-cols-3 gap-3 sm:grid-cols-5">
              {purposeItems.map(({ icon: Icon, label, caption }) => (
                <div key={label} className="flex items-center gap-2 sm:block sm:text-center">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/78 text-petrol shadow-sm ring-1 ring-petrol/8 sm:mx-auto"><Icon className="h-[18px] w-[18px]" /></span>
                  <div className="sm:mt-1.5"><p className="text-[10px] font-black tracking-[0.08em] text-petrol">{label}</p><p className="text-[8px] font-bold tracking-[0.08em] text-petrol/55">{caption}</p></div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function FacePetsSection() {
  return <section className="xl:hidden" aria-label="FacePets"><FacePetsPanel className="w-full" /></section>;
}
