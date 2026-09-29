# Projects and case studies

## 1. Purpose

Presents professional work as sanitised case studies: a filterable index at `/projects` and a long-form page per project at `/projects/[slug]`.

## 2. Business requirements

- Show three confidential business platforms (veterinary operations, travel management, multi-tenant property records) with no client names, internal URLs, production data, or invented metrics.
- Describe the business problem, users and workflow, the author's contributions (scoped, team-based), stack, architecture, challenges, decisions, and outcomes.
- Show demo/source links only when a public URL exists (none today).
- Return 404 for unknown or unpublished slugs.

## 3. Features

Implemented: category filter (All + categories) with `aria-pressed` and a live `role="status"` count; project cards with CSS mockups; case-study hero with role/duration/visibility facts; nine anchored sections with a sticky "Contents" nav; layered architecture diagram; related case studies by shared technologies; confidentiality notice on outcomes.

Planned: none.

## 4. Technical implementation

- Data: `src/data/projects.ts` exports the `projects` array and helpers `getPublishedProjects()`, `getFeaturedProjects(limit = 4)`, `getProjectBySlug(slug)`, `getRelatedProjects(project)`, `getProjectCategories()`. Type `Project` in `src/types/content.ts` includes `confidential`, `featured`, `status`, `contributionsVerified`, optional `duration`, `demoUrl`, `repositoryUrl`, `relatedSlugs`.
- `/projects` (`src/app/projects/page.tsx`): server component passes projects and categories to the client `ProjectFilter`.
- `/projects/[slug]` (`src/app/projects/[slug]/page.tsx`): `dynamicParams = false`, `generateStaticParams()` from published projects, `generateMetadata()` with `type: "article"`, `notFound()` when the slug is unknown. Sections are rendered by local `CaseSection` and `SubSections` helpers.
- `ProjectMockup` renders one of three CSS-only variants (`dashboard`, `workflow`, `records`); `ArchitectureDiagram` renders `ArchitectureLayer[]` as stacked layers.
- Duration is only rendered when `project.duration` is set (currently unset; engagement dates unverified).

## 5. File structure

| File | Responsibility |
| --- | --- |
| `src/data/projects.ts` | Case study content and query helpers |
| `src/app/projects/page.tsx` | Index page |
| `src/app/projects/[slug]/page.tsx` | Case study page |
| `src/components/projects/project-card.tsx` | Card (heading level configurable) |
| `src/components/projects/project-filter.tsx` | Client filter |
| `src/components/projects/project-mockup.tsx` | CSS mockups |
| `src/components/projects/architecture-diagram.tsx` | Architecture layers |
| `src/components/page-header.tsx` | Shared page header |

## 6. Dependencies

- Internal: `buildMetadata`, `Reveal`, `Badge`, `Button`, `PageHeader`.
- Depended on by: homepage (`FeaturedProjects`), sitemap.
- External: `lucide-react`.
- Environment: none.

## 7. Design and UI

Index grid: 2 columns from `md`. Case study: hero split `1.2fr/1fr` from `md`; body `1fr/18rem` with sticky aside from `lg`. Confidential badge uses a lock icon. Sections use `scroll-mt-24` so anchors clear the sticky header.

## 8. Data and API

Static TypeScript data. No endpoints. Published slugs: `veterinary-management-platform`, `travel-management-platform`, `property-records-platform`.

## 9. Technical decisions

ADR-002, ADR-003, ADR-009 in [../DECISIONS.md](../DECISIONS.md).

## 10. Testing

- Unit: `tests/unit/projects.test.ts` (helpers, slug lookup, categories, no URLs/metrics), `tests/unit/components/project-card.test.tsx`.
- E2E: `projects.spec.ts` (filter, card links, case study sections, contents nav, related, unknown slug 404), `accessibility.spec.ts`.
- Executed 2026-09-29: passing.

## 11. Current status

**Implemented.** `contributionsVerified` is `false` on all projects until the owner confirms the lists; `duration` is unset.

## 12. Future improvements

- Optional screenshots/diagrams if sanitised assets are approved.
- Tag-based filtering in addition to category.

## 13. Update history

- 2026-09-29 — Initial documentation.
