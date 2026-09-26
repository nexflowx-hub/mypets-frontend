"use client";

import { Menu } from "lucide-react";
import { type GuideHeading } from "@/lib/digital-library";

export function LibraryToc({ headings }: { headings: GuideHeading[] }) {
  if (!headings.length) return null;

  return (
    <>
      <details className="mb-6 rounded-2xl border border-border bg-white p-4 lg:hidden print:hidden">
        <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-black text-petrol">
          <Menu className="h-4 w-4" /> Índice do guia
        </summary>
        <nav className="mt-4 space-y-1">
          {headings.map((heading) => (
            <a
              key={heading.id}
              href={"#" + heading.id}
              className="block rounded-lg px-2 py-2 text-sm font-semibold text-petrol/70 hover:bg-emerald-50 hover:text-emerald-800"
            >
              {heading.text}
            </a>
          ))}
        </nav>
      </details>

      <aside className="sticky top-24 hidden max-h-[calc(100vh-7rem)] overflow-y-auto pr-4 lg:block print:hidden">
        <p className="mb-3 text-[10px] font-black uppercase tracking-[.14em] text-emerald-700">Neste guia</p>
        <nav className="space-y-1 border-l border-border pl-3">
          {headings.map((heading) => (
            <a
              key={heading.id}
              href={"#" + heading.id}
              className="block py-1.5 text-xs font-bold leading-5 text-petrol/55 transition hover:text-emerald-700"
            >
              {heading.text}
            </a>
          ))}
        </nav>
      </aside>
    </>
  );
}
