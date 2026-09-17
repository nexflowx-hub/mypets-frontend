import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { AuthDialog } from "@/components/layout/auth-dialog";
import { Storefront } from "@/components/store/storefront";
import { StoreMarketNotice } from "@/components/store/store-market-notice";

export const metadata: Metadata = {
  title: "Loja MyPets | Tudo para o mundo pet",
  description: "Explore a Loja MyPets: uma experiência completa para passeio, alimentação, higiene, brinquedos, conforto e tecnologia pet, com impacto transparente.",
  alternates: { canonical: "/loja" },
  openGraph: {
    title: "Loja MyPets | Tudo para o mundo pet",
    description: "Curadoria pet, experiência de compra moderna e um modelo de impacto transparente.",
    url: "https://mypets.lat/loja",
    siteName: "MyPets",
    type: "website",
  },
};

export default function StorePage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-cream pt-[72px]">
        <StoreMarketNotice />
        <Storefront />
      </main>
      <SiteFooter />
      <AuthDialog />
    </>
  );
}
