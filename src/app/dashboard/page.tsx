import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { AuthDialog } from "@/components/layout/auth-dialog";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

export const metadata: Metadata = {
  title: "O Meu Impacto | MyPets",
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-cream">
        <DashboardClient />
      </main>
      <SiteFooter />
      <AuthDialog />
    </>
  );
}
