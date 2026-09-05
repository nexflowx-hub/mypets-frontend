"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, PawPrint, ShieldCheck, CircleCheck, Heart, Package, Users } from "lucide-react";
import { useLocale } from "@/lib/i18n/locale-context";
import type { MetricDTO } from "@/lib/types";
import { cn } from "@/lib/utils";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  paw: PawPrint,
  shield: ShieldCheck,
  check: CircleCheck,
  heart: Heart,
  food: Package,
  users: Users,
};

const COLORS: Record<string, { bg: string; fg: string }> = {
  coral: { bg: "bg-coral-soft", fg: "text-coral" },
  teal: { bg: "bg-teal/15", fg: "text-teal" },
  amber: { bg: "bg-amber-brand/15", fg: "text-amber-brand" },
  red: { bg: "bg-[#e05252]/12", fg: "text-[#e05252]" },
  blue: { bg: "bg-petrol-light/12", fg: "text-petrol-light" },
  green: { bg: "bg-[#5f9e63]/15", fg: "text-[#5f9e63]" },
};

function CountUp({ value, decimals, prefix, suffix }: { value: number; decimals: number; prefix?: string | null; suffix?: string | null }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        if (reduced) {
          setDisplay(value);
          return;
        }
        const t0 = performance.now();
        const dur = 1400;
        const tick = (t: number) => {
          const p = Math.min(1, (t - t0) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          setDisplay(value * eased);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value]);

  const formatted = new Intl.NumberFormat("pt-PT", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(display);

  return <span ref={ref}>{prefix}{formatted}{suffix && <span className="ml-1 text-[13px] font-bold">{suffix}</span>}</span>;
}

function MetricTile({ metric, label }: { metric: MetricDTO; label: string }) {
  const Icon = ICONS[metric.icon] ?? PawPrint;
  const color = COLORS[metric.color] ?? COLORS.coral;
  return (
    <div className="flex items-center gap-3.5 rounded-xl border border-border/60 bg-white p-4 transition-shadow hover:shadow-[0_10px_26px_-18px_rgba(16,32,42,0.3)]">
      <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-full", color.bg, color.fg)}><Icon className="h-5 w-5" aria-hidden /></span>
      <div className="min-w-0">
        <p className="text-[20px] font-extrabold leading-tight tracking-tight text-petrol"><CountUp value={metric.value} decimals={metric.decimals} prefix={metric.prefix} suffix={metric.suffix} /></p>
        <p className="truncate text-[11.5px] font-semibold text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

export function ImpactSection({ metrics }: { metrics: MetricDTO[] }) {
  const { dict, locale } = useLocale();
  const router = useRouter();
  const label = (m: MetricDTO) => locale === "pt-BR" ? m.labelPtBR : locale === "en" ? m.labelEn : m.labelPtPT;

  return (
    <section id="impacto" className="bg-cream pb-16 lg:pb-24">
      <div className="mx-auto grid max-w-[1440px] gap-8 px-4 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:px-8">
        <div className="relative isolate flex min-h-[340px] flex-col justify-center overflow-hidden rounded-2xl bg-petrol p-7 sm:p-10 lg:min-h-[420px]">
          <Image src="/images/cta-dog.jpg" alt="Cão resgatado a olhar para a câmara" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover object-[72%_center] opacity-90" />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-[#0b161d]/94 via-[#0b161d]/72 to-[#0b161d]/15" />
          <div className="relative z-10 max-w-sm">
            <h2 className="text-balance text-[26px] font-extrabold leading-[1.14] tracking-tight text-white sm:text-[32px]">{dict.cta.title}</h2>
            <button onClick={() => router.push("/join/ajudar?utm_source=mypets&utm_medium=onsite&utm_campaign=always_on&utm_content=impact_cta")} className="group mt-7 inline-flex min-h-11 items-center gap-2 rounded-lg bg-white px-5 text-[14px] font-bold text-petrol transition-all hover:bg-cream hover:shadow-xl focus-visible:outline-2 focus-visible:outline-coral">
              {dict.cta.button}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
            </button>
          </div>
        </div>

        <div>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="text-[22px] font-extrabold tracking-tight text-petrol sm:text-[26px]">{dict.impact.title}</h2>
            <button onClick={() => document.querySelector("#historias")?.scrollIntoView({ behavior: "smooth" })} className="group inline-flex items-center gap-1.5 text-[13px] font-bold text-coral transition-colors hover:text-coral-dark">
              {dict.impact.viewAll}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
            </button>
          </div>

          {metrics.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-border bg-white p-7">
              <p className="text-sm font-extrabold text-petrol">Impacto verificável, não estimativas.</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Os primeiros indicadores públicos serão apresentados aqui à medida que existirem casos, apoios e resultados validados pela plataforma.</p>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-3.5 sm:grid-cols-2">{metrics.map((m) => <MetricTile key={m.key} metric={m} label={label(m)} />)}</div>
          )}
        </div>
      </div>
    </section>
  );
}

export function PartnerBand() {
  const { dict } = useLocale();
  return (
    <section id="parceiros" className="border-t border-border/60 bg-white py-12">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-5 px-4 text-center sm:px-6 lg:flex-row lg:justify-between lg:px-8 lg:text-left">
        <p className="max-w-xl text-balance text-[19px] font-extrabold tracking-tight text-petrol sm:text-[22px]">{dict.partner.text}</p>
        <a href="/join/projeto?utm_source=mypets&utm_medium=onsite&utm_campaign=projects&utm_content=partner_band" className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-coral px-6 text-[14px] font-bold text-white shadow-[0_8px_22px_-10px_rgba(255,98,88,0.6)] transition-all hover:bg-coral-dark focus-visible:outline-2 focus-visible:outline-coral">
          {dict.partner.cta}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
        </a>
      </div>
    </section>
  );
}
