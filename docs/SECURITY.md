# Security

## Threat model in one paragraph

A public, read-only marketing site with one optional write path (the contact form). Assets worth protecting: the owner's reputation (no defacement, no misleading content), the owner's inbox (no spam relay), and the hosting server (no container escape or resource abuse). There is no user data, no session, and no database.

## Transport and headers

Configured once in `next.config.ts` for every route (`source: "/(.*)"`) and verified by `tests/e2e/seo-and-headers.spec.ts`:

| Header | Value | Reason |
| --- | --- | --- |
| `Content-Security-Policy` | `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; object-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests` | No third-party origins at all. `'unsafe-inline'` is required because pages are statically generated and cannot carry per-request nonces for the small inline scripts Next.js, the theme bootstrap, and JSON-LD emit. `object-src 'self'` allows the résumé PDF `<object>` preview |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains` | Two years; the proxy must serve HTTPS before this takes effect |
| `X-Frame-Options` | `DENY` | Belt-and-braces with `frame-ancestors 'none'` |
| `X-Content-Type-Options` | `nosniff` | — |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | — |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), interest-cohort=()` | — |
| `X-Powered-By` | removed (`poweredByHeader: false`) | — |

TLS is terminated by Nginx Proxy Manager in front of the container ([DEPLOYMENT.md](DEPLOYMENT.md)).

## Contact form boundary

Implemented in `src/lib/contact.ts` and `src/app/contact/actions.ts`; tested in `tests/unit/contact*.test.ts`.

- **Fails closed.** Without all three of `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`, the page hides the form and the server action returns an error without any side effect.
- **Server-side validation** with Zod: name 2–100, valid email ≤ 200, message 20–4000 characters. Client attributes mirror these limits for UX only.
- **Honeypot** field `website` (visually hidden, `tabIndex={-1}`, `autoComplete="off"`). Any content → silent `success` with nothing sent.
- **Rate limiting:** 3 submissions per 10 minutes per client key derived from `x-forwarded-for` (first hop) or `x-real-ip`. In-memory and per container; adequate for a single instance. If the site ever runs multiple replicas, move this to the proxy or a shared store and record the decision.
- **No user-controlled headers.** The email is sent as plain text with `replyTo` set to the sender; the `from` address is the configured verified identity, so the form cannot be used to spoof arbitrary senders.
- **Provider errors are not leaked.** Resend error messages are logged server-side and replaced with a generic message for the client.
- **`server-only`** guards `contact.ts`, `blog.ts`, and `resume.ts` from ever being bundled into client JavaScript.

## Secrets and configuration

- No secrets exist in the repository. `.gitignore` excludes `.env` and `.env.*` except `.env.example`; `.dockerignore` does the same for the build context.
- `.env.example` contains variable names with placeholder values only.
- Production secrets are supplied as environment variables through Compose or Portainer. They are never baked into the image: the only build argument is the public site URL.
- `NEXT_PUBLIC_*` values are public by definition; nothing sensitive uses that prefix.

## Container hardening

- Multi-stage build: the runtime image contains the standalone server, static assets, and `public/` only — no source, no dev dependencies, no build tooling.
- Runs as the unprivileged `nextjs` user (uid 1001) created in the `Dockerfile`; files are copied with `--chown`.
- `HEALTHCHECK` lets the orchestrator replace a wedged container.
- No volumes, no privileged flags, no host networking. Only port 3000 is exposed and mapped to a configurable host port.
- Base image `node:24-alpine`; rebuild periodically to pick up upstream patches.

## Content integrity

- Case studies are sanitised by policy (no client names, internal URLs, screenshots, or unmeasured metrics) and by test (`tests/unit/projects.test.ts` rejects `demoUrl`/`repositoryUrl` on confidential entries and percentage-style metrics anywhere in the data).
- Contact details are never placeholders: `getSocialLinks()` only returns configured values and the footer/contact page show an explicit "not configured" state otherwise.
- JSON-LD is serialised with `<` escaped to prevent script breakout.

## Dependencies

- `npm audit` reported 0 vulnerabilities at the time of the last install (2026-09-29). Re-run on every dependency update.
- CI (`.github/workflows/ci.yml`) runs on every push and pull request with read-only `contents` permission and never pushes images.

## Known accepted risks

| Risk | Mitigation / rationale |
| --- | --- |
| `'unsafe-inline'` in CSP | Required for static generation; no third-party origins are permitted so injected external scripts are still blocked. Revisit if the site moves to dynamic rendering with nonces |
| In-memory rate limiter | Single-instance deployment; document before scaling out |
| Hostname unverified | Configuration reproduces the supplied spelling; nothing is deployed until it is confirmed |

## Reporting

Security issues should be reported privately to the site owner through the contact channel listed on the live site once it is configured. Do not open public issues for vulnerabilities.
