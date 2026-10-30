"use client";

import type { MouseEvent } from "react";
import { ArrowUpRight } from "lucide-react";

type Props = {
  href: string;
  productCode: string;
  productSlug: string;
  placement: "card" | "detail";
  className?: string;
};

export function HotmartCheckoutLink({ href, productCode, productSlug, placement, className }: Props) {
  function trackCheckoutClick(_event: MouseEvent<HTMLAnchorElement>) {
    // Only measure the CTA; never record payment completion from this event.
    const analyticsWindow = window as Window & {
      gtag?: (...args: unknown[]) => void;
    };
    analyticsWindow.gtag?.("event", "begin_checkout", {
      currency: "BRL",
      value: 12.9,
      items: [{ item_id: productCode, item_name: productSlug }],
      item_list_name: "mypets_campanha_livros",
      cta_placement: placement,
    });
  }

  return (
    <a
      href={href}
      onClick={trackCheckoutClick}
      data-hotmart-product={productCode}
      data-cta-placement={placement}
      rel="noopener noreferrer"
      className={className}
      aria-label={"Comprar " + productSlug + " por R$ 12,90 na Hotmart"}
    >
      Comprar por R$ 12,90 <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
    </a>
  );
}
