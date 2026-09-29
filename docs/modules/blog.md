# Blog

## 1. Purpose

Publishes technical articles from MDX files in `content/blog` at `/blog` and `/blog/[slug]`, with an RSS feed at `/feed.xml`.

## 2. Business requirements

- Articles are authored as files in the repository; no CMS.
- Drafts must never appear on the index, post routes, sitemap, feed, or homepage.
- Code samples must be readable in both themes; headings must be linkable with a table of contents.
- Each post needs title, description, date, tags, status.

## 3. Features

Implemented: index with published posts newest first and tag list; post page with date, reading time, author, tags, compiled MDX (GFM, heading ids, Shiki highlighting), sticky table of contents (h2/h3), related posts by tag overlap, `TechArticle` JSON-LD; RSS 2.0 feed. One post is published (`dockerizing-a-nextjs-application`); four are drafts.

Planned: none.

## 4. Technical implementation

- `src/lib/blog.ts` (`server-only`): `getPublishedPosts()`, `getPostBySlug(slug)` (rejects unsafe slugs, returns `null` for drafts/missing), `getRelatedPosts(meta, limit = 2)`, `getAllTags()`, `extractToc(content)` (skips fenced code, mirrors rehype-slug ids with duplicate suffixes), `formatDate(iso)` (en-GB, UTC). Frontmatter is validated by `normaliseFrontmatter`, which throws at build time when title/description/date are missing; unknown `status` values are treated as `draft`.
- `src/app/blog/[slug]/page.tsx`: `dynamicParams = false`, `generateStaticParams()`, `generateMetadata()` with article Open Graph fields, `compileMDX` from `next-mdx-remote/rsc` with `remarkGfm`, `rehypeSlug`, `rehypePrettyCode` (`github-dark-default` / `github-light-default`, `keepBackground: false`, `defaultLang: "plaintext"`).
- `src/components/blog/mdx-components.tsx` maps MDX elements to styled components; `TableOfContents` renders `TocEntry[]`; `PostCard` is shared with the homepage.
- Theme-aware code colours via `globals.css`: `.prose-article code[data-theme] span { color: var(--shiki-dark) }` and `.light … { color: var(--shiki-light) }`.

## 5. File structure

| File | Responsibility |
| --- | --- |
| `content/blog/*.mdx` | Articles (frontmatter + MDX) |
| `src/lib/blog.ts` | Reading, filtering, TOC, dates |
| `src/app/blog/page.tsx` | Index |
| `src/app/blog/[slug]/page.tsx` | Post page |
| `src/app/feed.xml/route.ts` | RSS feed |
| `src/components/blog/mdx-components.tsx` | MDX element mapping |
| `src/components/blog/post-card.tsx` | Card |
| `src/components/blog/table-of-contents.tsx` | TOC |

## 6. Dependencies

- Internal: `buildMetadata`, `absoluteUrl`, `siteConfig`.
- Depended on by: homepage `Writing`, sitemap, feed.
- External: `next-mdx-remote`, `gray-matter`, `reading-time`, `remark-gfm`, `rehype-slug`, `rehype-pretty-code`, `shiki`.
- Environment: none.

## 7. Design and UI

Post layout `minmax(0,1fr)/16rem` from `lg`; the TOC sits first on mobile (`order-first`). Prose styles live under `.prose-article` in `globals.css` (heading anchors inherit colour, brand on hover).

## 8. Data and API

Frontmatter schema (`BlogFrontmatter`): `title`, `description`, `date` (YYYY-MM-DD), `tags[]`, `status` (`published` | `draft`), optional `author`, `updated`. Feed endpoint documented in [../API_REFERENCE.md](../API_REFERENCE.md).

## 9. Technical decisions

ADR-002 in [../DECISIONS.md](../DECISIONS.md).

## 10. Testing

- Unit: `tests/unit/blog.test.ts` (published filter, draft exclusion, slug safety, TOC extraction, date formatting).
- E2E: `content-pages.spec.ts` (index lists only published articles, post renders MDX with highlighted code, draft slug returns 404), `seo-and-headers.spec.ts` (feed served with an item), `accessibility.spec.ts` (blog routes). TOC jumps, theme-dependent code colours, and TechArticle JSON-LD were checked manually in the browser on 2026-09-29 and are not yet covered by automated tests.
- Executed 2026-09-29: passing.

## 11. Current status

**Implemented.** Draft articles need review before switching `status` to `published`.

## 12. Future improvements

- Tag pages (`/blog/tags/[tag]`).
- Pagination if the index grows beyond one screen.
- Estimated "updated" surfacing in the index.

## 13. Update history

- 2026-09-29 — Initial documentation.
