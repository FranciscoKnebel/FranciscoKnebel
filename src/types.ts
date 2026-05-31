export type Lang = 'en' | 'pt';

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
