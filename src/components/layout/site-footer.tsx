"use client";

import * as React from "react";
import { ArrowRight, Instagram, Facebook, Globe2 } from "lucide-react";
import { useLocale } from "@/lib/i18n/locale-context";
import { LocalePill } from "@/components/layout/site-header";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/brand";

const SOCIALS = [
  { icon: Instagram, label: "Instagram @mypets.lat", href: BRAND.instagramUrl },
  { icon: Facebook, label: "Facebook @mypets.lat", href: BRAND.facebookUrl },
  { icon: Globe2, label: "FacePets", href: BRAND.facePetsUrl },
];

const SECTION_IDS = ["/#historias", "/#como-ajudar", "/causas", "/projetos", "/join/padrinho", "/#impacto"];

const LEGAL_LINKS = [
  ["69.093.616/0001-50 MyPets Brasil", "/institucional#brasil"],
  ["MyPets Europe", "/institucional#europe"],
  ["Termos", "/legal/termos"],
  ["Privacidade", "/legal/privacidade"],
  ["Cookies", "/legal/cookies"],
  ["Loja", "/legal/loja"],
] as const;

export function SiteFooter() {
  const { dict, locale, setLocale } = useLocale();
  const { toast } = useToast();
  const [email, setEmail] = React.useState("");
  const [sending, setSending] = React.useState(false);

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    try {
      const res = await fetch("/api/v1/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, locale, consent: true }) });
      if (!res.ok) throw new Error();
      toast({ title: dict.footer.newsletterSuccess, duration: 4000 });
      setEmail("");
    } catch {
      toast({ title: dict.footer.newsletterError, variant: "destructive", duration: 4000 });
    } finally {
      setSending(false);
    }
  };

  const columns: { title: string; links: string[]; hrefs: string[] }[] = [
    { title: dict.footer.navigation, links: dict.footer.navLinks, hrefs: SECTION_IDS },
    { title: dict.footer.institutional, links: dict.footer.instLinks, hrefs: ["/sobre", "/sobre#parceiros", "/sobre#transparencia", "/guias", "/sobre#imprensa", "/sobre#contato"] },
    { title: dict.footer.help, links: dict.footer.helpLinks, hrefs: ["/preciso-de-apoio", "/apoiar", "/join/padrinho", "/join/voluntario", "/join/adotar", "/join/projeto"] },
  ];

  return (
    <footer className="mt-auto bg-[#073d3a] text-white">
      <div className="mx-auto max-w-[1440px] px-4 pb-7 pt-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr_1fr_1fr_1.45fr]">
          <div>
            <div className="flex items-center gap-3"><img src={BRAND.logoUrl} alt="MyPets" className="h-14 w-14 rounded-full object-contain" /><div><p className="text-xl font-black tracking-tight">My<span className="text-coral">Pets</span></p><p className="text-[10px] font-semibold text-white/55">Juntos, cada pet tem futuro.</p></div></div>
            <p className="mt-4 max-w-[300px] text-[12px] leading-relaxed text-white/60">{dict.footer.about}</p>
            <ul className="mt-5 flex gap-2.5" aria-label="Canais oficiais MyPets">
              {SOCIALS.map((s) => <li key={s.label}><a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/8 text-white/75 transition hover:bg-coral hover:text-white"><s.icon className="h-4 w-4" /></a></li>)}
            </ul>
          </div>

          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="text-[10px] font-black uppercase tracking-[0.13em] text-white/40">{col.title}</h3>
              <ul className="mt-3 flex flex-col gap-2">
                {col.links.map((link, i) => <li key={link}><a href={col.hrefs[i] ?? "/"} className="text-[12px] font-medium text-white/72 transition hover:text-coral">{link}</a></li>)}
              </ul>
            </nav>
          ))}

          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.13em] text-white/40">{dict.footer.newsletter}</h3>
            <p className="mt-3 text-[12px] text-white/62">{dict.footer.newsletterDesc}</p>
            <form onSubmit={subscribe} className="mt-3"><div className="flex items-center overflow-hidden rounded-xl border border-white/15 bg-white/8 focus-within:border-coral/60"><label htmlFor="newsletter-email" className="sr-only">{dict.footer.newsletterPlaceholder}</label><input id="newsletter-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder={dict.footer.newsletterPlaceholder} autoComplete="email" className="h-10 w-full bg-transparent px-3 text-[12px] text-white placeholder:text-white/35 focus:outline-none" /><button type="submit" disabled={sending} aria-label={dict.footer.newsletter} className="flex h-10 w-11 shrink-0 items-center justify-center text-coral transition hover:bg-coral hover:text-white disabled:opacity-50"><ArrowRight className="h-4 w-4" /></button></div></form>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-start gap-2 lg:justify-end">{dict.footer.countries.map((c) => <LocalePill key={c.locale} label={c.label} flag={c.flag} active={locale === c.locale} onClick={() => setLocale(c.locale)} />)}</div>

        <nav aria-label="Informação legal e operadores" className="mt-6 flex flex-wrap gap-x-4 gap-y-2 border-t border-white/10 pt-5 text-[10.5px] text-white/50">
          {LEGAL_LINKS.map(([label, href]) => <a key={href} href={href} className="transition hover:text-coral">{label}</a>)}
        </nav>

        <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10.5px] text-white/40"><span>Plataforma tecnológica MyPets</span><a href="/institucional#tecnologia" className="font-semibold text-white/55 transition hover:text-coral">estrutura e operadores</a></div>
          <p className={cn("font-hand rotate-[-1deg] text-[18px] text-white/68")}>{dict.footer.motto} <span aria-hidden>♡</span></p>
        </div>
      </div>
    </footer>
  );
}
