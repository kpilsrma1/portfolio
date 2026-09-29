# Deployment: Docker, Compose, CI

## 1. Purpose

Packages the site as a single container and defines the automated checks that run on every push. The full server procedure lives in [../DEPLOYMENT.md](../DEPLOYMENT.md); this document describes the code-level artefacts.

## 2. Business requirements

- Run on an existing Ubuntu host alongside other Docker services without disturbing them.
- Host port configurable (default 3005) to avoid collisions; container listens on 3000.
- Non-root runtime, health check for Portainer/Compose, secrets supplied only via environment.
- CI proves lint, types, unit tests, build, e2e, and image build before merge.

## 3. Features

Implemented: multi-stage `Dockerfile` (deps → builder → runner) on `node:24-alpine`, `output: "standalone"` copy, `nextjs` user (uid 1001), `HEALTHCHECK` calling `/api/health` with `wget`, `docker-compose.yml` with configurable image name/tag/host port and Resend variables, `.dockerignore`, `.env.example`, GitHub Actions workflow with three jobs.

Planned: none.

## 4. Technical implementation

- **Dockerfile**
  - `base`: `node:24-alpine` with `NEXT_TELEMETRY_DISABLED=1`.
  - `deps`: `npm ci` from `package.json` + `package-lock.json`.
  - `builder`: `ARG NEXT_PUBLIC_SITE_URL` → `ENV`, `npm run build` (runs `next build`, producing `.next/standalone`).
  - `runner`: `NODE_ENV=production`, `PORT=3000`, `HOSTNAME=0.0.0.0`, creates group `nodejs` (gid 1001) and user `nextjs` (uid 1001), copies `public`, `.next/standalone`, `.next/static` with `--chown`, `EXPOSE 3000`, `HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3` running `wget -qO- http://127.0.0.1:3000/api/health`, `CMD ["node", "server.js"]`.
- **docker-compose.yml**: service `portfolio`, `image: ${IMAGE_NAME:-kapil-portfolio}:${IMAGE_TAG:-latest}`, `build.args.NEXT_PUBLIC_SITE_URL` (default `https://KapilSahrma.mageiatech.com`), `container_name: kapil-portfolio`, `restart: unless-stopped`, `ports: "${HOST_PORT:-3005}:3000"`, `environment` for `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` (default empty → form disabled), healthcheck, json-file logging (10 MB × 3).
- **.dockerignore** excludes `node_modules`, `.next`, tests, docs, `.git`, `.github`, editor folders, `.env*` (keeps `.env.example`), Docker files.
- **CI (`.github/workflows/ci.yml`)**: triggers on push to `master`/`main` and on every pull request.
  - `quality`: Node 24, `npm ci`, `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, upload `.next` artefact.
  - `e2e`: downloads artefact, `npx playwright install --with-deps chromium`, `npm run test:e2e`, uploads report on failure.
  - `docker`: `docker/build-push-action` with `push: false`, tag `kapil-portfolio:ci`.

## 5. File structure

| File | Responsibility |
| --- | --- |
| `Dockerfile` | Image definition |
| `docker-compose.yml` | Service definition |
| `.dockerignore` | Build context filter |
| `.env.example` | Variable names and explanations (no values) |
| `.github/workflows/ci.yml` | CI pipeline |
| `src/app/api/health/route.ts` | Health endpoint used by HEALTHCHECK |

## 6. Dependencies

- Internal: `next.config.ts` (`output: "standalone"`), health route.
- External: Docker Engine + Compose v2 on the host, GitHub Actions runners.
- Environment: `NEXT_PUBLIC_SITE_URL` (build arg), `HOST_PORT`, `IMAGE_NAME`, `IMAGE_TAG`, `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`.

## 7. Design and UI

Not applicable.

## 8. Data and API

`GET /api/health` → `200 {"status":"ok"}`, `Cache-Control: no-store`, `force-dynamic`.

## 9. Technical decisions

ADR-001, ADR-010 in [../DECISIONS.md](../DECISIONS.md).

## 10. Testing

- Local: `docker compose build` was **not** executed (Docker daemon unavailable on the development machine). The Dockerfile has been reviewed against the Next.js standalone output layout only.
- CI: workflow has **not** run yet (nothing pushed).
- Health endpoint verified by e2e (`seo-and-headers.spec.ts`).

## 11. Current status

**Implemented, Needs Testing.** First real validation happens on the server or in CI.

## 12. Future improvements

- Publish images to a registry (GHCR) from CI once a remote exists and is authorised.
- Add `docker compose config` validation to CI.
- Image scanning (Trivy) job.

## 13. Update history

- 2026-09-29 — Initial documentation.
