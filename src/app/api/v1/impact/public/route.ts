import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * GET /api/v1/impact/public
 * Public impact metrics. Demo values only shown when SHOW_DEMO_IMPACT=true.
 */
export async function GET() {
  const showDemo = process.env.SHOW_DEMO_IMPACT !== "false";

  try {
    const rows = await db.impactMetric.findMany({ orderBy: { sortOrder: "asc" } });
    const metrics = (showDemo ? rows : rows.filter((m) => !m.isDemo)).map((m) => ({
      key: m.key,
      value: m.value,
      prefix: m.prefix,
      suffix: m.suffix,
      decimals: m.decimals,
      labelPtPT: m.labelPtPT,
      labelPtBR: m.labelPtBR,
      labelEn: m.labelEn,
      icon: m.icon,
      color: m.color,
      isDemo: m.isDemo,
    }));
    return NextResponse.json({ showDemoImpact: showDemo, data: metrics });
  } catch (error) {
    console.error("[api/v1/impact/public]", error);
    return NextResponse.json(
      { error: { code: "INTERNAL", message: "Failed to load impact metrics." } },
      { status: 500 }
    );
  }
}
