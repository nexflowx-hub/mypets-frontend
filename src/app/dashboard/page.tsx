import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { AuthDialog } from "@/components/layout/auth-dialog";
import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { ParticipationPanel } from "@/components/dashboard/participation-panel";
import { ProtectorSocialPanel } from "@/components/dashboard/protector-social-panel";
import { ReferralPanel } from "@/components/dashboard/referral-panel";
import { AdminShortcut } from "@/components/dashboard/admin-shortcut";
import { PetMediaWorkspace } from "@/components/dashboard/pet-media-workspace";
import { GrowthOnboardingBridge } from "@/components/growth/growth-onboarding-bridge";

export const metadata: Metadata = {
  title: "O Meu Impacto | MyPets",
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-cream">
        <GrowthOnboardingBridge />
        <AdminShortcut />
        <ParticipationPanel />
        <ReferralPanel />
        <ProtectorSocialPanel />
        <PetMediaWorkspace />
        <DashboardClient />
      </main>
      <SiteFooter />
      <AuthDialog />
    </>
  );
}
