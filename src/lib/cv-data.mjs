import { readFileSync, readdirSync } from 'node:fs';
import { parse } from 'yaml';
import { join } from 'node:path';
const read = (name) =>
  JSON.parse(readFileSync(join(process.cwd(), 'src/data', `${name}.json`), 'utf8'));
export const plainText = (value) => value.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&');
export function cvData(lang) {
  const ui = read('ui')[lang];
  const directory = join(process.cwd(), 'src/content/projects', lang);
  const projects = readdirSync(directory)
    .filter((name) => name.endsWith('.md'))
    .map((name) => parse(readFileSync(join(directory, name), 'utf8').split('---')[1]))
    .sort((a, b) => a.order - b.order);
  return {
    lang,
    name: 'Francisco Paiva Knebel',
    role: ui.hero.role,
    summary: plainText(ui.hero.bio),
    email: 'contato@franciscoknebel.com',
    website: 'https://franciscoknebel.com',
    experiences: read('experiences').map((entry) => ({
      role: entry.role[lang],
      company: entry.company,
      period: entry.period[lang],
      description: plainText(entry.description[lang]),
      tags: entry.tags,
    })),
    projects,
    publications: read('publications'),
    education:
      lang === 'pt'
        ? [
            'Mestrado em Ciência da Computação, UFRGS, 2024',
            'Engenharia de Computação, UFRGS, 2020',
          ]
        : ['M.Sc. in Computer Science, UFRGS, 2024', 'Computer Engineering, UFRGS, 2020'],
  };
}
