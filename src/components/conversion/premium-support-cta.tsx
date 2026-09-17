"use client";

import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

type VisualProps = {
  label: string;
  detail?: string;
  compact?: boolean;
  showArrow?: boolean;
};

function SupportVisual({ label, detail, compact = false, showArrow = true }: VisualProps) {
  return (
    <>
      <span aria-hidden className="pointer-events-none absolute -left-14 top-[-55%] h-[210%] w-10 rotate-[18deg] bg-white/25 blur-md transition-transform duration-700 ease-out group-hover:translate-x-[380px]" />
      <span aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(255,255,255,0.28),transparent_33%)] opacity-80" />
      <span className={cn("relative flex shrink-0 items-center justify-center rounded-full bg-white/16 ring-1 ring-white/25", compact ? "h-7 w-7" : "h-9 w-9")}>
        <span aria-hidden className="absolute inset-1 rounded-full bg-white/15 animate-pulse" />
        <Heart className={cn("relative fill-white text-white", compact ? "h-3.5 w-3.5" : "h-4 w-4")} />
      </span>
      <span className="relative min-w-0 text-left leading-tight">
        <span className={cn("block whitespace-nowrap font-black tracking-[-0.01em]", compact ? "text-[12.5px]" : "text-sm")}>{label}</span>
        {detail && !compact && <span className="mt-0.5 block whitespace-nowrap text-[9px] font-bold tracking-[0.035em] text-white/72">{detail}</span>}
      </span>
      {showArrow && <ArrowRight className={cn("relative ml-0.5 shrink-0 transition-transform duration-300 group-hover:translate-x-1", compact ? "h-3.5 w-3.5" : "h-4 w-4")} />}
    </>
  );
}

const baseClass = "group relative isolate inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-[linear-gradient(115deg,#ff7b6d_0%,#ef5c50_42%,#d9473f_100%)] font-black text-white ring-1 ring-[#ff8f84]/45 transition-all duration-300 hover:-translate-y-0.5 hover:brightness-[1.025] active:translate-y-0 active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2";

type LinkProps = {
  href: string;
  label?: string;
  detail?: string;
  compact?: boolean;
  showArrow?: boolean;
  className?: string;
};

export function PremiumSupportLink({ href, label = "Apoiar agora", detail, compact = false, showArrow = true, className }: LinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        baseClass,
        compact ? "min-h-10 px-3.5 shadow-[0_9px_24px_-12px_rgba(218,66,57,0.95)]" : "min-h-12 px-5 shadow-[0_16px_34px_-16px_rgba(218,66,57,0.95)] hover:shadow-[0_20px_42px_-17px_rgba(218,66,57,0.92)]",
        className,
      )}
    >
      <SupportVisual label={label} detail={detail} compact={compact} showArrow={showArrow} />
    </Link>
  );
}

type ButtonProps = Omit<LinkProps, "href"> & {
  onClick: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
};

export function PremiumSupportButton({ onClick, disabled = false, type = "button", label = "Apoiar agora", detail, compact = false, showArrow = true, className }: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        baseClass,
        compact ? "min-h-10 px-3.5 shadow-[0_9px_24px_-12px_rgba(218,66,57,0.95)]" : "min-h-12 px-5 shadow-[0_16px_34px_-16px_rgba(218,66,57,0.95)] hover:shadow-[0_20px_42px_-17px_rgba(218,66,57,0.92)]",
        "disabled:pointer-events-none disabled:opacity-55",
        className,
      )}
    >
      <SupportVisual label={label} detail={detail} compact={compact} showArrow={showArrow} />
    </button>
  );
}
