"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, ChevronLeft, ChevronRight } from "lucide-react";
import type { PetMedia } from "@/lib/core-types";

export function PetGallery({ name, media, fallback }: { name: string; media: PetMedia[]; fallback?: string | null }) {
  const sources = React.useMemo(() => {
    const items = media.filter((item) => item.isPublic && item.publicUrl);
    if (items.length) return items;
    if (fallback) return [{ id: "fallback", publicUrl: fallback, caption: null, provenance: "REAL_CASE" as const }];
    return [];
  }, [media, fallback]);
  const [index, setIndex] = React.useState(0);
  React.useEffect(() => { if (index >= sources.length) setIndex(0); }, [index, sources.length]);

  if (!sources.length) {
    return (
      <div className="flex aspect-[16/9] items-center justify-center rounded-3xl border border-dashed border-border bg-white text-muted-foreground">
        <div className="text-center"><Camera className="mx-auto h-8 w-8 text-coral/55" /><p className="mt-2 text-sm font-semibold">As primeiras fotografias de {name} serão publicadas aqui.</p></div>
      </div>
    );
  }

  const active = sources[index];
  return (
    <section aria-label={`Fotografias de ${name}`}>
      <div className="group relative overflow-hidden rounded-3xl bg-petrol shadow-[0_24px_52px_-34px_rgba(16,32,42,0.7)]">
        <div className="relative aspect-[16/10] overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={active.id} initial={{ opacity: 0, scale: 1.018 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.32 }} className="absolute inset-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={active.publicUrl ?? ""} alt={active.caption || name} className="h-full w-full object-cover" />
            </motion.div>
          </AnimatePresence>
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/55 to-transparent" />
          <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-black/35 px-3 py-1.5 text-[11px] font-bold text-white backdrop-blur-md"><Camera className="h-3.5 w-3.5" />{index + 1} / {sources.length}</div>
          {sources.length > 1 && (
            <>
              <button type="button" aria-label="Fotografia anterior" onClick={() => setIndex((index - 1 + sources.length) % sources.length)} className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white opacity-80 backdrop-blur transition hover:bg-black/55 sm:opacity-0 sm:group-hover:opacity-100"><ChevronLeft className="h-5 w-5" /></button>
              <button type="button" aria-label="Fotografia seguinte" onClick={() => setIndex((index + 1) % sources.length)} className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white opacity-80 backdrop-blur transition hover:bg-black/55 sm:opacity-0 sm:group-hover:opacity-100"><ChevronRight className="h-5 w-5" /></button>
            </>
          )}
        </div>
      </div>
      {sources.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {sources.slice(0, 10).map((item, itemIndex) => (
            <button key={item.id} type="button" onClick={() => setIndex(itemIndex)} aria-label={`Ver fotografia ${itemIndex + 1}`} className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-sand transition ${itemIndex === index ? "border-coral shadow-sm" : "border-transparent opacity-70 hover:opacity-100"}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.publicUrl ?? ""} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
