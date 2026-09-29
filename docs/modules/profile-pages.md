# Profile pages: About, Experience, Uses

## 1. Purpose

Static pages describing the person behind the work: background and education (`/about`), role history (`/experience`), and tooling (`/uses`). `/privacy` and the custom 404 are covered here as well because they share the same page-header pattern.

## 2. Business requirements

- Present only verified facts: MCA and B.Sc. Computer Science (68%), 3.5 years, current role at LnP Infotech Pvt. Ltd.
- Hide employment dates and location until verified/supplied.
- Provide a privacy statement that reflects actual data handling (no analytics, no cookies beyond theme preference in `localStorage`, contact data used only to reply).
- Friendly 404 with routes back into the site.

## 3. Features

Implemented: About (introduction paragraphs, skill groups, education, principles, CTA); Experience (timeline with "Current" badge, highlights, technology badges, hidden date range); Uses (categorised tools with notes); Privacy (plain-language policy); 404 (`not-found.tsx`).

Planned: none.

## 4. Technical implementation

- All pages are server components exporting `metadata = buildMetadata(...)`.
- `ExperienceTimeline` renders `experience` entries; `dateRange` shows only when `datesVerified` is true (mirrors `siteConfig.employmentDatesVerified`), otherwise the label reads "Current" or "Past role".
- Data files: `src/data/skills.ts` (`skillGroups`), `src/data/education.ts`, `src/data/principles.ts`, `src/data/uses.ts`, `src/data/experience.ts` (`experience`, `getCurrentRole()`).
- `not-found.tsx` returns HTTP 404 via Next's convention; used by unknown slugs in projects and blog too.

## 5. File structure

| File | Responsibility |
| --- | --- |
| `src/app/about/page.tsx` | About page |
| `src/app/experience/page.tsx` | Experience page |
| `src/app/uses/page.tsx` | Uses page |
| `src/app/privacy/page.tsx` | Privacy statement |
| `src/app/not-found.tsx` | 404 page |
| `src/components/experience-timeline.tsx` | Timeline |
| `src/components/page-header.tsx` | Header block with eyebrow/title/description/children |
| `src/data/{experience,skills,education,principles,uses}.ts` | Content |

## 6. Dependencies

- Internal: `siteConfig`, `buildMetadata`, `Badge`, `Button`, `Reveal`.
- Depended on by: homepage sections (skills, principles, current role).
- External: `lucide-react`.
- Environment: none.

## 7. Design and UI

Single-column reading width with `surface-card` blocks; timeline uses a left rail with brand dots. Mobile stacks everything.

## 8. Data and API

Static TypeScript data. No endpoints.

## 9. Technical decisions

ADR-002, ADR-003 in [../DECISIONS.md](../DECISIONS.md).

## 10. Testing

- Unit: `tests/unit/site-config.test.ts` (site URL normalisation, absolute URL building, social links only when configured, unique rooted navigation hrefs).
- E2E: `content-pages.spec.ts` (about without unverified dates, résumé not-published state), `navigation.spec.ts` (Experience via primary nav; Uses, Privacy, Résumé via footer), `projects.spec.ts` (custom 404), `accessibility.spec.ts` (`/about`).
- Executed 2026-09-29: passing.

## 11. Current status

**Implemented.** Awaiting: employment `dateRange`, `location`, and the owner's review of wording.

## 12. Future improvements

- Downloadable vCard once contact details are public.
- Certifications section only if real certifications are supplied.

## 13. Update history

- 2026-09-29 — Initial documentation.
