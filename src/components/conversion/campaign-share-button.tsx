"use client";

import { HeartHandshake, Share2 } from "lucide-react";
import { recordGrowthEvent } from "@/lib/growth";
import { cn } from "@/lib/utils";

export function CampaignShareButton({
  sharePath,
  shareText,
  label = "Partilhar esta campanha",
  className,
}: {
  sharePath: string;
  shareText: string;
  label?: string;
  className?: string;
}) {
  async function share() {
    const params = new URLSearchParams(window.location.search);
    const target = new URL(sharePath, window.location.origin);
    target.searchParams.set("utm_source", "share");
    target.searchParams.set("utm_medium", "referral");
    target.searchParams.set("utm_campaign", sharePath.includes("petskids") ? "petskids_story" : "mypets_support");
    target.searchParams.set("utm_content", "onsite_share");

    void recordGrowthEvent({
      eventName: "SHARE_CLICK",
      source: params.get("utm_source"),
      medium: params.get("utm_medium"),
      campaign: params.get("utm_campaign"),
      content: params.get("utm_content"),
      landingPath: `${window.location.pathname}${window.location.search}`.slice(0, 500),
      metadata: {
        shareTarget: target.toString(),
        surface: "landing",
      },
    });

    if (navigator.share) {
      try {
        await navigator.share({ title: "MyPets", text: shareText, url: target.toString() });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        // Use WhatsApp as the broad fallback when native sharing is unavailable.
      }
    }
    const message = `${shareText}\n\n${target.toString()}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <button
      type="button"
      onClick={() => void share()}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border bg-white px-5 text-sm font-black text-petrol transition hover:-translate-y-0.5 hover:border-emerald-400 hover:text-emerald-700",
        className,
      )}
    >
      <Share2 className="h-4 w-4" /> {label}
    </button>
  );
}

export function ShareFallbackNote() {
  return (
    <p className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground">
      <HeartHandshake className="h-4 w-4 text-emerald-600" /> Não pode apoiar agora? Uma partilha também pode colocar esta história diante da pessoa certa.
    </p>
  );
}
