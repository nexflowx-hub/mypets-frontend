"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLocale } from "@/lib/i18n/locale-context";
import { FacePetsLogo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";

export function FacePetsPanel({ className }: { className?: string }) {
  const { dict } = useLocale();

  return (
    <aside aria-label={dict.facepets.name} className={cn("flex flex-col overflow-hidden bg-petrol text-white", className)}>
      <div className="flex h-full flex-col p-6 sm:p-8">
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>
          <FacePetsLogo />
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="group relative mt-6 aspect-[3/3.4] w-full shrink-0 overflow-hidden rounded-2xl shadow-[0_22px_42px_-24px_rgba(0,0,0,0.65)] sm:aspect-[4/3] xl:aspect-auto xl:flex-1">
          <Image
            src="/images/facepets-cat.jpg"
            alt="Gato resgatado a olhar diretamente para a câmara — FacePets"
            fill
            quality={90}
            sizes="(min-width: 1280px) 300px, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.035]"
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/60" aria-hidden />
          <div aria-hidden className="absolute inset-0 ring-1 ring-inset ring-white/10" />
          <p className="font-hand absolute right-3 top-3 max-w-[125px] rotate-[-4deg] text-right text-[19px] leading-[1.05] text-white drop-shadow-md">
            {dict.facepets.note} <span aria-hidden>♡</span>
          </p>
        </motion.div>

        <a
          href="https://facepets.org"
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-5 text-[14px] font-bold text-petrol transition-all hover:-translate-y-0.5 hover:bg-cream hover:shadow-lg focus-visible:outline-2 focus-visible:outline-coral"
        >
          {dict.facepets.cta}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
        </a>

        <p className="mt-4 text-[13px] leading-relaxed text-white/70">{dict.facepets.text}</p>
        <p className="mt-3 text-[12px] font-semibold tracking-wide text-white/45">{dict.facepets.domain}</p>
      </div>
    </aside>
  );
}
