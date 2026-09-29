# Documentation index

This folder is the maintained knowledge base for the portfolio project. Source code is authoritative for implementation details; these documents explain it and record status, decisions, and procedures.

## Read in this order for context recovery

1. [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md) — what the site is, features, structure, constraints
2. [PROJECT_STATUS.md](PROJECT_STATUS.md) — what is done, what is blocked, next tasks
3. [ARCHITECTURE.md](ARCHITECTURE.md) — rendering model, data flow, component hierarchy, deployment topology
4. [TECH_STACK.md](TECH_STACK.md) — every dependency, its version, and why it is there
5. The relevant document under [modules/](modules/README.md)
6. [DECISIONS.md](DECISIONS.md), [API_REFERENCE.md](API_REFERENCE.md), [DATABASE.md](DATABASE.md), [DEPLOYMENT.md](DEPLOYMENT.md) as needed

## All documents

| Document | Contents |
| --- | --- |
| [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md) | Purpose, audience, features, repository layout, constraints |
| [ARCHITECTURE.md](ARCHITECTURE.md) | App Router structure, data flow, component tree, deployment architecture |
| [TECH_STACK.md](TECH_STACK.md) | Dependency inventory with versions and rationale |
| [DATABASE.md](DATABASE.md) | Statement that there is no database, and where content lives instead |
| [API_REFERENCE.md](API_REFERENCE.md) | Route handlers and the contact server action |
| [DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md) | Setup, scripts, conventions, adding content |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Docker, Compose, Ubuntu, Portainer, Nginx Proxy Manager, DNS, rollback |
| [SECURITY.md](SECURITY.md) | Headers, CSP, contact boundary, secrets handling |
| [TESTING.md](TESTING.md) | Unit and end-to-end suites, how to run them, last verified results |
| [DECISIONS.md](DECISIONS.md) | Architecture decision records |
| [SKILLS_AND_LEARNINGS.md](SKILLS_AND_LEARNINGS.md) | Skills used, problems solved, practices established |
| [PROJECT_STATUS.md](PROJECT_STATUS.md) | Progress tracker and open questions |
| [CHANGELOG.md](CHANGELOG.md) | Dated record of significant changes |
| [modules/](modules/README.md) | One document per implemented module |

## Conventions

- Unknown or unverified facts are marked **Needs Confirmation** or **Not Yet Verified**.
- No secrets, tokens, or private data appear in documentation; environment variables are named with placeholder values only.
- Documentation changes ship on the same branch and in the same commits as the code they describe.
