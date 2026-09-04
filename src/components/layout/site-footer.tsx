"use client";

import * as React from "react";
import { ArrowRight, Instagram, Facebook, Youtube, Linkedin, Music2 } from "lucide-react";
import { useLocale } from "@/lib/i18n/locale-context";
import { MyPetsLogo } from "@/components/brand/logo";
import { LocalePill } from "@/components/layout/site-header";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const SOCIALS = [
  { icon: Instagram, label: "Instagram", href: "https://instagram.com/mypets.lat" },
  { icon: Facebook, label: "Facebook", href: "https://facebook.com/mypets.lat" },
  { icon: Youtube, label: "YouTube", href: "https://youtube.com/@mypets" },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/company/mypets" },
  { icon: Music2, label: "TikTok", href: "https://tiktok.com/@mypets" },
];

const SECTION_IDS = ["#historias", "#missao", "#historias", "#historias", "#historias", "#impacto"];

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
      const res = await fetch("/api/v1/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale, consent: true }),
      });
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
    {
      title: dict.footer.navigation,
      links: dict.footer.navLinks,
      hrefs: SECTION_IDS,
    },
    {
      title: dict.footer.institutional,
      links: dict.footer.instLinks,
      hrefs: ["#missao", "#parceiros", "#impacto", "#historias", "#parceiros", "#top"],
    },
    {
      title: dict.footer.help,
      links: dict.footer.helpLinks,
      hrefs: ["#top", "#top", "#top", "#top", "#top", "#top"],
    },
  ];

  const goTo = (href: string) =>
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });

  return (
    <footer className="mt-auto bg-[#0d1a22] text-white">
      <div className="mx-auto max-w-[1440px] px-4 pb-8 pt-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1.5fr]">
          {/* Brand */}
          <div>
            <MyPetsLogo light />
            <p className="mt-4 max-w-[300px] text-[13px] leading-relaxed text-white/60">
              {dict.footer.about}
            </p>
            <ul className="mt-6 flex gap-2.5" aria-label="Social">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/8 text-white/75 transition-all hover:bg-coral hover:text-white focus-visible:outline-2 focus-visible:outline-coral"
                  >
                    <s.icon className="h-[17px] w-[17px]" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="text-[12px] font-bold uppercase tracking-[0.12em] text-white/45">
                {col.title}
              </h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {col.links.map((link, i) => (
                  <li key={link}>
                    <button
                      onClick={() => goTo(col.hrefs[i] ?? "#top")}
                      className="text-[13.5px] font-medium text-white/75 transition-colors hover:text-coral focus-visible:outline-2 focus-visible:outline-coral"
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* Newsletter */}
          <div>
            <h3 className="text-[12px] font-bold uppercase tracking-[0.12em] text-white/45">
              {dict.footer.newsletter}
            </h3>
            <p className="mt-4 text-[13px] text-white/65">{dict.footer.newsletterDesc}</p>
            <form onSubmit={subscribe} className="mt-4" noValidate={false}>
              <div className="flex items-center overflow-hidden rounded-xl border border-white/15 bg-white/6 focus-within:border-coral/60">
                <label htmlFor="newsletter-email" className="sr-only">
                  {dict.footer.newsletterPlaceholder}
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={dict.footer.newsletterPlaceholder}
                  autoComplete="email"
                  className="h-11 w-full bg-transparent px-4 text-[13.5px] text-white placeholder:text-white/40 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={sending}
                  aria-label={dict.footer.newsletter}
                  className="flex h-11 w-12 shrink-0 items-center justify-center text-coral transition-colors hover:bg-coral hover:text-white disabled:opacity-50"
                >
                  <ArrowRight className="h-[18px] w-[18px]" aria-hidden />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Country selector */}
        <div className="mt-12 flex flex-wrap justify-start gap-3 lg:justify-end">
          {dict.footer.countries.map((c) => (
            <LocalePill
              key={c.locale}
              label={c.label}
              flag={c.flag}
              active={locale === c.locale}
              onClick={() => setLocale(c.locale)}
            />
          ))}
        </div>

        {/* Institutional line */}
        <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[11.5px] text-white/50">
            <span className="font-bold text-white/65">{dict.footer.poweredBy}</span>
            <span>{dict.footer.companyNumber}</span>
            <span>{dict.footer.address}</span>
            <a
              href="https://humanimpact.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-white/60 underline-offset-2 transition-colors hover:text-coral hover:underline"
            >
              {dict.footer.companySite}
            </a>
          </div>
          <p className={cn("font-hand rotate-[-1.5deg] text-[19px] text-white/70")}>
            {dict.footer.motto} <span aria-hidden>♡</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
