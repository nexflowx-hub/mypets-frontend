"use client";

import * as React from "react";
import { usePathname, useSearchParams } from "next/navigation";

type GrowthEvent = "LANDING_VIEW" | "SUPPORT_STARTED" | "SPONSORSHIP_STARTED";

type Props = {
  campaignKey: string;
  causeId: string;
  vertical: string;
};

function value(params: URLSearchParams, key: string, fallback: string | null = null) {
  return params.get(key)?.trim() || fallback;
}

export function CampaignTracker({ campaignKey, causeId, vertical }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sentView = React.useRef(false);

  const send = React.useCallback((eventName: GrowthEvent, contentOverride?: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    const payload = {
      eventName,
      source: value(params, "utm_source", "mypets"),
      medium: value(params, "utm_medium", "campaign_landing"),
      campaign: value(params, "utm_campaign", campaignKey),
      content: contentOverride ?? value(params, "utm_content"),
      landingPath: pathname,
      metadata: {
        causeId,
        campaignKey,
        vertical,
        refCode: value(params, "ref"),
        utmTerm: value(params, "utm_term"),
      },
    };

    void fetch("/api/v1/growth/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => undefined);
  }, [campaignKey, causeId, pathname, searchParams, vertical]);

  React.useEffect(() => {
    if (sentView.current) return;
    sentView.current = true;
    send("LANDING_VIEW");
  }, [send]);

  React.useEffect(() => {
    const handler = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const tracked = target?.closest<HTMLElement>("[data-growth-event]");
      if (!tracked) return;
      const eventName = tracked.dataset.growthEvent as GrowthEvent | undefined;
      if (!eventName || !["SUPPORT_STARTED", "SPONSORSHIP_STARTED"].includes(eventName)) return;
      send(eventName, tracked.dataset.growthContent ?? null);
    };

    document.addEventListener("click", handler, { passive: true });
    return () => document.removeEventListener("click", handler);
  }, [send]);

  return null;
}
