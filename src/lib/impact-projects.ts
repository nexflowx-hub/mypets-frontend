export type ImpactProjectStatus = "active" | "preparing";

export type ImpactProjectMedia = {
  hero?: string;
  gallery?: Array<{ src: string; alt: string }>;
  video?: { src: string; poster?: string; title: string };
};

export type ImpactProjectEcosystem = {
  headline: string;
  lead: string;
  supportOptions: string[];
  beneficiaries: string[];
  steps: Array<{ title: string; text: string }>;
  requestLabel: string;
  supportLabel: string;
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
  media?: ImpactProjectMedia;
  ecosystem?: ImpactProjectEcosystem;
};

const TWF_SITE_PATH = "/go/together-we-feed";
const TWF_MEDIA_ORIGIN =
  process.env.TWF_MEDIA_ORIGIN?.trim() ||
  process.env.NEXT_PUBLIC_TWF_URL?.trim() ||
  "";
const TWF_MEDIA = TWF_MEDIA_ORIGIN ? `${TWF_MEDIA_ORIGIN.replace(/\/$/, "")}/media/images` : "";

export function impactProjects(): ImpactProject[] {
  return [
    {
      slug: "together-we-feed",
      title: "Together We Feed",
      shortTitle: "Together We Feed",
      category: "Alimentação",
      summary: "Alimentação e apoio imediato para animais em situação de vulnerabilidade.",
      description: "Together We Feed é o primeiro projeto real apoiado dentro do ecossistema MyPets. O projeto mantém o seu próprio funil de captação, enquanto o MyPets funciona como camada de descoberta, confiança, acompanhamento e ligação com a comunidade.",
      status: "active",
      image: TWF_MEDIA ? `${TWF_MEDIA}/hero-desktop.webp` : "/images/cta-dog.jpg",
      funnelUrl: TWF_SITE_PATH,
      publicUrl: TWF_SITE_PATH,
      media: {
        hero: TWF_MEDIA ? `${TWF_MEDIA}/hero-desktop.webp` : "/images/cta-dog.jpg",
        gallery: TWF_MEDIA ? [
          { src: `${TWF_MEDIA}/missao-impacto.webp`, alt: "A missão e o impacto do Together We Feed" },
          { src: `${TWF_MEDIA}/historias-01.webp`, alt: "História de impacto do Together We Feed" },
          { src: `${TWF_MEDIA}/historias-02.webp`, alt: "Animais apoiados pelo Together We Feed" },
          { src: `${TWF_MEDIA}/historias-03.webp`, alt: "Apoio alimentar a animais em situação de vulnerabilidade" },
          { src: `${TWF_MEDIA}/historias-04.webp`, alt: "História acompanhada pelo Together We Feed" },
          { src: `${TWF_MEDIA}/historias-05.webp`, alt: "Impacto do apoio Together We Feed" },
        ] : undefined,
        video: TWF_MEDIA ? { src: "https://hopeheaart.com/pt/media/videos/apresentacao.mp4", poster: `${TWF_MEDIA}/video-poster.webp`, title: "Apresentação Together We Feed" } : undefined,
      },
    },
    {
      slug: "vet-help",
      title: "MyPets Vet Help",
      shortTitle: "Vet Help",
      category: "Tratamentos veterinários",
      summary: "Ajuda para consultas, exames, cirurgias, medicamentos e recuperação.",
      description: "Uma frente dedicada a casos veterinários que precisam de apoio financeiro ou material, com páginas próprias para cada campanha e acompanhamento de evolução.",
      status: "preparing",
      image: "/images/card-tratou.jpg",
      ecosystem: {
        headline: "Quando o tratamento não pode esperar, a comunidade pode agir.",
        lead: "Transformamos necessidades veterinárias verificadas em campanhas claras, com objetivo, atualizações e um caminho simples para quem quer ajudar.",
        supportOptions: ["Consultas e exames", "Cirurgias e internações", "Medicamentos e terapias", "Recuperação e pós-operatório"],
        beneficiaries: ["Animais resgatados", "Protetores independentes", "ONGs e abrigos", "Tutores em vulnerabilidade"],
        steps: [
          { title: "O caso é apresentado", text: "O responsável descreve a situação, o animal e a necessidade veterinária." },
          { title: "A campanha ganha contexto", text: "MyPets organiza objetivo, documentos, atualizações e formas de apoio." },
          { title: "A comunidade acompanha", text: "Apoiadores recebem uma página clara para ajudar, partilhar e acompanhar a evolução." },
        ],
        requestLabel: "Preciso de ajuda veterinária",
        supportLabel: "Quero apoiar tratamentos",
      },
    },
    {
      slug: "rescue",
      title: "MyPets Rescue",
      shortTitle: "Rescue",
      category: "Resgates",
      summary: "Apoio a resgates urgentes, transporte, segurança e primeiros cuidados.",
      description: "Uma frente para apoiar operações de resgate e protetores em campo, com campanhas dedicadas e necessidades claramente identificadas.",
      status: "preparing",
      image: "/images/card-resgatou.jpg",
      ecosystem: {
        headline: "Resgates urgentes precisam de resposta rápida e coordenação.",
        lead: "O MyPets Rescue organiza pedidos de campo em funis objetivos para mobilizar transporte, lar temporário, primeiros cuidados e apoio financeiro.",
        supportOptions: ["Transporte e logística", "Primeiros cuidados", "Lar temporário", "Equipamentos e resgate em campo"],
        beneficiaries: ["Protetores em campo", "Animais abandonados", "Operações coletivas", "Redes locais de resgate"],
        steps: [
          { title: "O alerta chega", text: "O resgate é registado com localização, urgência e necessidades imediatas." },
          { title: "A rede é mobilizada", text: "Voluntários e apoiadores recebem tarefas e formas concretas de participação." },
          { title: "O caso continua", text: "Resgate, tratamento, acolhimento e desfecho podem ser acompanhados na mesma história." },
        ],
        requestLabel: "Tenho um resgate urgente",
        supportLabel: "Quero ajudar resgates",
      },
    },
    {
      slug: "shelter",
      title: "MyPets Shelter",
      shortTitle: "Shelter",
      category: "Abrigos e protetores",
      summary: "Apoio recorrente a abrigos, lares temporários e estruturas de proteção.",
      description: "Uma frente voltada a abrigos e protetores que precisam de alimentação, higiene, manutenção, medicamentos, transporte e capacidade operacional.",
      status: "preparing",
      image: "/images/card-acolheu.jpg",
      ecosystem: {
        headline: "Quem acolhe dezenas de animais precisa de previsibilidade, não só de ajuda pontual.",
        lead: "MyPets Shelter transforma necessidades recorrentes de abrigos e protetores em páginas de apoio contínuo, com prioridades e prestação de contas.",
        supportOptions: ["Ração e higiene", "Medicamentos", "Manutenção do abrigo", "Apoio mensal e voluntariado"],
        beneficiaries: ["Abrigos independentes", "ONGs", "Lares temporários", "Protetores com muitos animais"],
        steps: [
          { title: "O abrigo cria o perfil", text: "Estrutura, capacidade, animais e necessidades principais ficam organizados." },
          { title: "As prioridades ficam visíveis", text: "Apoio financeiro e material é apresentado por necessidade, sem misturar tudo numa única meta." },
          { title: "A relação torna-se contínua", text: "Padrinhos, doadores e voluntários podem acompanhar atualizações e novas necessidades." },
        ],
        requestLabel: "Cadastrar abrigo ou projeto",
        supportLabel: "Quero apoiar um abrigo",
      },
    },
    {
      slug: "emergency",
      title: "MyPets Emergency",
      shortTitle: "Emergency",
      category: "Emergências",
      summary: "Resposta rápida a catástrofes, incêndios, enchentes e outras emergências.",
      description: "Uma frente de mobilização rápida para situações extraordinárias em que animais, famílias e protetores precisam de ajuda imediata e coordenada.",
      status: "preparing",
      image: "/images/cta-dog.jpg",
      ecosystem: {
        headline: "Em uma emergência, informação confiável e velocidade salvam vidas.",
        lead: "MyPets Emergency foi pensado para concentrar campanhas, pontos de apoio, necessidades e atualizações em situações de crise.",
        supportOptions: ["Alimentação emergencial", "Evacuação e transporte", "Atendimento veterinário", "Acolhimento e suprimentos"],
        beneficiaries: ["Animais afetados", "Famílias e tutores", "ONGs locais", "Equipes e protetores em campo"],
        steps: [
          { title: "A situação é validada", text: "A campanha identifica região, responsáveis e necessidades prioritárias." },
          { title: "O tráfego é concentrado", text: "Links dedicados levam apoiadores diretamente para a ação mais urgente." },
          { title: "As prioridades são atualizadas", text: "Conforme a emergência evolui, necessidades e orientações mudam sem perder o histórico." },
        ],
        requestLabel: "Reportar necessidade emergencial",
        supportLabel: "Quero ajudar em emergências",
      },
    },
  ];
}

export function impactProject(slug: string) {
  return impactProjects().find((project) => project.slug === slug) ?? null;
}

export function trackedProjectFunnel(project: ImpactProject, source = "project_page") {
  if (!project.funnelUrl) return null;
  try {
    const internal = project.funnelUrl.startsWith("/");
    const url = new URL(project.funnelUrl, "https://mypets.lat");
    url.searchParams.set("utm_source", "mypets");
    url.searchParams.set("utm_medium", "referral");
    url.searchParams.set("utm_campaign", project.slug.replaceAll("-", "_"));
    url.searchParams.set("utm_content", source);
    return internal ? `${url.pathname}${url.search}` : url.toString();
  } catch {
    return project.funnelUrl;
  }
}

export function internalProjectFunnel(project: ImpactProject, intent: "request" | "support", source = "project_page") {
  const base = intent === "request" ? "/join/projeto" : `/projetos/${project.slug}/apoiar`;
  const params = new URLSearchParams({
    utm_source: "mypets",
    utm_medium: "internal",
    utm_campaign: project.slug.replaceAll("-", "_"),
    utm_content: source,
    vertical: project.slug,
    intent,
  });
  return `${base}?${params.toString()}`;
}
