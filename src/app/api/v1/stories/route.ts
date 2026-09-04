import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

type Locale = "pt-PT" | "pt-BR" | "en";

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

    const stories = rows.map((s) => ({
      id: s.id,
      slug: s.slug,
      kind: s.kind,
      name: s.name,
      location: s.location,
      country: s.country,
      currency: s.currency as "EUR" | "BRL",
      description:
        locale === "pt-BR" ? s.descPtBR : locale === "en" ? s.descEn : s.descPtPT,
      image: s.image,
      imageAlt: s.imageAlt,
      tags: JSON.parse(s.tags || "[]") as string[],
      targetCents: s.targetCents,
      raisedCents: s.raisedCents,
      progress: s.targetCents > 0 ? Math.min(100, Math.round((s.raisedCents / s.targetCents) * 100)) : 0,
      isDemo: s.isDemo,
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
