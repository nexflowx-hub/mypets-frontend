// Mission 2 — Local premium cover backgrounds for the MyPets Digital Library.
// Each guide maps to a dedicated photographic WebP background in
// /public/images/library/covers/. The GuideCover component keeps its own
// typography, official MyPets seal, kicker, icon, overlays and guide identity;
// these backgrounds are purely photographic and never bake price or campaign
// promises into the source image.

const COVER_BACKGROUNDS: Record<string, string> = {
  "cuidados-essenciais": "/images/library/covers/01-cuidados-essenciais.webp",
  "primeiros-30-dias": "/images/library/covers/02-primeiros-30-dias.webp",
  "treino-gentil": "/images/library/covers/03-treino-gentil.webp",
  "guia-das-racas": "/images/library/covers/04-atlas-64.webp",
  "alimentacao-bem-estar": "/images/library/covers/05-alimentacao-bem-estar.webp",
  "linguagem-corporal-canina": "/images/library/covers/06-linguagem-corporal.webp",
  "passeios-sem-stress": "/images/library/covers/07-passeios-sem-stress.webp",
  "ficar-sozinho": "/images/library/covers/08-ficar-sozinho.webp",
  "cao-em-apartamento": "/images/library/covers/09-cao-em-apartamento.webp",
  "higiene-saude-oral": "/images/library/covers/10-higiene-saude-oral.webp",
  "adotei-cao-adulto": "/images/library/covers/11-adotei-cao-adulto.webp",
  "caes-e-criancas": "/images/library/covers/12-caes-e-criancas.webp",
  "50-ideias-enriquecimento": "/images/library/covers/13-enriquecimento.webp",
};

/**
 * Returns the dedicated local WebP cover background for a guide slug.
 * Falls back to the supplied legacy image if no dedicated background exists,
 * so unknown slugs never break rendering.
 */
export function coverBackgroundForSlug(slug: string, fallback?: string): string {
  return COVER_BACKGROUNDS[slug] ?? fallback ?? "/images/hero.jpg";
}
