"use client";

import { ExternalLink, Film, ImageIcon } from "lucide-react";
import type { LibraryMediaPlacement, LibraryMediaRecord } from "@/lib/digital-library";
import { OriginalVisual, visualLabel } from "@/components/library/visuals";
import { cn } from "@/lib/utils";

export { visualLabel };

function commonsImageUrl(sourcePage?: string) {
  if (!sourcePage?.startsWith("https://commons.wikimedia.org/wiki/File:")) return null;
  const filename = sourcePage.split("/wiki/File:")[1];
  return filename ? `https://commons.wikimedia.org/wiki/Special:Redirect/file/${filename}` : null;
}

function youtubeEmbedUrl(value?: string) {
  if (!value) return null;
  const watch = /[?&]v=([^&#]+)/.exec(value)?.[1];
  const short = /youtu\.be\/([^?&#]+)/.exec(value)?.[1];
  const embed = /youtube(?:-nocookie)?\.com\/embed\/([^?&#]+)/.exec(value)?.[1];
  const id = watch || short || embed;
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
}

// `visualLabel` is now maintained in `./visuals` and re-exported above so any
// existing caller (e.g. tests or tooling) continues to resolve the extended map
// including the two new families (`annotated-body`, `child-card`).

export function LibraryMediaSlot({
  placement,
  media,
  className,
}: {
  placement: LibraryMediaPlacement;
  media?: LibraryMediaRecord;
  className?: string;
}) {
  if (placement.kind === "video") {
    const embedUrl = youtubeEmbedUrl(media?.embed_url || media?.source_page);
    return (
      <figure className={cn("my-7 overflow-hidden rounded-[1.5rem] border border-petrol/10 bg-[#0f241b] text-white shadow-sm", className)}>
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
          <Film className="h-4 w-4 text-emerald-300" />
          <span className="text-[10px] font-black uppercase tracking-[.14em] text-emerald-200">
            Vídeo selecionado · {media?.publisher || "fonte oficial"}
          </span>
        </div>
        {embedUrl ? (
          <div className="aspect-video bg-black print:hidden">
            <iframe
              className="h-full w-full"
              src={embedUrl}
              title={media?.title || placement.alt}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        ) : null}
        <figcaption className="p-5">
          <p className="text-sm font-black">{media?.title || placement.alt}</p>
          <p className="mt-2 text-xs leading-6 text-white/65">{placement.caption}</p>
          {placement.watch_for?.length ? (
            <div className="mt-4 rounded-xl bg-white/7 p-3">
              <p className="text-[9px] font-black uppercase tracking-[.14em] text-emerald-200">Observe estes pontos</p>
              <ul className="mt-2 space-y-1 text-[11px] leading-5 text-white/70">
                {placement.watch_for.map((item) => <li key={item}>• {item}</li>)}
              </ul>
            </div>
          ) : null}
          {media?.source_page ? (
            <a href={media.source_page} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-[10px] font-black text-emerald-300 underline underline-offset-4">
              Ver fonte oficial <ExternalLink className="h-3 w-3" />
            </a>
          ) : null}
        </figcaption>
      </figure>
    );
  }

  if (placement.kind === "media") {
    const imageUrl = media?.asset_path || media?.asset_url || commonsImageUrl(media?.source_page);
    return (
      <figure className={cn("my-7 overflow-hidden rounded-[1.5rem] border border-border bg-white shadow-sm", className)}>
        {imageUrl ? (
          // External CC images are intentionally rendered with their canonical source attribution.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={placement.alt || media?.alt_pt_br || ""}
            loading="lazy"
            className="max-h-[520px] w-full bg-[#f3f2ed] object-cover"
          />
        ) : (
          <div className="flex min-h-44 items-center justify-center bg-[#f3f2ed] text-petrol/35">
            <ImageIcon className="h-8 w-8" />
          </div>
        )}
        <figcaption className="p-4">
          <p className="text-xs font-semibold leading-6 text-petrol/70">{placement.caption}</p>
          {(media?.attribution || media?.license || media?.source_page) ? (
            <p className="mt-2 text-[9px] leading-4 text-petrol/45">
              {media?.attribution ? `Foto: ${media.attribution}. ` : ""}
              {media?.license ? `${media.license}. ` : ""}
              {media?.source_page ? (
                <a href={media.source_page} target="_blank" rel="noreferrer" className="font-bold underline underline-offset-2">Fonte</a>
              ) : null}
            </p>
          ) : null}
        </figcaption>
      </figure>
    );
  }

  return (
    <OriginalVisual placement={placement} className={className} />
  );
}
