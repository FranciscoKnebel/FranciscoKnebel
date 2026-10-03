import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'fs';
import { dirname } from 'path';

// Root-level metric SVGs served in dev and copied to dist in build
const metricsSvgs = [
  'github-metrics.svg',
  'metrics.plugin.calendar.svg',
  'profile-3d-contrib/profile-gitblock.svg',
  'profile-3d-contrib/profile-night-view.svg',
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
      if (existsSync(f)) {
        mkdirSync(dirname(`dist/${f}`), { recursive: true });
        copyFileSync(f, `dist/${f}`);
      }
    });
  },
};

export default defineConfig({
  site: 'https://franciscoknebel.com',
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss(), metricsPlugin] },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'pt'],
    routing: { prefixDefaultLocale: false },
  },
});
