"use client";

import * as React from "react";
import { recordGrowthEvent } from "@/lib/growth";

export function CampaignLandingTracker({ variant }: { variant: string }) {
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    void recordGrowthEvent({
      eventName: "LANDING_VIEW",
      source: params.get("utm_source"),
      medium: params.get("utm_medium"),
      campaign: params.get("utm_campaign"),
      content: params.get("utm_content"),
      landingPath: `${window.location.pathname}${window.location.search}`.slice(0, 500),
      metadata: {
        variant,
        utmTerm: params.get("utm_term"),
        utmId: params.get("utm_id"),
        sourcePlatform: params.get("utm_source_platform"),
        gclid: params.get("gclid"),
        gbraid: params.get("gbraid"),
        wbraid: params.get("wbraid"),
        fbclid: params.get("fbclid"),
        msclkid: params.get("msclkid"),
        ttclid: params.get("ttclid"),
      },
    });
  }, [variant]);

  return null;
}
