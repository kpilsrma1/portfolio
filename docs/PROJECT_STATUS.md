# Project status

_Last updated: 2026-09-29_

## Overall

**Implemented and verified locally; not deployed.** All routes in scope exist, lint/typecheck/unit/e2e/build pass on the development machine, and the delivery files (Docker, Compose, CI) are written. Launch is blocked on personal inputs and infrastructure confirmations that only the owner can provide.

Branch: `feature/portfolio-site` (from `master`). Nothing has been pushed to a remote.

## Module status

| Module | Status | Notes |
| --- | --- | --- |
| Layout and theme | Implemented | Verified desktop and 375 px; theme persists |
| Homepage | Implemented | Seven sections, all from config/data |
| Projects and case studies | Implemented | 3 confidential case studies; filter; 404 for unknown slugs |
| About / Experience / Uses | Implemented | Dates hidden until `employmentDatesVerified` is true |
| Blog | Implemented | 1 published article, 4 drafts (excluded everywhere) |
| Contact and résumé | Implemented | Form disabled (no Resend config); résumé page in "not published" state (no PDF) |
| SEO and metadata | Implemented | Sitemap, robots, feed, manifest, OG image, JSON-LD, canonical URLs |
| Security headers | Implemented | Verified via e2e |
| Tests | Implemented | 43 unit, 34 e2e (incl. axe) passing locally |
| Docker / Compose | Implemented, **Needs Testing** | Files written; image not built locally (daemon unavailable) |
| CI workflow | Implemented, **Needs Testing** | Runs on first push |
| Documentation | Implemented | This `docs/` set and root `README.md` |

## Blockers and open questions (owner input required)

| Item | Where to supply | Effect when supplied |
| --- | --- | --- |
| Résumé PDF | `public/resume/kapil-sharma-resume.pdf` (then rebuild) | Header/footer/résumé page switch to download + inline preview |
| Employment dates | `src/data/experience.ts` (`dateRange`) and set `employmentDatesVerified: true` in `src/config/site.ts` | Timeline shows the date range |
| Email address | `siteConfig.email` | `mailto:` on contact page, footer link, JSON-LD |
| GitHub / LinkedIn URLs | `siteConfig.githubUrl`, `siteConfig.linkedinUrl` | Footer and contact links, JSON-LD `sameAs` |
| Location (optional) | `siteConfig.location` | Shown where configured |
| Hostname spelling `KapilSahrma.mageiatech.com` | `NEXT_PUBLIC_SITE_URL` / `DEFAULT_SITE_URL` | **Needs Confirmation** before DNS, proxy, or launch |
| Contribution wording review | `src/data/projects.ts` (`contributionsVerified`) | Set to `true` once checked against the résumé |
| Resend credentials (optional) | Server environment only | Enables the contact form |
| Licence choice | `LICENSE` (MIT proposed) | Confirm before making the repo public |
| Authorisation to push / create remote / open PR / deploy | — | Required by the git workflow rule |

## Testing and deployment readiness

- Local verification: complete (see [TESTING.md](TESTING.md#last-executed-results-development-machine-2026-09-29)).
- Docker image: not yet built anywhere. First `docker compose build` on the server or a CI run will confirm the `Dockerfile`.
- Deployment: procedure documented in [DEPLOYMENT.md](DEPLOYMENT.md); not executed.

## Next actionable tasks

1. Owner supplies the inputs above (at minimum: hostname confirmation, email, employment dates).
2. Rebuild, rerun `npm run check` and `npm run test:e2e`.
3. With explicit authorisation: push `feature/portfolio-site`, open a PR to `master`, let CI run (including the Docker build job).
4. Merge, then follow [DEPLOYMENT.md](DEPLOYMENT.md) on the Ubuntu host.
5. Verify the live site with the post-deploy checklist before calling it launched.

## History

- 2026-09-29 — Initial build of the full site, tests, Docker, CI, and documentation on `feature/portfolio-site`.
