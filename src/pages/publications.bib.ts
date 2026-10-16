import type { APIRoute } from 'astro';
import type { Publication } from '../types';
import rawPublications from '../data/publications.json';
import publicationsMeta from '../data/publications-meta.json';
import { buildBibliography, mergePublications } from '../lib/publications';

export const GET: APIRoute = () => {
  const meta: Record<string, Partial<Publication>> = publicationsMeta;
  const publications = mergePublications(rawPublications, meta);
  const body = buildBibliography(publications)
    .map((entry) => entry.entry)
    .join('\n\n');

  return new Response(`${body}\n`, {
    headers: { 'Content-Type': 'application/x-bibtex; charset=utf-8' },
  });
};
