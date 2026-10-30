export const CAMPAIGN_PRICE_BRL = 12.90;

export type CampaignBook = {
  code: string;
  slug: string;
  title: string;
  shortTitle: string;
  tagline: string;
  audience: string;
  intro: string;
  cover: string;
  banner: string;
  checkout: string;
  benefits: string[];
  highlights: string[];
};

export const campaignBooks: CampaignBook[] = [
  {
    code: "EB01",
    slug: "cuidados-essenciais",
    title: "Cuidados Essenciais com o Seu Cão",
    shortTitle: "Cuidados Essenciais",
    tagline: "Tudo começa com uma rotina de cuidado e carinho.",
    audience: "Para tutores que desejam uma base prática e responsável.",
    intro: "Organize os cuidados do dia a dia com mais tranquilidade: alimentação, higiene, segurança, prevenção e bem-estar, respeitando as necessidades do seu cão.",
    cover: "/images/library/covers/01-cuidados-essenciais.webp",
    banner: "/images/library/covers/01-cuidados-essenciais.webp",
    checkout: "https://pay.hotmart.com/C108190802Y",
    benefits: ["Organize os cuidados diários", "Cuide com mais segurança", "Fortaleça o vínculo com seu cão"],
    highlights: ["Rotina, conforto e segurança", "Higiene e bem-estar", "Prevenção e cuidados essenciais"],
  },
  {
    code: "EB02",
    slug: "primeiros-30-dias",
    title: "Os Primeiros 30 Dias com um Filhote",
    shortTitle: "Primeiros 30 Dias",
    tagline: "Um começo mais tranquilo para o novo membro da família.",
    audience: "Para quem vai receber ou acabou de acolher um filhote.",
    intro: "Da chegada à primeira rotina: entenda como preparar o ambiente, apoiar o sono e a higiene, oferecer experiências seguras e começar os primeiros aprendizados.",
    cover: "/images/campanha-livros/capa-eb02.png",
    banner: "/images/campanha-livros/banner-eb02.png",
    checkout: "https://pay.hotmart.com/M108259866W",
    benefits: ["Prepare a casa para a chegada", "Organize sono e higiene", "Comece o treino gentil"],
    highlights: ["Primeiro dia e primeira noite", "Rotinas e checklists", "Aprendizados e socialização segura"],
  },
  {
    code: "EB09",
    slug: "cao-em-apartamento",
    title: "Cão em Apartamento: Espaço Pequeno, Vida Completa",
    shortTitle: "Cão em Apartamento",
    tagline: "Mais bem-estar, mesmo com poucos metros quadrados.",
    audience: "Para famílias que vivem com cães em apartamentos.",
    intro: "Um guia para adaptar ambientes, passeios, descanso e enriquecimento às necessidades individuais do seu cão — com atenção especial à convivência no condomínio.",
    cover: "/images/library/covers/09-cao-em-apartamento.webp",
    banner: "/images/campanha-livros/banner-eb09.png",
    checkout: "https://pay.hotmart.com/J108259918Q",
    benefits: ["Organize um ambiente seguro", "Enriqueça o dia a dia em casa", "Melhore a rotina de passeios"],
    highlights: ["Varandas, janelas e circulação", "Ruídos, elevador e vizinhos", "Exploração, brincadeiras e descanso"],
  },
  {
    code: "EB11",
    slug: "adotei-cao-adulto",
    title: "Adotei um Cão Adulto: E Agora?",
    shortTitle: "Adotei um Cão Adulto",
    tagline: "Acolhimento com paciência, respeito e confiança.",
    audience: "Para famílias que acabaram de adotar um cão adulto.",
    intro: "Cada adoção é uma história única. Aprenda a preparar a casa, interpretar sinais, organizar rotinas e construir segurança sem impor prazos rígidos para a adaptação.",
    cover: "/images/campanha-livros/capa-eb11.png",
    banner: "/images/campanha-livros/banner-eb11.png",
    checkout: "https://pay.hotmart.com/R108259979J",
    benefits: ["Prepare um acolhimento seguro", "Construa confiança sem pressa", "Respeite o ritmo de adaptação"],
    highlights: ["Primeiros dias em casa", "Linguagem corporal e vínculo", "Orientações para os primeiros 90 dias"],
  },
  {
    code: "EB08",
    slug: "ficar-sozinho",
    title: "Ficar Sozinho em Casa: Autonomia sem Medo",
    shortTitle: "Ficar Sozinho em Casa",
    tagline: "Ajude seu cão a lidar melhor com a sua ausência.",
    audience: "Para tutores que querem desenvolver autonomia com cuidado.",
    intro: "Identifique sinais de desconforto, prepare um ambiente acolhedor e conheça exercícios graduais de ausência, sempre respeitando os limites individuais do animal.",
    cover: "/images/campanha-livros/capa-eb08.png",
    banner: "/images/campanha-livros/banner-eb08.png",
    checkout: "https://pay.hotmart.com/T108260019G",
    benefits: ["Reconheça sinais de desconforto", "Organize saídas graduais", "Acompanhe com mais segurança"],
    highlights: ["Observação e uso de câmera", "Portas, chaves e outras pistas", "Quando buscar orientação especializada"],
  },
];

export const campaignBookBySlug = Object.fromEntries(
  campaignBooks.map((book) => [book.slug, book]),
) as Record<string, CampaignBook>;
