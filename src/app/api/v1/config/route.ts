import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * GET /api/v1/config — brand/entity config for CMS-configurable legal wording.
 */
export async function GET() {
  try {
    const blocks = await db.contentBlock.findMany();
    const config: Record<string, unknown> = {};
    for (const b of blocks) {
      try {
        config[b.key] = JSON.parse(b.value);
      } catch {
        config[b.key] = b.value;
      }
    }
    return NextResponse.json({
      brand: process.env.BRAND ?? "mypets",
      appEnv: process.env.APP_ENV ?? "development",
      showDemoImpact: process.env.SHOW_DEMO_IMPACT !== "false",
      payoutsEnabled: false, // feature flag — never enable from client
      paymentsLive: false,
      legal: config["legal.entity"] ?? null,
    });
  } catch {
    return NextResponse.json({
      brand: "mypets",
      appEnv: "development",
      showDemoImpact: process.env.SHOW_DEMO_IMPACT !== "false",
      payoutsEnabled: false,
      paymentsLive: false,
      legal: null,
    });
  }
}
