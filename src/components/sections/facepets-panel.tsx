"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useLocale } from "@/lib/i18n/locale-context";
import { FacePetsLogo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";

/**
 * FacePets promo block — darker, premium, photography-led.
 * Docked beside the hero on xl+, standalone section below.
 */
export function FacePetsPanel({ className }: { className?: string }) {
  const { dict } = useLocale();

  return (
    <aside
      aria-label={dict.facepets.name}
      className={cn(
        "flex flex-col overflow-hidden bg-petrol text-white",
        className
      )}
    >
      <div className="flex h-full flex-col p-6 sm:p-8">
        <FacePetsLogo />

        <div className="relative mt-6 aspect-[3/3.4] w-full shrink-0 overflow-hidden rounded-xl sm:aspect-[4/3] xl:aspect-auto xl:flex-1">
          <Image
            src="/images/facepets-cat.jpg"
            alt="Gato resgatado a olhar diretamente para a câmara — FacePets"
            fill
            sizes="(min-width: 1280px) 300px, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/55" aria-hidden />
          <p className="font-hand absolute right-3 top-3 max-w-[120px] rotate-[-4deg] text-right text-[19px] leading-[1.05] text-white drop-shadow-md">
            {dict.facepets.note} <span aria-hidden>♡</span>
          </p>
        </div>

        <a
          href="https://facepets.org"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-5 text-[14px] font-bold text-petrol transition-all hover:bg-cream hover:shadow-lg focus-visible:outline-2 focus-visible:outline-coral"
        >
          {dict.facepets.cta}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </a>

        <p className="mt-4 text-[13px] leading-relaxed text-white/70">{dict.facepets.text}</p>
        <p className="mt-3 text-[12px] font-semibold tracking-wide text-white/45">{dict.facepets.domain}</p>
      </div>
    </aside>
  );
}
