"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PawPrint } from "lucide-react";
import { PremiumSupportLink } from "@/components/conversion/premium-support-cta";

const HIDDEN_PREFIXES = ["/dashboard", "/admin"];

export function PublicConversionDock() {
  const pathname = usePathname();
  if (HIDDEN_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-40 md:hidden" aria-label="Ações rápidas">
      <div className="grid grid-cols-[1.25fr_.9fr] items-stretch gap-1.5 overflow-hidden rounded-[22px] border border-white/70 bg-white/96 p-1.5 shadow-[0_20px_54px_-19px_rgba(16,32,42,0.6)] backdrop-blur-xl">
        <PremiumSupportLink
          href="/apoiar/mypets?utm_source=mypets&utm_medium=internal&utm_campaign=always_on&utm_content=mobile_conversion_dock"
          label="Apoiar agora"
          detail="rápido e seguro"
          showArrow={false}
          className="min-h-13 w-full rounded-[17px] px-3"
        />
        <Link href="/preciso-de-apoio?utm_source=mypets&utm_medium=internal&utm_campaign=need_support&utm_content=mobile_conversion_dock" className="inline-flex min-h-13 items-center justify-center gap-2 rounded-[17px] px-3 text-xs font-black text-petrol transition active:bg-accent">
          <PawPrint className="h-4 w-4 text-[#0d6e6b]" /> Preciso de apoio
        </Link>
      </div>
    </div>
  );
}
