"use client";

import { apiUrl } from "@/lib/api";
import type { ParticipationRole } from "@/lib/core-types";

export type GrowthIntent = "SUPPORT" | "VOLUNTEER" | "SPONSOR" | "DONATE" | "PROTECTOR" | "ADOPT" | "PROJECT" | "FOUND_ANIMAL";

export type GrowthCampaign = {
  slug: string;
  name: string;
  intent: GrowthIntent;
  headline: string;
  subheadline: string | null;
  ctaLabel: string;
  country: "PT" | "BR" | null;
  landingVariant: string;
};

export type GrowthTracking = {
  source?: string | null;
  medium?: string | null;
  campaign?: string | null;
  content?: string | null;
  term?: string | null;
  refCode?: string | null;
  entryCta?: string | null;
  targetCauseId?: string | null;
};

type PendingGrowthIntent = {
  intent: GrowthIntent;
  leadId: string | null;
  targetCauseId: string | null;
};

const PENDING_INTENT_KEY = "mypets.growth.pending-intent.v1";

const ROLE_BY_INTENT: Partial<Record<GrowthIntent, ParticipationRole>> = {
  SUPPORT: "SUPPORTER",
  VOLUNTEER: "VOLUNTEER",
  SPONSOR: "SPONSOR",
  DONATE: "DONOR",
  PROTECTOR: "PROTECTOR",
  ADOPT: "ADOPTER",
};

export function roleForIntent(intent: GrowthIntent): ParticipationRole | null {
  return ROLE_BY_INTENT[intent] ?? null;
}

// Stored only after an explicit funnel submission: this is functional onboarding state,
// not pre-consent advertising tracking.
export function savePendingGrowthIntent(intent: GrowthIntent, leadId?: string | null, targetCauseId?: string | null) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PENDING_INTENT_KEY, JSON.stringify({ intent, leadId: leadId ?? null, targetCauseId: targetCauseId ?? null, savedAt: Date.now() }));
}

export function readPendingGrowthIntent(): PendingGrowthIntent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PENDING_INTENT_KEY);
    if (!raw) return null;
    const value = JSON.parse(raw) as { intent?: GrowthIntent; leadId?: string | null; targetCauseId?: string | null; savedAt?: number };
    if (!value.intent || !value.savedAt || Date.now() - value.savedAt > 1000 * 60 * 60 * 24 * 30) return null;
    return { intent: value.intent, leadId: value.leadId ?? null, targetCauseId: value.targetCauseId ?? null };
  } catch {
    return null;
  }
}

export function clearPendingGrowthIntent() {
  if (typeof window !== "undefined") localStorage.removeItem(PENDING_INTENT_KEY);
}

export async function createGrowthLead(payload: Record<string, unknown>) {
  const response = await fetch(apiUrl("/growth/leads"), {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body?.error?.message ?? "Não foi possível guardar o contacto.");
  return body as { data: { id: string; intent: GrowthIntent; score: number } };
}

export async function recordGrowthEvent(payload: Record<string, unknown>) {
  try {
    await fetch(apiUrl("/growth/events"), {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch {
    // Attribution must never block the user's journey.
  }
}
