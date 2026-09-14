import { CauseCampaignPage } from "@/components/campaigns/cause-campaign-page";
import { CampaignStructuredData, campaignSeoMetadata } from "@/components/campaigns/campaign-seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ campaign: string }> }) {
  const { campaign } = await params;
  return campaignSeoMetadata("rescue", campaign);
}

export default async function RescueCampaignPage({ params }: { params: Promise<{ campaign: string }> }) {
  const { campaign } = await params;
  return <><CampaignStructuredData segment="rescue" campaignKey={campaign} /><CauseCampaignPage segment="rescue" campaignKey={campaign} /></>;
}
