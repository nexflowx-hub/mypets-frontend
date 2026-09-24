export const BRAND = {
  name: "MyPets",
  siteUrl: "https://mypets.lat",
  facePetsUrl: "https://facepets.org",
  instagramUrl: "https://www.instagram.com/mypets.lat/",
  facebookUrl: "https://www.facebook.com/mypets.lat",
  whatsappSupportUrl: process.env.NEXT_PUBLIC_MYPETS_BR_WHATSAPP_URL ?? "",
  whatsappCommunityUrl: process.env.NEXT_PUBLIC_MYPETS_WHATSAPP_COMMUNITY_URL ?? "",
  facebookGroupUrl: process.env.NEXT_PUBLIC_MYPETS_FACEBOOK_GROUP_URL ?? "",
  ebookCampaignVideoUrl: process.env.NEXT_PUBLIC_EBOOK_CAMPAIGN_VIDEO_URL ?? "",
  logoUrl: "https://res.cloudinary.com/fnki0ccg/image/upload/v1789145246/Logo_VPT.png",
  socialBannerUrl: "https://res.cloudinary.com/fnki0ccg/image/upload/v1789145243/Banner_VPT.png",
} as const;
