export type LegalSection = { title: string; paragraphs: string[]; bullets?: string[] };
export type LegalPage = { title: string; description: string; updated: string; sections: LegalSection[] };

export const LEGAL_PAGES: Record<string, LegalPage> = {
  termos: {
    title: "Termos de Uso do MyPets",
    description: "Regras gerais para utilização da plataforma, conteúdos, contas, causas, loja e serviços MyPets.",
    updated: "17 de setembro de 2026",
    sections: [
      { title: "1. Âmbito", paragraphs: ["Estes Termos regulam a utilização do site mypets.lat e das experiências digitais disponibilizadas sob a marca MyPets. Algumas funcionalidades possuem condições específicas, incluindo loja, pagamentos, apoio a causas, perfis e participação comunitária."] },
      { title: "2. Operadores por mercado", paragraphs: ["MyPets é uma marca e experiência digital. O operador contratual depende do serviço e do mercado e é identificado na oferta, no checkout ou na página institucional. MyPets Brasil e MyPets Europe são identificações comerciais e não pessoas jurídicas separadas."], bullets: ["Brasil: o operador brasileiro identificado em /institucional#brasil responde pelas vendas locais quando indicado como vendedor.", "Internacional: HUMAN IMPACT TECH LTD pode atuar como operadora comercial quando identificada na oferta ou checkout.", "HUMAN IMPACT TECH LTD também fornece tecnologia ao ecossistema MyPets; ser fornecedora tecnológica não a torna automaticamente parte de cada venda brasileira."] },
      { title: "3. Contas e utilização aceitável", paragraphs: ["O utilizador deve fornecer informações corretas, proteger as suas credenciais e não utilizar a plataforma para fraude, abuso, violação de direitos de terceiros, manipulação de campanhas ou tentativa de acesso não autorizado."] },
      { title: "4. Conteúdo e comunidade", paragraphs: ["Histórias, perfis, causas e atualizações podem ser fornecidos por utilizadores, protetores, organizações ou pela própria plataforma. A apresentação de conteúdo não constitui garantia absoluta de resultados, disponibilidade ou necessidade futura; verificações e estados podem mudar ao longo do tempo."] },
      { title: "5. Pagamentos", paragraphs: ["A geração de um QR Code, link ou intenção de pagamento não equivale à confirmação de pagamento. O estado financeiro confirmado pelo sistema e pelo respetivo prestador de pagamentos é a referência para conclusão de uma operação."] },
      { title: "6. Loja e apoios são fluxos distintos", paragraphs: ["Uma compra na Loja MyPets é uma operação comercial. Um apoio ou contribuição segue regras próprias e não deve ser apresentado como parte do preço de compra, salvo quando uma campanha comercial indicar de forma clara e verificável uma regra específica de impacto."] },
      { title: "7. Lei obrigatória e direitos do consumidor", paragraphs: ["Nada nestes Termos elimina direitos obrigatórios do consumidor aplicáveis no país do cliente. Em caso de conflito entre estes Termos e uma norma imperativa, prevalece a norma aplicável."] },
    ],
  },
  privacidade: {
    title: "Política de Privacidade",
    description: "Como o MyPets trata dados pessoais no Brasil e nos mercados internacionais.",
    updated: "17 de setembro de 2026",
    sections: [
      { title: "1. Quem trata os dados", paragraphs: ["A entidade responsável pelo tratamento depende do fluxo e do mercado. Para relações comerciais brasileiras, o operador brasileiro identificado na página institucional poderá atuar como controlador. Para operações internacionais ou serviços operados pela HUMAN IMPACT TECH LTD, esta poderá atuar como controladora. Prestadores de infraestrutura podem atuar como operadores ou controladores independentes conforme o serviço."] },
      { title: "2. Dados que podemos tratar", paragraphs: ["Podemos tratar dados de conta, contacto, autenticação, endereço, preferências, histórico de pedidos, dados de participação em causas, informações fornecidas em formulários, dados técnicos do dispositivo, consentimentos e identificadores de transação."], bullets: ["Dados de cartão não devem ser armazenados integralmente pelo MyPets quando o processamento é realizado por prestadores de pagamento.", "Dados de documentos solicitados em determinados meios de pagamento são limitados ao necessário para execução e prevenção de fraude."] },
      { title: "3. Finalidades", paragraphs: ["Utilizamos dados para prestar os serviços, processar pedidos e pagamentos, prevenir fraude, prestar suporte, cumprir obrigações legais, melhorar a plataforma, medir desempenho e, quando permitido, enviar comunicações solicitadas ou consentidas."] },
      { title: "4. Bases legais e direitos", paragraphs: ["No Brasil, o tratamento observa a LGPD e pode apoiar-se, conforme o caso, na execução de contrato, cumprimento de obrigação legal, legítimo interesse ou consentimento. Titulares podem solicitar informações e exercer os direitos previstos na legislação aplicável através de privacy@mypets.lat."] },
      { title: "5. Transferências e prestadores", paragraphs: ["O ecossistema utiliza fornecedores de hospedagem, banco de dados, pagamentos, segurança, comunicação e análise. Dados podem ser processados em outros países quando necessário, sujeitos às salvaguardas aplicáveis."] },
      { title: "6. Retenção e segurança", paragraphs: ["Mantemos dados pelo período necessário às finalidades declaradas, obrigações legais, prevenção de fraude e defesa de direitos. Aplicamos controles técnicos e organizacionais proporcionais ao risco, sem prometer segurança absoluta."] },
    ],
  },
  cookies: {
    title: "Política de Cookies",
    description: "Informações sobre cookies, armazenamento local e tecnologias semelhantes no MyPets.",
    updated: "17 de setembro de 2026",
    sections: [
      { title: "1. Tecnologias utilizadas", paragraphs: ["Podemos utilizar cookies, local storage e tecnologias semelhantes para autenticação, idioma, segurança, carrinho, preferências, medição de desempenho e análise de utilização."] },
      { title: "2. Categorias", paragraphs: ["Cookies estritamente necessários suportam funcionalidades essenciais. Cookies de preferências guardam escolhas do utilizador. Tecnologias analíticas e de marketing somente devem ser ativadas de acordo com a configuração de consentimento e a legislação aplicável."] },
      { title: "3. Controlo", paragraphs: ["O utilizador pode ajustar preferências no banner ou centro de consentimento quando disponível e também através do navegador. Desativar armazenamento essencial pode impedir certas funcionalidades."] },
    ],
  },
  loja: {
    title: "Termos da Loja MyPets",
    description: "Condições comerciais para compras de produtos na Loja MyPets.",
    updated: "17 de setembro de 2026",
    sections: [
      { title: "1. Identificação do vendedor", paragraphs: ["Antes da conclusão da compra, o checkout deve indicar claramente o vendedor contratual, moeda, preço total, impostos quando aplicáveis, frete, prazo de entrega e meios de pagamento. O vendedor pode variar conforme o mercado e o estoque que atende o pedido."] },
      { title: "2. Produtos e disponibilidade", paragraphs: ["A publicação de um produto não garante disponibilidade ilimitada. Variações, medidas, compatibilidade e características relevantes serão apresentadas na página do produto. Imagens podem sofrer variações de iluminação, escala ou lote."] },
      { title: "3. Formação do pedido", paragraphs: ["O carrinho não reserva estoque. O pedido é formado após confirmação da compra e pode depender da confirmação do pagamento, antifraude e disponibilidade. Em caso de indisponibilidade após cobrança, o cliente será informado e terá direito ao reembolso aplicável."] },
      { title: "4. Brasil", paragraphs: ["Para compras à distância sujeitas à legislação brasileira, o consumidor dispõe do direito de arrependimento previsto no Código de Defesa do Consumidor, inclusive o prazo legal de sete dias contado nos termos da lei. Demais garantias legais permanecem aplicáveis."] },
      { title: "5. Reino Unido e vendas internacionais", paragraphs: ["Para vendas à distância sujeitas às regras do Reino Unido, consumidores possuem direitos de cancelamento que normalmente incluem 14 dias após a entrega para comunicar o cancelamento, sem prejuízo das exceções legais. Para clientes de outros países, direitos obrigatórios do destino podem aplicar-se e prevalecem quando não podem ser afastados por contrato."] },
      { title: "6. Apoio animal", paragraphs: ["A compra de produtos é uma transação comercial. Caso uma coleção destine parte da receita a impacto animal, a percentagem, valor, beneficiário, período e regra de apuração devem ser informados de forma clara antes da compra."] },
    ],
  },
  entregas: {
    title: "Política de Entregas e Frete",
    description: "Como a Loja MyPets apresenta prazos, custos de entrega e mercados atendidos.",
    updated: "17 de setembro de 2026",
    sections: [
      { title: "1. Cálculo", paragraphs: ["Prazo, transportadora e custo de frete são calculados conforme CEP ou código postal, estoque, dimensões do produto e mercado. O valor final deve ser exibido antes da confirmação do pedido."] },
      { title: "2. Mercados", paragraphs: ["O Brasil é o mercado comercial prioritário. Reino Unido e mercados europeus são ativados gradualmente conforme estoque, logística, tributação e meios de pagamento. A presença do idioma ou moeda no site não significa que todos os produtos estejam disponíveis para todos os países."] },
      { title: "3. Acompanhamento", paragraphs: ["Quando houver rastreamento, o código ou ligação será disponibilizado após expedição. A entrega pode depender de transportadoras terceiras e eventos fora do controlo razoável do vendedor serão comunicados quando conhecidos."] },
      { title: "4. Importação", paragraphs: ["Em vendas internacionais, impostos, formalidades aduaneiras e modelo de importação devem ser informados no checkout ou documentação aplicável. O MyPets não deve apresentar uma entrega internacional como livre de encargos quando isso não estiver contratualmente assegurado."] },
    ],
  },
  reembolsos: {
    title: "Trocas, Devoluções e Reembolsos",
    description: "Regras para cancelamentos, devoluções, produtos com defeito e reembolsos na Loja MyPets.",
    updated: "17 de setembro de 2026",
    sections: [
      { title: "1. Solicitação", paragraphs: ["Pedidos de troca, devolução ou reembolso podem ser iniciados através de contact@mypets.lat, com identificação do pedido e motivo. O atendimento informará instruções de devolução quando necessárias."] },
      { title: "2. Brasil", paragraphs: ["Nas compras online sujeitas ao Código de Defesa do Consumidor, o direito de arrependimento pode ser exercido no prazo legal de sete dias contado nos termos da lei. Produtos com vício ou defeito seguem também as garantias e soluções previstas na legislação brasileira."] },
      { title: "3. Reino Unido", paragraphs: ["Quando as regras britânicas de distance selling forem aplicáveis, o cliente pode normalmente comunicar o cancelamento em até 14 dias após a entrega e dispõe de período adicional para devolver o item, observadas as exceções legais e eventual redução por uso além do necessário para inspeção."] },
      { title: "4. Reembolso", paragraphs: ["Reembolsos aprovados são enviados ao meio de pagamento original sempre que tecnicamente possível. O prazo de crédito final pode depender do banco, emissor, adquirente ou método utilizado."] },
    ],
  },
  apoios: {
    title: "Termos de Apoios e Contribuições",
    description: "Como funcionam apoios a causas, projetos e fundos dentro do ecossistema MyPets.",
    updated: "17 de setembro de 2026",
    sections: [
      { title: "1. Natureza do fluxo", paragraphs: ["Os fluxos de apoio são separados das compras da Loja MyPets. A página de cada causa, projeto ou fundo deve identificar o destino apresentado ao apoiador e, quando aplicável, o operador responsável por receber ou processar o pagamento."] },
      { title: "2. Linguagem", paragraphs: ["A utilização de termos como apoio ou contribuição não cria, por si só, enquadramento de entidade beneficente, charity ou benefício fiscal. Quando existir tratamento jurídico específico ou benefício fiscal, isso deverá ser declarado expressamente e com base verificável."] },
      { title: "3. Confirmação", paragraphs: ["Gerar uma cobrança não significa que o apoio foi pago. Somente pagamentos confirmados pelo sistema financeiro são considerados concluídos para fins de saldo, atualização de campanha e prestação de contas."] },
      { title: "4. Reembolsos", paragraphs: ["Pedidos de estorno ou reembolso serão analisados considerando o estado do pagamento, o destino dos recursos, regras do meio de pagamento e legislação aplicável. Casos de duplicidade, fraude ou erro operacional recebem tratamento prioritário."] },
      { title: "5. Transparência", paragraphs: ["Quando o MyPets publicar métricas de impacto, transferências ou campanhas, deve distinguir valores processados, valores confirmados, taxas e valores efetivamente destinados, evitando transformar estimativas em resultados consumados."] },
    ],
  },
};
