# Tech stack

Versions are the resolved versions in `package-lock.json` as of 2026-09-29 (`npm ls --depth=0`). Runtime: Node.js 24 (local development used v24.1.0; the Docker image uses `node:24-alpine`).

## Framework and language

| Package | Version | Purpose | Where used | Why |
| --- | --- | --- | --- | --- |
| `next` | 16.3.7 | App Router framework, static generation, metadata files, standalone output | `src/app/**`, `next.config.ts` | Static-first rendering with first-class metadata, image, and font handling; standalone output keeps the container small |
| `react`, `react-dom` | 19.2.8 | UI runtime; `useActionState` for the contact form | everywhere | Required by Next.js 16 |
| `typescript` | 5.9.3 | Strict typing across app, data, and tests | everywhere | Typed content files catch content mistakes at build time |
| `@types/node`, `@types/react`, `@types/react-dom` | 24.19.0 / 19.3.0 / 19.3.0 | Type definitions | tooling | — |

Docs: [Next.js](https://nextjs.org/docs), [React](https://react.dev).

## Styling and UI

| Package | Version | Purpose | Where used | Why |
| --- | --- | --- | --- | --- |
| `tailwindcss`, `@tailwindcss/postcss` | 4.3.3 | Utility CSS with CSS-first tokens | `src/app/globals.css`, all components | Design tokens live in CSS variables; no JS config |
| `radix-ui` | 1.6.7 | Accessible primitives (Dialog for the mobile sheet, Separator, Slot) | `src/components/ui/*` | Used by shadcn/ui components |
| `class-variance-authority` | 0.7.1 | Variant props for `Button` and `Badge` | `src/components/ui/button.tsx`, `badge.tsx` | shadcn convention |
| `cn` | 0.4.0 | Class name merging (`cn()`) | `src/lib/utils.ts`, ui components | shadcn v4 default |
| `tw-animate-css` | 1.4.0 | Enter/exit animation utilities for the sheet | `globals.css` import, `sheet.tsx` | shadcn dependency |
| `lucide-react` | 1.48.0 | Icons | header, cards, buttons | Consistent icon set; GitHub/LinkedIn glyphs are hand-written SVGs in `src/components/icons/brand-icons.tsx` because lucide no longer ships brand icons |
| `motion` | 13.4.5 | In-view reveal animation with reduced-motion support | `src/components/motion/reveal.tsx` | Small, respects `prefers-reduced-motion` |
| `next-themes` | 0.4.6 | Class-based dark/light theme with persisted preference | `src/components/layout/theme-provider.tsx`, `theme-toggle.tsx` | Avoids flash of wrong theme; default dark |
| `next/font` (built in) | — | Self-hosted Geist Sans and Geist Mono | `src/app/layout.tsx` | No external font requests; CSP `font-src 'self'` |

shadcn/ui was initialised with the CLI (`components.json`, style `radix-nova`) and then **ejected** (`npx shadcn eject`), which inlined its CSS into `src/styles/shadcn.css` and removed the `shadcn` runtime dependency. Components: `button`, `badge`, `sheet`, `separator`.

## Content pipeline

| Package | Version | Purpose | Where used | Why |
| --- | --- | --- | --- | --- |
| `next-mdx-remote` | 6.0.0 | `compileMDX` from `next-mdx-remote/rsc` renders MDX in server components | `src/app/blog/[slug]/page.tsx` | Content stays in `content/blog`, no MDX bundler plugin needed |
| `gray-matter` | 4.0.3 | Frontmatter parsing | `src/lib/blog.ts` | Standard |
| `reading-time` | 1.5.0 | Reading-time estimate | `src/lib/blog.ts` | Shown on cards and articles |
| `remark-gfm` | 4.0.1 | Tables, task lists, strikethrough | blog MDX options | — |
| `rehype-slug` | 6.0.0 | Heading ids for the table of contents | blog MDX options; `extractToc` mirrors its slug algorithm | — |
| `rehype-pretty-code` | 0.14.5 | Syntax highlighting with Shiki, dual theme (`github-dark-default` / `github-light-default`), `keepBackground: false` | blog MDX options, `globals.css` | Build-time highlighting; no client JS |
| `shiki` | 4.4.3 | Highlighter used by rehype-pretty-code | — | — |

## Validation and email

| Package | Version | Purpose | Where used | Why |
| --- | --- | --- | --- | --- |
| `zod` | 4.6.5 | Contact form schema (`z.email()`, honeypot) | `src/lib/contact.ts` | Server-side validation with field-level messages |
| `resend` | 6.30.0 | Email delivery SDK, dynamically imported | `src/lib/contact.ts` | Only loaded when a valid, configured submission reaches delivery |
| `server-only` | 0.0.1 | Build-time guard against importing server modules into the client | `src/lib/blog.ts`, `contact.ts`, `resume.ts` | Prevents leaking filesystem or secret access |

## Testing and quality

| Package | Version | Purpose | Where used |
| --- | --- | --- | --- |
| `vitest` | 5.0.2 | Unit test runner (jsdom environment) | `vitest.config.mts`, `tests/unit/**` |
| `@vitejs/plugin-react` | 6.1.1 | JSX transform for component tests | `vitest.config.mts` |
| `jsdom` | 29.1.1 | DOM environment | unit tests |
| `@testing-library/react`, `@testing-library/dom`, `@testing-library/jest-dom` | 16.3.3 / 10.4.2 / 7.0.1 | Component rendering and matchers | `tests/unit/components/**`, `tests/unit/setup.ts` |
| `@playwright/test` | 1.63.0 | End-to-end tests against the production build | `playwright.config.ts`, `tests/e2e/**` |
| `@axe-core/playwright` | 4.13.0 | Automated WCAG 2.1 AA checks | `tests/e2e/accessibility.spec.ts` |
| `eslint`, `eslint-config-next` | 9.39.5 / 16.3.7 | Linting (`eslint .`, flat config) | `eslint.config.mjs` |

## Delivery

| Tool | Purpose | Where |
| --- | --- | --- |
| Docker (multi-stage, `node:24-alpine`) | Production image with standalone output, non-root user, health check | `Dockerfile`, `.dockerignore` |
| Docker Compose | Single-service stack with configurable host port | `docker-compose.yml` |
| GitHub Actions | Lint, typecheck, unit tests, build, Playwright, Docker image build (no push) | `.github/workflows/ci.yml` |

## Environment variables

| Variable | Scope | Required | Purpose |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | build time | No (defaults to `https://KapilSahrma.mageiatech.com`) | Canonical origin for metadata, sitemap, robots, feed, JSON-LD |
| `RESEND_API_KEY` | runtime | No | Enables contact delivery together with the two below |
| `CONTACT_TO_EMAIL` | runtime | No | Recipient inbox |
| `CONTACT_FROM_EMAIL` | runtime | No | Verified sender identity in Resend |
| `HOST_PORT` | Compose | No (default 3005) | Host port mapped to container port 3000 |
| `IMAGE_NAME`, `IMAGE_TAG` | Compose | No | Image naming |
| `PLAYWRIGHT_BASE_URL`, `PLAYWRIGHT_PORT`, `PLAYWRIGHT_CHANNEL` | tests | No | Point Playwright at a running server or a system browser |

Placeholders only appear in `.env.example`; real values are never committed.
