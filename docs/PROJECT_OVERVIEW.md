# Project overview

## Name and purpose

**Kapil Sharma Portfolio** — a personal professional website for Kapil Sharma, Full-Stack Software Developer at LnP Infotech Pvt. Ltd. (3.5 years of experience; MCA and B.Sc. Computer Science).

The site exists to present professional work credibly to recruiters, hiring managers, and potential collaborators: what has been built, how it was built, and how the developer thinks about engineering.

## Business goals and audience

- Present three sanitised case studies from production business platforms (veterinary operations, travel management, property records) without exposing client names, internal URLs, or unmeasured metrics.
- Communicate technical depth on the .NET backend and fluency across React/TypeScript frontends, SQL databases, and Docker/Linux deployment.
- Provide a low-friction way to get in touch once contact details are confirmed.
- Be cheap and simple to operate: a single container behind an existing reverse proxy, no database, no admin panel.

Audience: recruiters and hiring managers, engineering leads evaluating a candidate, peers reading the blog.

## Main features

| Feature | Route(s) | Status |
| --- | --- | --- |
| Homepage with hero, featured projects, expertise, experience preview, principles, writing, contact CTA | `/` | Implemented |
| Project listing with client-side category filter | `/projects` | Implemented |
| Case study pages with architecture diagram, contents nav, related work; unknown slugs return 404 | `/projects/[slug]` | Implemented |
| About page with introduction, skills, education, principles | `/about` | Implemented |
| Experience timeline (dates hidden until verified) | `/experience` | Implemented |
| Tools and setup page | `/uses` | Implemented |
| MDX blog with tags, reading time, table of contents, syntax highlighting; drafts excluded everywhere | `/blog`, `/blog/[slug]` | Implemented (1 published article, 4 drafts) |
| Contact page: direct links when configured, honest "not configured" state otherwise; server-action form behind Resend credentials | `/contact` | Implemented |
| Résumé page: download and inline preview only when the PDF exists | `/resume` | Implemented (PDF not yet supplied) |
| Privacy page whose text reflects whether the form is enabled | `/privacy` | Implemented |
| Custom 404 | any unknown path | Implemented |
| SEO: metadata, canonical URLs, Open Graph image, sitemap, robots, RSS, manifest, JSON-LD | `/sitemap.xml`, `/robots.txt`, `/feed.xml`, `/manifest.webmanifest`, `/opengraph-image`, `/icon.svg` | Implemented |
| Health endpoint for container checks | `/api/health` | Implemented |
| Dark (default) and light themes with persisted preference | all pages | Implemented |

## User roles and permissions

There is a single anonymous visitor role. No authentication, sessions, or user data storage exist.

## Technology stack

Next.js 16.3.7 (App Router), React 19.2.8, TypeScript 5.9 (strict), Tailwind CSS 4.3, shadcn/ui primitives on `radix-ui`, `motion` 13, `next-themes`, `next-mdx-remote` 6 with `rehype-pretty-code`/Shiki, Zod 4, Resend SDK 6 (optional), Vitest 5, Playwright 1.63, `@axe-core/playwright`, Docker (Node 24 Alpine). Full inventory: [TECH_STACK.md](TECH_STACK.md).

## High-level architecture

Fully static site rendered at build time by Next.js. Content is TypeScript data (`src/data`) plus MDX files (`content/blog`). The only server-side runtime behaviour is the `/api/health` route handler and the contact server action, which refuses to run unless delivery is configured. The production artefact is the Next.js standalone output running as a non-root user in a Docker container, published through an external reverse proxy (Nginx Proxy Manager). See [ARCHITECTURE.md](ARCHITECTURE.md).

## Major modules

| Module | Responsibility | Document |
| --- | --- | --- |
| Layout and theme | Header, mobile navigation, footer, theme provider/toggle, fonts, skip link | [modules/layout.md](modules/layout.md) |
| Homepage | Section composition of the landing page | [modules/homepage.md](modules/homepage.md) |
| Projects | Project data, listing, filter, case study pages, mockups, architecture diagram | [modules/projects.md](modules/projects.md) |
| About, experience, uses | Profile pages and their data files | [modules/profile-pages.md](modules/profile-pages.md) |
| Blog | MDX pipeline, listing, article rendering, RSS | [modules/blog.md](modules/blog.md) |
| Contact and résumé | Contact page, server action, delivery boundary, résumé page | [modules/contact.md](modules/contact.md) |
| SEO and metadata | Metadata builder, sitemap, robots, manifest, OG image, JSON-LD | [modules/seo.md](modules/seo.md) |
| Deployment | Dockerfile, Compose, health check, CI | [modules/deployment.md](modules/deployment.md) |

## Integrations

- **Internal:** none beyond module imports; there is no API layer between pages and data.
- **External:** Resend (email delivery) is the only external service, used solely by the contact server action and only when `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, and `CONTACT_FROM_EMAIL` are all set. No analytics, no third-party scripts, no external fonts (Geist is self-hosted through `next/font`).

## Repository structure

```text
.
├── .cursor/rules/            Project rules (git workflow, documentation)
├── .github/workflows/ci.yml  Lint, typecheck, unit, build, e2e, Docker build
├── content/blog/             MDX articles (status: published | draft)
├── docs/                     This knowledge base
├── public/                   Static assets; public/resume is where the PDF goes
├── src/
│   ├── app/                  App Router routes, metadata files, route handlers
│   ├── components/           UI: layout, sections, projects, blog, forms, ui (shadcn)
│   ├── config/site.ts        Central profile and site configuration
│   ├── data/                 Typed content: projects, experience, skills, education, principles, uses
│   ├── lib/                  blog, contact, metadata, resume, utils helpers
│   ├── styles/shadcn.css     Ejected shadcn utilities
│   └── types/content.ts      Content type definitions
├── tests/unit/               Vitest suites
├── tests/e2e/                Playwright suites
├── Dockerfile, docker-compose.yml, .dockerignore
├── next.config.ts            Standalone output and security headers
├── playwright.config.ts, vitest.config.mts
└── .env.example              Documented environment variables (no secrets)
```

## Local development

```bash
npm ci
npm run dev        # http://localhost:3000
npm run check      # lint + typecheck + unit tests + build
```

Details, conventions, and how to add content: [DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md).

## Current status

Feature-complete for the defined scope and verified locally (lint, typecheck, 43 unit tests, 34 Playwright tests, production build). Not yet deployed. Docker image build is verified in CI configuration only; it has not been executed on the development machine. See [PROJECT_STATUS.md](PROJECT_STATUS.md).

## Constraints and known limitations

- **Hostname:** `KapilSahrma.mageiatech.com` is reproduced exactly as supplied and has not been checked against DNS. **Needs Confirmation.**
- **Personal facts withheld until supplied:** employment dates, email, GitHub, LinkedIn, résumé PDF, location. The UI omits them rather than showing placeholders.
- **Case studies:** confidential; no client names, screenshots, or metrics. Contribution lists are flagged `contributionsVerified: false` in data and worded at a functional level.
- **Contact form:** disabled until Resend credentials are configured; the in-memory rate limiter is per container instance.
- **CSP:** uses `'unsafe-inline'` for scripts and styles because pages are statically generated and cannot carry per-request nonces. No third-party origins are allowed.
- **No database, auth, CMS, or analytics** by design.
