import type { SkillGroup } from "@/types/content";

/**
 * Skills grouped by area. Order within each group reflects depth of
 * professional use; the first entries are the ones used most.
 */
export const skillGroups: SkillGroup[] = [
  {
    id: "backend",
    name: "Backend",
    description: "Primary focus. APIs, business logic, and data access on the .NET platform.",
    skills: ["C#", "ASP.NET Core", "ASP.NET MVC", "Web API", "Entity Framework Core", "Dapper", "REST API design"],
  },
  {
    id: "frontend",
    name: "Frontend",
    description: "Component-based UIs with typed contracts against backend APIs.",
    skills: ["React", "TypeScript", "Angular", "JavaScript", "HTML5", "CSS3", "Tailwind CSS", "Bootstrap"],
  },
  {
    id: "databases",
    name: "Databases",
    description: "Schema design, query work, and data-driven workflows.",
    skills: ["SQL Server", "PostgreSQL", "MongoDB"],
  },
  {
    id: "devops",
    name: "DevOps and delivery",
    description: "Packaging, deploying, and running applications on Linux servers.",
    skills: ["Docker", "Docker Compose", "Git", "GitHub", "Linux", "Nginx", "CI/CD"],
  },
  {
    id: "architecture",
    name: "Architecture and practices",
    description: "Approaches used in production work rather than in isolation.",
    skills: ["Clean Architecture", "Multi-tenancy", "Database design", "Business workflow automation"],
  },
];

export const coreStack = [".NET", "React", "TypeScript", "SQL Server", "Docker"];
