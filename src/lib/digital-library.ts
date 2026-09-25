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
const CONTENT_REF = process.env.MYPETS_CONTENT_REF || "cf75919727dc611fa5c7064480e1f3042e0bfa43";
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

export async function getDigitalLibraryIndex(): Promise<DigitalLibraryIndex> {
  const raw = await fetchContentFile("library/index.json");
  return JSON.parse(raw) as DigitalLibraryIndex;
}

export async function resolveDigitalLibraryGuide(slug: string) {
  const index = await getDigitalLibraryIndex();
  return index.guides.find((guide) => guide.slug === slug || guide.legacySlugs.includes(slug)) ?? null;
}

export async function getDigitalLibraryPreview(guide: DigitalLibraryGuide) {
  return fetchContentFile(guide.previewPath);
}

export async function getDigitalLibraryContent(guide: DigitalLibraryGuide) {
  return fetchContentFile(guide.contentPath);
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
