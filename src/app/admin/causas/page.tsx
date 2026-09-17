import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { AuthDialog } from "@/components/layout/auth-dialog";
import { CauseIntakeAdmin } from "@/components/admin/cause-intake-admin";

export const metadata: Metadata = {
  title: "Cause Operations | MyPets",
  robots: { index: false, follow: false },
};

export default function CauseOperationsPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-cream pt-[68px]"><CauseIntakeAdmin /></main>
      <SiteFooter />
      <AuthDialog />
    </>
  );
}
