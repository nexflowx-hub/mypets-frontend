import { CauseCampaignPage, campaignLandingMetadata } from "@/components/campaigns/cause-campaign-page";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ campaign: string }> }) {
  const { campaign } = await params;
  return campaignLandingMetadata("rescue", campaign);
}

export default async function RescueCampaignPage({ params }: { params: Promise<{ campaign: string }> }) {
  const { campaign } = await params;
  return <CauseCampaignPage segment="rescue" campaignKey={campaign} />;
}
