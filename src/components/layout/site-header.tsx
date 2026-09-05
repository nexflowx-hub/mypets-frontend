"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search, Menu, X, ChevronDown, Globe, UserRound } from "lucide-react";
import { useLocale } from "@/lib/i18n/locale-context";
import { LOCALES, LOCALE_META, type Locale } from "@/lib/i18n/dictionaries";
import { MyPetsLogo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useUiStore } from "@/lib/stores";
import { cn } from "@/lib/utils";
import { onAuthChanged, readSession } from "@/lib/auth-client";
import { growthDestination } from "@/lib/growth-navigation";

export function SiteHeader() {
  const { locale, setLocale, dict } = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const setSearchOpen = useUiStore((s) => s.setSearchOpen);
  const setAuthOpen = useUiStore((s) => s.setAuthOpen);
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [signedIn, setSignedIn] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    const sync = () => setSignedIn(Boolean(readSession()));
    sync();
    return onAuthChanged(sync);
  }, []);

  const navItems = [
    { label: dict.nav.discover, href: "#historias" },
    { label: dict.nav.protectors, href: "#missao" },
    { label: dict.nav.animals, href: "#historias" },
    { label: dict.nav.needs, href: "#historias" },
    { label: dict.nav.stories, href: "#historias" },
    { label: dict.nav.impact, href: "#impacto" },
    { label: dict.nav.partners, href: "#parceiros" },
    { label: dict.nav.about, href: "#missao" },
  ];

  const go = (href: string) => {
    setMobileOpen(false);
    if (pathname !== "/") {
      router.push(`/${href}`);
      return;
    }
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const account = () => {
    if (signedIn) router.push("/dashboard");
    else setAuthOpen(true);
  };

  const helpNow = () => router.push(growthDestination("/join/ajudar", { campaign: "always_on", cta: "header_cta" }));

  return (
    <header className={cn("fixed inset-x-0 top-0 z-50 bg-white/95 backdrop-blur-md transition-shadow", scrolled ? "shadow-[0_1px_0_0_var(--border),0_8px_24px_-16px_rgba(16,32,42,0.35)]" : "border-b border-transparent")}>
      <div className="mx-auto flex h-[68px] max-w-[1440px] items-center justify-between gap-2 px-4 sm:gap-4 sm:px-6 lg:px-8">
        <a href="/" aria-label="MyPets — início" className="shrink-0 rounded-md focus-visible:outline-2 focus-visible:outline-coral">
          <MyPetsLogo className="sm:hidden" compact />
          <MyPetsLogo className="hidden sm:inline-flex" />
        </a>

        <nav aria-label={dict.nav.menu} className="hidden items-center gap-5 xl:flex">
          {navItems.map((item) => (
            <button key={item.label} onClick={() => go(item.href)} className="rounded-sm text-[13.5px] font-semibold text-ink/80 transition-colors hover:text-coral focus-visible:outline-2 focus-visible:outline-coral">{item.label}</button>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <button onClick={() => pathname === "/" ? setSearchOpen(true) : router.push("/#historias")} aria-label={dict.nav.search} className="rounded-full p-2.5 text-ink/75 transition-colors hover:bg-accent hover:text-coral focus-visible:outline-2 focus-visible:outline-coral">
            <Search className="h-[18px] w-[18px]" />
          </button>

          <button onClick={account} className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-[13.5px] font-semibold text-ink/80 transition-colors hover:text-coral focus-visible:outline-2 focus-visible:outline-coral md:flex">
            {signedIn && <UserRound className="h-4 w-4" />}
            {signedIn ? "Conta" : dict.nav.signIn}
          </button>

          <Button onClick={helpNow} className="h-10 shrink-0 rounded-full bg-coral px-4 text-[13px] font-bold text-white shadow-[0_6px_16px_-6px_rgba(255,98,88,0.55)] hover:bg-coral-dark sm:px-5 sm:text-[13.5px]">
            {dict.nav.helpNow}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger aria-label="Idioma / Language" className="hidden h-10 items-center gap-1.5 rounded-full border border-border bg-white px-3 text-[13px] font-semibold text-ink/85 transition-colors hover:border-coral/50 hover:text-coral focus-visible:outline-2 focus-visible:outline-coral sm:flex">
              <span aria-hidden>{LOCALE_META[locale].flag}</span><span>{LOCALE_META[locale].short}</span><ChevronDown className="h-3.5 w-3.5 opacity-60" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-44 rounded-xl border-border p-1.5">
              {LOCALES.map((l: Locale) => (
                <DropdownMenuItem key={l} onClick={() => setLocale(l)} className={cn("cursor-pointer gap-2.5 rounded-lg px-3 py-2.5 text-[13.5px] font-semibold", l === locale && "bg-accent text-coral")}>
                  <span aria-hidden className="text-base">{LOCALE_META[l].flag}</span>{l === "en" ? "English" : l === "pt-BR" ? "Português (BR)" : "Português (PT)"}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger aria-label={dict.nav.menu} className="rounded-full p-2.5 text-ink transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-coral xl:hidden">
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </SheetTrigger>
            <SheetContent side="right" className="w-[86vw] max-w-xs border-l-border bg-white p-0">
              <SheetHeader className="border-b border-border px-5 py-4 text-left"><SheetTitle asChild><div><MyPetsLogo compact /></div></SheetTitle></SheetHeader>
              <nav className="flex flex-col gap-1 px-3 py-4" aria-label={dict.nav.menu}>
                {navItems.map((item) => (
                  <button key={item.label} onClick={() => go(item.href)} className="rounded-lg px-3 py-3 text-left text-[15px] font-semibold text-ink transition-colors hover:bg-accent hover:text-coral">{item.label}</button>
                ))}
                <div className="mt-3 border-t border-border pt-4">
                  <button onClick={() => { setMobileOpen(false); account(); }} className="w-full rounded-lg px-3 py-3 text-left text-[15px] font-semibold text-ink transition-colors hover:bg-accent hover:text-coral">{signedIn ? "Conta / Dashboard" : dict.nav.signIn}</button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export function LocalePill({ label, flag, active, onClick }: { label: string; flag: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} aria-pressed={active} className={cn("inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-[13px] font-semibold transition-all", active ? "border-coral/70 bg-coral/10 text-white" : "border-white/15 bg-white/5 text-white/80 hover:border-white/35 hover:text-white")}>
      {flag === "🌐" ? <Globe className="h-4 w-4" aria-hidden /> : <span aria-hidden>{flag}</span>}{label}
    </button>
  );
}
