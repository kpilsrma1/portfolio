import type { Project } from "@/types/content";

/**
 * Professional case studies.
 *
 * All three platforms were built for employers or their clients and are
 * confidential. Descriptions are sanitised: no client names, internal URLs,
 * production screenshots, customer data, or unmeasured business metrics.
 * Contribution lists are written at a functional level and remain flagged as
 * unverified until they are checked against the résumé.
 */
export const projects: Project[] = [
  {
    slug: "veterinary-management-platform",
    title: "Veterinary Management and Reporting Platform",
    subtitle: "Operational workflows for veterinary services, testing, and reporting",
    description:
      "A business platform that runs veterinary service operations: user management, test and report workflows, orders and requisitions, tasks, payments, and client records.",
    category: "Operations Platform",
    mockup: "dashboard",
    technologies: [
      "C#",
      "ASP.NET Core",
      "REST APIs",
      "Entity Framework Core",
      "SQL Server",
      "React",
      "TypeScript",
    ],
    role: "Full-stack developer",
    confidential: true,
    featured: true,
    status: "published",
    contributionsVerified: false,
    businessProblem: [
      "Veterinary service operations involve many connected records: the animals and sites being served, the tests requested, the reports produced, the orders and requisitions that authorise work, and the payments that close the loop. Handling these across spreadsheets and disconnected tools makes it hard to see the status of any single case.",
      "The platform brings those workflows into one system so that internal staff and external users each see the records relevant to them, work moves through defined stages, and history is preserved for reporting.",
    ],
    usersAndWorkflow: [
      "Internal users manage services, tests, orders, tasks, and reporting. External users interact with the records that belong to them, such as requisitions, reports, and payments.",
      "A typical flow starts with a requisition or order, moves through task activities and testing, produces a report, and ends with payment and archived history.",
    ],
    functionalAreas: [
      "Internal and external user management",
      "Veterinary services",
      "Test and report workflows",
      "Wells and orders",
      "Requisitions",
      "Task activities",
      "Opportunities",
      "Reports and history",
      "Payments",
      "Client management",
    ],
    contributions: [
      "Implemented backend REST endpoints and Entity Framework Core data access for operational modules including orders, requisitions, and task activities.",
      "Built React and TypeScript screens for record management, list and detail views, and status-driven workflows.",
      "Worked on report and history features that read across multiple related entities.",
      "Investigated and fixed production defects, and maintained existing modules as requirements changed.",
    ],
    architecture: [
      { name: "Clients", items: ["Internal staff web app", "External user web app"] },
      { name: "Frontend", items: ["React", "TypeScript", "REST client"] },
      { name: "API", items: ["ASP.NET Core Web API", "Validation", "Authorisation by user type"] },
      { name: "Data", items: ["Entity Framework Core", "SQL Server"] },
    ],
    challenges: [
      {
        heading: "Two audiences on one data model",
        body: [
          "Internal and external users need different views of overlapping records. Rather than duplicating screens, the API exposes the same resources with authorisation rules that decide which fields and actions are available to each user type.",
        ],
      },
      {
        heading: "Status-driven workflows",
        body: [
          "Requisitions, tests, and reports each move through statuses that unlock or block later steps. Keeping those transitions consistent between the API and the UI required the rules to live server-side, with the frontend reflecting rather than deciding state.",
        ],
      },
    ],
    decisions: [
      {
        heading: "Entity Framework Core for the primary data layer",
        body: [
          "The domain has many related entities and frequent schema evolution. EF Core migrations and LINQ queries kept the data layer readable and made changes safer than hand-written SQL for the majority of operations.",
        ],
      },
      {
        heading: "Typed API contracts",
        body: [
          "Request and response models are explicit DTOs rather than entity types, which keeps the database schema out of the public contract and lets the frontend rely on stable shapes.",
        ],
      },
    ],
    outcomes: [
      "Delivered operational modules that run day-to-day veterinary service workflows in one system.",
      "Established a pattern of explicit DTOs and server-side status rules that later modules followed.",
      "Reinforced the value of keeping authorisation logic close to the data rather than in the UI.",
    ],
    relatedSlugs: ["travel-management-platform", "property-records-platform"],
  },
  {
    slug: "travel-management-platform",
    title: "Travel Management Platform",
    subtitle: "Tours, reservations, invoicing, and task coordination for a travel business",
    description:
      "A business application for travel operations covering tours and groups, reservations, invoices, tasks, and integrations with external services and payment providers.",
    category: "Business Platform",
    mockup: "workflow",
    technologies: [
      "C#",
      "ASP.NET Core",
      "REST APIs",
      "SQL Server",
      "JavaScript",
      "Bootstrap",
      "Payment integration",
    ],
    role: "Full-stack developer",
    confidential: true,
    featured: true,
    status: "published",
    contributionsVerified: false,
    businessProblem: [
      "Travel operations combine scheduling, capacity, money, and people. A tour has groups, groups have reservations, reservations produce invoices, and every step generates tasks for staff. When those live in separate tools, double bookings and missed follow-ups are common.",
      "The platform models those relationships directly so that a reservation, its invoice, and its follow-up tasks are always connected.",
    ],
    usersAndWorkflow: [
      "Operations staff create tours and groups, manage reservations against available capacity, issue invoices, and track tasks.",
      "External APIs and payment providers feed data in and out: reference data from third-party services, and payment status from the provider back into invoices.",
    ],
    functionalAreas: [
      "Tours and groups",
      "Reservations",
      "Invoices",
      "Tasks",
      "External API integrations",
      "Payment integrations",
    ],
    contributions: [
      "Developed backend services and endpoints for reservation and invoice workflows.",
      "Integrated external APIs and payment providers, including handling asynchronous status updates.",
      "Built and maintained frontend screens for operational staff.",
      "Handled client requirement changes and resolved production issues in existing modules.",
    ],
    architecture: [
      { name: "Clients", items: ["Operations staff web app"] },
      { name: "Application", items: ["ASP.NET Core", "Business rules", "Background processing for integrations"] },
      { name: "Integrations", items: ["External travel APIs", "Payment provider webhooks"] },
      { name: "Data", items: ["SQL Server"] },
    ],
    challenges: [
      {
        heading: "Payment state that arrives late",
        body: [
          "Payment providers confirm asynchronously. Invoices had to tolerate a pending state, reconcile provider callbacks idempotently, and surface failures to staff instead of silently staying unpaid.",
        ],
      },
      {
        heading: "Third-party data that does not match your model",
        body: [
          "External APIs return shapes and identifiers that differ from the internal model. Mapping happens at the integration boundary so the rest of the application only sees its own types.",
        ],
      },
    ],
    decisions: [
      {
        heading: "Isolate integrations behind adapters",
        body: [
          "Each external service is wrapped in a small adapter with a typed interface. Swapping a provider or handling an API change touches one place, and the core workflow code stays free of vendor details.",
        ],
      },
    ],
    outcomes: [
      "Connected reservations, invoicing, and tasks into a single operational flow.",
      "Produced reusable integration patterns for payment callbacks and external API mapping.",
    ],
    relatedSlugs: ["veterinary-management-platform", "property-records-platform"],
  },
  {
    slug: "property-records-platform",
    title: "Property Records Platform",
    subtitle: "Multi-tenant records system with a .NET 8 API and a React TypeScript frontend",
    description:
      "A property records application built on a .NET 8 API using Clean Architecture, SQL Server, and multi-tenancy, with a React and TypeScript frontend.",
    category: "Records Platform",
    mockup: "records",
    technologies: [
      "C#",
      ".NET 8",
      "ASP.NET Core Web API",
      "Clean Architecture",
      "Multi-tenancy",
      "SQL Server",
      "React",
      "TypeScript",
    ],
    role: "Full-stack developer",
    confidential: true,
    featured: true,
    status: "published",
    contributionsVerified: false,
    businessProblem: [
      "Property records need to be accurate, searchable, and strictly separated between the organisations that own them. The same application serves multiple tenants, so every query and every write must be scoped to the correct tenant without relying on developers remembering to add a filter.",
    ],
    usersAndWorkflow: [
      "Users belonging to a tenant manage that tenant's property records: creating and updating entries, searching, and reviewing history.",
      "Tenant context is resolved at the API boundary and flows through the application so that data access is scoped automatically.",
    ],
    functionalAreas: [
      "Tenant-scoped property records",
      "Search and filtering",
      "Record history",
      "Tenant and user administration",
    ],
    contributions: [
      "Worked within a Clean Architecture solution structure: domain, application, infrastructure, and API layers with dependencies pointing inward.",
      "Implemented tenant-scoped data access on SQL Server so queries are filtered by tenant by default.",
      "Built React and TypeScript frontend features backed by typed API contracts.",
      "Contributed to API design and validation for record management endpoints.",
    ],
    architecture: [
      { name: "Frontend", items: ["React", "TypeScript", "Typed API client"] },
      { name: "API", items: [".NET 8 Web API", "Tenant resolution", "Request validation"] },
      { name: "Application and Domain", items: ["Use cases", "Domain entities", "Interfaces"] },
      { name: "Infrastructure", items: ["SQL Server", "Tenant-filtered data access"] },
    ],
    challenges: [
      {
        heading: "Tenant isolation without repetition",
        body: [
          "Adding a tenant filter to every query by hand is fragile. The data layer applies tenant scoping centrally so that a forgotten filter is not possible for standard queries, and cross-tenant operations have to be explicit.",
        ],
      },
    ],
    decisions: [
      {
        heading: "Clean Architecture layering",
        body: [
          "Business rules live in the application and domain layers with no dependency on the web framework or database. That keeps use cases testable and makes infrastructure choices replaceable.",
          "The trade-off is more files and mapping code than a single-project API. For a records system expected to grow, the separation paid for itself in clarity.",
        ],
      },
      {
        heading: "Shared schema with tenant discriminator",
        body: [
          "A single SQL Server database with a tenant key on tenant-owned tables kept operations simple while still enforcing isolation in the data layer. A database-per-tenant model was considered and set aside for the initial scope.",
        ],
      },
    ],
    outcomes: [
      "A layered .NET 8 codebase where tenant isolation is a property of the data layer rather than of individual queries.",
      "A working model for pairing a Clean Architecture API with a typed React frontend that later work can reuse.",
    ],
    relatedSlugs: ["veterinary-management-platform", "travel-management-platform"],
  },
];

export function getPublishedProjects(): Project[] {
  return projects.filter((project) => project.status === "published");
}

export function getFeaturedProjects(limit = 4): Project[] {
  return getPublishedProjects()
    .filter((project) => project.featured)
    .slice(0, limit);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return getPublishedProjects().find((project) => project.slug === slug);
}

export function getRelatedProjects(project: Project): Project[] {
  return project.relatedSlugs
    .map((slug) => getProjectBySlug(slug))
    .filter((related): related is Project => Boolean(related));
}

export function getProjectCategories(): string[] {
  return Array.from(new Set(getPublishedProjects().map((project) => project.category)));
}
