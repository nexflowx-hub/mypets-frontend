import type { Metadata } from "next";
import { GrowthPerformanceAdmin } from "@/components/admin/growth-performance-admin";
import { AuthDialog } from "@/components/layout/auth-dialog";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export const metadata: Metadata = {
  title: "Growth Performance | MyPets",
  robots: { index: false, follow: false },
};

export default function GrowthPerformancePage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-cream pt-[68px]"><GrowthPerformanceAdmin /></main>
      <SiteFooter />
      <AuthDialog />
    </>
  );
}
