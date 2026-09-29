import type { UsesCategory } from "@/types/content";

/**
 * Tools and technologies in actual day-to-day use. Editor, hardware, and
 * personal preferences are left out until the owner supplies them.
 */
export const uses: UsesCategory[] = [
  {
    name: "Backend",
    items: [
      { name: "C# and .NET", note: "Primary platform for APIs and business logic, including .NET 8." },
      { name: "ASP.NET Core Web API and MVC", note: "REST endpoints and server-rendered applications." },
      { name: "Entity Framework Core", note: "Default data access layer with migrations." },
      { name: "Dapper", note: "For hot paths and reporting queries where explicit SQL is clearer." },
    ],
  },
  {
    name: "Frontend",
    items: [
      { name: "React with TypeScript", note: "Component-based UIs with typed API contracts." },
      { name: "Angular", note: "Used on projects that standardised on it." },
      { name: "Tailwind CSS and Bootstrap", note: "Utility-first styling on new work; Bootstrap on existing systems." },
    ],
  },
  {
    name: "Data",
    items: [
      { name: "SQL Server", note: "Main relational database in professional work." },
      { name: "PostgreSQL", note: "Relational alternative on projects that call for it." },
      { name: "MongoDB", note: "Document storage where the data shape suits it." },
    ],
  },
  {
    name: "Delivery and operations",
    items: [
      { name: "Docker and Docker Compose", note: "Packaging applications and running them consistently." },
      { name: "Nginx and Nginx Proxy Manager", note: "Reverse proxy and TLS termination in front of containers." },
      { name: "Linux (Ubuntu)", note: "Server environment for deployments." },
      { name: "Git and GitHub", note: "Version control and collaboration." },
    ],
  },
];
