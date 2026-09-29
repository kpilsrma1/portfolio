# Testing

## Layers

| Layer | Tool | Location | Command |
| --- | --- | --- | --- |
| Static analysis | ESLint (`eslint-config-next`), TypeScript strict | whole repo | `npm run lint`, `npm run typecheck` |
| Unit and component | Vitest 5 + Testing Library, jsdom | `tests/unit/**` | `npm test` |
| End-to-end and accessibility | Playwright 1.63 + `@axe-core/playwright` | `tests/e2e/**` | `npm run test:e2e` |
| Build | `next build` (also type-checks tests because `tsconfig.json` includes them) | — | `npm run build` |

`npm run check` chains lint → typecheck → unit → build.

## Unit tests (`tests/unit`)

Configuration: `vitest.config.mts` — jsdom, `@vitejs/plugin-react`, `resolve.tsconfigPaths: true` for the `@/` alias, `server-only` aliased to `tests/unit/mocks/server-only.ts` (the real package throws outside a server bundle), `unstubEnvs: true`, setup file `tests/unit/setup.ts` (jest-dom matchers, cleanup).

| File | What it verifies |
| --- | --- |
| `contact.test.ts` | Zod schema (valid input, trimming, field messages, size limits, honeypot), `fieldErrorsFromIssues`, `getContactDeliveryConfig` / `isContactFormEnabled` with stubbed env, sliding-window rate limiter (3 per 10 min, per key, window expiry) |
| `contact-action.test.ts` | `sendContactMessage` with `next/headers` and `resend` mocked: fails closed when unconfigured, returns field errors, honeypot → silent success with no send, delivers with `replyTo`, rate limits the fourth submission, hides provider error text |
| `blog.test.ts` | Published-only listing sorted newest first, article lookup with reading time and TOC, drafts return `null`, unsafe slugs rejected, tags from published posts only, `extractToc` (skips fences, dedupes ids), `formatDate` |
| `projects.test.ts` | Unique slugs, confidential projects have no demo/repo URLs, no percentage metrics in data, slug lookup, featured limit, related projects exclude self, category list |
| `site-config.test.ts` | `siteUrl` is https without trailing slash, `absoluteUrl`, `getSocialLinks` only returns configured links and never placeholders, unique rooted nav hrefs |
| `nav-link.test.ts` | `isActivePath` for root, nested, and exact matching |
| `components/project-card.test.tsx` | Title links to case study, confidential marker, no external links for confidential entries, ≤ 5 technologies, external links only with URLs and `rel="noopener noreferrer"` |
| `components/section-heading.test.tsx` | Heading level, id, eyebrow, description, action slot |

## End-to-end tests (`tests/e2e`)

Configuration: `playwright.config.ts` — `testDir: tests/e2e`, base URL `http://127.0.0.1:3100` (override with `PLAYWRIGHT_BASE_URL`), `webServer` runs `npx next start -p 3100` and waits for `/api/health` unless a base URL is supplied. Projects: `chromium` (Desktop Chrome, all specs except mobile) and `mobile-chrome` (Pixel 7, `mobile.spec.ts` only). `PLAYWRIGHT_CHANNEL=chrome|msedge` reuses a system browser when the Chromium download is unavailable.

| File | Scenarios |
| --- | --- |
| `home.spec.ts` | Title, hero h1, CTA href, three project cards, footer year; `aria-current` on Home; skip link is first focusable; Person + WebSite JSON-LD present |
| `navigation.spec.ts` | Click through Projects, About, Experience, Blog, Contact from the header with URL, h1, and `aria-current` checks; footer links to Uses, Privacy, Résumé |
| `projects.spec.ts` | Listing shows 3 with status text; filter to Records Platform → 1, `aria-pressed`; back to All; case study sections, confidential marker, no GitHub link, 2 related cards; unknown slug → HTTP 404 and custom page |
| `content-pages.spec.ts` | About content without dates; contact page honest state and no placeholder strings; blog lists published only, MDX renders, TOC anchor navigation, highlighted `code[data-theme]`; draft slug → 404; résumé page never links a missing PDF |
| `theme.spec.ts` | Default dark, toggle to light with label change, persists across reload and route change, toggle back |
| `mobile.spec.ts` (Pixel 7) | Desktop nav hidden, sheet opens with `aria-current`, navigates and closes, close button, no horizontal overflow on a case study |
| `seo-and-headers.spec.ts` | Sitemap includes projects/posts and excludes drafts; robots disallows `/api/` and links sitemap; RSS, manifest, OG image respond correctly; health JSON; CSP/HSTS/XFO/nosniff/Referrer headers present, `x-powered-by` absent; canonical, description, `og:image` on `/about` |
| `accessibility.spec.ts` | axe WCAG 2.1 A/AA on `/`, `/projects`, a case study, `/about`, the published article, `/contact`; fails on serious or critical violations |

## Last executed results (development machine, 2026-09-29)

| Check | Result |
| --- | --- |
| `npm run lint` | Clean |
| `npm run typecheck` | Clean |
| `npm test` | 8 files, 43 tests passed |
| `npm run build` | 21 static routes + `/api/health` dynamic, success |
| `npm run test:e2e` (`PLAYWRIGHT_CHANNEL=chrome`, against `next start -p 3210`) | 34 tests passed (27 chromium + 3 mobile-chrome + 4 request-only) |
| Docker image build | **Not executed locally** — Docker daemon unavailable. Covered by the CI `docker` job, which has not run yet because the repository has not been pushed |

Two issues were found by the e2e suite and fixed before the results above: muted text contrast (3.6–4.3:1) was below WCAG AA and the Open Graph image was missing on pages that define their own `openGraph` metadata.

## Manual verification performed

Browser walkthrough of the production build at desktop and 375 px widths: homepage sections, theme toggle (class and `localStorage` persistence), projects filter, case study with contents nav and architecture diagram, blog article with highlighted code in both themes and TOC jump, contact unconfigured state, résumé page, custom 404, mobile sheet navigation, `/sitemap.xml`, `/robots.txt`, `/feed.xml`, `/opengraph-image`, response headers.

## Known gaps

- No visual regression snapshots; layout changes rely on manual review.
- Contact delivery is tested with a mocked Resend client; a real send has not been performed because no credentials exist yet.
- Lighthouse/performance budgets are not automated.
- The Docker image has not been started anywhere yet; the health check and non-root runtime are verified only by reading the `Dockerfile`.

## Adding tests

- Unit: create `tests/unit/<area>.test.ts(x)`, import from `vitest` explicitly (no globals), use `@/` imports. Mock `next/*` modules with `vi.mock` inside `vi.hoisted` when the mocked value is referenced in the factory.
- E2E: add a `*.spec.ts` under `tests/e2e`; prefer role-based locators and the existing `data-testid` hooks (`project-card`, `theme-toggle`, `mobile-menu-trigger`, `contact-email`, `contact-unconfigured`, `contact-form-disabled`, `resume-download`).
