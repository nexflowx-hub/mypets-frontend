import { CauseCampaignPage, campaignLandingMetadata } from "@/components/campaigns/cause-campaign-page";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ campaign: string }> }) {
  const { campaign } = await params;
  return campaignLandingMetadata("vet-help", campaign);
}

export default async function VetHelpCampaignPage({ params }: { params: Promise<{ campaign: string }> }) {
  const { campaign } = await params;
  return <CauseCampaignPage segment="vet-help" campaignKey={campaign} />;
}
