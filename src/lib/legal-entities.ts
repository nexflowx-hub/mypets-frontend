export type MarketCode = "BR" | "UK" | "EU";

export type LegalEntity = {
  code: "MYPETS_BR" | "HUMAN_IMPACT_UK";
  publicLabel: string;
  legalName: string;
  registrationLabel: string;
  registrationNumber: string;
  countryCode: "BR" | "GB";
  addressLines: string[];
  supportEmail: string;
  supportPhone?: string;
  whatsapp?: string;
  role: string;
  note: string;
};

export const LEGAL_ENTITIES: Record<LegalEntity["code"], LegalEntity> = {
  MYPETS_BR: {
    code: "MYPETS_BR",
    publicLabel: "MyPets Brasil",
    legalName: "69.093.616 MICAELA GOMES DE JESUS",
    registrationLabel: "CNPJ",
    registrationNumber: "69.093.616/0001-50",
    countryCode: "BR",
    addressLines: [
      "Avenida Joao Florentino, 9, Quadra 2",
      "Residencial Araguaia",
      "Anapolis - GO, 75071-430",
      "Brasil",
    ],
    supportEmail: "contact@mypets.lat",
    supportPhone: "+55 (62) 99619-7224",
    whatsapp: "+55 (62) 99619-7224",
    role: "Operador comercial no Brasil",
    note: "MyPets Brasil e uma designacao comercial da operacao brasileira. A identificacao juridica completa do fornecedor e apresentada nesta area institucional e no checkout comercial quando aplicavel.",
  },
  HUMAN_IMPACT_UK: {
    code: "HUMAN_IMPACT_UK",
    publicLabel: "MyPets Europe",
    legalName: "HUMAN IMPACT TECH LTD",
    registrationLabel: "Company number",
    registrationNumber: "17422257",
    countryCode: "GB",
    addressLines: [
      "71-75 Shelton Street",
      "Covent Garden",
      "London, WC2H 9JQ",
      "United Kingdom",
    ],
    supportEmail: "contact@mypets.lat",
    role: "Empresa-mae da operacao internacional e fornecedora tecnologica do ecossistema MyPets",
    note: "MyPets Europe e uma designacao comercial para a experiencia europeia/internacional. A entidade juridica e HUMAN IMPACT TECH LTD, uma sociedade do Reino Unido; esta designacao nao representa uma sociedade constituida na Uniao Europeia.",
  },
};

export const COMMERCE_MARKETS: Record<MarketCode, {
  code: MarketCode;
  label: string;
  currency: "BRL" | "GBP" | "EUR";
  legalEntityCode: LegalEntity["code"];
  paymentProfile: "XPAYMENTS_BR" | "XPAYMENTS_INTL";
  enabled: boolean;
}> = {
  BR: { code: "BR", label: "Brasil", currency: "BRL", legalEntityCode: "MYPETS_BR", paymentProfile: "XPAYMENTS_BR", enabled: true },
  UK: { code: "UK", label: "United Kingdom", currency: "GBP", legalEntityCode: "HUMAN_IMPACT_UK", paymentProfile: "XPAYMENTS_INTL", enabled: false },
  EU: { code: "EU", label: "Europa", currency: "EUR", legalEntityCode: "HUMAN_IMPACT_UK", paymentProfile: "XPAYMENTS_INTL", enabled: false },
};

export const LEGAL_CONTACT = {
  email: "contact@mypets.lat",
  brazilPhone: "+55 (62) 99619-7224",
  brazilWhatsappHref: "https://wa.me/5562996197224",
} as const;
