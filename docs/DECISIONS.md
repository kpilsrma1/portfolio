# Decision records

Each record: context, options, decision, rationale, consequences, status. Dates are when the decision was implemented on `feature/portfolio-site`. "Accepted" means implemented in code; nothing here claims owner sign-off beyond the original project brief.

## ADR-001 — Static-first Next.js App Router with standalone output

- **Date:** 2026-09-29
- **Context:** The brief asked for a fast, self-hosted portfolio with no database, deployable as a single Docker container behind an existing reverse proxy.
- **Options:** (a) Next.js static generation with `output: "standalone"`; (b) pure static export served by Nginx; (c) a dynamic SSR app.
- **Decision:** (a).
- **Rationale:** Static generation gives the performance of (b) while keeping route handlers (`/api/health`, `/feed.xml`) and a server action for the contact form available. Standalone output keeps the image small.
- **Consequences:** Pages cannot use per-request nonces, so CSP needs `'unsafe-inline'` (ADR-006). `NEXT_PUBLIC_SITE_URL` is baked at build time.
- **Status:** Accepted.

## ADR-002 — Content as typed TypeScript data and MDX, no CMS

- **Date:** 2026-09-29
- **Context:** Three case studies, one role, a handful of pages, and a small blog. The owner edits content rarely.
- **Options:** (a) TypeScript data files + MDX; (b) headless CMS; (c) database + admin UI.
- **Decision:** (a).
- **Rationale:** Type checking catches content mistakes at build time; git provides history and review; zero runtime dependencies or credentials.
- **Consequences:** Content changes require a rebuild and redeploy. Acceptable for the update frequency.
- **Status:** Accepted.

## ADR-003 — Single source of profile facts in `src/config/site.ts`, unverified facts hidden

- **Date:** 2026-09-29
- **Context:** No résumé was available; employment dates, email, and social URLs were unknown. The brief forbids placeholders and invented facts.
- **Options:** (a) hard-code facts in pages; (b) central config with optional fields and verification flags.
- **Decision:** (b). Optional fields default to `undefined`; `employmentDatesVerified` and `contributionsVerified` flags gate display.
- **Rationale:** One place to fill in later; the UI degrades to honest "not configured" states instead of `YOUR_EMAIL`.
- **Consequences:** Some sections (footer profile links, contact channels, date ranges) render explanatory text until the owner supplies values.
- **Status:** Accepted.

## ADR-004 — Contact form fails closed behind Resend credentials

- **Date:** 2026-09-29
- **Context:** A contact form is expected, but no email provider is configured and the owner's address is unknown.
- **Options:** (a) always render the form and fail at send time; (b) `mailto:` only; (c) render the form only when `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, and `CONTACT_FROM_EMAIL` are all set, and make the server action refuse otherwise.
- **Decision:** (c), with `mailto:` links when an email is configured.
- **Rationale:** The site must never pretend a message was sent. Server-side gating means even a crafted request cannot trigger delivery without configuration.
- **Consequences:** Two UI states on `/contact` and `/privacy`; tests cover both paths.
- **Status:** Accepted.

## ADR-005 — In-memory rate limiter and honeypot instead of CAPTCHA

- **Date:** 2026-09-29
- **Context:** Spam protection for the contact form without third-party scripts (CSP allows none).
- **Options:** (a) reCAPTCHA/hCaptcha; (b) honeypot + server-side rate limit; (c) nothing.
- **Decision:** (b): hidden `website` field, 3 submissions per 10 minutes per client key.
- **Rationale:** No external origins, no user friction, adequate for expected volume.
- **Consequences:** Limiter is per container and resets on restart; documented as an accepted risk. Revisit if replicas or spam volume increase.
- **Status:** Accepted.

## ADR-006 — Strict CSP with `'unsafe-inline'` and no third-party origins

- **Date:** 2026-09-29
- **Context:** Static pages cannot receive per-request nonces; Next.js, the theme bootstrap, and JSON-LD emit inline scripts.
- **Options:** (a) skip CSP; (b) `'unsafe-inline'` with `default-src 'self'` and no external hosts; (c) switch to dynamic rendering for nonces.
- **Decision:** (b).
- **Rationale:** Blocks every external script/style/connect origin, which is where real-world injection payloads come from, while keeping static generation.
- **Consequences:** Inline script injection via a hypothetical XSS would not be blocked by CSP; the site has no user-generated content, so exposure is low.
- **Status:** Accepted.

## ADR-007 — Tailwind v4 CSS-first tokens with dark default and class-based light theme

- **Date:** 2026-09-29
- **Context:** The brief specified dark-by-default with a light option and a precise palette.
- **Options:** (a) media-query dark mode; (b) class-based theme via `next-themes` with tokens in CSS variables.
- **Decision:** (b). `:root` holds dark tokens, `.light` overrides, `@theme inline` maps them to Tailwind utilities.
- **Rationale:** Explicit user control with persistence and no flash; a single place to tune colours (which mattered when contrast had to be raised).
- **Consequences:** Shiki dual themes need small CSS selectors to pick the right palette per class.
- **Status:** Accepted.

## ADR-008 — Eject shadcn/ui after initialisation

- **Date:** 2026-09-29
- **Context:** `shadcn` as a runtime dependency pulled Babel 7 and conflicted with `@vitejs/plugin-react@6` (peer `@babel/core@8`).
- **Options:** (a) pin older Vite plugin; (b) `npx shadcn eject` to inline CSS and drop the dependency.
- **Decision:** (b). Components live in `src/components/ui`, utilities in `src/styles/shadcn.css`.
- **Rationale:** Removes a conflicting dependency; the four components are small and owned by the repo.
- **Consequences:** Future shadcn updates are applied manually.
- **Status:** Accepted.

## ADR-009 — Confidential case studies with no metrics or client identifiers

- **Date:** 2026-09-29
- **Context:** All three projects were built for an employer/clients; no permission exists to name them or publish numbers.
- **Options:** (a) omit the projects; (b) generic descriptions; (c) structured case studies at a functional level, flagged confidential, with CSS mockups instead of screenshots.
- **Decision:** (c). `confidential: true`, no `demoUrl`/`repositoryUrl`, contributions flagged unverified, results phrased qualitatively with an explicit note that metrics are not published.
- **Rationale:** Demonstrates engineering depth while respecting confidentiality; tests enforce the constraints.
- **Consequences:** Visual richness comes from `ProjectMockup` and `ArchitectureDiagram` rather than imagery.
- **Status:** Accepted.

## ADR-010 — Run e2e tests against the production build; allow a system browser

- **Date:** 2026-09-29
- **Context:** Playwright's Chromium download failed on the development machine; the production build differs from dev (static output, headers).
- **Options:** (a) test the dev server; (b) test `next start` of the built output, with `PLAYWRIGHT_CHANNEL` to reuse Chrome/Edge.
- **Decision:** (b).
- **Rationale:** Headers, 404 status codes, and static routes only behave correctly in the production build. The channel override keeps the suite runnable offline.
- **Consequences:** `npm run build` must precede `npm run test:e2e`; CI passes the build artefact between jobs.
- **Status:** Accepted.

## ADR-011 — MIT licence for code, all rights reserved for content

- **Date:** 2026-09-29
- **Context:** A `LICENSE` file was requested; the code is generic but the case studies and articles are personal work.
- **Decision:** MIT for source; explicit reservation for written content in the same file.
- **Status:** **Proposed** — needs owner confirmation before the repository is made public.

## Proposed / open

- **Hostname spelling** `KapilSahrma.mageiatech.com` — reproduced as supplied; **Needs Confirmation**.
- **Attaching the container to the proxy network instead of publishing a host port** — depends on the server's actual network name; **Not Yet Verified**.
