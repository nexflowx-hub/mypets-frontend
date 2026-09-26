export type DigitalLibraryGuide = {
  id: string;
  slug: string;
  legacySlugs: string[];
  title: string;
  subtitle: string;
  description: string;
  readingMinutes: number;
  image: string;
  tags: string[];
  contentPath: string;
  previewPath: string;
  atlasProfileCount?: number;
  structuredAtlasPath?: string;
};


export type LibraryMediaPlacement = {
  id: string;
  kind: "media" | "video" | "original-visual";
  anchor: string;
  position: "before" | "after";
  alt: string;
  caption: string;
  render?: string;
  watch_for?: string[];
};

export type LibraryMediaRecord = {
  id: string;
  type: "image" | "video-embed";
  title?: string;
  publisher?: string;
  source_page?: string;
  embed_url?: string;
  asset_path?: string;
  asset_url?: string;
  license?: string;
  attribution?: string;
  attribution_required?: boolean;
  alt_pt_br?: string;
  caption_pt_br?: string;
};

type MediaPlacementMaster = {
  guides: Record<string, {
    slug: string;
    placements: LibraryMediaPlacement[];
  }>;
};

export type DigitalLibraryIndex = {
  version: string;
  collection: {
    id: string;
    title: string;
    campaign: string;
    basePriceBrl: number;
  };
  guides: DigitalLibraryGuide[];
};

const CONTENT_REPO = "nexflowx-hub/mypets-data";
export const DIGITAL_LIBRARY_CONTENT_REF = process.env.MYPETS_CONTENT_REF || "507dfbc03e30f036d8b5fbc6f31c4473b2083b7b";
const CONTENT_REF = DIGITAL_LIBRARY_CONTENT_REF;
const RAW_BASE = "https://raw.githubusercontent.com/" + CONTENT_REPO + "/" + encodeURIComponent(CONTENT_REF);

async function fetchContentFile(path: string) {
  const response = await fetch(RAW_BASE + "/" + path, {
    next: { revalidate: 300 },
    headers: { Accept: "text/plain" },
  });
  if (!response.ok) {
    throw new Error("MyPets content fetch failed: " + path + " (" + response.status + ")");
  }
  return response.text();
}


function parseSimpleMediaRegistryYaml(raw: string): LibraryMediaRecord[] {
  const lines = raw.split("\n");
  const records: LibraryMediaRecord[] = [];
  let current: Record<string, unknown> | null = null;

  function commit() {
    if (!current?.id || !current?.type) return;
    records.push(current as LibraryMediaRecord);
  }

  for (const line of lines) {
    const idMatch = /^\s+- id:\s*(.+?)\s*$/.exec(line);
    if (idMatch) {
      commit();
      current = { id: idMatch[1].trim() };
      continue;
    }
    if (!current) continue;

    const fieldMatch = /^\s{4}([a-zA-Z_]+):\s*(.*?)\s*$/.exec(line);
    if (!fieldMatch) continue;
    const [, key, rawValue] = fieldMatch;
    if (["topics", "notes", "frontend_source", "license_action"].includes(key)) continue;

    let value: unknown = rawValue.trim();
    if (value === "true") value = true;
    else if (value === "false") value = false;
    else if (
      typeof value === "string" &&
      ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'")))
    ) {
      value = value.slice(1, -1);
    }
    current[key] = value;
  }
  commit();
  return records;
}

export async function getGuideMediaBundle(guide: DigitalLibraryGuide) {
  try {
    const [masterRaw, registryRaw] = await Promise.all([
      fetchContentFile("media/media-placement-master.json"),
      fetchContentFile("media/registry.yaml"),
    ]);
    const master = JSON.parse(masterRaw) as MediaPlacementMaster;
    const placements = Object.values(master.guides).find((entry) => entry.slug === guide.slug)?.placements ?? [];
    const registry = parseSimpleMediaRegistryYaml(registryRaw);
    const wanted = new Set(placements.filter((item) => item.kind !== "original-visual").map((item) => item.id));
    const mediaRecords = registry.filter((item) => wanted.has(item.id));
    return { placements, mediaRecords };
  } catch {
    // Rich media should improve the reader, never make the paid content unreadable.
    return { placements: [] as LibraryMediaPlacement[], mediaRecords: [] as LibraryMediaRecord[] };
  }
}

export async function getDigitalLibraryIndex(): Promise<DigitalLibraryIndex> {
  const raw = await fetchContentFile("library/index.json");
  return JSON.parse(raw) as DigitalLibraryIndex;
}

export async function resolveDigitalLibraryGuide(slug: string) {
  const index = await getDigitalLibraryIndex();
  return index.guides.find((guide) => guide.slug === slug || guide.legacySlugs.includes(slug)) ?? null;
}

function readerMarkdown(markdown: string) {
  // Production-only media directives remain canonical in mypets-data, but the
  // launch reader must never expose implementation instructions such as
  // "[!MEDIA] renderizar ...". Rich media is progressively rendered from the
  // separate placement manifest.
  return markdown
    .replace(/\n## Recursos visuais do reader[\s\S]*?(?=\n## Referências de base desta edição)/g, "\n")
    .replace(/\nAlém destes medias externos\/licenciados,[^\n]*\n/g, "\n");
}

export async function getDigitalLibraryPreview(guide: DigitalLibraryGuide) {
  return readerMarkdown(await fetchContentFile(guide.previewPath));
}

export async function getDigitalLibraryContent(guide: DigitalLibraryGuide) {
  return readerMarkdown(await fetchContentFile(guide.contentPath));
}

export function entitlementKeysForGuide(guide: DigitalLibraryGuide) {
  return [guide.slug, ...guide.legacySlugs];
}

export type GuideHeading = { id: string; text: string; level: number };

export function headingId(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function extractGuideHeadings(markdown: string): GuideHeading[] {
  return markdown
    .split("\n")
    .map((line) => {
      const match = /^(##|###)\s+(.+)$/.exec(line.trim());
      if (!match) return null;
      const text = match[2].replace(/[*_`]/g, "").trim();
      return { id: headingId(text), text, level: match[1].length };
    })
    .filter((item): item is GuideHeading => Boolean(item));
}
