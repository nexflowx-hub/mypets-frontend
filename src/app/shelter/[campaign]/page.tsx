import { CauseCampaignPage } from "@/components/campaigns/cause-campaign-page";
import { CampaignStructuredData, campaignSeoMetadata } from "@/components/campaigns/campaign-seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ campaign: string }> }) {
  const { campaign } = await params;
  return campaignSeoMetadata("shelter", campaign);
}

export default async function ShelterCampaignPage({ params }: { params: Promise<{ campaign: string }> }) {
  const { campaign } = await params;
  return <><CampaignStructuredData segment="shelter" campaignKey={campaign} /><CauseCampaignPage segment="shelter" campaignKey={campaign} /></>;
}
