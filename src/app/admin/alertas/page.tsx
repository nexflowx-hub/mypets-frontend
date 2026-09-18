import type { Metadata } from "next";
import { InternalAlertsAdmin } from "@/components/admin/internal-alerts-admin";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { AuthDialog } from "@/components/layout/auth-dialog";

export const metadata: Metadata = {
  title: "Alertas Internos | MyPets",
  robots: { index: false, follow: false },
};

export default function InternalAlertsPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-cream pt-[68px]"><InternalAlertsAdmin /></main>
      <SiteFooter />
      <AuthDialog />
    </>
  );
}
