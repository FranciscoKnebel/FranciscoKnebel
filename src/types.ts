export type Lang = 'en' | 'pt';

export interface LocalizedText {
  en: string;
  pt: string;
}

export interface Experience {
  role: LocalizedText;
  company: string;
  companyUrl?: string;
  period: LocalizedText;
  location: LocalizedText;
  description: LocalizedText;
  tags: string[];
  current: boolean;
  placeholder?: boolean;
}

export interface Publication {
  title: string;
  type: string;
  venue: string;
  year: number;
  authors: string[];
  url?: string;
  citations?: number;
  venueUrl?: string;
  advisor?: string;
  advisorUrl?: string;
}
