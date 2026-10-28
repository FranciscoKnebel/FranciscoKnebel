# Website maintenance

Personal website built with [Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com), bilingual (EN/PT) and deployed to GitHub Pages.

## Local setup

Use Node.js 24 (the same version as CI) and npm. From a fresh checkout:

```sh
npm ci
npm run dev
```

Python 3.12 is only needed for publication synchronization; it is not required to build the site. For a live sync, create a virtual environment and install `scripts/requirements-scholar.txt`. Keep local credentials in the shell or an untracked environment file; never put them in content or commits.

## Commands

| Command                 | Description                                               |
| ----------------------- | --------------------------------------------------------- |
| `npm run dev`           | Local dev server                                          |
| `npm run build`         | Static build to `dist/`                                   |
| `npm run preview`       | Preview the build                                         |
| `npm test`              | Build and run browser/artefact acceptance tests           |
| `npm run validate:html` | Validate the generated HTML                               |
| `npm run check`         | Type check with `astro check`                             |
| `npm run lint`          | ESLint                                                    |
| `npm run format`        | Prettier write                                            |
| `npm run format:check`  | Prettier check                                            |
| `npm run og`            | Regenerate `public/og-image*.png` from `src/data/ui.json` |

## Structure

- `src/pages/`: home, `publications/`, `projects/<slug>/`, `case-studies/` and 404.
- `src/content/`: `projects` and `case-studies` collections. Each entry has a markdown file per language with the same slug in `en/` and `pt/`.
- `src/data/`: `ui.json` with every UI string, plus publications, experiences, social links, groups and interests.
- `src/lib/`: publication helpers (merge and BibTeX) and content helpers.
- `scripts/`: Google Scholar sync (`scrape-scholar.py`) and og:image generation.

## Workflows

- `deploy.yml`: deploys committed content to Pages on push to `main`, manual dispatch, or successful main-branch publication refreshes. Metric generation is not a build dependency.
- The old metric-image workflow has been retired; `deploy.yml` refreshes native public metrics with a snapshot fallback.
- `quality.yml`: format, lint, type check, build and Lighthouse CI on pull requests and `main`.
- `links.yml`: weekly link check with lychee over the built site.
- `publications.yml`: weekly Google Scholar sync.

## Adding content

- **Project**: create `src/content/projects/en/<slug>.md` and `pt/<slug>.md` with the same slug. Required frontmatter: `lang`, `title`, `description`, `tags`, `order`. Optional: `repo`, `url`.
- **Case study**: create `src/content/case-studies/en/<slug>.md` and `pt/<slug>.md`. Use `status: planned` for placeholders (adds the "coming soon" badge and `noindex`) and `status: published` when the content is ready.

## Publication sync safety

Install with `python -m pip install -r scripts/requirements-scholar.txt`, then check imports with `python -c "from scholarly import scholarly, ProxyGenerator"`. Run offline regression tests with `python -m unittest discover -s scripts -p 'test_*.py'`.

The scraper updates the file atomically after all records have been fetched and validated. Empty responses, duplicates, missing existing titles, invalid records and individual fetch failures leave the previous snapshot untouched. If Scholar renames or removes a publication, review and reconcile the local data manually before retrying. Display overrides remain in `src/data/publications-meta.json`.

The site displays the oldest successful `last_sync` timestamp alongside citation data. A failed fetch does not advance this date. Live synchronization is verified by running **Update Publications** after merge; offline tests do not contact Scholar or use the proxy secret.

## Deploy and refresh behavior

Normal content pushes build directly from `main`, using a public JSON snapshot if the metrics API fails. A failure in a metric provider cannot block this path. Successful automated refreshes trigger deployment with `workflow_run`, because pushes authenticated with `GITHUB_TOKEN` do not trigger another push workflow. Only successful refreshes from the same repository on `main` are accepted; deployment always checks out trusted `main` content.

Publication writes use their own concurrency group. Public profile data refreshes during the build and never creates a Git commit. No new secrets are required.

After merging the PR stack, run **Update Publications** and **Deploy Portfolio** manually and confirm that each successful refresh is followed by **Deploy Portfolio**. These workflows and their secrets cannot be fully exercised before the new workflow files reach the default branch.

## Native GitHub metrics

The site renders semantic HTML from `src/data/github-snapshot.json`, not generated SVGs. Normal local/CI builds use the committed public snapshot. Set `REFRESH_GITHUB_METRICS=1` to fetch public profile counts, non-fork repository languages and a small sample of public events. An optional `GITHUB_TOKEN` avoids anonymous API limits. Refresh failures preserve the snapshot and do not block deployment. No account credential or private activity is included in the frontend.

Deployment refreshes the snapshot at build time and weekly. These build changes are not pushed back to Git. The old metric-image workflow has been retired. Publication refreshes remain separate and still trigger deployment after success.

## Validation before opening a PR

```sh
npm run format:check
npm run lint
npm run check
npm run build
npm run validate:html
npx playwright install chromium
npm test
python -m unittest discover -s scripts -p 'test_*.py'
```

The Python tests are offline and use only the standard library. They do not require Scholar dependencies, a proxy account or a secret. `npm test` runs a new build before starting a static preview on port 4322; stop any unrelated local server using that port first.

CI also runs Lighthouse against representative routes. Automated accessibility checks cover only part of usability: check the following manually when changing layout or navigation.

| Scenario                       | Check                                                                            |
| ------------------------------ | -------------------------------------------------------------------------------- |
| Narrow phone, tablet, desktop  | No horizontal scrolling, available navigation and readable contact details       |
| EN and PT                      | Equivalent destinations, translated actions and correct page language            |
| Keyboard                       | Skip link, visible focus, disclosure controls, menu Escape and natural Tab order |
| Dark and light themes          | Text contrast, project actions and contribution calendar variants                |
| Reduced motion                 | No entry movement or smooth scrolling                                            |
| JavaScript disabled or blocked | Core content and contact links remain readable                                   |
| Zoom at 200%                   | Navigation and content remain usable without clipping                            |
| External links                 | Check the destination, not only the HTTP status; some services block bots        |

## Credentials and permissions

| Name              | Used by                | Purpose                                                                                |
| ----------------- | ---------------------- | -------------------------------------------------------------------------------------- |
| `GITHUB_TOKEN`    | Actions jobs           | Repository-scoped authentication supplied by GitHub, with permissions declared per job |
| `METRICS_TOKEN`   | Retired image workflow | No longer read by the native metrics build; no secret was removed during this change   |
| `SCRAPER_API_KEY` | Update Publications    | Optional ScraperAPI account for Scholar requests that need a proxy                     |

The static site needs none of these secrets at runtime. The analytics measurement ID in the frontend is a public identifier, not an API secret. Never copy token values into this guide, workflow logs or PR descriptions.

The build job reads repository content; only the deployment job receives Pages/OIDC write permissions. Automated content writers are serialized by `profile-content-refresh`.

## Editing content

- Keep the same slug in EN and PT content files. Add or change both translations together, including linked destinations inside Markdown.
- Update `src/data/ui.json` for interface copy. Shared layout and navigation belong in components, rather than duplicated page markup.
- Edit roles in `experiences.json`. Entries for the same employer are grouped automatically; keep dates and current responsibilities explicit.
- Use `publications-meta.json` for reviewed display corrections such as publication type, venue or stable URLs. The scraper owns raw citation data; do not advance `last_sync` after a failed fetch.
- Separate a documented project result from an engineering interpretation. Add numbers only when a source supports them, and distinguish original contributions from current operation by another maintainer.
- Run `npm run og` when changing the social card's title or visual copy. The generator writes the EN/PT images in `public/`.

## After merge and rollback

New or changed scheduled workflows become effective on the default branch. After the PR stack is merged in dependency order, run Update Publications and Deploy Portfolio manually, verify their logs, then verify the follow-up Pages deployment and the published EN/PT pages. A successful build alone does not prove Scholar access or publication with production credentials.

To undo a deployed change, open a revert PR for the relevant commit or merge and let the normal deploy workflow publish the reviewed revert. Preserve the last valid publication and metric snapshots while investigating provider failures. Avoid modifying generated snapshots just to make a failing refresh appear successful.

## Optional roadmap pages

- **Privacy:** `/privacy/` and `/pt/privacidade/`, linked from the notice and footer. Update the wording when storage, analytics or hosting behavior changes.
- **CV:** `npm run cv` generates two-page EN/PT PDFs in `public/cv/`; `prebuild` regenerates them from the same source data used by HTML. CI uploads them as `curriculum-previews` for review. Generated files are not committed.
- **Talks & Teaching:** edit `src/data/talks.json`. Required fields: id, type (talk/teaching/mentoring), ISO date, title and description in both languages, and event. Optional links: url, slides, video. Empty lists remain noindex and out of the sitemap; do not substitute invented events.
- **Now/Uses:** edit `src/data/personal-pages.json` and its explicit updated date. The initial selection uses documented projects and technologies, not an assumed hardware setup.
- **Search:** Pagefind creates separate EN/PT indexes after the Astro build. It runs locally without a hosted search provider. noindex and redirect pages are excluded. To try search, build and use `npm run preview`; development mode may not have an index yet.
- **Case studies:** two additional technical accounts cite immutable source READMEs. Recheck upstream behavior before updating claims about APIs, compatibility or credentials.
- **Structured data:** publication type follows reviewed overrides; source-code metadata is emitted only when a repository is supplied. Contributors are not represented as sole authors.

## Production smoke checks

After Pages deploys, `verify` checks the exact published revision, localized routes, PDFs, search bundles, sharing-image signatures/dimensions and the privacy sitemap mapping. It polls for the deployed revision to allow for propagation. It makes read-only requests and receives no write credential. Run manually with `PUBLIC_SITE_URL=https://franciscoknebel.com node scripts/verify-production.mjs` once the PR stack is deployed.

The local acceptance suite runs the same smoke checker against the static preview. That is evidence about built artifacts, not a claim that unpublished features are already live. The validation performed for this roadmap did not merge PRs or trigger a production workflow.
