import type { Publication } from '../types';

const normalize = (value: string) => value.trim().toLowerCase().replace(/\s+/g, ' ');

export const publicationTypeColors: Record<string, string> = {
  'M.Sc. Thesis': 'bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400',
  'B.Sc. Thesis': 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400',
  'Journal Article': 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400',
  Preprint: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
  Conference: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400',
};

export function mergePublications(
  raw: Publication[],
  meta: Record<string, Partial<Publication>>,
): Publication[] {
  return raw
    .map((publication) => ({ ...publication, ...(meta[normalize(publication.title)] ?? {}) }))
    .sort((a, b) => b.year - a.year || a.title.localeCompare(b.title));
}

const slugify = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');

function lastName(author: string): string {
  if (author.includes(',')) return slugify(author.split(',')[0]);
  const parts = author.trim().split(/\s+/);
  return slugify(parts[parts.length - 1] ?? 'anon');
}

function titleWord(title: string): string {
  const cleaned = title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
  const word = cleaned
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter((word) => word && !['a', 'an', 'the'].includes(word))[0];
  return slugify(word ?? 'work');
}

function bibType(type: string): string {
  switch (type) {
    case 'Journal Article':
      return 'article';
    case 'Conference':
      return 'inproceedings';
    case 'M.Sc. Thesis':
      return 'mastersthesis';
    default:
      return 'misc';
  }
}

export function escapeBibTex(value: string): string {
  const replacements: Record<string, string> = {
    '\\': '\\textbackslash{}',
    '{': '\\{',
    '}': '\\}',
    '%': '\\%',
    '&': '\\&',
    '#': '\\#',
    _: '\\_',
    $: '\\$',
    '~': '\\textasciitilde{}',
    '^': '\\textasciicircum{}',
  };
  return value.replace(/[\\{}%&#_$~^]/g, (character) => replacements[character]);
}

function suffix(index: number): string {
  let result = '';
  while (index > 0) {
    index -= 1;
    result = String.fromCharCode(97 + (index % 26)) + result;
    index = Math.floor(index / 26);
  }
  return result;
}

export interface BibEntry {
  key: string;
  entry: string;
}

export function buildBibliography(publications: Publication[]): BibEntry[] {
  const used = new Set<string>();

  return publications.map((publication) => {
    const base = `${lastName(publication.authors[0] ?? 'anon')}${publication.year}${titleWord(publication.title)}`;
    let index = 0;
    while (used.has(`${base}${suffix(index)}`)) index += 1;
    const key = `${base}${suffix(index)}`;
    used.add(key);

    const type = bibType(publication.type);
    const fields = [
      `  author = {${publication.authors.map(escapeBibTex).join(' and ')}}`,
      `  title = {${escapeBibTex(publication.title)}}`,
    ];

    if (type === 'article') {
      fields.push(`  journal = {${escapeBibTex(publication.venue)}}`);
    } else if (type === 'inproceedings') {
      fields.push(`  booktitle = {${escapeBibTex(publication.venue)}}`);
    } else if (publication.type === 'M.Sc. Thesis' || publication.type === 'B.Sc. Thesis') {
      fields.push(
        `  school = {Universidade Federal do Rio Grande do Sul (UFRGS)}`,
        `  type = {${escapeBibTex(publication.type)}}`,
      );
    }

    if (publication.type === 'Preprint') {
      fields.push(`  howpublished = {${escapeBibTex(publication.venue)}}`);
    }

    fields.push(`  year = {${publication.year}}`);
    if (publication.url) fields.push(`  url = {${escapeBibTex(publication.url)}}`);

    return { key, entry: `@${type}{${key},\n${fields.join(',\n')}\n}` };
  });
}
