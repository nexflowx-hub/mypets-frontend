import { CauseCampaignPage } from "@/components/campaigns/cause-campaign-page";
import { CampaignStructuredData, campaignSeoMetadata } from "@/components/campaigns/campaign-seo";

export const revalidate = 30;

export async function generateMetadata({ params }: { params: Promise<{ campaign: string }> }) {
  const { campaign } = await params;
  return campaignSeoMetadata("emergency", campaign);
}

export default async function EmergencyCampaignPage({ params }: { params: Promise<{ campaign: string }> }) {
  const { campaign } = await params;
  return <><CampaignStructuredData segment="emergency" campaignKey={campaign} /><CauseCampaignPage segment="emergency" campaignKey={campaign} /></>;
}
