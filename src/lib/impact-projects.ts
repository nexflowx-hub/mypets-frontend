export type ImpactProjectStatus = "active" | "preparing";

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
};

function togetherWeFeedUrl() {
  return process.env.NEXT_PUBLIC_TWF_URL?.trim() || "https://twf-help.vercel.app";
}

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
      image: "/images/card-alimentou.jpg",
      funnelUrl: togetherWeFeedUrl(),
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
