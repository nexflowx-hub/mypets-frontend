export const SOLIDARITY_EBOOK_UNIT_CENTS = 1290;
export const FEED_EQUIVALENT_GRAMS = 1000;

export type SolidarityEbook = {
  slug: string;
  legacySlugs?: string[];
  title: string;
  shortTitle: string;
  promise: string;
  description: string;
  audience: string;
  image: string;
  tags: string[];
  chapters?: Array<{
    title: string;
    intro?: string;
    points: string[];
  }>;
};

export const solidarityEbooks: SolidarityEbook[] = [
  {
    "slug": "cuidados-essenciais",
    "legacySlugs": [],
    "title": "Cuidados Essenciais com o Seu Cão",
    "shortTitle": "Cuidados Essenciais",
    "promise": "Organize rotina, segurança, prevenção e bem-estar sem transformar o cuidado numa lista impossível.",
    "description": "Organize rotina, segurança, prevenção e bem-estar sem transformar o cuidado numa lista impossível.",
    "audience": "Para qualquer tutor que queira uma base prática de cuidados.",
    "image": "/images/card-acolheu.jpg",
    "tags": [
      "cuidados",
      "rotina",
      "bem-estar"
    ],
    "chapters": []
  },
  {
    "slug": "primeiros-30-dias",
    "legacySlugs": [
      "filhote-primeiros-30-dias"
    ],
    "title": "Os Primeiros 30 Dias com um Filhote",
    "shortTitle": "Primeiros 30 Dias",
    "promise": "Um plano de 30 dias para receber um filhote com menos caos, mais segurança e melhores hábitos.",
    "description": "Um plano de 30 dias para receber um filhote com menos caos, mais segurança e melhores hábitos.",
    "audience": "Para quem acabou de receber ou pretende receber um filhote.",
    "image": "/images/hero.jpg",
    "tags": [
      "filhote",
      "adaptação",
      "rotina"
    ],
    "chapters": []
  },
  {
    "slug": "treino-gentil",
    "legacySlugs": [],
    "title": "Treino Gentil: 7 Comandos para o Dia a Dia",
    "shortTitle": "Treino Gentil",
    "promise": "Aprenda a ensinar comportamentos úteis com progressão, clareza e recompensa — sem medo, gritos ou força.",
    "description": "Aprenda a ensinar comportamentos úteis com progressão, clareza e recompensa — sem medo, gritos ou força.",
    "audience": "Para tutores que querem treino aplicável à vida real.",
    "image": "/images/cta-dog.jpg",
    "tags": [
      "treino",
      "comportamento",
      "reforço"
    ],
    "chapters": []
  },
  {
    "slug": "guia-das-racas",
    "legacySlugs": [],
    "title": "Guia das Raças: Escolha pelo Estilo de Vida",
    "shortTitle": "Atlas de 64 Raças",
    "promise": "Compare 64 perfis, energia, grooming, contexto familiar e custos antes de escolher pela aparência.",
    "description": "Compare 64 perfis, energia, grooming, contexto familiar e custos antes de escolher pela aparência.",
    "audience": "Para famílias a pensar em adotar, comprar ou conhecer melhor perfis de cães.",
    "image": "/images/card-resgatou.jpg",
    "tags": [
      "raças",
      "adoção",
      "compatibilidade"
    ],
    "chapters": []
  },
  {
    "slug": "alimentacao-bem-estar",
    "legacySlugs": [
      "rotina-alimentacao"
    ],
    "title": "Rotina de Alimentação e Bem-Estar",
    "shortTitle": "Alimentação & Bem-Estar",
    "promise": "Organize porções, água, petiscos, rótulos e observação corporal com uma rotina simples e segura.",
    "description": "Organize porções, água, petiscos, rótulos e observação corporal com uma rotina simples e segura.",
    "audience": "Para tutores que querem mais consistência na alimentação do dia a dia.",
    "image": "/images/card-alimentou.jpg",
    "tags": [
      "alimentação",
      "rotina",
      "bem-estar"
    ],
    "chapters": []
  },
  {
    "slug": "linguagem-corporal-canina",
    "legacySlugs": [],
    "title": "Linguagem Corporal Canina: Aprenda a Ouvir sem Palavras",
    "shortTitle": "Linguagem Corporal",
    "promise": "Aprenda a reconhecer conforto, stress, medo, convite para brincar e pedidos de distância antes do conflito.",
    "description": "Aprenda a reconhecer conforto, stress, medo, convite para brincar e pedidos de distância antes do conflito.",
    "audience": "Para qualquer pessoa que queira compreender melhor o que o cão comunica.",
    "image": "/images/hero.jpg",
    "tags": [
      "comportamento",
      "linguagem corporal",
      "segurança"
    ],
    "chapters": []
  },
  {
    "slug": "passeios-sem-stress",
    "legacySlugs": [],
    "title": "Passeios sem Stress",
    "shortTitle": "Passeios sem Stress",
    "promise": "Guia frouxa, farejo, recall, segurança e manejo de reatividade para passeios mais sustentáveis.",
    "description": "Guia frouxa, farejo, recall, segurança e manejo de reatividade para passeios mais sustentáveis.",
    "audience": "Para tutores que querem tornar o passeio mais tranquilo e funcional.",
    "image": "/images/cta-dog.jpg",
    "tags": [
      "passeio",
      "treino",
      "farejo"
    ],
    "chapters": []
  },
  {
    "slug": "ficar-sozinho",
    "legacySlugs": [],
    "title": "Ficar Sozinho em Casa: Autonomia sem Medo",
    "shortTitle": "Ficar Sozinho",
    "promise": "Construa pequenas ausências, observe a câmera e aumente autonomia sem transformar o treino num teste de resistência.",
    "description": "Construa pequenas ausências, observe a câmera e aumente autonomia sem transformar o treino num teste de resistência.",
    "audience": "Para famílias que querem preparar o cão para ficar sozinho gradualmente.",
    "image": "/images/card-acolheu.jpg",
    "tags": [
      "autonomia",
      "separação",
      "comportamento"
    ],
    "chapters": []
  },
  {
    "slug": "cao-em-apartamento",
    "legacySlugs": [],
    "title": "Cão em Apartamento: Espaço Pequeno, Vida Completa",
    "shortTitle": "Cão em Apartamento",
    "promise": "Ruído, elevador, vizinhos, enriquecimento, passeio e descanso para uma vida completa em espaços compactos.",
    "description": "Ruído, elevador, vizinhos, enriquecimento, passeio e descanso para uma vida completa em espaços compactos.",
    "audience": "Para quem vive com cães em apartamentos e ambientes urbanos.",
    "image": "/images/card-resgatou.jpg",
    "tags": [
      "apartamento",
      "rotina",
      "enriquecimento"
    ],
    "chapters": []
  },
  {
    "slug": "higiene-saude-oral",
    "legacySlugs": [],
    "title": "Higiene, Banho e Saúde Oral",
    "shortTitle": "Higiene & Saúde Oral",
    "promise": "Escovação, banho, patas, unhas, orelhas e dentes com uma abordagem gradual e cooperativa.",
    "description": "Escovação, banho, patas, unhas, orelhas e dentes com uma abordagem gradual e cooperativa.",
    "audience": "Para quem quer cuidar da higiene sem transformar manejo em confronto.",
    "image": "/images/card-alimentou.jpg",
    "tags": [
      "higiene",
      "saúde oral",
      "grooming"
    ],
    "chapters": []
  },
  {
    "slug": "adotei-cao-adulto",
    "legacySlugs": [],
    "title": "Adotei um Cão Adulto: E Agora?",
    "shortTitle": "Adotei um Cão Adulto",
    "promise": "Primeiros dias, vínculo, segurança, passeio, outros animais e um plano de adaptação sem pressa.",
    "description": "Primeiros dias, vínculo, segurança, passeio, outros animais e um plano de adaptação sem pressa.",
    "audience": "Para famílias que acabaram de adotar ou acolher um cão adulto.",
    "image": "/images/card-acolheu.jpg",
    "tags": [
      "adoção",
      "cão adulto",
      "adaptação"
    ],
    "chapters": []
  },
  {
    "slug": "caes-e-criancas",
    "legacySlugs": [],
    "title": "Cães e Crianças: Convivência Segura, Respeitosa e Feliz",
    "shortTitle": "Cães & Crianças",
    "promise": "Supervisão, linguagem corporal, regras simples e atividades para uma convivência mais segura.",
    "description": "Supervisão, linguagem corporal, regras simples e atividades para uma convivência mais segura.",
    "audience": "Para famílias com crianças, bebés ou visitas infantis frequentes.",
    "image": "/images/hero.jpg",
    "tags": [
      "crianças",
      "segurança",
      "comportamento"
    ],
    "chapters": []
  },
  {
    "slug": "50-ideias-enriquecimento",
    "legacySlugs": [],
    "title": "50 Ideias de Enriquecimento para Cães",
    "shortTitle": "50 Ideias de Enriquecimento",
    "promise": "Farejo, comida, cérebro, movimento e calma com atividades de baixo custo adaptáveis à vida real.",
    "description": "Farejo, comida, cérebro, movimento e calma com atividades de baixo custo adaptáveis à vida real.",
    "audience": "Para quem quer enriquecer a rotina sem depender de brinquedos caros.",
    "image": "/images/cta-dog.jpg",
    "tags": [
      "enriquecimento",
      "farejo",
      "brincadeira"
    ],
    "chapters": []
  }
] as SolidarityEbook[];

export const solidarityEbookBySlug = Object.fromEntries(
  solidarityEbooks.flatMap((ebook) => [
    [ebook.slug, ebook],
    ...(ebook.legacySlugs ?? []).map((slug) => [slug, ebook] as const),
  ]),
) as Record<string, SolidarityEbook>;

export const recommendationMap: Record<string, string> = {
  care: "cuidados-essenciais",
  puppy: "primeiros-30-dias",
  training: "treino-gentil",
  breeds: "guia-das-racas",
  food: "alimentacao-bem-estar",
  body: "linguagem-corporal-canina",
  walks: "passeios-sem-stress",
  alone: "ficar-sozinho",
  apartment: "cao-em-apartamento",
  grooming: "higiene-saude-oral",
  adoption: "adotei-cao-adulto",
  children: "caes-e-criancas",
  enrichment: "50-ideias-enriquecimento",
};

export function solidarityAmountCents(count: number) {
  return Math.max(1, Math.min(solidarityEbooks.length, count)) * SOLIDARITY_EBOOK_UNIT_CENTS;
}
