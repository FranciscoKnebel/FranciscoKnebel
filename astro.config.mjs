import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import { copyFileSync, existsSync, readFileSync } from 'fs';

// Root-level metric SVGs served in dev and copied to dist in build
const metricsSvgs = [
  'github-metrics.svg',
  'metrics.plugin.calendar.svg',
  'metrics.plugin.isocalendar.fullyear.svg',
  'metrics.plugin.languages.indepth.svg',
];

const metricsPlugin = {
  name: 'metrics-svgs',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      const filename = (req.url ?? '').slice(1).split('?')[0];
      if (metricsSvgs.includes(filename) && existsSync(filename)) {
        res.setHeader('Content-Type', 'image/svg+xml');
        res.end(readFileSync(filename));
        return;
      }
      next();
    });
  },
  writeBundle() {
    metricsSvgs.forEach((f) => {
      if (existsSync(f)) copyFileSync(f, `dist/${f}`);
    });
  },
};

export default defineConfig({
  site: 'https://franciscoknebel.com',
  integrations: [tailwind(), sitemap()],
  vite: { plugins: [metricsPlugin] },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'pt'],
    routing: { prefixDefaultLocale: false },
  },
});
