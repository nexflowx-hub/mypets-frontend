"use client";

import * as React from "react";
import { Check, Copy, Share2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ShareActions({ title, text, path }: { title: string; text: string; path: string }) {
  const [copied, setCopied] = React.useState(false);

  const absoluteUrl = () => new URL(path, window.location.origin).toString();

  const share = async () => {
    const url = absoluteUrl();
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch {
        // User cancellation or unsupported target falls back to clipboard.
      }
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const copy = async () => {
    await navigator.clipboard.writeText(absoluteUrl());
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const whatsapp = () => {
    const message = `${text}\n${absoluteUrl()}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex flex-wrap gap-2" aria-label="Partilhar esta causa">
      <Button type="button" onClick={() => void share()} className="rounded-xl bg-coral font-bold text-white hover:bg-coral-dark">
        <Share2 className="mr-2 h-4 w-4" /> Partilhar
      </Button>
      <Button type="button" variant="outline" onClick={whatsapp} className="rounded-xl">
        <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp
      </Button>
      <Button type="button" variant="outline" onClick={() => void copy()} className="rounded-xl">
        {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
        {copied ? "Copiado" : "Copiar link"}
      </Button>
    </div>
  );
}
