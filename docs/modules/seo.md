# SEO, metadata, and structured data

## 1. Purpose

Makes every page discoverable and shareable: titles, descriptions, canonical URLs, Open Graph/Twitter cards, sitemap, robots, web manifest, icon, RSS, and JSON-LD.

## 2. Business requirements

- One configured site URL drives every absolute link; the hostname `KapilSahrma.mageiatech.com` is reproduced as supplied until confirmed.
- Drafts and unpublished projects are absent from sitemap and feed.
- Social previews on all pages, including nested ones.
- Structured data must contain only configured facts (no invented `sameAs`, email, or metrics).

## 3. Features

Implemented: `buildMetadata()` helper; root title template `%s · Kapil Sharma`; generated 1200×630 PNG Open Graph image; SVG icon; `sitemap.xml` (9 static routes + projects + posts); `robots.txt` (allow `/`, disallow `/api/`, sitemap, host); `manifest.webmanifest`; `feed.xml`; Person + WebSite JSON-LD on every page and TechArticle JSON-LD on posts; `noIndex` option (unused today).

Planned: none.

## 4. Technical implementation

- `src/config/site.ts`: `siteUrl = normalizeUrl(NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL)`, `absoluteUrl(path)` via `new URL()`. Note: `new URL()` lowercases the host, so generated absolute URLs read `https://kapilsahrma.mageiatech.com/...` while `siteUrl` itself keeps the supplied casing (used by robots `host`, JSON-LD `url`, feed `<docs>`). Hostnames are case-insensitive, so both resolve identically.
- `src/lib/metadata.ts`: `buildMetadata({ title, description, path, type, publishedTime, modifiedTime, tags, noIndex })` sets `alternates.canonical`, `openGraph` (title `"<title> · Kapil Sharma"`, `siteName`, `locale: en_US`, explicit `images`, article fields), `twitter` (`summary_large_image`). Explicit images are required because Next.js replaces the whole `openGraph` object per page.
- `src/app/layout.tsx`: `metadataBase`, default title/template, RSS alternate, viewport `themeColor`.
- Metadata routes (all `force-static` except the health route): `sitemap.ts`, `robots.ts`, `manifest.ts`, `opengraph-image.tsx` (`alt`, `size`, `contentType`), `icon.svg`, `feed.xml/route.ts`.
- `src/components/structured-data.tsx`: Person (`@id /#person`, `jobTitle`, `worksFor`, `knowsAbout` from skills, conditional `sameAs`/`email`) and WebSite (`author` → person). Serialised with `<` escaped to `\u003c`.
- Security headers in `next.config.ts` (CSP, HSTS, `X-Frame-Options: DENY`, nosniff, Referrer-Policy, Permissions-Policy; `poweredByHeader: false`).

## 5. File structure

| File | Responsibility |
| --- | --- |
| `src/config/site.ts` | Site URL, `absoluteUrl` |
| `src/lib/metadata.ts` | `buildMetadata` |
| `src/app/layout.tsx` | Root metadata defaults |
| `src/app/sitemap.ts`, `robots.ts`, `manifest.ts` | Metadata routes |
| `src/app/opengraph-image.tsx`, `icon.svg` | Image assets |
| `src/app/feed.xml/route.ts` | RSS |
| `src/components/structured-data.tsx` | Global JSON-LD |
| `src/app/blog/[slug]/page.tsx` | TechArticle JSON-LD |
| `next.config.ts` | Security headers |

## 6. Dependencies

- Internal: projects and blog data for sitemap/feed.
- Depended on by: every page.
- External: `next/og` (ImageResponse), Next metadata API.
- Environment: `NEXT_PUBLIC_SITE_URL` (build-time; baked into the image by the Docker build arg).

## 7. Design and UI

Open Graph image: dark background `#0B0D12`, monogram tile, eyebrow in brand cyan, headline, technology strip, company name. Icon is an SVG monogram.

## 8. Data and API

Endpoints and response shapes are listed in [../API_REFERENCE.md](../API_REFERENCE.md).

## 9. Technical decisions

ADR-001, ADR-003, ADR-006 in [../DECISIONS.md](../DECISIONS.md).

## 10. Testing

- E2E: `seo-and-headers.spec.ts` (sitemap includes published projects and excludes drafts, robots points at the sitemap and blocks `/api/`, feed/manifest/OG image served, health JSON, security headers on HTML, canonical + description + `og:image` on `/about`), `home.spec.ts` (Person and WebSite JSON-LD present).
- Executed 2026-09-29: passing. Search Console submission and rich-result validation have **not** been performed (site not live).

## 11. Current status

**Implemented.** Hostname spelling **Needs Confirmation**; DNS record existence unknown.

## 12. Future improvements

- Per-post Open Graph images with the article title.
- `lastModified` in the sitemap from git history instead of build time for static routes.

## 13. Update history

- 2026-09-29 — Initial documentation.
