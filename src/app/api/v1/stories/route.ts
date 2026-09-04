import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

type Locale = "pt-PT" | "pt-BR" | "en";

function stringTags(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((tag): tag is string => typeof tag === "string")
    : [];
}

/**
 * GET /api/v1/stories?locale=pt-PT
 * Public active stories (protectors, animals, campaigns) — localized.
 */
export async function GET(req: NextRequest) {
  const localeParam = req.nextUrl.searchParams.get("locale");
  const locale: Locale =
    localeParam === "pt-BR" || localeParam === "en" ? localeParam : "pt-PT";

  try {
    const rows = await db.story.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
      take: 12,
    });

    const stories = rows.map((story) => ({
      id: story.id,
      slug: story.slug,
      kind: story.kind,
      name: story.name,
      location: story.location,
      country: story.country,
      currency: story.currency as "EUR" | "BRL",
      description:
        locale === "pt-BR"
          ? story.descPtBR
          : locale === "en"
            ? story.descEn
            : story.descPtPT,
      image: story.image,
      imageAlt: story.imageAlt,
      tags: stringTags(story.tags),
      targetCents: story.targetCents,
      raisedCents: story.raisedCents,
      progress:
        story.targetCents > 0
          ? Math.min(100, Math.round((story.raisedCents / story.targetCents) * 100))
          : 0,
      isDemo: story.isDemo,
    }));

    return NextResponse.json({ data: stories, count: stories.length });
  } catch (error) {
    console.error("[api/v1/stories]", error);
    return NextResponse.json(
      { error: { code: "INTERNAL", message: "Failed to load stories." } },
      { status: 500 }
    );
  }
}
