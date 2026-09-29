# Homepage

## 1. Purpose

The landing page (`/`) that summarises who Kapil is, shows featured case studies, expertise, current role, engineering principles, latest writing, and a contact call to action.

## 2. Business requirements

- Communicate the positioning "Building scalable software for real-world business problems." within the first viewport.
- Surface the three case studies and the technology stack without invented metrics.
- Drive to `/projects`, `/resume` (or PDF), and `/contact`.
- Load fast and remain readable in both themes and on mobile.

## 3. Features

Implemented: hero with eyebrow, headline, supporting copy, primary/secondary CTAs, technology strip, and a CSS-only "request lifecycle" panel; featured projects grid (3 cards); expertise groups (5); experience preview with "Current" badge; six principles; latest published article; contact CTA. Sections animate in with `Reveal`.

Planned: none.

## 4. Technical implementation

- `src/app/page.tsx` composes section components in order: `Hero`, `FeaturedProjects`, `Expertise`, `ExperiencePreview`, `Principles`, `Writing`, `ContactCta`. `Writing` is async (reads posts).
- Data sources: `siteConfig.hero`, `getFeaturedProjects()`, `skillGroups` from `src/data/skills.ts`, `getCurrentRole()`, `principles`, `getPublishedPosts()` (first item), `siteConfig.contactCta`.
- Each section uses `SectionHeading` (with `id` for anchor targets) and `container-content`.
- `Reveal` (client) wraps card groups; server sections stay server components.

## 5. File structure

| File | Responsibility |
| --- | --- |
| `src/app/page.tsx` | Page composition |
| `src/components/sections/hero.tsx` | Hero and decorative panel |
| `src/components/sections/featured-projects.tsx` | Featured `ProjectCard` grid |
| `src/components/sections/expertise.tsx` | Skill groups as badge lists |
| `src/components/sections/experience-preview.tsx` | Current role summary |
| `src/components/sections/principles.tsx` | Numbered principles |
| `src/components/sections/writing.tsx` | Latest article(s) via `PostCard` |
| `src/components/sections/contact-cta.tsx` | Closing CTA |
| `src/components/section-heading.tsx` | Shared heading block |
| `src/components/motion/reveal.tsx` | In-view animation wrapper |

## 6. Dependencies

- Internal: projects, profile data, blog lib, layout module.
- Depended on by: none.
- External: `motion`, `lucide-react`.
- Environment: none.

## 7. Design and UI

Two-column hero from `lg`, single column below; the decorative panel is `aria-hidden`. Grid of three cards collapses to one column on mobile. Eyebrows use the `eyebrow` utility (mono, tracked, brand colour). Headline uses `text-display` clamp size.

## 8. Data and API

Read-only from config/data. No endpoints.

## 9. Technical decisions

ADR-002, ADR-003, ADR-009 in [../DECISIONS.md](../DECISIONS.md).

## 10. Testing

- E2E: `home.spec.ts` (title, h1, CTA, card count, footer, JSON-LD, skip link), `accessibility.spec.ts` (`/`).
- Executed 2026-09-29: passing.

## 11. Current status

**Implemented.**

## 12. Future improvements

- Testimonials section if quotes are ever authorised.
- Metrics strip if real, permitted numbers become available.

## 13. Update history

- 2026-09-29 — Initial documentation.
