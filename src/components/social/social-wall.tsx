"use client";

import * as React from "react";
import { ExternalLink, Instagram, Facebook, Youtube, Play, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

type SocialProfile = {
  id: string;
  platform: string;
  profileUrl: string;
  handle: string | null;
  displayName: string | null;
  verificationStatus: string;
  scope: string;
};

type SocialContent = {
  id: string;
  socialProfileId: string;
  platform: string;
  canonicalUrl: string;
  contentType: string;
  captionExcerpt: string | null;
  thumbnailUrl: string | null;
  publishedAt: string | null;
  featured: boolean;
};

function platformLabel(platform: string) {
  return platform.charAt(0) + platform.slice(1).toLowerCase();
}

function PlatformIcon({ platform }: { platform: string }) {
  if (platform === "INSTAGRAM") return <Instagram className="h-4 w-4" aria-hidden />;
  if (platform === "FACEBOOK") return <Facebook className="h-4 w-4" aria-hidden />;
  if (platform === "YOUTUBE") return <Youtube className="h-4 w-4" aria-hidden />;
  return <ExternalLink className="h-4 w-4" aria-hidden />;
}

function embedUrl(item: SocialContent) {
  try {
    const url = new URL(item.canonicalUrl);
    if (item.platform === "YOUTUBE") {
      const fromQuery = url.searchParams.get("v");
      const parts = url.pathname.split("/").filter(Boolean);
      const id = fromQuery ?? (url.hostname === "youtu.be" ? parts[0] : parts[0] === "shorts" ? parts[1] : null);
      return id ? `https://www.youtube.com/embed/${encodeURIComponent(id)}` : null;
    }
    if (item.platform === "TIKTOK") {
      const match = url.pathname.match(/\/video\/(\d+)/);
      return match?.[1] ? `https://www.tiktok.com/player/v1/${match[1]}` : null;
    }
  } catch {
    return null;
  }
  return null;
}

function SocialContentCard({ item }: { item: SocialContent }) {
  const [loaded, setLoaded] = React.useState(false);
  const player = embedUrl(item);

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
      <div className="relative aspect-[4/3] bg-sand">
        {loaded && player ? (
          <iframe
            src={player}
            title={`Conteúdo ${platformLabel(item.platform)}`}
            className="h-full w-full border-0"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : item.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.thumbnailUrl} alt="Preview da publicação" className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground"><PlatformIcon platform={item.platform} /></div>
        )}
        {!loaded && player && (
          <button type="button" onClick={() => setLoaded(true)} className="absolute inset-0 flex items-center justify-center bg-petrol/25 transition hover:bg-petrol/35" aria-label="Carregar conteúdo externo">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-petrol shadow-xl"><Play className="ml-0.5 h-6 w-6" fill="currentColor" /></span>
          </button>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wide text-coral"><PlatformIcon platform={item.platform} />{platformLabel(item.platform)}</span>
          {item.featured && <span className="rounded-full bg-coral/10 px-2 py-1 text-[10px] font-extrabold uppercase text-coral">Destaque</span>}
        </div>
        {item.captionExcerpt && <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-ink/80">{item.captionExcerpt}</p>}
        <a href={item.canonicalUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-petrol hover:text-coral">
          Ver publicação original <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </article>
  );
}

export function SocialWall({ profiles, content }: { profiles: SocialProfile[]; content: SocialContent[] }) {
  if (!profiles.length && !content.length) return null;

  return (
    <section className="rounded-3xl border border-border bg-white p-5 sm:p-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-coral">Redes oficiais</p>
          <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-petrol">Acompanhe diretamente quem está no terreno</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">As contas apresentadas aqui foram confirmadas pelo responsável da causa. Conteúdo externo só é carregado quando o visitante o solicita.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {profiles.map((profile) => (
            <a key={profile.id} href={profile.profileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-2 rounded-full border border-border px-4 text-xs font-bold text-petrol transition hover:border-coral/50 hover:text-coral">
              <PlatformIcon platform={profile.platform} />
              {profile.displayName || profile.handle || platformLabel(profile.platform)}
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" aria-label="Confirmado pelo gestor" />
            </a>
          ))}
        </div>
      </div>

      {content.length > 0 && <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{content.map((item) => <SocialContentCard key={item.id} item={item} />)}</div>}

      <p className="mt-5 text-[11px] leading-relaxed text-muted-foreground">Publicações continuam alojadas nas plataformas de origem e podem deixar de estar disponíveis se forem removidas ou tornadas privadas.</p>
    </section>
  );
}
