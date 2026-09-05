"use client";

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "utm_id", "utm_source_platform"] as const;

export function growthDestination(path: string, options: { campaign: string; cta: string }) {
  const target = new URL(path, window.location.origin);
  const current = new URLSearchParams(window.location.search);
  const hasExternalAttribution = UTM_KEYS.some((key) => current.has(key));

  if (hasExternalAttribution) {
    for (const key of UTM_KEYS) {
      const value = current.get(key);
      if (value) target.searchParams.set(key, value);
    }
  } else {
    target.searchParams.set("utm_source", "mypets");
    target.searchParams.set("utm_medium", "onsite");
    target.searchParams.set("utm_campaign", options.campaign);
  }

  const ref = current.get("ref");
  if (ref) target.searchParams.set("ref", ref);
  target.searchParams.set("src_cta", options.cta);
  return `${target.pathname}${target.search}`;
}
