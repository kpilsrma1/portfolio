# Changelog

All notable changes to this project. Dates are ISO 8601. Grouped by Added, Changed, Fixed, Removed, Security.

## 2026-09-29 — Initial build (`feature/portfolio-site`)

### Added

- Next.js 16 App Router project with TypeScript strict mode, Tailwind CSS v4 design tokens (dark default, light theme), shadcn/ui primitives (`button`, `badge`, `sheet`, `separator`), Geist fonts.
- Central site configuration `src/config/site.ts` and typed content files for projects, experience, skills, education, principles, and uses.
- Routes: `/`, `/projects`, `/projects/[slug]` (3 confidential case studies), `/about`, `/experience`, `/uses`, `/blog`, `/blog/[slug]`, `/contact`, `/resume`, `/privacy`, custom 404.
- MDX blog pipeline (`next-mdx-remote`, `remark-gfm`, `rehype-slug`, `rehype-pretty-code`/Shiki) with one published article and four drafts excluded from every surface.
- Contact server action with Zod validation, honeypot, in-memory rate limiting, and Resend delivery that fails closed when credentials are absent.
- SEO: per-page metadata with canonical URLs, `sitemap.xml`, `robots.txt`, `feed.xml` (RSS 2.0), `manifest.webmanifest`, generated Open Graph image, SVG icon, Person/WebSite/TechArticle JSON-LD.
- `/api/health` route handler for container health checks.
- Unit tests (Vitest, 43) and end-to-end tests (Playwright + axe, 34).
- `Dockerfile` (multi-stage, `node:24-alpine`, non-root, health check), `docker-compose.yml` (configurable host port, default 3005), `.dockerignore`, `.env.example`.
- GitHub Actions workflow: lint, typecheck, unit tests, build, Playwright, Docker image build (no push).
- Root `README.md`, MIT `LICENSE` (proposed), and the `docs/` knowledge base.
- Project rules `.cursor/rules/git-workflow.mdc` and `.cursor/rules/project-documentation.mdc`.

### Changed

- Replaced the create-next-app default page, layout, and README.
- Ejected shadcn/ui to remove the runtime dependency (`src/styles/shadcn.css`).

### Fixed

- Muted text contrast raised to meet WCAG AA (`--muted-foreground` `#858d9b` dark / `#5f6773` light) after axe reported 3.6–4.3:1 ratios.
- Open Graph and Twitter images now set explicitly in `buildMetadata` so nested pages keep a social preview.
- MDX heading anchors no longer inherit link underline/colour; Shiki tokens now switch palette with the active theme.

### Removed

- Default `src/app/favicon.ico` (replaced by `icon.svg`).
- Unused `react-hook-form`, `@hookform/resolvers`, and `vite-tsconfig-paths` dependencies.

### Security

- Security headers (CSP with no third-party origins, HSTS, `X-Frame-Options: DENY`, nosniff, Referrer-Policy, Permissions-Policy) applied to all routes; `X-Powered-By` removed.
- `.env*` excluded from git and Docker context; no secrets in repository or documentation.
