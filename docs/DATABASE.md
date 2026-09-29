# Database

## There is no database

This project deliberately has no database, ORM, migrations, or persistent storage of any kind. Nothing in the codebase opens a connection, and `docker-compose.yml` defines a single `portfolio` service with no volumes.

## Where content lives instead

| Content | Location | Type definitions |
| --- | --- | --- |
| Profile facts, navigation, URLs | `src/config/site.ts` | inline `siteConfig` |
| Projects and case studies | `src/data/projects.ts` | `Project` in `src/types/content.ts` |
| Experience entries | `src/data/experience.ts` | `ExperienceEntry` |
| Skill groups | `src/data/skills.ts` | `SkillGroup` |
| Education | `src/data/education.ts` | `EducationEntry` |
| Engineering principles | `src/data/principles.ts` | `Principle` |
| Tools ("uses") | `src/data/uses.ts` | `UsesCategory` |
| Blog articles | `content/blog/*.mdx` with frontmatter | `BlogFrontmatter`, `BlogPostMeta` |

All of it is read at build time; the running container serves prerendered output.

## Runtime state

The contact server action keeps an in-memory sliding-window rate limiter (`Map<string, number[]>` in `src/lib/contact.ts`). It is process-local, resets on restart, and is not shared between replicas. This is acceptable for a single-container deployment and is documented in [SECURITY.md](SECURITY.md).

## If a database is ever introduced

Record the decision in [DECISIONS.md](DECISIONS.md), update this file with the schema and migration approach, add the service to `docker-compose.yml`, and extend [DEPLOYMENT.md](DEPLOYMENT.md) with backup and rollback steps. Until then, this document intentionally stays short.
