"use client";

export type AttributionTouch = {
  source: string | null;
  medium: string | null;
  campaign: string | null;
  content: string | null;
  term: string | null;
  campaignId: string | null;
  sourcePlatform: string | null;
  landingPath: string;
  referrerHost: string | null;
  capturedAt: number;
};

const FIRST_KEY = "mypets.attribution.first.v1";
const LAST_KEY = "mypets.attribution.last.v1";

function clean(value: string | null) {
  const result = value?.trim().toLowerCase();
  return result ? result.slice(0, 160) : null;
}

function referrerHost() {
  try {
    return document.referrer ? new URL(document.referrer).hostname.slice(0, 160) : null;
  } catch {
    return null;
  }
}

export function currentTouch(): AttributionTouch | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const source = clean(params.get("utm_source"));
  const medium = clean(params.get("utm_medium"));
  const campaign = clean(params.get("utm_campaign"));
  const campaignId = clean(params.get("utm_id"));
  const sourcePlatform = clean(params.get("utm_source_platform"));
  const hasCampaignSignal = Boolean(source || medium || campaign || campaignId || sourcePlatform);
  if (!hasCampaignSignal) return null;
  return {
    source,
    medium,
    campaign,
    content: clean(params.get("utm_content")),
    term: clean(params.get("utm_term")),
    campaignId,
    sourcePlatform,
    landingPath: `${window.location.pathname}${window.location.search}`.slice(0, 800),
    referrerHost: referrerHost(),
    capturedAt: Date.now(),
  };
}

export function captureAttribution() {
  if (typeof window === "undefined") return;
  const touch = currentTouch();
  if (!touch) return;
  if (!localStorage.getItem(FIRST_KEY)) localStorage.setItem(FIRST_KEY, JSON.stringify(touch));
  localStorage.setItem(LAST_KEY, JSON.stringify(touch));
}

function read(key: string): AttributionTouch | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const value = JSON.parse(raw) as AttributionTouch;
    if (!value?.capturedAt || Date.now() - value.capturedAt > 1000 * 60 * 60 * 24 * 90) return null;
    return value;
  } catch {
    return null;
  }
}

export function readAttribution() {
  return { first: read(FIRST_KEY), last: read(LAST_KEY) };
}
