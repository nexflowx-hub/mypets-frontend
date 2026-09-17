export type LegalEntityKey = "BR" | "UK";

export const LEGAL_ENTITIES = {
  BR: {
    key: "BR" as const,
    displayName: "MyPets Brasil",
    legalName: "69.093.616 MICAELA GOMES DE JESUS",
    taxIdLabel: "CNPJ",
    taxId: "69.093.616/0001-50",
    addressLines: [
      "Avenida João Florentino, 9 — Quadra 2",
      "Residencial Araguaia",
      "Anápolis — GO, CEP 75071-430",
      "Brasil",
    ],
    email: "contact@mypets.lat",
    phone: "+55 (62) 99619-7224",
    whatsappUrl: "https://wa.me/5562996197224",
    role:
      "Operador comercial brasileiro da marca MyPets para ofertas identificadas como vendidas no Brasil.",
    publicLabel: "69.093.616/0001-50 MyPets Brasil",
    note:
      "MyPets Brasil é uma identificação comercial da experiência MyPets no Brasil e não constitui pessoa jurídica separada do titular do CNPJ acima.",
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
      "Empresa tecnológica responsável pelo produto e operador comercial internacional para ofertas em que HUMAN IMPACT TECH LTD seja identificada como vendedora.",
    publicLabel: "MyPets Europe",
    note:
      "MyPets Europe é uma identificação comercial da experiência internacional MyPets. Não é uma pessoa jurídica separada; quando indicado no checkout, o vendedor contratual é HUMAN IMPACT TECH LTD.",
  },
} as const;

export const LEGAL_CONTACT = {
  privacy: "privacy@mypets.lat",
  support: "contact@mypets.lat",
  legal: "legal@mypets.lat",
} as const;
