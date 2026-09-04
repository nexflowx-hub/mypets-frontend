/** Shared data types between server page → client sections */

export interface StoryDTO {
  id: string;
  slug: string;
  kind: string;
  name: string;
  location: string | null;
  country: string;
  currency: "EUR" | "BRL";
  descPtPT: string;
  descPtBR: string;
  descEn: string;
  image: string;
  imageAlt: string;
  tags: string[];
  targetCents: number;
  raisedCents: number;
  progress: number;
  isDemo: boolean;
}

export interface MetricDTO {
  key: string;
  value: number;
  prefix: string | null;
  suffix: string | null;
  decimals: number;
  labelPtPT: string;
  labelPtBR: string;
  labelEn: string;
  icon: string;
  color: string;
  isDemo: boolean;
}
