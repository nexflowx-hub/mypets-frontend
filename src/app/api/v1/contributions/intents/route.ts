import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { randomUUID } from "crypto";

export const dynamic = "force-dynamic";

const VALID_TARGETS = ["ANIMAL", "PROTECTOR", "NETWORK", "GUARDIANS"];
const VALID_FREQ = ["ONE_TIME", "MONTHLY"];

/**
 * POST /api/v1/contributions/intents
 * Creates a PENDING contribution via the mock PaymentProvider.
 * The client can NEVER set status = PAID — only /confirm via the provider does.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const targetType = String(body?.targetType ?? "").toUpperCase();
    const storyId = typeof body?.storyId === "string" && body.storyId ? body.storyId : null;
    const amountCents = Number(body?.amountCents);
    const currency = String(body?.currency ?? "EUR").toUpperCase();
    const frequency = String(body?.frequency ?? "ONE_TIME").toUpperCase();
    const donorName = typeof body?.donorName === "string" ? body.donorName.slice(0, 120) : null;
    const donorEmail = typeof body?.donorEmail === "string" ? body.donorEmail.slice(0, 200) : null;
    const idempotencyKey =
      typeof body?.idempotencyKey === "string" && body.idempotencyKey
        ? body.idempotencyKey
        : randomUUID();

    if (!VALID_TARGETS.includes(targetType)) {
      return NextResponse.json({ error: { code: "INVALID_TARGET", message: "Invalid target." } }, { status: 400 });
    }
    if (!Number.isInteger(amountCents) || amountCents < 100 || amountCents > 2_000_000) {
      return NextResponse.json({ error: { code: "INVALID_AMOUNT", message: "Amount must be between 1 and 20,000." } }, { status: 400 });
    }
    if (!["EUR", "BRL"].includes(currency)) {
      return NextResponse.json({ error: { code: "INVALID_CURRENCY", message: "Unsupported currency." } }, { status: 400 });
    }
    if (!VALID_FREQ.includes(frequency)) {
      return NextResponse.json({ error: { code: "INVALID_FREQUENCY", message: "Invalid frequency." } }, { status: 400 });
    }

    let targetLabel = "MyPets";
    let story: Awaited<ReturnType<typeof db.story.findUnique>> = null;
    if (storyId) {
      story = await db.story.findUnique({ where: { id: storyId } });
      if (!story) {
        return NextResponse.json({ error: { code: "STORY_NOT_FOUND", message: "Story not found." } }, { status: 404 });
      }
      targetLabel = story.name;
    } else {
      targetLabel =
        targetType === "GUARDIANS"
          ? "MyPets Guardians"
          : targetType === "PROTECTOR"
            ? "Protetores"
            : targetType === "ANIMAL"
              ? "Animais"
              : "MyPets";
    }

    // Mock PaymentProvider.createPaymentIntent()
    const providerRef = `mock_${randomUUID().replace(/-/g, "").slice(0, 20)}`;

    const contribution = await db.contribution.upsert({
      where: { idempotencyKey },
      update: {}, // idempotent replay returns the same intent
      create: {
        storyId: story?.id ?? null,
        targetType,
        targetLabel,
        amountCents,
        currency,
        frequency,
        donorName,
        donorEmail,
        provider: "mock",
        providerRef,
        status: "PENDING",
        idempotencyKey,
        isDemo: true,
      },
    });

    return NextResponse.json(
      {
        data: {
          id: contribution.id,
          status: contribution.status,
          amountCents: contribution.amountCents,
          currency: contribution.currency,
          provider: contribution.provider,
          providerRef: contribution.providerRef,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[api/v1/contributions/intents]", error);
    return NextResponse.json({ error: { code: "INTERNAL", message: "Failed to create intent." } }, { status: 500 });
  }
}
