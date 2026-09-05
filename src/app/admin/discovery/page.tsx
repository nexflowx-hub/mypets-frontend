import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { AuthDialog } from "@/components/layout/auth-dialog";
import { DiscoveryAdmin } from "@/components/admin/discovery-admin";

export const metadata: Metadata = {
  title: "Discovery Admin | MyPets",
  robots: { index: false, follow: false },
};

export default function DiscoveryAdminPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-cream"><DiscoveryAdmin /></main>
      <SiteFooter />
      <AuthDialog />
    </>
  );
}
