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

- `deploy.yml`: deploys committed content to Pages on push to `main`, manual dispatch, or successful main-branch metric/publication refreshes. Metric generation is not a build dependency.
- `metrics.yml`: updates metric snapshots weekly or manually, independently of deployment.
- `quality.yml`: format, lint, type check, build and Lighthouse CI on pull requests and `main`.
- `links.yml`: weekly link check with lychee over the built site.
- `publications.yml`: weekly Google Scholar sync.

### Adding content

- **Project**: create `src/content/projects/en/<slug>.md` and `pt/<slug>.md` with the same slug. Required frontmatter: `lang`, `title`, `description`, `tags`, `order`. Optional: `repo`, `url`.
- **Case study**: create `src/content/case-studies/en/<slug>.md` and `pt/<slug>.md`. Use `status: planned` for placeholders (adds the "coming soon" badge and `noindex`) and `status: published` when the content is ready.

### Publication sync safety

Install with `python -m pip install -r scripts/requirements-scholar.txt`, then check imports with `python -c "from scholarly import scholarly, ProxyGenerator"`. Run offline regression tests with `python -m unittest discover -s scripts -p 'test_*.py'`.

The scraper updates the file atomically after all records have been fetched and validated. Empty responses, duplicates, missing existing titles, invalid records and individual fetch failures leave the previous snapshot untouched. If Scholar renames or removes a publication, review and reconcile the local data manually before retrying. Display overrides remain in `src/data/publications-meta.json`.

The site displays the oldest successful `last_sync` timestamp alongside citation data. A failed fetch does not advance this date. Live synchronization is verified by running **Update Publications** after merge; offline tests do not contact Scholar or use the proxy secret.

### Deploy and refresh behavior

Normal content pushes build directly from `main`, using the last committed metric SVGs. A failure in a metric provider cannot block this path. Successful automated refreshes trigger deployment with `workflow_run`, because pushes authenticated with `GITHUB_TOKEN` do not trigger another push workflow. Only successful refreshes from the same repository on `main` are accepted; deployment always checks out trusted `main` content.

Metric and publication workflows share a concurrency group to avoid concurrent automated writes. Metrics retain their own failure status for diagnosis. The 3D refresh can run after a failed base-metrics job, and commits only `profile-3d-contrib/`. Metric actions use immutable commit references. No new secrets are required.

After merging the PR stack, run **Update Publications** and **Update Profile Metrics** manually and confirm that each successful refresh is followed by **Deploy Portfolio**. These workflows and their secrets cannot be fully exercised before the new workflow files reach the default branch.

### Statistics assets

The site shows one contribution calendar with light/dark variants. The general GitHub summary is optional in a native details disclosure. Dimensions are read from the committed SVGs at build time, so regenerated assets reserve their actual aspect ratio. Missing assets produce a profile link rather than a broken image. All displayed metric assets are served locally.

The redundant full-history calendar and unused language SVG have been retired. The refresh workflow no longer regenerates the removed calendar; avoid reintroducing it into the build. The remaining generated files are snapshots, not real-time indicators of all professional work.
