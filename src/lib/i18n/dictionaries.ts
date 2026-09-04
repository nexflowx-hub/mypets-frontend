// ─────────────────────────────────────────────────────────────
// MyPets translation dictionaries
// pt-PT and pt-BR are NOT the same localization — natural
// terminology per country (esterilização/castração, donativo/doação…)
// ─────────────────────────────────────────────────────────────

export type Locale = "pt-PT" | "pt-BR" | "en";

export const LOCALES: Locale[] = ["pt-PT", "pt-BR", "en"];

export interface LocaleMeta {
  code: Locale;
  country: string;
  flag: string; // emoji
  short: string;
  intl: string;
  currency: "EUR" | "BRL";
  currencySymbol: string;
}

export const LOCALE_META: Record<Locale, LocaleMeta> = {
  "pt-PT": { code: "pt-PT", country: "PT", flag: "🇵🇹", short: "PT", intl: "pt-PT", currency: "EUR", currencySymbol: "€" },
  "pt-BR": { code: "pt-BR", country: "BR", flag: "🇧🇷", short: "BR", intl: "pt-BR", currency: "BRL", currencySymbol: "R$" },
  en: { code: "en", country: "INT", flag: "🌐", short: "EN", intl: "en", currency: "EUR", currencySymbol: "€" },
};

export interface Dictionary {
  nav: {
    discover: string;
    protectors: string;
    animals: string;
    needs: string;
    stories: string;
    impact: string;
    partners: string;
    about: string;
    signIn: string;
    helpNow: string;
    search: string;
    menu: string;
    close: string;
  };
  hero: {
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    community: string;
    handwritten: string;
    moreThan: string;
  };
  facepets: {
    name: string;
    tagline: string;
    note: string;
    cta: string;
    text: string;
    domain: string;
  };
  mission: {
    title1: string;
    title2: string;
    cards: { key: string; title: string; text: string }[];
  };
  how: {
    title: string;
    steps: { title: string; text: string }[];
    closing: string;
  };
  ways: {
    title: string;
    cards: { title: string; text: string }[];
    guardians: {
      title: string;
      text: string;
      cta: string;
    };
  };
  stories: {
    title: string;
    viewAll: string;
    support: string; // {name} placeholder
    of: string; // "de" progress separator
    demo: string;
    report: string;
    empty: string;
  };
  tags: Record<string, string>;
  impact: {
    title: string;
    viewAll: string;
    demoNote: string;
  };
  cta: {
    title: string;
    button: string;
  };
  partner: {
    text: string;
    cta: string;
  };
  trust: {
    verified: string;
    updates: string;
    clearNeeds: string;
    moderation: string;
  };
  footer: {
    tagline: string;
    about: string;
    navigation: string;
    institutional: string;
    help: string;
    newsletter: string;
    newsletterDesc: string;
    newsletterPlaceholder: string;
    newsletterSuccess: string;
    newsletterError: string;
    navLinks: string[];
    instLinks: string[];
    helpLinks: string[];
    poweredBy: string;
    companyNumber: string;
    address: string;
    companySite: string;
    motto: string;
    countries: { label: string; flag: string; locale: Locale }[];
  };
  donate: {
    title: string;
    subtitle: string;
    step: string;
    of: string;
    targetTitle: string;
    targets: { key: string; title: string; text: string }[];
    amountTitle: string;
    custom: string;
    frequencyTitle: string;
    oneTime: string;
    monthly: string;
    monthlyNote: string;
    paymentTitle: string;
    methods: Record<string, string>;
    cardNumber: string;
    cardName: string;
    expiry: string;
    cvv: string;
    nameField: string;
    emailField: string;
    processing: string;
    confirm: string;
    back: string;
    next: string;
    thankYouTitle: string;
    thankYouText: string;
    amountLabel: string;
    destinationLabel: string;
    statusLabel: string;
    statusPaid: string;
    shareLabel: string;
    shareCta: string;
    followCta: string;
    closeCta: string;
    errorGeneric: string;
    guardianTitle: string;
    guardianText: string;
  };
  auth: {
    title: string;
    subtitle: string;
    email: string;
    password: string;
    submit: string;
    noAccount: string;
    signUp: string;
    demoNote: string;
    forgot: string;
  };
  report: {
    title: string;
    desc: string;
    reason: string;
    reasons: string[];
    email: string;
    submit: string;
    success: string;
  };
  search: {
    placeholder: string;
    noResults: string;
    sections: string;
    stories: string;
    suggest: string[];
  };
  common: {
    loading: string;
    error: string;
    retry: string;
    demoEnv: string;
  };
}

const ptPT: Dictionary = {
  nav: {
    discover: "Descobrir",
    protectors: "Protetores",
    animals: "Animais",
    needs: "Necessidades",
    stories: "Histórias",
    impact: "Impacto",
    partners: "Parceiros",
    about: "Sobre nós",
    signIn: "Entrar",
    helpNow: "Ajudar agora",
    search: "Pesquisar",
    menu: "Menu",
    close: "Fechar",
  },
  hero: {
    title: "Quem ajuda animais também merece ajuda.",
    subtitle:
      "Todos os dias existem pessoas que resgatam, alimentam, tratam e acolhem animais usando o que têm. O MyPets existe para que elas não precisem fazer isso sozinhas.",
    ctaPrimary: "Quero ajudar",
    ctaSecondary: "Eu ajudo animais",
    community: "Uma comunidade. Milhares de histórias. Um impacto que podemos acompanhar.",
    handwritten: "Pessoas mudam vidas",
    moreThan: "Mais do que doações, são novas histórias.",
  },
  facepets: {
    name: "FacePets",
    tagline: "Every pet has a story.",
    note: "Histórias reais. Vidas melhores.",
    cta: "Conhecer histórias",
    text: "Cada animal tem uma história. Conheça, acompanhe e faça parte da mudança.",
    domain: "facepets.org",
  },
  mission: {
    title1: "Por trás de cada animal salvo existe alguém",
    title2: "que decidiu não ignorar.",
    cards: [
      { key: "resgatou", title: "Resgatou", text: "Encontrou um animal abandonado e decidiu levá-lo para casa." },
      { key: "alimentou", title: "Alimentou", text: "Todos os dias volta à mesma rua para alimentar uma colónia." },
      { key: "tratou", title: "Tratou", text: "Pagou uma consulta ou medicamento com os próprios recursos." },
      { key: "acolheu", title: "Acolheu", text: "Abriu espaço em casa até encontrar uma família." },
    ],
  },
  how: {
    title: "Como funciona?",
    steps: [
      { title: "Alguém ajuda", text: "Um protetor ou um animal precisa de apoio." },
      { title: "MyPets verifica", text: "Analisamos o perfil e as necessidades apresentadas." },
      { title: "A comunidade apoia", text: "Pessoas e empresas contribuem." },
      { title: "A ajuda é realizada", text: "O apoio chega a quem precisa." },
      { title: "O impacto é mostrado", text: "Acompanhe resultados e atualizações reais." },
    ],
    closing: "Você vê. Você ajuda. Você acompanha.",
  },
  ways: {
    title: "Três formas de ajudar",
    cards: [
      { title: "Apoiar um animal", text: "Contribua para um caso concreto." },
      { title: "Apoiar um protetor", text: "Ajude quem ajuda todos os dias." },
      { title: "Apoiar o MyPets", text: "Fortaleça a rede e necessidades prioritárias." },
    ],
    guardians: {
      title: "MyPets Guardians",
      text: "Um Guardião é alguém que decidiu não ajudar apenas uma vez.",
      cta: "Torne-se um Guardião",
    },
  },
  stories: {
    title: "Histórias que precisam de você agora.",
    viewAll: "Ver todas as necessidades",
    support: "Apoiar {name}",
    of: "de",
    demo: "Demonstração",
    report: "Reportar",
    empty: "De momento não há histórias ativas. Volte em breve.",
  },
  tags: {
    RACAO: "Ração",
    MEDICACAO: "Medicamentos",
    ESTERILIZACAO: "Esterilizações",
    VACINACAO: "Vacinação",
    TRANSPORTE: "Transporte",
    CONSULTA: "Consulta",
    CIRURGIA: "Cirurgia",
    RECUPERACAO: "Recuperação",
    ACOLHIMENTO: "Acolhimento",
    ALIMENTO: "Alimento",
    CASTRACAO: "Castração",
  },
  impact: {
    title: "Impacto em números",
    viewAll: "Ver todas",
    demoNote: "Valores de demonstração.",
  },
  cta: {
    title: "Juntos criamos um mundo mais humano para todos os animais.",
    button: "Ver nosso impacto",
  },
  partner: {
    text: "Empresas também podem ajudar quem cuida de animais.",
    cta: "Torne-se parceiro",
  },
  trust: {
    verified: "Perfis verificados",
    updates: "Atualizações de casos",
    clearNeeds: "Necessidades claras",
    moderation: "Moderação e reporte",
  },
  footer: {
    tagline: "Pessoas. Animais. Impacto Real.",
    about:
      "Uma rede que aproxima quem quer ajudar das pessoas que resgatam, alimentam, tratam e protegem animais todos os dias.",
    navigation: "Navegação",
    institutional: "Institucional",
    help: "Ajuda",
    newsletter: "Newsletter",
    newsletterDesc: "Receba histórias e novidades.",
    newsletterPlaceholder: "Seu email",
    newsletterSuccess: "Inscrição registada. Obrigado por acompanhar estas histórias.",
    newsletterError: "Não foi possível registar. Verifique o email e tente novamente.",
    navLinks: ["Descobrir", "Protetores", "Animais", "Necessidades", "Histórias", "Impacto"],
    instLinks: ["Sobre nós", "Parceiros", "Transparência", "Blog", "Imprensa", "Contactos"],
    helpLinks: ["Central de ajuda", "Segurança", "Denunciar", "Termos", "Privacidade", "Cookies"],
    poweredBy: "Powered by HUMAN IMPACT TECH LTD",
    companyNumber: "Company number: 17422257",
    address: "1-75 Shelton Street, Covent Garden, London, United Kingdom, WC2H 9JQ",
    companySite: "humanimpact.tech",
    motto: "Animais. Pessoas. Um futuro melhor.",
    countries: [
      { label: "Brasil", flag: "🇧🇷", locale: "pt-BR" as Locale },
      { label: "Portugal", flag: "🇵🇹", locale: "pt-PT" as Locale },
      { label: "English", flag: "🌐", locale: "en" as Locale },
    ],
  },
  donate: {
    title: "Apoiar",
    subtitle: "Escolha o destino do seu apoio. Você acompanha o impacto.",
    step: "Passo",
    of: "de",
    targetTitle: "O que quer apoiar?",
    targets: [
      { key: "ANIMAL", title: "Apoiar um animal", text: "Contribua para um caso concreto." },
      { key: "PROTECTOR", title: "Apoiar um protetor", text: "Ajude quem ajuda todos os dias." },
      { key: "NETWORK", title: "Apoiar o MyPets", text: "Fortaleça a rede e necessidades prioritárias." },
    ],
    amountTitle: "Escolha o valor",
    custom: "Outro valor",
    frequencyTitle: "Frequência",
    oneTime: "Apoio único",
    monthly: "Apoio mensal",
    monthlyNote: "Ao tornar-se Guardião, o seu apoio recorrente sustenta a rede todos os meses.",
    paymentTitle: "Método de pagamento",
    methods: {
      CARD: "Cartão",
      MBWAY: "MB WAY",
      MULTIBANCO: "Multibanco",
      PIX: "Pix",
      BOLETO: "Boleto",
    },
    cardNumber: "Número do cartão",
    cardName: "Nome no cartão",
    expiry: "Validade",
    cvv: "CVV",
    nameField: "O seu nome (opcional)",
    emailField: "Email (opcional, para recibo)",
    processing: "A processar pagamento…",
    confirm: "Confirmar apoio",
    back: "Voltar",
    next: "Continuar",
    thankYouTitle: "Você acabou de fazer parte desta história.",
    thankYouText: "Obrigado por apoiar quem cuida dos animais todos os dias. Vai receber atualizações sobre o impacto do seu apoio.",
    amountLabel: "Valor",
    destinationLabel: "Destino",
    statusLabel: "Estado",
    statusPaid: "Pagamento confirmado",
    shareLabel: "Partilhe esta história",
    shareCta: "Partilhar",
    followCta: "Seguir atualizações",
    closeCta: "Continuar a explorar",
    errorGeneric: "Não foi possível concluir. Tente novamente.",
    guardianTitle: "MyPets Guardians",
    guardianText: "Um Guardião é alguém que decidiu não ajudar apenas uma vez.",
  },
  auth: {
    title: "Entrar no MyPets",
    subtitle: "Acompanhe o seu impacto, siga histórias e apoie quem ajuda animais.",
    email: "Email",
    password: "Palavra-passe",
    submit: "Entrar",
    noAccount: "Ainda não tem conta?",
    signUp: "Criar conta",
    demoNote: "Ambiente de demonstração: a autenticação completa estará disponível na plataforma de produção.",
    forgot: "Esqueceu a palavra-passe?",
  },
  report: {
    title: "Reportar preocupação",
    desc: "A sua mensagem entra na fila de moderação do MyPets. Analisamos todos os reportes.",
    reason: "Motivo",
    reasons: ["Conteúdo suspeito ou fraudulento", "Informação incorreta sobre o animal", "Má conduta de protetor", "Outro"],
    email: "Email para contacto (opcional)",
    submit: "Enviar reporte",
    success: "Reporte enviado. Obrigado por ajudar a manter a comunidade segura.",
  },
  search: {
    placeholder: "Pesquisar animais, protetores, histórias…",
    noResults: "Sem resultados. Tente outra palavra.",
    sections: "Secções",
    stories: "Histórias",
    suggest: ["Ana", "Carlos", "Luna", "Milo", "Impacto", "Guardians"],
  },
  common: {
    loading: "A carregar…",
    error: "Algo correu mal.",
    retry: "Tentar novamente",
    demoEnv: "Ambiente de demonstração",
  },
};

const ptBR: Dictionary = {
  nav: {
    discover: "Descobrir",
    protectors: "Protetores",
    animals: "Animais",
    needs: "Necessidades",
    stories: "Histórias",
    impact: "Impacto",
    partners: "Parceiros",
    about: "Sobre nós",
    signIn: "Entrar",
    helpNow: "Ajudar agora",
    search: "Pesquisar",
    menu: "Menu",
    close: "Fechar",
  },
  hero: {
    title: "Quem ajuda animais também merece ajuda.",
    subtitle:
      "Todos os dias, existem pessoas que resgatam, alimentam, tratam e acolhem animais usando o que têm. O MyPets existe para que elas não precisem fazer isso sozinhas.",
    ctaPrimary: "Quero ajudar",
    ctaSecondary: "Eu ajudo animais",
    community: "Uma comunidade. Milhares de histórias. Um impacto que podemos acompanhar.",
    handwritten: "Pessoas mudam vidas",
    moreThan: "Mais do que doações, são novas histórias.",
  },
  facepets: {
    name: "FacePets",
    tagline: "Every pet has a story.",
    note: "Histórias reais. Vidas melhores.",
    cta: "Conhecer histórias",
    text: "Cada animal tem uma história. Conheça, acompanhe e faça parte da mudança.",
    domain: "facepets.org",
  },
  mission: {
    title1: "Por trás de cada animal salvo existe alguém",
    title2: "que decidiu não ignorar.",
    cards: [
      { key: "resgatou", title: "Resgatou", text: "Encontrou um animal abandonado e decidiu ajudá-lo." },
      { key: "alimentou", title: "Alimentou", text: "Todos os dias volta para alimentar animais que dependem daquela ajuda." },
      { key: "tratou", title: "Tratou", text: "Pagou uma consulta, exame ou medicamento com os próprios recursos." },
      { key: "acolheu", title: "Acolheu", text: "Abriu espaço em casa até encontrar uma família." },
    ],
  },
  how: {
    title: "Como funciona?",
    steps: [
      { title: "Alguém ajuda", text: "Um protetor ou um animal precisa de apoio." },
      { title: "MyPets verifica", text: "Analisamos o perfil e as necessidades apresentadas." },
      { title: "A comunidade apoia", text: "Pessoas e empresas contribuem." },
      { title: "A ajuda é realizada", text: "O apoio chega a quem precisa." },
      { title: "O impacto é mostrado", text: "A comunidade pode acompanhar resultados e atualizações." },
    ],
    closing: "Você vê. Você ajuda. Você acompanha.",
  },
  ways: {
    title: "Três formas de ajudar",
    cards: [
      { title: "Apoiar um animal", text: "Contribua para um caso concreto." },
      { title: "Apoiar um protetor", text: "Ajude quem ajuda todos os dias." },
      { title: "Apoiar o MyPets", text: "Fortaleça a rede e necessidades prioritárias." },
    ],
    guardians: {
      title: "MyPets Guardians",
      text: "Um Guardião é alguém que decidiu não ajudar apenas uma vez.",
      cta: "Seja um Guardião",
    },
  },
  stories: {
    title: "Histórias que precisam de você agora.",
    viewAll: "Ver todas as necessidades",
    support: "Apoiar {name}",
    of: "de",
    demo: "Demonstração",
    report: "Denunciar",
    empty: "No momento não há histórias ativas. Volte em breve.",
  },
  tags: {
    RACAO: "Ração",
    MEDICACAO: "Medicamentos",
    ESTERILIZACAO: "Castrações",
    VACINACAO: "Vacinação",
    TRANSPORTE: "Transporte",
    CONSULTA: "Consulta",
    CIRURGIA: "Cirurgia",
    RECUPERACAO: "Recuperação",
    ACOLHIMENTO: "Acolhimento",
    ALIMENTO: "Alimento",
    CASTRACAO: "Castração",
  },
  impact: {
    title: "Impacto em números",
    viewAll: "Ver todas",
    demoNote: "Valores de demonstração.",
  },
  cta: {
    title: "Juntos criamos um mundo mais humano para todos os animais.",
    button: "Ver nosso impacto",
  },
  partner: {
    text: "Empresas também podem ajudar quem cuida de animais.",
    cta: "Torne-se parceiro",
  },
  trust: {
    verified: "Perfis verificados",
    updates: "Atualizações de casos",
    clearNeeds: "Necessidades claras",
    moderation: "Moderação e denúncia",
  },
  footer: {
    tagline: "Pessoas. Animais. Impacto Real.",
    about:
      "Uma rede que aproxima quem quer ajudar das pessoas que resgatam, alimentam, tratam e protegem animais todos os dias.",
    navigation: "Navegação",
    institutional: "Institucional",
    help: "Ajuda",
    newsletter: "Newsletter",
    newsletterDesc: "Receba histórias e novidades.",
    newsletterPlaceholder: "Seu email",
    newsletterSuccess: "Inscrição registrada. Obrigado por acompanhar essas histórias.",
    newsletterError: "Não foi possível registrar. Verifique o email e tente novamente.",
    navLinks: ["Descobrir", "Protetores", "Animais", "Necessidades", "Histórias", "Impacto"],
    instLinks: ["Sobre nós", "Parceiros", "Transparência", "Blog", "Imprensa", "Contatos"],
    helpLinks: ["Central de ajuda", "Segurança", "Denunciar", "Termos", "Privacidade", "Cookies"],
    poweredBy: "Powered by HUMAN IMPACT TECH LTD",
    companyNumber: "Company number: 17422257",
    address: "1-75 Shelton Street, Covent Garden, London, United Kingdom, WC2H 9JQ",
    companySite: "humanimpact.tech",
    motto: "Animais. Pessoas. Um futuro melhor.",
    countries: [
      { label: "Brasil", flag: "🇧🇷", locale: "pt-BR" as Locale },
      { label: "Portugal", flag: "🇵🇹", locale: "pt-PT" as Locale },
      { label: "English", flag: "🌐", locale: "en" as Locale },
    ],
  },
  donate: {
    title: "Apoiar",
    subtitle: "Escolha o destino do seu apoio. Você acompanha o impacto.",
    step: "Passo",
    of: "de",
    targetTitle: "O que você quer apoiar?",
    targets: [
      { key: "ANIMAL", title: "Apoiar um animal", text: "Contribua para um caso concreto." },
      { key: "PROTECTOR", title: "Apoiar um protetor", text: "Ajude quem ajuda todos os dias." },
      { key: "NETWORK", title: "Apoiar o MyPets", text: "Fortaleça a rede e necessidades prioritárias." },
    ],
    amountTitle: "Escolha o valor",
    custom: "Outro valor",
    frequencyTitle: "Frequência",
    oneTime: "Apoio único",
    monthly: "Apoio mensal",
    monthlyNote: "Ao virar Guardião, o seu apoio recorrente sustenta a rede todos os meses.",
    paymentTitle: "Forma de pagamento",
    methods: {
      CARD: "Cartão",
      MBWAY: "MB WAY",
      MULTIBANCO: "Multibanco",
      PIX: "Pix",
      BOLETO: "Boleto",
    },
    cardNumber: "Número do cartão",
    cardName: "Nome no cartão",
    expiry: "Validade",
    cvv: "CVV",
    nameField: "Seu nome (opcional)",
    emailField: "Email (opcional, para recibo)",
    processing: "Processando pagamento…",
    confirm: "Confirmar apoio",
    back: "Voltar",
    next: "Continuar",
    thankYouTitle: "Você acabou de fazer parte desta história.",
    thankYouText: "Obrigado por apoiar quem cuida dos animais todos os dias. Você vai receber atualizações sobre o impacto do seu apoio.",
    amountLabel: "Valor",
    destinationLabel: "Destino",
    statusLabel: "Status",
    statusPaid: "Pagamento confirmado",
    shareLabel: "Compartilhe esta história",
    shareCta: "Compartilhar",
    followCta: "Seguir atualizações",
    closeCta: "Continuar explorando",
    errorGeneric: "Não foi possível concluir. Tente novamente.",
    guardianTitle: "MyPets Guardians",
    guardianText: "Um Guardião é alguém que decidiu não ajudar apenas uma vez.",
  },
  auth: {
    title: "Entrar no MyPets",
    subtitle: "Acompanhe o seu impacto, siga histórias e apoie quem ajuda animais.",
    email: "Email",
    password: "Senha",
    submit: "Entrar",
    noAccount: "Ainda não tem conta?",
    signUp: "Criar conta",
    demoNote: "Ambiente de demonstração: a autenticação completa estará disponível na plataforma de produção.",
    forgot: "Esqueceu a senha?",
  },
  report: {
    title: "Denunciar preocupação",
    desc: "Sua mensagem entra na fila de moderação do MyPets. Analisamos todas as denúncias.",
    reason: "Motivo",
    reasons: ["Conteúdo suspeito ou fraudulento", "Informação incorreta sobre o animal", "Má conduta de protetor", "Outro"],
    email: "Email para contato (opcional)",
    submit: "Enviar denúncia",
    success: "Denúncia enviada. Obrigado por ajudar a manter a comunidade segura.",
  },
  search: {
    placeholder: "Pesquisar animais, protetores, histórias…",
    noResults: "Sem resultados. Tente outra palavra.",
    sections: "Seções",
    stories: "Histórias",
    suggest: ["Ana", "Carlos", "Luna", "Milo", "Impacto", "Guardians"],
  },
  common: {
    loading: "Carregando…",
    error: "Algo deu errado.",
    retry: "Tentar novamente",
    demoEnv: "Ambiente de demonstração",
  },
};

const en: Dictionary = {
  nav: {
    discover: "Discover",
    protectors: "Protectors",
    animals: "Animals",
    needs: "Needs",
    stories: "Stories",
    impact: "Impact",
    partners: "Partners",
    about: "About us",
    signIn: "Sign in",
    helpNow: "Help now",
    search: "Search",
    menu: "Menu",
    close: "Close",
  },
  hero: {
    title: "People who help animals deserve support too.",
    subtitle:
      "Every day, people rescue, feed, treat and foster animals using the resources they have. MyPets exists so they don't have to do it alone.",
    ctaPrimary: "I want to help",
    ctaSecondary: "I help animals",
    community: "A community. Thousands of stories. An impact we can follow.",
    handwritten: "People change lives",
    moreThan: "More than donations — new stories.",
  },
  facepets: {
    name: "FacePets",
    tagline: "Every pet has a story.",
    note: "Real stories. Better lives.",
    cta: "Discover stories",
    text: "Every animal has a story. Discover it, follow it and be part of the change.",
    domain: "facepets.org",
  },
  mission: {
    title1: "Behind every rescued animal there is someone",
    title2: "who decided not to look away.",
    cards: [
      { key: "resgatou", title: "Rescued", text: "Found an abandoned animal and decided to bring it home." },
      { key: "alimentou", title: "Fed", text: "Returns to the same street every day to feed a colony." },
      { key: "tratou", title: "Treated", text: "Paid for a vet visit or medication out of their own pocket." },
      { key: "acolheu", title: "Fostered", text: "Opened their home until a family could be found." },
    ],
  },
  how: {
    title: "How it works",
    steps: [
      { title: "Someone helps", text: "A protector or an animal needs support." },
      { title: "MyPets verifies", text: "We review the profile and the needs presented." },
      { title: "The community supports", text: "People and companies contribute." },
      { title: "Help is delivered", text: "Support reaches those who need it." },
      { title: "Impact is shown", text: "Follow real results and updates." },
    ],
    closing: "You see. You help. You follow.",
  },
  ways: {
    title: "Three ways to help",
    cards: [
      { title: "Support an animal", text: "Contribute to a concrete case." },
      { title: "Support a protector", text: "Help those who help every day." },
      { title: "Support MyPets", text: "Strengthen the network and priority needs." },
    ],
    guardians: {
      title: "MyPets Guardians",
      text: "A Guardian is someone who decided not to help only once.",
      cta: "Become a Guardian",
    },
  },
  stories: {
    title: "Stories that need you right now.",
    viewAll: "View all needs",
    support: "Support {name}",
    of: "of",
    demo: "Demo",
    report: "Report",
    empty: "There are no active stories right now. Come back soon.",
  },
  tags: {
    RACAO: "Food",
    MEDICACAO: "Medication",
    ESTERILIZACAO: "Sterilization",
    VACINACAO: "Vaccination",
    TRANSPORTE: "Transport",
    CONSULTA: "Vet visit",
    CIRURGIA: "Surgery",
    RECUPERACAO: "Recovery",
    ACOLHIMENTO: "Foster care",
    ALIMENTO: "Food",
    CASTRACAO: "Neutering",
  },
  impact: {
    title: "Impact in numbers",
    viewAll: "View all",
    demoNote: "Demo values.",
  },
  cta: {
    title: "Together we create a more humane world for all animals.",
    button: "See our impact",
  },
  partner: {
    text: "Companies can also help those who care for animals.",
    cta: "Become a partner",
  },
  trust: {
    verified: "Verified profiles",
    updates: "Case updates",
    clearNeeds: "Clear needs",
    moderation: "Moderation & reporting",
  },
  footer: {
    tagline: "People. Animals. Real Impact.",
    about:
      "A network that brings together people who want to help and those who rescue, feed, treat and protect animals every day.",
    navigation: "Navigation",
    institutional: "Institutional",
    help: "Help",
    newsletter: "Newsletter",
    newsletterDesc: "Receive stories and updates.",
    newsletterPlaceholder: "Your email",
    newsletterSuccess: "Subscription registered. Thank you for following these stories.",
    newsletterError: "Could not register. Check the email and try again.",
    navLinks: ["Discover", "Protectors", "Animals", "Needs", "Stories", "Impact"],
    instLinks: ["About us", "Partners", "Transparency", "Blog", "Press", "Contacts"],
    helpLinks: ["Help center", "Safety", "Report", "Terms", "Privacy", "Cookies"],
    poweredBy: "Powered by HUMAN IMPACT TECH LTD",
    companyNumber: "Company number: 17422257",
    address: "1-75 Shelton Street, Covent Garden, London, United Kingdom, WC2H 9JQ",
    companySite: "humanimpact.tech",
    motto: "Animals. People. A better future.",
    countries: [
      { label: "Brasil", flag: "🇧🇷", locale: "pt-BR" as Locale },
      { label: "Portugal", flag: "🇵🇹", locale: "pt-PT" as Locale },
      { label: "English", flag: "🌐", locale: "en" as Locale },
    ],
  },
  donate: {
    title: "Support",
    subtitle: "Choose where your support goes. You can follow the impact.",
    step: "Step",
    of: "of",
    targetTitle: "What do you want to support?",
    targets: [
      { key: "ANIMAL", title: "Support an animal", text: "Contribute to a concrete case." },
      { key: "PROTECTOR", title: "Support a protector", text: "Help those who help every day." },
      { key: "NETWORK", title: "Support MyPets", text: "Strengthen the network and priority needs." },
    ],
    amountTitle: "Choose the amount",
    custom: "Other amount",
    frequencyTitle: "Frequency",
    oneTime: "One-time",
    monthly: "Monthly",
    monthlyNote: "As a Guardian, your recurring support sustains the network every month.",
    paymentTitle: "Payment method",
    methods: {
      CARD: "Card",
      MBWAY: "MB WAY",
      MULTIBANCO: "Multibanco",
      PIX: "Pix",
      BOLETO: "Boleto",
    },
    cardNumber: "Card number",
    cardName: "Name on card",
    expiry: "Expiry",
    cvv: "CVV",
    nameField: "Your name (optional)",
    emailField: "Email (optional, for the receipt)",
    processing: "Processing payment…",
    confirm: "Confirm support",
    back: "Back",
    next: "Continue",
    thankYouTitle: "You just became part of this story.",
    thankYouText: "Thank you for supporting those who care for animals every day. You will receive updates about the impact of your support.",
    amountLabel: "Amount",
    destinationLabel: "Destination",
    statusLabel: "Status",
    statusPaid: "Payment confirmed",
    shareLabel: "Share this story",
    shareCta: "Share",
    followCta: "Follow updates",
    closeCta: "Keep exploring",
    errorGeneric: "Could not complete. Please try again.",
    guardianTitle: "MyPets Guardians",
    guardianText: "A Guardian is someone who decided not to help only once.",
  },
  auth: {
    title: "Sign in to MyPets",
    subtitle: "Follow your impact, follow stories and support those who help animals.",
    email: "Email",
    password: "Password",
    submit: "Sign in",
    noAccount: "Don't have an account?",
    signUp: "Create account",
    demoNote: "Demo environment: full authentication will be available on the production platform.",
    forgot: "Forgot your password?",
  },
  report: {
    title: "Report a concern",
    desc: "Your message enters the MyPets moderation queue. We review every report.",
    reason: "Reason",
    reasons: ["Suspicious or fraudulent content", "Incorrect information about the animal", "Protector misconduct", "Other"],
    email: "Contact email (optional)",
    submit: "Send report",
    success: "Report sent. Thank you for helping keep the community safe.",
  },
  search: {
    placeholder: "Search animals, protectors, stories…",
    noResults: "No results. Try another word.",
    sections: "Sections",
    stories: "Stories",
    suggest: ["Ana", "Carlos", "Luna", "Milo", "Impact", "Guardians"],
  },
  common: {
    loading: "Loading…",
    error: "Something went wrong.",
    retry: "Try again",
    demoEnv: "Demo environment",
  },
};

export const DICTIONARIES: Record<Locale, Dictionary> = {
  "pt-PT": ptPT,
  "pt-BR": ptBR,
  en,
};

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale] ?? DICTIONARIES["pt-PT"];
}

/** Format cents into localized currency, e.g. €285 or R$ 1.670 */
export function formatMoney(cents: number, currency: "EUR" | "BRL", intlLocale: string): string {
  return new Intl.NumberFormat(intlLocale, {
    style: "currency",
    currency,
    maximumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}

/** Donation amount presets per currency (configurable) */
export function amountPresets(currency: "EUR" | "BRL"): { cents: number; label: string }[] {
  if (currency === "BRL") {
    return [
      { cents: 1500, label: "R$ 15" },
      { cents: 3000, label: "R$ 30" },
      { cents: 6000, label: "R$ 60" },
      { cents: 10000, label: "R$ 100" },
    ];
  }
  return [
    { cents: 500, label: "€5" },
    { cents: 1000, label: "€10" },
    { cents: 2500, label: "€25" },
    { cents: 5000, label: "€50" },
  ];
}
