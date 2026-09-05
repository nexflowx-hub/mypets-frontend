"use client";

import { apiUrl } from "@/lib/api";
import type { ParticipationRole } from "@/lib/core-types";
import { readAttribution } from "@/lib/attribution";

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

export function savePendingGrowthIntent(intent: GrowthIntent, leadId?: string | null) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PENDING_INTENT_KEY, JSON.stringify({ intent, leadId: leadId ?? null, savedAt: Date.now() }));
}

export function readPendingGrowthIntent(): { intent: GrowthIntent; leadId: string | null } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PENDING_INTENT_KEY);
    if (!raw) return null;
    const value = JSON.parse(raw) as { intent?: GrowthIntent; leadId?: string | null; savedAt?: number };
    if (!value.intent || !value.savedAt || Date.now() - value.savedAt > 1000 * 60 * 60 * 24 * 30) return null;
    return { intent: value.intent, leadId: value.leadId ?? null };
  } catch {
    return null;
  }
}

export function clearPendingGrowthIntent() {
  if (typeof window !== "undefined") localStorage.removeItem(PENDING_INTENT_KEY);
}

export async function createGrowthLead(payload: Record<string, unknown>) {
  const attribution = readAttribution();
  const first = attribution.first;
  const currentMetadata = payload.metadata && typeof payload.metadata === "object" && !Array.isArray(payload.metadata)
    ? payload.metadata as Record<string, unknown>
    : {};
  const enriched = {
    ...payload,
    source: first?.source ?? payload.source ?? null,
    medium: first?.medium ?? payload.medium ?? null,
    campaign: first?.campaign ?? payload.campaign ?? null,
    content: first?.content ?? payload.content ?? null,
    term: first?.term ?? payload.term ?? null,
    metadata: {
      ...currentMetadata,
      firstTouch: attribution.first,
      lastTouch: attribution.last,
      currentTouch: {
        source: payload.source ?? null,
        medium: payload.medium ?? null,
        campaign: payload.campaign ?? null,
        content: payload.content ?? null,
        term: payload.term ?? null,
      },
    },
  };

  const response = await fetch(apiUrl("/growth/leads"), {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(enriched),
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
