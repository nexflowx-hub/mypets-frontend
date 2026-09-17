export type LegalEntityKey = "BR" | "UK";

const splitAddress = (value?: string) => value?.split("|").map((item) => item.trim()).filter(Boolean) ?? [];

const brAddress = splitAddress(process.env.NEXT_PUBLIC_MYPETS_BR_ADDRESS);

export const LEGAL_ENTITIES = {
  BR: {
    key: "BR" as const,
    displayName: "MyPets Brasil",
    legalName: process.env.NEXT_PUBLIC_MYPETS_BR_LEGAL_NAME || "69.093.616 MICAELA GOMES DE JESUS",
    taxIdLabel: "CNPJ",
    taxId: "69.093.616/0001-50",
    addressLines: brAddress.length > 0 ? brAddress : [
      "Avenida Joao Florentino, 9, Quadra 2",
      "Residencial Araguaia",
      "Anapolis - GO, 75071-430",
      "Brasil",
    ],
    email: "contact@mypets.lat",
    phone: process.env.NEXT_PUBLIC_MYPETS_BR_PHONE || "+55 (62) 99619-7224",
    whatsappUrl: process.env.NEXT_PUBLIC_MYPETS_BR_WHATSAPP_URL || "https://wa.me/5562996197224",
    role:
      "Operador comercial brasileiro da marca MyPets para ofertas identificadas como vendidas no Brasil.",
    publicLabel: "69.093.616/0001-50 MyPets Brasil",
    note:
      "MyPets Brasil e uma identificacao comercial da experiencia MyPets no Brasil e nao constitui pessoa juridica separada do titular do CNPJ acima. A razao social completa e exibida nesta area institucional e no checkout quando aplicavel.",
    capitalSocial: "R$ 5.000,00",
  },
  UK: {
    key: "UK" as const,
    displayName: "MyPets Europe",
    legalName: "HUMAN IMPACT TECH LTD",
    taxIdLabel: "Company number",
    taxId: "17422257",
    addressLines: [
      "71-75 Shelton Street",
      "Covent Garden",
      "London, WC2H 9JQ",
      "United Kingdom",
    ],
    email: "contact@mypets.lat",
    companyUrl: "https://humanimpact.tech",
    role:
      "Empresa-mae da experiencia internacional MyPets e fornecedora tecnologica do ecossistema; pode atuar como operadora comercial internacional quando identificada no checkout.",
    publicLabel: "MyPets Europe",
    note:
      "MyPets Europe e uma identificacao comercial da experiencia internacional MyPets. Nao e uma pessoa juridica separada nem uma sociedade constituida na Uniao Europeia; quando indicado no checkout, o vendedor contratual e HUMAN IMPACT TECH LTD, sociedade do Reino Unido.",
  },
} as const;

export const LEGAL_CONTACT = {
  privacy: "privacy@mypets.lat",
  support: "contact@mypets.lat",
  legal: "legal@mypets.lat",
} as const;
