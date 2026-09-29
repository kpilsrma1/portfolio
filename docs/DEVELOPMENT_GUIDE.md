# Development guide

## Prerequisites

- Node.js 24 (the Docker image uses `node:24-alpine`; local development was done on v24.1.0). Node 22 LTS also satisfies the dependency ranges but is not what CI uses.
- npm 11 (ships with Node 24).
- Optional: Docker Engine or Docker Desktop for container builds; Chrome or Edge for Playwright if the Chromium download is blocked on your network.

## Setup

```bash
git clone <repository-url>
cd kapil-portfolio
npm ci
cp .env.example .env.local   # optional
npm run dev
```

The dev server runs at `http://localhost:3000`. `.env.local` is ignored by git; the defaults in `src/config/site.ts` work without any environment file.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Next.js dev server (Turbopack) |
| `npm run build` | Production build; also type-checks `src/` **and** `tests/` because `tsconfig.json` includes `**/*.ts(x)` |
| `npm run start` | Serves the production build. Next.js warns that `next start` is not for `output: "standalone"`; for local verification it still works. Production uses `node .next/standalone/server.js` inside Docker |
| `npm run lint` | `eslint .` with `eslint-config-next` flat config |
| `npm run typecheck` | `next typegen && tsc --noEmit` (generates typed route helpers first) |
| `npm test` / `npm run test:watch` | Vitest |
| `npm run test:e2e` | Playwright; expects a completed `npm run build` unless `PLAYWRIGHT_BASE_URL` points at a running server |
| `npm run check` | lint → typecheck → unit tests → build |

## Project conventions

### Content and configuration

- **All profile facts live in `src/config/site.ts`.** Page components never contain names, titles, years, or URLs. Optional values (`email`, `githubUrl`, `linkedinUrl`, `location`) stay `undefined` until confirmed; the UI omits the element rather than rendering a placeholder.
- **Typed data files** in `src/data/` implement interfaces from `src/types/content.ts`. A wrong field fails `tsc` and therefore the build.
- **Unverified facts are flagged, not guessed.** `employmentDatesVerified: false` in `site.ts` hides date ranges; `contributionsVerified: false` on projects marks contribution lists that still need checking against the résumé.
- **Confidential projects** must not include `demoUrl`, `repositoryUrl`, client names, or numeric business metrics. `tests/unit/projects.test.ts` enforces the URL and percentage rules.

### Adding a project

1. Add an entry to `src/data/projects.ts` following the `Project` interface (slug, title, subtitle, description, category, `mockup` variant, technologies, role, flags, sections, `architecture` layers, `relatedSlugs`).
2. `generateStaticParams` in `src/app/projects/[slug]/page.tsx` picks it up automatically, as do the listing, filter, sitemap, and homepage (if `featured: true`).
3. Run `npm run check`.

### Adding a blog post

1. Create `content/blog/<slug>.mdx`. Slugs must match `^[a-z0-9-]+$`.
2. Frontmatter fields: `title`, `description`, `date` (`YYYY-MM-DD`), optional `updated`, `tags` (array), `status` (`published` or `draft`), optional `author`. Missing title/description/date throws at build time.
3. Write GFM Markdown/MDX. Fenced code blocks with a language get Shiki highlighting; add a `title="..."` after the language to show a filename.
4. Keep `status: draft` until the article is ready. Drafts are excluded from listing, article routes (404), feed, sitemap, and the homepage in one place: `getPublishedPosts()` in `src/lib/blog.ts`.

### Components

- Server components by default. Add `"use client"` only for browser state (theme, sheet, filter, in-view animation, form state).
- Use `SectionHeading` for section titles (`eyebrow`, `title`, optional `description`, `action`, `as`, `id`) and `PageHeader` for page tops.
- Wrap groups of cards in `Reveal` for entrance motion; it disables itself under `prefers-reduced-motion`.
- shadcn components live in `src/components/ui/` and were ejected; edit them directly rather than re-running the CLI.
- Styling: Tailwind utilities against the tokens defined in `src/app/globals.css` (`bg-surface`, `text-foreground-secondary`, `text-brand`, `surface-card`, `container-content`). Add new tokens in `:root` / `.light` and map them in `@theme inline`.

### Accessibility

- Every page has one `h1`; sections use `h2`/`h3` in order.
- Interactive elements need accessible names (`aria-label` on icon buttons, `aria-pressed` on filter buttons, `aria-current="page"` on active links).
- Text colours must meet WCAG AA contrast on their background. `tests/e2e/accessibility.spec.ts` runs axe on six routes and fails on serious/critical violations.

## Environment variables

See `.env.example` and the table in [TECH_STACK.md](TECH_STACK.md#environment-variables). `NEXT_PUBLIC_SITE_URL` is inlined at build time; changing it requires a rebuild.

## Testing

Full detail in [TESTING.md](TESTING.md). Quick reference:

```bash
npm test                                        # unit
npm run build && npm run test:e2e               # e2e with Playwright-managed server
PLAYWRIGHT_CHANNEL=chrome npm run test:e2e      # reuse system Chrome
```

## Debugging tips

- **Blank styles in Docker:** `.next/static` or `public` was not copied; check the `COPY --from=builder` lines in `Dockerfile`.
- **`EADDRINUSE` on `next start`:** a previous server still holds the port; on Windows `Get-NetTCPConnection -LocalPort <port>` shows the owning PID.
- **`server-only` import error in tests:** `vitest.config.mts` aliases the package to `tests/unit/mocks/server-only.ts`; keep that alias if you move test files.
- **Heading anchors styled like links inside MDX:** `.prose-article h2 a` overrides are in `globals.css`.
- **Code blocks without colour:** Shiki emits `--shiki-dark`/`--shiki-light` variables; `globals.css` selects them per theme class.

## Git workflow

Follow `.cursor/rules/git-workflow.mdc`: feature branches (`feature/<module>`), conventional commit messages (`feat(...)`, `test(...)`, `docs(...)`), commit implementation and documentation together, never push or open PRs without explicit authorisation, never commit `.env*` or secrets.
