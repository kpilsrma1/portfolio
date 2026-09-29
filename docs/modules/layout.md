# Layout and theme

## 1. Purpose

Provides the shell shared by every page: root HTML document, fonts, theme provider, sticky header with primary navigation, mobile navigation sheet, footer, skip link, and global structured data.

## 2. Business requirements

- Dark theme by default with a user-selectable light theme that persists.
- Navigation to Home, Projects, About, Experience, Blog, Contact; Uses, Résumé, Privacy reachable from the footer.
- Résumé entry point must link to the PDF only when the file exists; otherwise to `/resume`.
- Profile links (GitHub, LinkedIn, email) appear only when configured; the footer states plainly when none are.
- Usable at 375 px and on desktop; keyboard accessible.

## 3. Features

Implemented: sticky translucent header, active-link highlighting (`aria-current`), theme toggle with accessible label, Radix-based mobile sheet (`md:hidden`), footer with dynamic year, skip link, Geist Sans/Mono via `next/font`, `suppressHydrationWarning` on `<html>` for theme class, optional availability indicator (`siteConfig.availability.open`, currently `false`).

Planned: none.

## 4. Technical implementation

- `src/app/layout.tsx` — server component. Sets `metadataBase`, title template `%s · Kapil Sharma`, RSS alternate, viewport theme colour; calls `hasResumeFile()` once and passes the result to header and footer; renders `<ThemeProvider>`, skip link, `SiteHeader`, `<main id="main">`, `SiteFooter`, `StructuredData`.
- `ThemeProvider` (`theme-provider.tsx`, client) wraps `next-themes` with `attribute="class"`, `defaultTheme="dark"`, `value={{ dark: "dark", light: "light" }}`, `enableSystem={false}`.
- `ThemeToggle` (client) uses `useSyncExternalStore` for a mounted flag to avoid hydration mismatch, toggles `setTheme`, exposes `aria-label` "Switch to light/dark theme" and `data-testid="theme-toggle"`.
- `NavLink` (client) computes `isActivePath(pathname, href, exact)`; `/` matches only the root, other hrefs match themselves and nested paths.
- `MobileNav` (client) renders a shadcn `Sheet` (Radix Dialog) with `data-testid="mobile-menu-trigger"`, title "Navigation", links that close the sheet on navigation, and the résumé button.
- `SiteHeader` / `SiteFooter` are server components reading `siteConfig.navigation`, `siteConfig.footerNavigation`, `getSocialLinks()`.
- `Logo` / `Monogram` render the "KS" mark.

State: theme (next-themes, `localStorage` key `theme`), sheet open state (local). No global store.

## 5. File structure

| File | Responsibility |
| --- | --- |
| `src/app/layout.tsx` | Root document, metadata defaults, shell composition |
| `src/app/globals.css` | Tokens, theme classes, utilities, prose styles |
| `src/styles/shadcn.css` | Ejected shadcn utilities/variants |
| `src/components/layout/theme-provider.tsx` | next-themes wrapper |
| `src/components/layout/theme-toggle.tsx` | Toggle button |
| `src/components/layout/site-header.tsx` | Header |
| `src/components/layout/mobile-nav.tsx` | Sheet navigation |
| `src/components/layout/nav-link.tsx` | Active-aware link + `isActivePath` |
| `src/components/layout/site-footer.tsx` | Footer |
| `src/components/layout/logo.tsx` | Monogram and wordmark |
| `src/components/social-links.tsx` | Configured profile links |
| `src/components/icons/brand-icons.tsx` | GitHub/LinkedIn SVGs |
| `src/components/ui/sheet.tsx`, `button.tsx`, `badge.tsx`, `separator.tsx` | shadcn primitives |

## 6. Dependencies

- Internal: `src/config/site.ts`, `src/lib/resume.ts`, `src/components/structured-data.tsx`.
- Depended on by: every page.
- External: `next-themes`, `radix-ui`, `lucide-react`, `cn`, `class-variance-authority`, `tw-animate-css`, `next/font`.
- Environment: none directly (`NEXT_PUBLIC_SITE_URL` via `siteConfig`).

## 7. Design and UI

- Header: `sticky top-0`, backdrop blur, `container-content` width (75 rem). Desktop nav visible from `md`; below that the sheet trigger shows.
- Footer: three columns on desktop (identity, Navigate, Elsewhere), stacked on mobile.
- Tokens: `--background #0b0d12`, `--surface #10141d`, `--card #151923`, `--elevated #1b2130`, `--brand #67e8f9`, `--brand-alt #818cf8`, text `#e5e7eb` / `#a1a1aa` / `#858d9b`; light theme `#f8f9fb`, `#f1f3f7`, `#ffffff`, text `#14161c` / `#4b5563` / `#5f6773`, brand `#0e7490`.
- Accessibility: skip link first in tab order, `nav[aria-label="Primary"]`, `aria-current="page"`, visible focus rings, reduced-motion respected.

## 8. Data and API

Reads `siteConfig` only. No endpoints.

## 9. Technical decisions

ADR-007 (theme tokens), ADR-008 (shadcn eject), ADR-003 (optional facts hidden) in [../DECISIONS.md](../DECISIONS.md).

## 10. Testing

- Unit: `tests/unit/nav-link.test.ts`.
- E2E: `home.spec.ts` (skip link, `aria-current`, footer), `navigation.spec.ts`, `theme.spec.ts`, `mobile.spec.ts`, `accessibility.spec.ts`.
- Executed 2026-09-29: passing (see [../TESTING.md](../TESTING.md)).

## 11. Current status

**Implemented.** Known gaps: availability indicator is off; footer "Elsewhere" shows the not-configured message until social URLs are supplied.

## 12. Future improvements

- Command palette / search if content grows.
- Persist theme via cookie for server-rendered theme class (currently class is set client-side by next-themes before paint).

## 13. Update history

- 2026-09-29 — Initial documentation.
