export type StoreCategory = "passeio" | "alimentacao" | "higiene" | "brinquedos" | "conforto" | "smart";

export type StoreProduct = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  category: StoreCategory;
  priceCents: number;
  compareAtCents?: number;
  badge?: string;
  rating: number;
  reviews: number;
  species: "Cães" | "Gatos" | "Cães e gatos";
  isDemo: boolean;
};

export const storeCategories: Array<{ id: "todos" | StoreCategory; label: string; description: string }> = [
  { id: "todos", label: "Todos", description: "A curadoria completa da Loja MyPets" },
  { id: "passeio", label: "Passeio", description: "Peitorais, guias, coleiras e acessórios" },
  { id: "alimentacao", label: "Alimentação", description: "Comedouros, fontes e acessórios de rotina" },
  { id: "higiene", label: "Higiene", description: "Cuidados para uma casa mais limpa e confortável" },
  { id: "brinquedos", label: "Brinquedos", description: "Enriquecimento, treino e diversão" },
  { id: "conforto", label: "Conforto", description: "Camas, mantas e organização" },
  { id: "smart", label: "Smart Pet", description: "Tecnologia útil para a rotina do tutor" },
];

// Curadoria editorial para construir e validar a experiência comercial.
// Antes da abertura de vendas, cada SKU deve ser substituído/confirmado com fornecedor,
// custo, estoque, política de frete, garantia e preço comercial reais.
export const storeProducts: StoreProduct[] = [
  {
    id: "demo-walk-001",
    slug: "peitoral-comfort-fit",
    name: "Peitoral Comfort Fit",
    shortDescription: "Ajuste em múltiplos pontos e desenho confortável para passeios diários.",
    category: "passeio",
    priceCents: 8990,
    compareAtCents: 10990,
    badge: "Mais procurado",
    rating: 4.9,
    reviews: 128,
    species: "Cães",
    isDemo: true,
  },
  {
    id: "demo-walk-002",
    slug: "guia-refletiva-urban",
    name: "Guia Refletiva Urban",
    shortDescription: "Pegada macia, detalhe refletivo e mosquetão reforçado para uso urbano.",
    category: "passeio",
    priceCents: 5990,
    rating: 4.8,
    reviews: 84,
    species: "Cães",
    isDemo: true,
  },
  {
    id: "demo-food-001",
    slug: "comedouro-slow-care",
    name: "Comedouro Slow Care",
    shortDescription: "Formato de alimentação lenta para transformar a refeição numa rotina mais tranquila.",
    category: "alimentacao",
    priceCents: 4990,
    badge: "Rotina saudável",
    rating: 4.8,
    reviews: 97,
    species: "Cães e gatos",
    isDemo: true,
  },
  {
    id: "demo-food-002",
    slug: "fonte-agua-flow",
    name: "Fonte de Água Flow",
    shortDescription: "Circulação contínua, reservatório compacto e limpeza simplificada.",
    category: "alimentacao",
    priceCents: 15990,
    compareAtCents: 18990,
    rating: 4.7,
    reviews: 63,
    species: "Cães e gatos",
    isDemo: true,
  },
  {
    id: "demo-hygiene-001",
    slug: "tapete-higienico-care-pack",
    name: "Tapete Higiênico Care Pack",
    shortDescription: "Pacote para rotina diária com foco em absorção e controle de odores.",
    category: "higiene",
    priceCents: 6990,
    badge: "Essencial",
    rating: 4.8,
    reviews: 211,
    species: "Cães",
    isDemo: true,
  },
  {
    id: "demo-hygiene-002",
    slug: "escova-autolimpante-soft",
    name: "Escova Autolimpante Soft",
    shortDescription: "Cerdas protegidas e mecanismo de limpeza rápida para cuidados frequentes.",
    category: "higiene",
    priceCents: 4590,
    rating: 4.7,
    reviews: 76,
    species: "Cães e gatos",
    isDemo: true,
  },
  {
    id: "demo-play-001",
    slug: "mordedor-enriquecimento-orbit",
    name: "Mordedor Enriquecimento Orbit",
    shortDescription: "Texturas e cavidades para brincadeira assistida e enriquecimento ambiental.",
    category: "brinquedos",
    priceCents: 3990,
    rating: 4.9,
    reviews: 154,
    species: "Cães",
    isDemo: true,
  },
  {
    id: "demo-play-002",
    slug: "varinha-interativa-cat-play",
    name: "Varinha Interativa Cat Play",
    shortDescription: "Movimento leve para sessões curtas de caça simulada e vínculo com o tutor.",
    category: "brinquedos",
    priceCents: 2990,
    rating: 4.8,
    reviews: 118,
    species: "Gatos",
    isDemo: true,
  },
  {
    id: "demo-comfort-001",
    slug: "cama-ninho-cloud",
    name: "Cama Ninho Cloud",
    shortDescription: "Formato acolhedor e capa removível para criar um espaço de descanso protegido.",
    category: "conforto",
    priceCents: 12990,
    compareAtCents: 14990,
    badge: "Conforto",
    rating: 4.9,
    reviews: 92,
    species: "Cães e gatos",
    isDemo: true,
  },
  {
    id: "demo-comfort-002",
    slug: "manta-pet-easy-wash",
    name: "Manta Pet Easy Wash",
    shortDescription: "Proteção leve para sofá, cama, caixa de transporte e rotina de viagem.",
    category: "conforto",
    priceCents: 5490,
    rating: 4.7,
    reviews: 57,
    species: "Cães e gatos",
    isDemo: true,
  },
  {
    id: "demo-smart-001",
    slug: "tag-smart-pet-id",
    name: "Tag Smart Pet ID",
    shortDescription: "Identificação rápida com QR para aproximar tutor, contacto e perfil do pet.",
    category: "smart",
    priceCents: 4990,
    badge: "MyPets Smart",
    rating: 4.9,
    reviews: 143,
    species: "Cães e gatos",
    isDemo: true,
  },
  {
    id: "demo-smart-002",
    slug: "localizador-bluetooth-pet-loop",
    name: "Pet Loop Tracker",
    shortDescription: "Suporte compacto para localizador Bluetooth em coleiras compatíveis.",
    category: "smart",
    priceCents: 6490,
    rating: 4.6,
    reviews: 41,
    species: "Cães e gatos",
    isDemo: true,
  },
];

export function formatStorePrice(cents: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
}
