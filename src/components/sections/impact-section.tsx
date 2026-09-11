"use client";

import { motion } from "framer-motion";
import { ArrowRight, PawPrint, ShieldCheck, CircleCheck, Heart, Package, Users, Eye, LockKeyhole, Handshake } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/lib/i18n/locale-context";
import type { MetricDTO } from "@/lib/types";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = { paw: PawPrint, shield: ShieldCheck, check: CircleCheck, heart: Heart, food: Package, users: Users };

function CountUp({ value, decimals, prefix, suffix }: { value: number; decimals: number; prefix?: string | null; suffix?: string | null }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || started.current) return;
      started.current = true;
      if (reduced) { setDisplay(value); return; }
      const t0 = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / 1200);
        setDisplay(value * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, [value]);
  const formatted = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(display);
  return <span ref={ref}>{prefix}{formatted}{suffix && <span className="ml-1 text-[11px] font-bold">{suffix}</span>}</span>;
}

export function ImpactSection({ metrics }: { metrics: MetricDTO[] }) {
  const { locale } = useLocale();
  const label = (m: MetricDTO) => locale === "pt-BR" ? m.labelPtBR : locale === "en" ? m.labelEn : m.labelPtPT;
  const visible = metrics.slice(0, 4);

  return (
    <section id="impacto" className="bg-white">
      <div className="bg-[#075b57] text-white">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-5 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:px-8">
          <div className="min-w-[255px] lg:w-[30%]"><p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/55">Nosso impacto</p><h2 className="mt-1 text-[22px] font-black leading-[1.06] tracking-tight">Mais vidas transformadas, com impacto verificável.</h2></div>
          {visible.length > 0 ? (
            <div className="grid flex-1 grid-cols-2 gap-4 sm:grid-cols-4">
              {visible.map((metric, index) => {
                const Icon = ICONS[metric.icon] ?? PawPrint;
                return <motion.div key={metric.key} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} className="flex items-center gap-3 border-white/14 sm:border-l sm:pl-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/35 bg-white/5"><Icon className="h-5 w-5" /></span><div><p className="text-[19px] font-black leading-none"><CountUp value={metric.value} decimals={metric.decimals} prefix={metric.prefix} suffix={metric.suffix} /></p><p className="mt-1 text-[9.5px] font-semibold leading-tight text-white/65">{label(metric)}</p></div></motion.div>;
              })}
            </div>
          ) : (
            <div className="flex-1 rounded-xl border border-white/15 bg-white/5 px-5 py-4 text-sm text-white/65">Os primeiros indicadores públicos aparecerão aqui quando existirem resultados validados. Não usamos números fictícios como prova social.</div>
          )}
        </div>
      </div>

      <div id="missao" className="border-b border-border bg-white">
        <div className="mx-auto grid max-w-[1440px] gap-4 px-4 py-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-[1.35fr_repeat(4,1fr)] lg:px-8">
          <div><p className="text-[15px] font-black text-petrol">Plataforma confiável e transparente</p><p className="mt-1 text-[10.5px] leading-4 text-muted-foreground">Ligamos pessoas a protetores, causas e projetos com regras claras de publicação e acompanhamento.</p></div>
          {[
            [ShieldCheck, "Projetos identificados", "Camada de validação e contexto"],
            [Eye, "Transparência", "Necessidades e atualizações públicas"],
            [Handshake, "Parceiros confiáveis", "Pessoas, ONGs e instituições"],
            [LockKeyhole, "Dados protegidos", "Privacidade e pagamentos seguros"],
          ].map(([Icon, title, text]) => {
            const Comp = Icon as React.ComponentType<{ className?: string }>;
            return <div key={String(title)} className="flex items-center gap-2.5"><Comp className="h-5 w-5 shrink-0 text-petrol" /><div><p className="text-[10.5px] font-black text-petrol">{String(title)}</p><p className="text-[9px] leading-3.5 text-muted-foreground">{String(text)}</p></div></div>;
          })}
        </div>
      </div>
    </section>
  );
}

export function PartnerBand() {
  return (
    <section id="parceiros" className="border-t border-border/60 bg-white py-8">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-4 px-4 text-center sm:px-6 lg:flex-row lg:justify-between lg:px-8 lg:text-left">
        <div><p className="text-[18px] font-black tracking-tight text-petrol">Tem um projeto, ONG ou causa que precisa de apoio?</p><p className="mt-1 text-sm text-muted-foreground">Candidate-se ao ecossistema MyPets e prepare uma página de mobilização verificável.</p></div>
        <a href="/join/projeto?utm_source=mypets&utm_medium=onsite&utm_campaign=projects&src_cta=partner_band" className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-coral px-6 text-[13px] font-black text-white shadow-[0_8px_22px_-10px_rgba(255,98,88,0.6)] transition hover:-translate-y-0.5 hover:bg-coral-dark">Apresentar projeto <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></a>
      </div>
    </section>
  );
}
