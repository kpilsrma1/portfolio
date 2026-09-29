# Skills and learnings

This file records what the codebase actually demonstrates. It distinguishes techniques implemented here from topics only studied or planned, and it does not claim mastery of a tool because a package is installed.

## Skills used (implemented in this repository)

| Skill | Evidence |
| --- | --- |
| Next.js 16 App Router: layouts, static generation, `generateStaticParams`, `dynamicParams = false`, `notFound()` | `src/app/**`, `src/app/projects/[slug]/page.tsx`, `src/app/blog/[slug]/page.tsx` |
| Next.js metadata API and file conventions (sitemap, robots, manifest, `opengraph-image` with `next/og`, icon) | `src/lib/metadata.ts`, `src/app/sitemap.ts`, `robots.ts`, `manifest.ts`, `opengraph-image.tsx` |
| React 19 server actions with `useActionState` | `src/app/contact/actions.ts`, `src/components/forms/contact-form.tsx` |
| Server/client boundary discipline (`server-only`, minimal `"use client"`) | `src/lib/*.ts`, `src/components/layout/theme-toggle.tsx`, `projects/project-filter.tsx` |
| `useSyncExternalStore` for mount detection without effect-driven state | `src/components/layout/theme-toggle.tsx` |
| Tailwind CSS v4 CSS-first configuration (`@theme inline`, `@custom-variant`, `@utility`) | `src/app/globals.css` |
| Class-based theming with `next-themes` and hydration-safe markup | `src/components/layout/theme-provider.tsx`, `src/app/layout.tsx` |
| Accessible UI: skip link, landmarks, `aria-current`, `aria-pressed`, `role="status"`, focus-visible styles, reduced-motion handling | header, `ProjectFilter`, `Reveal`, `globals.css` |
| MDX pipeline in server components with remark/rehype plugins and Shiki dual themes | `src/lib/blog.ts`, `src/app/blog/[slug]/page.tsx`, `src/components/blog/mdx-components.tsx` |
| Zod v4 schemas and issue-to-field mapping | `src/lib/contact.ts` |
| Sliding-window rate limiting | `src/lib/contact.ts` |
| Structured data (Person, WebSite, TechArticle JSON-LD) with safe serialisation | `src/components/structured-data.tsx`, blog article page |
| HTTP security headers and CSP design for static sites | `next.config.ts` |
| Multi-stage Docker builds, non-root runtime, health checks, Compose variable substitution | `Dockerfile`, `docker-compose.yml` |
| GitHub Actions pipelines with artefact hand-off between jobs | `.github/workflows/ci.yml` |
| Vitest with jsdom, module aliasing, `vi.hoisted` mocks, env stubbing | `vitest.config.mts`, `tests/unit/**` |
| Playwright: role-based locators, device projects, request fixtures, `webServer`, axe integration | `playwright.config.ts`, `tests/e2e/**` |

## Skills learned or refreshed during this build

- **Next.js 16 changes:** `next lint` is gone (use `eslint .`); `params` are async; `next typegen` produces global `PageProps<'/route'>` helpers; Turbopack is the default bundler.
- **shadcn/ui v4 CLI** installs the unified `radix-ui` package and the `cn` package, and offers `eject` to remove the runtime dependency.
- **Shiki dual themes** emit `--shiki-light`/`--shiki-dark` variables per token; the consumer must select one via CSS, otherwise all tokens share a colour.
- **Next.js metadata merging is shallow:** a page-level `openGraph` object replaces the parent's, dropping the file-based image unless it is referenced explicitly.
- **Zod v4 API:** `z.email()` top-level validator; issue type is `z.core.$ZodIssue`.
- **`react-hooks/set-state-in-effect` lint rule** (eslint-config-next 16) pushes the mounted-flag pattern toward `useSyncExternalStore`.

## Practical examples

- Fail-closed configuration gate: `getContactDeliveryConfig()` in `src/lib/contact.ts` and its use at the top of `sendContactMessage`.
- Single filter for drafts across routes, feed, and sitemap: `getPublishedPosts()` in `src/lib/blog.ts`.
- Hiding unverified facts: `employmentDatesVerified` in `src/config/site.ts` consumed by `src/components/experience-timeline.tsx`.
- Build-time asset detection: `hasResumeFile()` in `src/lib/resume.ts` used by layout, header, footer, and the résumé page.

## Problems and solutions

| Problem | Root cause | Solution |
| --- | --- | --- |
| `npm install` ERESOLVE between `@vitejs/plugin-react@6` and `shadcn` | shadcn runtime dep pinned Babel 7; plugin wants Babel 8 | Ejected shadcn (`npx shadcn eject`), removing the dependency |
| `vitest@5` peer conflict with `@types/node@20` | Vitest 5 requires `@types/node ^22 || >=24` | Upgraded to `@types/node@24` |
| `GithubIcon`/`LinkedinIcon` missing from `lucide-react` | Brand icons removed from lucide | Local SVG components in `src/components/icons/brand-icons.tsx` |
| Lint error `react-hooks/set-state-in-effect` in the theme toggle | Setting state inside `useEffect` for a mounted flag | `useSyncExternalStore(noop, () => true, () => false)` |
| Invalid `<li>` nesting when wrapping list items in `Reveal` | `Reveal` renders a `div` | Grid of cards without `<ul>` where motion wrapping is needed |
| Code blocks rendered without token colours | Dual-theme variables not selected | `code[data-theme] span { color: var(--shiki-dark) }` plus `.light` override |
| MDX heading anchors styled as links | `.prose-article a` applied inside `h2`/`h3` | `.prose-article h2 a, h3 a { color: inherit; text-decoration: none }` |
| axe `color-contrast` failures (3.6–4.3:1) | `--muted-foreground` too dark on elevated dark surfaces and too light on light surfaces | Tokens raised to `#858d9b` (dark) and `#5f6773` (light) |
| `og:image` absent on nested pages | Shallow metadata merge | `buildMetadata` sets `openGraph.images` and `twitter.images` explicitly |
| `vi.mock` factory referenced top-level variables | Hoisting | Wrapped mocks in `vi.hoisted` |
| Playwright Chromium download blocked | Network restriction on the dev machine | `PLAYWRIGHT_CHANNEL=chrome` uses the installed browser; CI still installs Chromium |
| `next start` `EADDRINUSE` after stopping the parent shell | Child `node` process kept the port | Locate owner with `Get-NetTCPConnection -LocalPort` and stop it |

## Best practices established

- Profile facts have one home; components never carry them.
- Every optional external fact has an explicit, honest empty state.
- Draft content is filtered in exactly one function.
- Security headers are declared once in `next.config.ts` and asserted in e2e tests.
- Tests run against the production build, and the build type-checks the tests.
- Documentation is updated in the same commit as the code it describes.

## Learning roadmap (planned, not yet demonstrated here)

- Visual regression testing (Playwright screenshots or a hosted service).
- Nonce-based CSP with dynamic rendering, if the site ever needs it.
- Shared rate limiting (proxy-level or Redis) for multi-replica deployments.
- Lighthouse CI budgets in the pipeline.
