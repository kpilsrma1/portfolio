import type { ExperienceEntry } from "@/types/content";
import { siteConfig } from "@/config/site";

/**
 * Work history. Dates stay hidden until they are verified against the résumé.
 */
export const experience: ExperienceEntry[] = [
  {
    id: "lnp-infotech",
    company: siteConfig.currentCompany,
    title: siteConfig.employmentTitle,
    datesVerified: siteConfig.employmentDatesVerified,
    current: true,
    summary:
      "Full-stack development of business applications: backend APIs, frontend modules, database work, deployment, and ongoing maintenance.",
    highlights: [
      "Build business applications end to end across backend, frontend, and database layers.",
      "Implement backend REST APIs with C# and ASP.NET Core, and frontend modules with React, TypeScript, and Angular.",
      "Design and operate data-driven workflows on SQL Server and PostgreSQL, including query and schema work.",
      "Debug and resolve production issues, and maintain and improve existing systems.",
      "Handle client requirements, translate them into technical work, and deliver iteratively.",
      "Containerise and deploy applications with Docker and Nginx on Linux servers.",
    ],
    technologies: [
      "C#",
      "ASP.NET Core",
      "Entity Framework Core",
      "SQL Server",
      "PostgreSQL",
      "React",
      "TypeScript",
      "Angular",
      "Docker",
      "Nginx",
    ],
  },
];

export function getCurrentRole(): ExperienceEntry | undefined {
  return experience.find((entry) => entry.current);
}
