/**
 * MyPets deterministic demo seed (is_demo = true everywhere).
 * Reproducible — no random content.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const stories = [
  {
    slug: "ana-porto",
    kind: "PROTECTOR",
    name: "Ana",
    location: "Porto",
    country: "PT",
    currency: "EUR",
    descPtPT: "Cuida atualmente de 14 gatos.",
    descPtBR: "Cuida atualmente de 14 gatos.",
    descEn: "Currently caring for 14 cats.",
    image: "/images/story-ana.jpg",
    imageAlt: "Ana sentada num degrau rodeada por gatos resgatados no Porto",
    tags: ["RACAO", "MEDICACAO", "ESTERILIZACAO"],
    targetCents: 42000,
    raisedCents: 28500,
    sortOrder: 1,
    isDemo: true,
  },
  {
    slug: "carlos-sao-paulo",
    kind: "PROTECTOR",
    name: "Carlos",
    location: "São Paulo",
    country: "BR",
    currency: "BRL",
    descPtPT: "Alimenta e acompanha 23 cães numa comunidade local.",
    descPtBR: "Alimenta e acompanha 23 cães em uma comunidade local.",
    descEn: "Feeds and looks after 23 dogs in a local community.",
    image: "/images/story-carlos.jpg",
    imageAlt: "Carlos ajoelhado entre cães resgatados numa comunidade de São Paulo",
    tags: ["RACAO", "VACINACAO", "TRANSPORTE"],
    targetCents: 240000,
    raisedCents: 167000,
    sortOrder: 2,
    isDemo: true,
  },
  {
    slug: "luna",
    kind: "ANIMAL",
    name: "Luna",
    location: null,
    country: "PT",
    currency: "EUR",
    descPtPT: "Encontrada ferida. Está em tratamento.",
    descPtBR: "Encontrada ferida. Está em tratamento.",
    descEn: "Found injured. Currently in treatment.",
    image: "/images/story-luna.jpg",
    imageAlt: "Luna, cadelinha em recuperação sobre coberta clínica",
    tags: ["CONSULTA", "CIRURGIA", "RECUPERACAO"],
    targetCents: 42000,
    raisedCents: 28500,
    sortOrder: 3,
    isDemo: true,
  },
  {
    slug: "milo",
    kind: "ANIMAL",
    name: "Milo",
    location: null,
    country: "PT",
    currency: "EUR",
    descPtPT: "Resgatado da rua. Precisa de cuidados.",
    descPtBR: "Resgatado da rua. Precisa de cuidados.",
    descEn: "Rescued from the street. Needs care.",
    image: "/images/story-milo.jpg",
    imageAlt: "Milo, cão jovem resgatado da rua, a olhar para a câmara",
    tags: ["RACAO", "CONSULTA", "ACOLHIMENTO"],
    targetCents: 30000,
    raisedCents: 12000,
    sortOrder: 4,
    isDemo: true,
  },
];

const metrics = [
  { key: "animals_supported", value: 3482, icon: "paw", color: "coral", labelPtPT: "Animais apoiados", labelPtBR: "Animais apoiados", labelEn: "Animals supported", sortOrder: 1, isDemo: true },
  { key: "protectors_supported", value: 612, icon: "paw", color: "teal", labelPtPT: "Protetores apoiados", labelPtBR: "Protetores apoiados", labelEn: "Protectors supported", sortOrder: 2, isDemo: true },
  { key: "needs_resolved", value: 1920, icon: "check", color: "amber", labelPtPT: "Necessidades resolvidas", labelPtBR: "Necessidades resolvidas", labelEn: "Needs resolved", sortOrder: 3, isDemo: true },
  { key: "adoptions", value: 285, icon: "heart", color: "red", labelPtPT: "Adoções", labelPtBR: "Adoções", labelEn: "Adoptions", sortOrder: 4, isDemo: true },
  { key: "food_delivered", value: 48.7, decimals: 1, suffix: "ton", icon: "food", color: "blue", labelPtPT: "Ração doada", labelPtBR: "Ração doada", labelEn: "Food delivered", sortOrder: 5, isDemo: true },
  { key: "community", value: 12500, prefix: "+", icon: "users", color: "green", labelPtPT: "Pessoas na comunidade", labelPtBR: "Pessoas na comunidade", labelEn: "Community members", sortOrder: 6, isDemo: true },
];

async function main() {
  console.log("🌱 Seeding MyPets demo data…");

  for (const story of stories) {
    await prisma.story.upsert({
      where: { slug: story.slug },
      update: story,
      create: story,
    });
  }

  for (const metric of metrics) {
    await prisma.impactMetric.upsert({
      where: { key: metric.key },
      update: metric,
      create: metric,
    });
  }

  const legalEntity = {
    poweredBy: "HUMAN IMPACT TECH LTD",
    companyNumber: "17422257",
    address: "1-75 Shelton Street, Covent Garden, London, United Kingdom, WC2H 9JQ",
    site: "humanimpact.tech",
    disclaimerPt: "MyPets é uma iniciativa de impacto social powered by HUMAN IMPACT TECH LTD.",
    disclaimerEn: "MyPets is a social impact initiative powered by HUMAN IMPACT TECH LTD.",
  };

  await prisma.contentBlock.upsert({
    where: { key: "legal.entity" },
    update: { value: legalEntity },
    create: {
      key: "legal.entity",
      value: legalEntity,
    },
  });

  const counts = {
    stories: await prisma.story.count(),
    metrics: await prisma.impactMetric.count(),
    blocks: await prisma.contentBlock.count(),
  };
  console.log("✅ Seed complete:", counts);
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
