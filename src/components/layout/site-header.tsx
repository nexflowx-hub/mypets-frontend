"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search, Menu, X, ChevronDown, Globe, UserRound, Heart } from "lucide-react";
import { useLocale } from "@/lib/i18n/locale-context";
import { LOCALES, LOCALE_META, type Locale } from "@/lib/i18n/dictionaries";
import { MyPetsLogo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useUiStore } from "@/lib/stores";
import { cn } from "@/lib/utils";
import { onAuthChanged, readSession } from "@/lib/auth-client";

const OFFICIAL_LOGO = "https://res.cloudinary.com/fnki0ccg/image/upload/v1789145246/Logo_VPT.png";

type NavItem = { label: string; href: string };

function navigation(locale: string): NavItem[] {
  if (locale === "en") {
    return [
      { label: "Home", href: "/" },
      { label: "Causes", href: "/causas" },
      { label: "Stories", href: "/#historias" },
      { label: "How to help", href: "/#como-ajudar" },
      { label: "Sponsors", href: "/join/padrinho" },
      { label: "Projects", href: "/projetos" },
      { label: "Shop", href: "/loja" },
    ];
  }
  return [
    { label: "Início", href: "/" },
    { label: "Causas", href: "/causas" },
    { label: "Histórias", href: "/#historias" },
    { label: "Como ajudar", href: "/#como-ajudar" },
    { label: "Padrinhos", href: "/join/padrinho" },
    { label: "Projetos", href: "/projetos" },
    { label: "Loja", href: "/loja" },
  ];
}

export function SiteHeader() {
  const { locale, setLocale, dict } = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const setSearchOpen = useUiStore((s) => s.setSearchOpen);
  const setAuthOpen = useUiStore((s) => s.setAuthOpen);
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [signedIn, setSignedIn] = React.useState(false);
  const navItems = navigation(locale);

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

  const go = (href: string) => {
    setMobileOpen(false);
    if (href.startsWith("/#") && pathname === "/") {
      document.querySelector(href.slice(1))?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    router.push(href);
  };

  const account = () => {
    if (signedIn) router.push("/dashboard");
    else setAuthOpen(true);
  };

  const helpNow = () => router.push("/apoiar/mypets?utm_source=mypets&utm_medium=internal&utm_campaign=always_on&utm_content=header_quick_support");
  const search = () => pathname === "/" ? setSearchOpen(true) : router.push("/#historias");

  return (
    <header className={cn("fixed inset-x-0 top-0 z-50 border-b border-border/70 bg-white/96 backdrop-blur-xl transition-shadow", scrolled && "shadow-[0_10px_28px_-22px_rgba(16,32,42,0.48)]")}>
      <div className="relative mx-auto flex h-[72px] max-w-[1440px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <a href="/" aria-label="MyPets — início" className="relative z-10 flex shrink-0 items-center focus-visible:outline-2 focus-visible:outline-coral">
          <img src={OFFICIAL_LOGO} alt="MyPets" className="h-12 w-12 rounded-full object-contain drop-shadow-md sm:h-14 sm:w-14 xl:absolute xl:left-0 xl:top-[-4px] xl:h-[88px] xl:w-[88px]" />
          <span className="ml-2 hidden text-lg font-extrabold tracking-tight text-petrol sm:inline xl:ml-[102px]">My<span className="text-coral">Pets</span></span>
        </a>

        <nav aria-label={dict.nav.menu} className="hidden items-center gap-5 xl:flex">
          {navItems.map((item) => (
            <button key={item.href} onClick={() => go(item.href)} className={cn("relative rounded-sm py-2 text-[13px] font-bold text-ink/78 transition-colors hover:text-coral focus-visible:outline-2 focus-visible:outline-coral", pathname === item.href && "text-petrol after:absolute after:inset-x-1 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-coral")}>{item.label}</button>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button onClick={search} aria-label={dict.nav.search} className="hidden h-10 w-[235px] items-center gap-2 rounded-full border border-border bg-[#f8f9fa] px-4 text-left text-[12px] font-medium text-muted-foreground transition hover:border-coral/35 hover:bg-white lg:flex">
            <Search className="h-4 w-4 shrink-0" />
            <span className="truncate">Buscar causas, ONGs ou histórias...</span>
          </button>
          <button onClick={search} aria-label={dict.nav.search} className="rounded-full p-2.5 text-ink/75 transition hover:bg-accent hover:text-coral lg:hidden"><Search className="h-[18px] w-[18px]" /></button>

          <button onClick={account} className="hidden items-center gap-1.5 rounded-full px-2.5 py-2 text-[13px] font-bold text-ink/80 transition hover:text-coral md:flex">
            <UserRound className="h-4 w-4" />{signedIn ? "Conta" : dict.nav.signIn}
          </button>

          <Button onClick={helpNow} className="h-10 shrink-0 rounded-full bg-gradient-to-r from-[#ff7466] to-[#ed554a] px-4 text-[13px] font-extrabold text-white shadow-[0_8px_20px_-9px_rgba(232,79,69,0.75)] hover:from-coral hover:to-coral-dark sm:px-5">
            <Heart className="mr-1.5 h-4 w-4" />
            <span className="hidden sm:inline">Apoiar agora</span><span className="sm:hidden">Apoiar</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger aria-label="Idioma / Language" className="hidden h-9 items-center gap-1 rounded-full px-2 text-[12px] font-bold text-ink/65 transition hover:text-coral 2xl:flex">
              <span aria-hidden>{LOCALE_META[locale].flag}</span><ChevronDown className="h-3.5 w-3.5 opacity-60" />
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
            <SheetTrigger aria-label={dict.nav.menu} className="rounded-full p-2.5 text-ink transition hover:bg-accent xl:hidden">
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </SheetTrigger>
            <SheetContent side="right" className="w-[86vw] max-w-xs border-l-border bg-white p-0">
              <SheetHeader className="border-b border-border px-5 py-4 text-left"><SheetTitle asChild><div><MyPetsLogo compact /></div></SheetTitle></SheetHeader>
              <nav className="flex flex-col gap-1 px-3 py-4" aria-label={dict.nav.menu}>
                {navItems.map((item) => <button key={item.href} onClick={() => go(item.href)} className="rounded-lg px-3 py-3 text-left text-[15px] font-semibold text-ink transition hover:bg-accent hover:text-coral">{item.label}</button>)}
                <button onClick={() => go("/apoiar/mypets?utm_source=mypets&utm_medium=internal&utm_campaign=always_on&utm_content=mobile_quick_support")} className="rounded-lg px-3 py-3 text-left text-[15px] font-black text-coral transition hover:bg-accent">Apoiar agora</button>
                <button onClick={() => go("/apoiar")} className="rounded-lg px-3 py-3 text-left text-[15px] font-semibold text-ink transition hover:bg-accent hover:text-coral">Escolher causa ou categoria</button>
                <button onClick={() => go("/preciso-de-apoio")} className="rounded-lg px-3 py-3 text-left text-[15px] font-semibold text-ink transition hover:bg-accent hover:text-coral">Preciso de apoio</button>
                <a href="https://facepets.org" target="_blank" rel="noopener noreferrer" className="rounded-lg px-3 py-3 text-[15px] font-semibold text-ink transition hover:bg-accent hover:text-coral">FacePets</a>
                <div className="mt-3 border-t border-border pt-4"><button onClick={() => { setMobileOpen(false); account(); }} className="w-full rounded-lg px-3 py-3 text-left text-[15px] font-semibold text-ink transition hover:bg-accent hover:text-coral">{signedIn ? "Conta / Dashboard" : dict.nav.signIn}</button></div>
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
