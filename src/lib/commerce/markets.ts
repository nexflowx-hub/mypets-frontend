import type { LegalEntityKey } from "@/lib/legal/entities";

export type CommerceMarketKey = "BR" | "UK" | "EU";

export type CommerceMarket = {
  key: CommerceMarketKey;
  label: string;
  countries: string[];
  currency: "BRL" | "GBP" | "EUR";
  locale: "pt-BR" | "en-GB" | "pt-PT";
  legalEntity: LegalEntityKey;
  paymentProfile: "XPAYMENTS_BR" | "XPAYMENTS_INTL";
  enabledMethods: string[];
  status: "ACTIVE" | "PREPARING";
};

export const COMMERCE_MARKETS: Record<CommerceMarketKey, CommerceMarket> = {
  BR: {
    key: "BR",
    label: "Brasil",
    countries: ["BR"],
    currency: "BRL",
    locale: "pt-BR",
    legalEntity: "BR",
    paymentProfile: "XPAYMENTS_BR",
    enabledMethods: ["pix", "card"],
    status: "ACTIVE",
  },
  UK: {
    key: "UK",
    label: "United Kingdom",
    countries: ["GB"],
    currency: "GBP",
    locale: "en-GB",
    legalEntity: "UK",
    paymentProfile: "XPAYMENTS_INTL",
    enabledMethods: ["card", "apple_pay", "google_pay", "link"],
    status: "PREPARING",
  },
  EU: {
    key: "EU",
    label: "Europa",
    countries: ["PT", "ES", "FR", "DE", "IT", "NL", "BE", "IE", "AT", "FI", "LU"],
    currency: "EUR",
    locale: "pt-PT",
    legalEntity: "UK",
    paymentProfile: "XPAYMENTS_INTL",
    enabledMethods: ["card", "apple_pay", "google_pay", "link"],
    status: "PREPARING",
  },
};

export function resolveCommerceMarket(countryCode?: string | null): CommerceMarket {
  const country = countryCode?.trim().toUpperCase();
  if (country === "BR") return COMMERCE_MARKETS.BR;
  if (country === "GB") return COMMERCE_MARKETS.UK;
  if (country && COMMERCE_MARKETS.EU.countries.includes(country)) return COMMERCE_MARKETS.EU;
  return COMMERCE_MARKETS.BR;
}
