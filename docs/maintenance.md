# Website maintenance

Personal website built with [Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com), bilingual (EN/PT) and deployed to GitHub Pages.

### Commands

| Command                | Description                                               |
| ---------------------- | --------------------------------------------------------- |
| `npm run dev`          | Local dev server                                          |
| `npm run build`        | Static build to `dist/`                                   |
| `npm run preview`      | Preview the build                                         |
| `npm run check`        | Type check with `astro check`                             |
| `npm run lint`         | ESLint                                                    |
| `npm run format`       | Prettier write                                            |
| `npm run format:check` | Prettier check                                            |
| `npm run og`           | Regenerate `public/og-image*.png` from `src/data/ui.json` |

### Structure

- `src/pages/`: home, `publications/`, `projects/<slug>/`, `case-studies/` and 404.
- `src/content/`: `projects` and `case-studies` collections. Each entry has a markdown file per language with the same slug in `en/` and `pt/`.
- `src/data/`: `ui.json` with every UI string, plus publications, experiences, social links, groups and interests.
- `src/lib/`: publication helpers (merge and BibTeX) and content helpers.
- `scripts/`: Google Scholar sync (`scrape-scholar.py`) and og:image generation.

### Workflows

- `deploy.yml`: regenerates the GitHub metrics and deploys to Pages on push to `main`.
- `quality.yml`: format, lint, type check, build and Lighthouse CI on pull requests and `main`.
- `links.yml`: weekly link check with lychee over the built site.
- `publications.yml`: weekly Google Scholar sync.

### Adding content

- **Project**: create `src/content/projects/en/<slug>.md` and `pt/<slug>.md` with the same slug. Required frontmatter: `lang`, `title`, `description`, `tags`, `order`. Optional: `repo`, `url`.
- **Case study**: create `src/content/case-studies/en/<slug>.md` and `pt/<slug>.md`. Use `status: planned` for placeholders (adds the "coming soon" badge and `noindex`) and `status: published` when the content is ready.
