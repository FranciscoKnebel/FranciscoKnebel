import type { Publication } from '../types';
const origin = 'https://franciscoknebel.com';
const contributor = { '@type': 'Person', '@id': `${origin}/#person`, name: 'Francisco Knebel' };
export const jsonLd = (value: unknown) => JSON.stringify(value).replace(/</g, '\\u003c');

export function publicationList(publications: Publication[], lang: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    url: `${origin}${lang === 'pt' ? '/pt' : ''}/publications/`,
    numberOfItems: publications.length,
    itemListElement: publications.map((publication, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': publication.type.endsWith('Thesis') ? 'Thesis' : 'ScholarlyArticle',
        name: publication.title,
        url: publication.url,
        datePublished: String(publication.year),
        genre: publication.type,
        ...(publication.type === 'Preprint' ? { creativeWorkStatus: 'Preprint' } : {}),
        author: publication.authors.map((name) => ({ '@type': 'Person', name })),
      },
    })),
  };
}

export function projectData(
  project: { title: string; description: string; tags: string[]; repo?: string; url?: string },
  canonical: string,
  lang: string,
) {
  return {
    '@context': 'https://schema.org',
    '@type': project.repo ? 'SoftwareSourceCode' : 'CreativeWork',
    '@id': `${canonical}#project`,
    url: canonical,
    name: project.title,
    description: project.description,
    inLanguage: lang,
    contributor,
    keywords: project.tags.join(', '),
    ...(project.repo ? { codeRepository: project.repo } : {}),
    ...(project.url ? { sameAs: project.url } : {}),
  };
}
