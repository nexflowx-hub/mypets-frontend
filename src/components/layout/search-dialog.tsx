"use client";

import * as React from "react";
import { CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Compass, PawPrint, HeartHandshake, LineChart, Handshake, Info } from "lucide-react";
import { useLocale } from "@/lib/i18n/locale-context";
import { useUiStore } from "@/lib/stores";
import type { StoryDTO } from "@/lib/types";

export function SearchDialog({ stories }: { stories: StoryDTO[] }) {
  const { searchOpen, setSearchOpen } = useUiStore();
  const { dict, locale } = useLocale();

  const label = (m: { labelPtPT: string; labelPtBR: string; labelEn: string }) =>
    locale === "pt-BR" ? m.labelPtBR : locale === "en" ? m.labelEn : m.labelPtPT;

  const sections = [
    { icon: Compass, name: dict.nav.discover, id: "#historias" },
    { icon: HeartHandshake, name: dict.nav.protectors, id: "#missao" },
    { icon: PawPrint, name: dict.nav.animals, id: "#historias" },
    { icon: PawPrint, name: dict.nav.needs, id: "#historias" },
    { icon: PawPrint, name: dict.nav.stories, id: "#historias" },
    { icon: LineChart, name: dict.nav.impact, id: "#impacto" },
    { icon: Handshake, name: dict.nav.partners, id: "#parceiros" },
    { icon: Info, name: dict.nav.about, id: "#missao" },
  ];

  const run = React.useCallback(
    (id: string) => {
      setSearchOpen(false);
      setTimeout(() => {
        document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
      }, 60);
    },
    [setSearchOpen]
  );

  return (
    <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
      <CommandInput placeholder={dict.search.placeholder} />
      <CommandList className="styled-scroll">
        <CommandEmpty>{dict.search.noResults}</CommandEmpty>
        <CommandGroup heading={dict.search.stories}>
          {stories.map((s) => (
            <CommandItem key={s.id} value={`${s.name} ${s.location ?? ""}`} onSelect={() => run("#historias")}>
              <PawPrint className="mr-2 h-4 w-4 text-coral" aria-hidden />
              <span className="font-semibold">{s.name}</span>
              {s.location && <span className="ml-1.5 text-muted-foreground">• {s.location}</span>}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading={dict.search.sections}>
          {sections.map((s) => (
            <CommandItem key={s.name} value={s.name} onSelect={() => run(s.id)}>
              <s.icon className="mr-2 h-4 w-4 text-coral" aria-hidden />
              {s.name}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
