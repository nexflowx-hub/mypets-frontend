import { CauseCampaignPage } from "@/components/campaigns/cause-campaign-page";
import { CampaignStructuredData, campaignSeoMetadata } from "@/components/campaigns/campaign-seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ campaign: string }> }) {
  const { campaign } = await params;
  return campaignSeoMetadata("vet-help", campaign);
}

export default async function VetHelpCampaignPage({ params }: { params: Promise<{ campaign: string }> }) {
  const { campaign } = await params;
  return <><CampaignStructuredData segment="vet-help" campaignKey={campaign} /><CauseCampaignPage segment="vet-help" campaignKey={campaign} /></>;
}
