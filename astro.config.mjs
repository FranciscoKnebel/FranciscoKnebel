import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import { copyFileSync, existsSync, readFileSync } from 'fs';

// Serves root-level metric SVGs in dev and copies them to dist in build
const metricsPlugin = {
  name: 'metrics-svgs',
  configureServer(server) {
    const svgs = [
      'github-metrics.svg',
      'metrics.plugin.calendar.svg',
      'metrics.plugin.isocalendar.fullyear.svg',
      'metrics.plugin.languages.indepth.svg',
    ];
    server.middlewares.use((req, res, next) => {
      const filename = (req.url ?? '').slice(1).split('?')[0];
      if (svgs.includes(filename) && existsSync(filename)) {
        res.setHeader('Content-Type', 'image/svg+xml');
        res.end(readFileSync(filename));
        return;
      }
      next();
    });
  },
  writeBundle() {
    const svgs = [
      'github-metrics.svg',
      'metrics.plugin.calendar.svg',
      'metrics.plugin.isocalendar.fullyear.svg',
      'metrics.plugin.languages.indepth.svg',
    ];
    svgs.forEach(f => {
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
