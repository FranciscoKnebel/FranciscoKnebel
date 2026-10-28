import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { readFileSync } from 'node:fs';

export default defineConfig({
  site: 'https://franciscoknebel.com',
  integrations: [
    sitemap({
      filter: (page) =>
        !page.endsWith('/projects/') &&
        !page.endsWith('/search/') &&
        !(
          page.endsWith('/talks/') &&
          JSON.parse(readFileSync('src/data/talks.json', 'utf8')).length === 0
        ),
      serialize(item) {
        if (item.url.endsWith('/privacy/') || item.url.endsWith('/pt/privacidade/')) {
          item.links = [
            { lang: 'en', url: 'https://franciscoknebel.com/privacy/' },
            { lang: 'pt', url: 'https://franciscoknebel.com/pt/privacidade/' },
          ];
        }
        return item;
      },
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en', pt: 'pt' },
      },
    }),
  ],
  vite: { plugins: [tailwindcss()] },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'pt'],
    routing: { prefixDefaultLocale: false },
  },
});
