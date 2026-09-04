import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * POST /api/v1/reports — { reason, entityUrl?, email? }
 * Reports enter the moderation queue (status OPEN).
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const reason = typeof body?.reason === "string" ? body.reason.trim().slice(0, 500) : "";
    const entityUrl = typeof body?.entityUrl === "string" ? body.entityUrl.trim().slice(0, 500) : null;
    const email = typeof body?.email === "string" ? body.email.trim().slice(0, 200) : null;

    if (reason.length < 3) {
      return NextResponse.json({ error: { code: "INVALID_REASON", message: "Reason is required." } }, { status: 400 });
    }

    const report = await db.report.create({ data: { reason, entityUrl, email, status: "OPEN" } });
    return NextResponse.json({ data: { id: report.id, status: report.status } }, { status: 201 });
  } catch (error) {
    console.error("[api/v1/reports]", error);
    return NextResponse.json({ error: { code: "INTERNAL", message: "Failed to file report." } }, { status: 500 });
  }
}
