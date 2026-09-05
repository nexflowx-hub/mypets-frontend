"use client";

import * as React from "react";
import { Check, Copy, Share2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authApi } from "@/lib/auth-api";
import { getValidSession } from "@/lib/auth-client";

type Envelope<T> = { data: T };

type ShareChannel = "native_share" | "whatsapp" | "copy_link";

export function ShareActions({ title, text, path }: { title: string; text: string; path: string }) {
  const [copied, setCopied] = React.useState(false);

  const fallbackUrl = (channel: ShareChannel) => {
    const url = new URL(path, window.location.origin);
    url.searchParams.set("utm_source", "community");
    url.searchParams.set("utm_medium", channel);
    url.searchParams.set("utm_campaign", "community_referral");
    url.searchParams.set("utm_content", path.startsWith("/pets/") ? "facepets" : path.startsWith("/protetores/") ? "protector" : "shared_content");
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
          campaignSlug: "ajudar",
          source: "member",
          medium: channel,
          campaign: "community_referral",
          content: path.startsWith("/pets/") ? "facepets" : path.startsWith("/protetores/") ? "protector" : "shared_content",
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

  return (
    <div className="flex flex-wrap gap-2" aria-label="Partilhar esta causa">
      <Button type="button" onClick={() => void share()} className="rounded-xl bg-coral font-bold text-white hover:bg-coral-dark">
        <Share2 className="mr-2 h-4 w-4" /> Partilhar
      </Button>
      <Button type="button" variant="outline" onClick={() => void whatsapp()} className="rounded-xl">
        <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp
      </Button>
      <Button type="button" variant="outline" onClick={() => void copy()} className="rounded-xl">
        {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
        {copied ? "Copiado" : "Copiar link"}
      </Button>
    </div>
  );
}
