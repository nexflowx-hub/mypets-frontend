export const SOLIDARITY_EBOOK_UNIT_CENTS = 1290;
export const FEED_EQUIVALENT_GRAMS = 1000;

export type SolidarityEbook = {
  slug: string;
  title: string;
  shortTitle: string;
  promise: string;
  description: string;
  audience: string;
  image: string;
  tags: string[];
  chapters: Array<{
    title: string;
    intro?: string;
    points: string[];
  }>;
};

export const solidarityEbooks: SolidarityEbook[] = [
  {
    slug: "cuidados-essenciais",
    title: "Cuidados Essenciais com o Seu Cão",
    shortTitle: "Cuidados Essenciais",
    promise: "Uma rotina simples para dar mais segurança, conforto e bem-estar ao seu cão.",
    description: "Um guia direto sobre rotina, ambiente, higiene, passeio, observação e quando procurar ajuda profissional.",
    audience: "Para qualquer tutor que queira organizar melhor os cuidados do dia a dia.",
    image: "/images/card-acolheu.jpg",
    tags: ["cuidados", "rotina", "bem-estar"],
    chapters: [
      {
        title: "1. Comece pela rotina",
        intro: "Cães tendem a lidar melhor com o dia quando alimentação, descanso, passeios e interação têm alguma previsibilidade.",
        points: [
          "Defina horários consistentes para alimentação, saídas e períodos de descanso.",
          "Garanta água limpa e acessível durante todo o dia.",
          "Reserve um local tranquilo e confortável onde o cão possa descansar sem ser incomodado.",
          "Observe mudanças bruscas de apetite, sede, disposição, sono ou comportamento e procure orientação veterinária quando algo parecer fora do normal.",
        ],
      },
      {
        title: "2. Casa segura",
        points: [
          "Mantenha medicamentos, produtos de limpeza, fios elétricos e objetos pequenos fora do alcance.",
          "Proteja janelas, varandas, portões e áreas por onde o cão possa escapar.",
          "Escolha brinquedos compatíveis com o porte do animal e retire peças danificadas que possam ser engolidas.",
          "Em dias quentes, ofereça sombra, ventilação e evite superfícies muito aquecidas nos passeios.",
        ],
      },
      {
        title: "3. Passeio e enriquecimento",
        points: [
          "O passeio não serve apenas para gastar energia: cheirar e explorar também fazem parte do enriquecimento.",
          "Use equipamento confortável e adequado ao porte do cão.",
          "Aumente duração e intensidade gradualmente, respeitando idade, condição corporal e orientação veterinária.",
          "Dentro de casa, alterne brinquedos, atividades de busca e pequenas sessões de treino positivo.",
        ],
      },
      {
        title: "4. Higiene sem excessos",
        points: [
          "Escovação regular ajuda a observar pele, pelo, nós e pequenas alterações.",
          "Banhos devem respeitar a necessidade do animal e produtos próprios para cães.",
          "Unhas, ouvidos e dentes merecem atenção, mas qualquer dor, odor intenso, secreção ou sangramento deve ser avaliado por profissional.",
          "Mantenha cama, mantas, potes e áreas de descanso limpos.",
        ],
      },
      {
        title: "5. Prevenção é parte do cuidado",
        points: [
          "Mantenha acompanhamento veterinário e calendário de vacinação e controle de parasitas conforme indicação profissional.",
          "Identificação com plaquinha e microchip, quando disponível, aumenta a chance de reencontro em caso de fuga.",
          "Não administre medicamentos humanos ou suplementos por conta própria.",
          "Tenha à mão o contacto de uma clínica veterinária e de atendimento de urgência da sua região.",
        ],
      },
    ],
  },
  {
    slug: "filhote-primeiros-30-dias",
    title: "Os Primeiros 30 Dias com um Filhote",
    shortTitle: "Primeiros 30 Dias",
    promise: "Um plano prático para receber um filhote com menos caos e mais segurança.",
    description: "Organização da casa, rotina, socialização responsável, higiene e primeiros hábitos.",
    audience: "Para quem acabou de receber ou pretende receber um filhote.",
    image: "/images/hero.jpg",
    tags: ["filhote", "adaptação", "rotina"],
    chapters: [
      {
        title: "1. Prepare antes de chegar",
        points: [
          "Escolha uma área segura com cama, água, brinquedos e espaço para descanso.",
          "Retire objetos frágeis, plantas potencialmente perigosas, fios e produtos químicos do alcance.",
          "Defina desde o primeiro dia onde serão alimentação, sono e necessidades.",
          "Combine regras básicas entre todas as pessoas da casa para evitar sinais contraditórios.",
        ],
      },
      {
        title: "2. Primeira semana: reduzir a pressão",
        points: [
          "Dê tempo para o filhote explorar aos poucos, sem excesso de visitas ou estímulos.",
          "Mantenha rotina previsível e períodos frequentes de descanso.",
          "Reforce comportamentos desejáveis com comida, brincadeira, atenção e calma.",
          "Evite punições físicas, sustos e métodos aversivos.",
        ],
      },
      {
        title: "3. Necessidades e acidentes",
        points: [
          "Leve o filhote ao local adequado depois de dormir, comer, brincar e em intervalos frequentes.",
          "Quando acertar, recompense imediatamente.",
          "Acidentes fazem parte da aprendizagem; limpe sem repreender depois do facto.",
          "A consistência de rotina costuma ser mais eficiente do que broncas.",
        ],
      },
      {
        title: "4. Socialização responsável",
        points: [
          "Apresente sons, superfícies, pessoas e ambientes de forma gradual e positiva.",
          "A exposição a outros animais deve respeitar segurança sanitária e orientação veterinária.",
          "Ensine o filhote a aceitar manipulação leve de patas, boca e corpo de forma positiva.",
          "Evite forçar aproximações quando houver medo.",
        ],
      },
      {
        title: "5. O que acompanhar nos 30 dias",
        points: [
          "Adaptação ao sono e à rotina da casa.",
          "Consistência das necessidades no local correto.",
          "Resposta ao nome e contacto espontâneo com o tutor.",
          "Consulta veterinária, prevenção, crescimento e alimentação adequada à fase de vida.",
        ],
      },
    ],
  },
  {
    slug: "treino-gentil",
    title: "Treino Gentil: 7 Comandos para o Dia a Dia",
    shortTitle: "Treino Gentil",
    promise: "Ensine comportamentos úteis sem medo, gritos ou força.",
    description: "Um guia introdutório de treino por reforço positivo para comunicação, segurança e convivência.",
    audience: "Para tutores que querem começar a treinar de forma simples e respeitosa.",
    image: "/images/cta-dog.jpg",
    tags: ["treino", "comportamento", "reforço positivo"],
    chapters: [
      {
        title: "1. Como ensinar",
        points: [
          "Escolha recompensas que realmente interessem ao seu cão e treine em sessões curtas.",
          "Marque o comportamento certo com uma palavra curta como “sim” e entregue a recompensa logo depois.",
          "Aumente dificuldade gradualmente e termine antes de o cão perder o interesse.",
          "Evite corrigir com dor, intimidação ou sustos.",
        ],
      },
      {
        title: "2. Responder ao nome",
        points: [
          "Diga o nome uma vez; quando o cão olhar para si, marque e recompense.",
          "Comece num ambiente sem distrações e avance devagar.",
          "Não use o nome repetidamente para repreender.",
        ],
      },
      {
        title: "3. Senta e espera",
        points: [
          "Use um petisco para guiar o nariz ligeiramente para cima até o cão sentar naturalmente.",
          "Associe a palavra apenas quando o movimento já estiver previsível.",
          "Para “espera”, comece por um segundo e aumente o tempo aos poucos.",
        ],
      },
      {
        title: "4. Vem",
        points: [
          "Treine primeiro em área segura e a curta distância.",
          "Use voz amigável, recompense generosamente e nunca puna o cão por ter demorado a chegar.",
          "Em locais abertos, use guia longa até haver segurança suficiente.",
        ],
      },
      {
        title: "5. Larga, deixa e vai para a cama",
        points: [
          "Troque o objeto por algo melhor para ensinar “larga”.",
          "Recompense quando o cão recua de algo para ensinar “deixa”.",
          "Associe a cama ou tapete a recompensas e descanso para criar um ponto seguro.",
          "Procure um profissional qualificado quando houver agressividade, medo intenso ou comportamentos de risco.",
        ],
      },
    ],
  },
  {
    slug: "guia-das-racas",
    title: "Guia das Raças: Escolha pelo Estilo de Vida",
    shortTitle: "Guia das Raças",
    promise: "Antes de escolher pela aparência, entenda energia, tamanho, manejo e necessidades.",
    description: "Um guia para comparar perfis de cães e tomar decisões mais responsáveis, incluindo adoção de cães sem raça definida.",
    audience: "Para famílias a pensar em adotar ou acolher um cão.",
    image: "/images/card-resgatou.jpg",
    tags: ["raças", "adoção", "compatibilidade"],
    chapters: [
      {
        title: "1. A raça não é o cão inteiro",
        points: [
          "Tendências de raça podem ajudar a antecipar tamanho, energia ou tipo de pelagem, mas indivíduos variam bastante.",
          "Histórico, socialização, saúde, idade e ambiente também influenciam o comportamento.",
          "Cães sem raça definida podem ter perfis igualmente previsíveis quando avaliados individualmente.",
        ],
      },
      {
        title: "2. Perguntas antes de escolher",
        points: [
          "Quanto tempo real existe para passeios, treino e companhia todos os dias?",
          "A casa tolera queda de pelo, vocalização, lama e possíveis danos durante a adaptação?",
          "Há crianças, idosos, outros animais ou restrições de espaço?",
          "Qual orçamento existe para alimentação, prevenção, veterinário, treino e imprevistos?",
        ],
      },
      {
        title: "3. Perfis de energia",
        points: [
          "Cães de energia elevada tendem a exigir mais atividade física e mental diária.",
          "Cães de companhia podem precisar de menos exercício intenso, mas continuam a precisar de rotina e enriquecimento.",
          "Raças de trabalho, pastoreio e caça podem apresentar comportamentos ligados à função para a qual foram selecionadas.",
        ],
      },
      {
        title: "4. Tamanho não é tudo",
        points: [
          "Alguns cães pequenos são muito ativos; alguns cães grandes podem ser tranquilos dentro de casa.",
          "Espaço disponível importa, mas rotina e exercício adequado são igualmente importantes.",
          "Custos de alimentação, transporte e alguns cuidados veterinários podem aumentar com o porte.",
        ],
      },
      {
        title: "5. Conheça o indivíduo",
        points: [
          "Antes de adotar, converse com o abrigo, protetor ou família temporária sobre rotina e comportamento observado.",
          "Faça encontros compatíveis com a realidade da casa.",
          "Evite decisões impulsivas baseadas apenas em fotografias.",
          "Compatibilidade sustentável costuma ser melhor do que escolher apenas pela estética.",
        ],
      },
    ],
  },
  {
    slug: "rotina-alimentacao",
    title: "Rotina de Alimentação e Bem-Estar",
    shortTitle: "Alimentação & Rotina",
    promise: "Organize horários, água, petiscos e observação sem transformar o dia numa confusão.",
    description: "Orientações gerais de rotina alimentar e bem-estar, sem substituir avaliação veterinária ou nutricional.",
    audience: "Para tutores que querem mais consistência e consciência na alimentação do cão.",
    image: "/images/card-alimentou.jpg",
    tags: ["alimentação", "rotina", "bem-estar"],
    chapters: [
      {
        title: "1. Consistência ajuda",
        points: [
          "Mantenha horários razoavelmente previsíveis e observe como o cão responde à rotina.",
          "Siga a quantidade recomendada para o alimento escolhido e ajuste apenas com orientação adequada.",
          "Água fresca deve permanecer disponível, salvo orientação veterinária específica.",
        ],
      },
      {
        title: "2. Petiscos também contam",
        points: [
          "Petiscos podem ser úteis no treino, mas fazem parte da ingestão diária.",
          "Use porções pequenas no reforço positivo.",
          "Evite oferecer alimentos humanos sem confirmar se são seguros para cães.",
        ],
      },
      {
        title: "3. Mudanças devem ser observadas",
        points: [
          "Alterações de alimento são geralmente melhor toleradas quando feitas gradualmente.",
          "Vómitos repetidos, diarreia persistente, perda de apetite ou mudança marcada de sede justificam avaliação profissional.",
          "Não faça dietas restritivas, suplementação ou alimentação caseira desequilibrada sem orientação.",
        ],
      },
      {
        title: "4. Peso e condição corporal",
        points: [
          "O peso isolado não conta toda a história; condição corporal e evolução ao longo do tempo são importantes.",
          "Acompanhe mudanças e converse com o veterinário sobre metas adequadas ao indivíduo.",
          "Atividade física deve respeitar idade, saúde, clima e condicionamento.",
        ],
      },
      {
        title: "5. Rotina é cuidado",
        points: [
          "Alimentação, sono, atividade, contacto social e acompanhamento veterinário funcionam em conjunto.",
          "Uma rotina boa não precisa ser perfeita; precisa ser sustentável para a família e adequada ao cão.",
          "Use este guia como organização geral, não como prescrição nutricional.",
        ],
      },
    ],
  },
];

export const solidarityEbookBySlug = Object.fromEntries(solidarityEbooks.map((ebook) => [ebook.slug, ebook])) as Record<string, SolidarityEbook>;

export const recommendationMap: Record<string, string> = {
  care: "cuidados-essenciais",
  puppy: "filhote-primeiros-30-dias",
  training: "treino-gentil",
  breeds: "guia-das-racas",
  food: "rotina-alimentacao",
};

export function solidarityAmountCents(count: number) {
  return Math.max(1, Math.min(solidarityEbooks.length, count)) * SOLIDARITY_EBOOK_UNIT_CENTS;
}
