import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * POST /api/v1/contributions/:id/confirm
 * Mock PaymentProvider.confirmPayment() — the ONLY place a contribution
 * becomes PAID. Verifies with the (mock) provider, never trusts the client.
 * Successful story-targeted contributions increment the story progress.
 */
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const contribution = await db.contribution.findUnique({ where: { id } });
    if (!contribution) {
      return NextResponse.json({ error: { code: "NOT_FOUND", message: "Contribution not found." } }, { status: 404 });
    }
    if (contribution.status === "PAID") {
      // idempotent confirmation
      return NextResponse.json({ data: { id: contribution.id, status: "PAID" } });
    }
    if (contribution.status === "FAILED") {
      return NextResponse.json({ error: { code: "ALREADY_FAILED", message: "Contribution already failed." } }, { status: 409 });
    }

    // Mock provider verification round-trip (latency + deterministic success)
    await new Promise((r) => setTimeout(r, 900));
    const providerVerified = contribution.provider === "mock" && !!contribution.providerRef;

    if (!providerVerified) {
      await db.contribution.update({ where: { id }, data: { status: "FAILED" } });
      return NextResponse.json({ error: { code: "PROVIDER_REJECTED", message: "Provider rejected the payment." } }, { status: 402 });
    }

    const updated = await db.$transaction(async (tx) => {
      const paid = await tx.contribution.update({
        where: { id },
        data: { status: "PAID", updatedAt: new Date() },
      });
      if (paid.storyId) {
        await tx.story.update({
          where: { id: paid.storyId },
          data: { raisedCents: { increment: paid.amountCents } },
        });
      }
      return paid;
    });

    return NextResponse.json({
      data: {
        id: updated.id,
        status: updated.status,
        amountCents: updated.amountCents,
        currency: updated.currency,
        targetLabel: updated.targetLabel,
        frequency: updated.frequency,
      },
    });
  } catch (error) {
    console.error("[api/v1/contributions/confirm]", error);
    return NextResponse.json({ error: { code: "INTERNAL", message: "Failed to confirm contribution." } }, { status: 500 });
  }
}
