export type CorePet = {
  id: string;
  facepetsId: string;
  slug: string;
  name: string;
  species: "DOG" | "CAT" | "OTHER";
  sex: "MALE" | "FEMALE" | "UNKNOWN";
  country: "PT" | "BR";
  city: string | null;
  rescueDate: string | null;
  status: "RESCUED" | "TREATMENT" | "RECOVERED" | "ADOPTABLE" | "ADOPTED";
  story: string | null;
  primaryImage: string | null;
  createdAt: string;
};

export type CoreNeed = {
  id: string;
  protectorId: string;
  petId: string | null;
  type: string;
  title: string;
  description: string | null;
  supportMode: "FINANCIAL" | "NON_FINANCIAL" | "BOTH";
  targetAmountCents: number | null;
  raisedAmountCents: number;
  currency: "EUR" | "BRL" | null;
  status: "OPEN" | "FUNDED" | "RESOLVED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
};

export type CoreProtector = {
  id: string;
  userId?: string;
  slug: string;
  displayName: string;
  country: "PT" | "BR";
  city: string;
  region: string | null;
  bio: string | null;
  yearsActive: number;
  animalsCurrent: number;
  activityTypes: string[];
  socialLinks?: Record<string, string>;
  verification: "NEW" | "IDENTITY_VERIFIED" | "VERIFIED" | "MYPETS_VERIFIED";
  status?: "ACTIVE" | "PAUSED" | "SUSPENDED";
  isPublic?: boolean;
  pets?: CorePet[];
  needs?: CoreNeed[];
};

export type MePayload = {
  id: string;
  email: string | null;
  displayName: string | null;
  locale: "pt-PT" | "pt-BR" | "en";
  country: "PT" | "BR" | null;
  avatarUrl: string | null;
  protector: CoreProtector | null;
};
