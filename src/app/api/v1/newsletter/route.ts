import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * POST /api/v1/newsletter — { email, locale?, consent }
 * Consent is explicit; never implied. Double opt-in handled by email provider later.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const locale = typeof body?.locale === "string" ? body.locale : "pt-PT";
    const consent = body?.consent === true;

    if (!EMAIL_RE.test(email) || email.length > 254) {
      return NextResponse.json(
        { error: { code: "INVALID_EMAIL", message: "Invalid email address." } },
        { status: 400 }
      );
    }
    if (!consent) {
      return NextResponse.json(
        { error: { code: "CONSENT_REQUIRED", message: "Consent is required." } },
        { status: 400 }
      );
    }

    await db.newsletterSubscriber.upsert({
      where: { email },
      update: { locale, consent },
      create: { email, locale, consent },
    });

    return NextResponse.json({ ok: true, message: "subscribed" }, { status: 201 });
  } catch (error) {
    console.error("[api/v1/newsletter]", error);
    return NextResponse.json(
      { error: { code: "INTERNAL", message: "Failed to subscribe." } },
      { status: 500 }
    );
  }
}
