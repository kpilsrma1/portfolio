# Kapil Sharma — Portfolio

Personal portfolio website for Kapil Sharma, Full-Stack Software Developer. It presents sanitised case studies from production business platforms, a technical profile, a small MDX blog, and a contact page, and is packaged as a single Docker container for self-hosting.

Intended hostname: `KapilSahrma.mageiatech.com` (spelling reproduced exactly as supplied; **Needs Confirmation** before launch).

## Stack

- Next.js 16 (App Router, static generation, `output: "standalone"`), React 19, TypeScript (strict)
- Tailwind CSS v4 with CSS-first design tokens, shadcn/ui primitives on `radix-ui`, `lucide-react`, `motion`
- MDX blog via `next-mdx-remote` with `rehype-pretty-code` / Shiki highlighting
- Zod validation and an optional Resend-backed contact form that fails closed when unconfigured
- Vitest + Testing Library (unit), Playwright + axe-core (end-to-end and accessibility)
- Multi-stage Dockerfile (Node 24 Alpine, non-root, health check) and Docker Compose

No database, authentication, or admin panel: all content lives in typed data files and MDX.

## Quick start

```bash
npm ci
cp .env.example .env.local   # optional; defaults work without it
npm run dev                  # http://localhost:3000
```

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build (standalone output) |
| `npm run start` | Serve the production build locally |
| `npm run lint` | ESLint |
| `npm run typecheck` | Generate route types and run `tsc --noEmit` |
| `npm test` | Vitest unit tests |
| `npm run test:e2e` | Playwright end-to-end tests (requires a prior `npm run build`) |
| `npm run check` | Lint, typecheck, unit tests, and build in sequence |

## Docker

```bash
docker compose build
docker compose up -d
# http://localhost:3005 by default (HOST_PORT in .env)
```

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for the Ubuntu / Portainer / Nginx Proxy Manager procedure.

## Documentation

Start with [docs/README.md](docs/README.md). Key documents:

- [Project overview](docs/PROJECT_OVERVIEW.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Tech stack](docs/TECH_STACK.md)
- [Development guide](docs/DEVELOPMENT_GUIDE.md)
- [Deployment](docs/DEPLOYMENT.md)
- [Security](docs/SECURITY.md)
- [Testing](docs/TESTING.md)
- [Project status](docs/PROJECT_STATUS.md)

## Personal inputs still required

The site is complete as software but the following facts come from the site owner and are intentionally absent until supplied (see [docs/PROJECT_STATUS.md](docs/PROJECT_STATUS.md)):

- Résumé PDF at `public/resume/kapil-sharma-resume.pdf`
- Employment dates (`employmentDatesVerified` in `src/config/site.ts`)
- Email address, GitHub URL, LinkedIn URL (`src/config/site.ts`)
- Confirmation of the production hostname spelling
- Resend credentials if the contact form should be enabled

## License

Source code is released under the [MIT License](LICENSE). Written content (case studies, articles, profile text) is © Kapil Sharma, all rights reserved.
