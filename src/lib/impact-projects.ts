export type ImpactProjectStatus = "active" | "preparing";

export type ImpactProjectMedia = {
  hero?: string;
  gallery?: Array<{ src: string; alt: string }>;
  video?: {
    src: string;
    poster?: string;
    title: string;
  };
};

export type ImpactProject = {
  slug: string;
  title: string;
  shortTitle: string;
  category: string;
  summary: string;
  description: string;
  status: ImpactProjectStatus;
  image: string;
  funnelUrl?: string;
  publicUrl?: string;
  sourceRepository?: string;
  media?: ImpactProjectMedia;
};

function togetherWeFeedUrl() {
  return process.env.NEXT_PUBLIC_TWF_URL?.trim() || "https://twf-help.vercel.app";
}

const TWF_PUBLIC_URL = "https://twf-help.vercel.app";
const TWF_MEDIA = `${TWF_PUBLIC_URL}/media/images`;

export function impactProjects(): ImpactProject[] {
  return [
    {
      slug: "together-we-feed",
      title: "Together We Feed",
      shortTitle: "Together We Feed",
      category: "Alimentação",
      summary: "Alimentação e apoio imediato para animais em situação de vulnerabilidade.",
      description:
        "Together We Feed é o primeiro projeto real apoiado dentro do ecossistema MyPets. O projeto mantém o seu próprio funil de captação, enquanto o MyPets funciona como camada de descoberta, confiança, acompanhamento e ligação com a comunidade.",
      status: "active",
      image: `${TWF_MEDIA}/hero-desktop.webp`,
      funnelUrl: togetherWeFeedUrl(),
      publicUrl: TWF_PUBLIC_URL,
      sourceRepository: "https://github.com/nexflowx-hub/TogetherWeFeed",
      media: {
        hero: `${TWF_MEDIA}/hero-desktop.webp`,
        gallery: [
          { src: `${TWF_MEDIA}/missao-impacto.webp`, alt: "A missão e o impacto do Together We Feed" },
          { src: `${TWF_MEDIA}/historias-01.webp`, alt: "História de impacto do Together We Feed" },
          { src: `${TWF_MEDIA}/historias-02.webp`, alt: "Animais apoiados pelo Together We Feed" },
          { src: `${TWF_MEDIA}/historias-03.webp`, alt: "Apoio alimentar a animais em situação de vulnerabilidade" },
          { src: `${TWF_MEDIA}/historias-04.webp`, alt: "História acompanhada pelo Together We Feed" },
          { src: `${TWF_MEDIA}/historias-05.webp`, alt: "Impacto do apoio Together We Feed" },
        ],
        video: {
          src: "https://hopeheaart.com/pt/media/videos/apresentacao.mp4",
          poster: `${TWF_MEDIA}/video-poster.webp`,
          title: "Apresentação Together We Feed",
        },
      },
    },
    {
      slug: "vet-help",
      title: "MyPets Vet Help",
      shortTitle: "Vet Help",
      category: "Tratamentos veterinários",
      summary: "Ajuda para consultas, exames, cirurgias, medicamentos e recuperação.",
      description:
        "Uma frente dedicada a casos veterinários que precisam de apoio financeiro ou material, com páginas próprias para cada campanha e acompanhamento de evolução.",
      status: "preparing",
      image: "/images/card-tratou.jpg",
    },
    {
      slug: "rescue",
      title: "MyPets Rescue",
      shortTitle: "Rescue",
      category: "Resgates",
      summary: "Apoio a resgates urgentes, transporte, segurança e primeiros cuidados.",
      description:
        "Uma frente para apoiar operações de resgate e protetores em campo, com campanhas dedicadas e necessidades claramente identificadas.",
      status: "preparing",
      image: "/images/card-resgatou.jpg",
    },
    {
      slug: "shelter",
      title: "MyPets Shelter",
      shortTitle: "Shelter",
      category: "Abrigos e protetores",
      summary: "Apoio recorrente a abrigos, lares temporários e estruturas de proteção.",
      description:
        "Uma frente voltada a abrigos e protetores que precisam de alimentação, higiene, manutenção, medicamentos, transporte e capacidade operacional.",
      status: "preparing",
      image: "/images/card-acolheu.jpg",
    },
    {
      slug: "emergency",
      title: "MyPets Emergency",
      shortTitle: "Emergency",
      category: "Emergências",
      summary: "Resposta rápida a catástrofes, incêndios, enchentes e outras emergências.",
      description:
        "Uma frente de mobilização rápida para situações extraordinárias em que animais, famílias e protetores precisam de ajuda imediata e coordenada.",
      status: "preparing",
      image: "/images/cta-dog.jpg",
    },
  ];
}

export function impactProject(slug: string) {
  return impactProjects().find((project) => project.slug === slug) ?? null;
}

export function trackedProjectFunnel(project: ImpactProject, source = "project_page") {
  if (!project.funnelUrl) return null;
  try {
    const url = new URL(project.funnelUrl);
    url.searchParams.set("utm_source", "mypets");
    url.searchParams.set("utm_medium", "referral");
    url.searchParams.set("utm_campaign", project.slug.replaceAll("-", "_"));
    url.searchParams.set("utm_content", source);
    return url.toString();
  } catch {
    return project.funnelUrl;
  }
}
