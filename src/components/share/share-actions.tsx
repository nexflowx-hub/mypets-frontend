"use client";

import * as React from "react";
import { Check, Copy, ExternalLink, MessageCircle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authApi } from "@/lib/auth-api";
import { getValidSession } from "@/lib/auth-client";

type Envelope<T> = { data: T };
type ShareChannel = "native_share" | "whatsapp" | "facebook" | "copy_link";

type Props = {
  title: string;
  text: string;
  path: string;
  trackingCampaign?: string;
  trackingSource?: string;
  trackingContent?: string;
  growthCampaignSlug?: string | null;
};

const campaignPrefixes = new Set(["vet-help", "rescue", "shelter", "emergency"]);

function defaultContent(path: string) {
  if (path.startsWith("/pets/")) return "facepets";
  if (path.startsWith("/protetores/")) return "protector";
  if ([...campaignPrefixes].some((prefix) => path.startsWith(`/${prefix}/`))) return "cause_campaign";
  return "shared_content";
}

function inferredCampaign(path: string) {
  const parts = path.split("/").filter(Boolean);
  if (parts.length >= 2 && campaignPrefixes.has(parts[0]!)) return parts[1]!;
  return "community_referral";
}

export function ShareActions({
  title,
  text,
  path,
  trackingCampaign,
  trackingSource = "community",
  trackingContent,
  growthCampaignSlug = null,
}: Props) {
  const [copied, setCopied] = React.useState(false);
  const content = trackingContent ?? defaultContent(path);
  const campaign = trackingCampaign ?? inferredCampaign(path);

  const fallbackUrl = (channel: ShareChannel) => {
    const url = new URL(path, window.location.origin);
    url.searchParams.set("utm_source", trackingSource);
    url.searchParams.set("utm_medium", channel);
    url.searchParams.set("utm_campaign", campaign);
    url.searchParams.set("utm_content", content);
    return url.toString();
  };

  const attributedUrl = async (channel: ShareChannel) => {
    const session = await getValidSession();
    if (!session) return fallbackUrl(channel);

    try {
      const response = await authApi<Envelope<{ code: string; path: string }>>("/growth/share-links", {
        method: "POST",
        body: JSON.stringify({
          destinationPath: path,
          campaignSlug: growthCampaignSlug,
          source: "member",
          medium: channel,
          campaign,
          content,
        }),
      });
      return new URL(response.data.path, window.location.origin).toString();
    } catch {
      return fallbackUrl(channel);
    }
  };

  const markCopied = () => {
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const share = async () => {
    const url = await attributedUrl("native_share");
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch {
        // User cancellation or unsupported target falls back to clipboard.
      }
    }
    await navigator.clipboard.writeText(url);
    markCopied();
  };

  const copy = async () => {
    await navigator.clipboard.writeText(await attributedUrl("copy_link"));
    markCopied();
  };

  const whatsapp = async () => {
    const url = await attributedUrl("whatsapp");
    const message = `${text}\n${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  const facebook = async () => {
    const url = await attributedUrl("facebook");
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank", "noopener,noreferrer,width=720,height=620");
  };

  return (
    <div className="flex flex-wrap gap-2" aria-label="Partilhar esta causa">
      <Button type="button" onClick={() => void share()} className="rounded-xl bg-coral font-bold text-white hover:bg-coral-dark">
        <Share2 className="mr-2 h-4 w-4" /> Partilhar
      </Button>
      <Button type="button" variant="outline" onClick={() => void whatsapp()} className="rounded-xl">
        <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp
      </Button>
      <Button type="button" variant="outline" onClick={() => void facebook()} className="rounded-xl">
        <ExternalLink className="mr-2 h-4 w-4" /> Facebook
      </Button>
      <Button type="button" variant="outline" onClick={() => void copy()} className="rounded-xl">
        {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
        {copied ? "Copiado" : "Copiar link"}
      </Button>
    </div>
  );
}
