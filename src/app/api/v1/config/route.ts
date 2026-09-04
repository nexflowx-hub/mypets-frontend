import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * GET /api/v1/config — public brand/entity configuration.
 * Only explicitly public content blocks should ever be returned here.
 */
export async function GET() {
  try {
    const blocks = await db.contentBlock.findMany({
      where: { key: { in: ["legal.entity"] } },
    });

    const config: Record<string, unknown> = Object.fromEntries(
      blocks.map((block) => [block.key, block.value])
    );

    return NextResponse.json({
      brand: process.env.BRAND ?? "mypets",
      appEnv: process.env.APP_ENV ?? "development",
      showDemoImpact: process.env.SHOW_DEMO_IMPACT !== "false",
      payoutsEnabled: false,
      paymentsLive: false,
      legal: config["legal.entity"] ?? null,
    });
  } catch (error) {
    console.error("[api/v1/config]", error);
    return NextResponse.json({
      brand: "mypets",
      appEnv: process.env.APP_ENV ?? "development",
      showDemoImpact: process.env.SHOW_DEMO_IMPACT !== "false",
      payoutsEnabled: false,
      paymentsLive: false,
      legal: null,
    });
  }
}
