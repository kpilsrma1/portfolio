import { ArrowUpRightIcon, LockIcon } from "lucide-react";
import Link from "next/link";

import { ProjectMockup } from "@/components/projects/project-mockup";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/types/content";

interface ProjectCardProps {
  project: Project;
  headingLevel?: "h2" | "h3";
}

export function ProjectCard({ project, headingLevel: Heading = "h3" }: ProjectCardProps) {
  const href = `/projects/${project.slug}`;

  return (
    <article
      data-testid="project-card"
      className="surface-card group relative flex h-full flex-col overflow-hidden transition-colors hover:border-border-strong focus-within:border-brand/60"
    >
      <ProjectMockup variant={project.mockup} title={project.title} className="rounded-none border-0 border-b" />
      <div className="flex flex-1 flex-col gap-4 p-5 md:p-6">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-mono uppercase tracking-[0.14em] text-muted-foreground">{project.category}</span>
          {project.confidential ? (
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <LockIcon aria-hidden="true" className="size-3" />
              Confidential
            </span>
          ) : null}
        </div>
        <div>
          <Heading className="text-h3 font-semibold text-foreground">
            <Link href={href} className="after:absolute after:inset-0 focus-visible:outline-none">
              {project.title}
            </Link>
          </Heading>
          <p className="mt-2 text-sm leading-relaxed text-foreground-secondary md:text-[0.95rem]">{project.description}</p>
        </div>
        <ul className="flex flex-wrap gap-1.5" aria-label="Technologies">
          {project.technologies.slice(0, 5).map((tech) => (
            <li key={tech}>
              <Badge variant="outline" className="font-mono text-[0.7rem] text-foreground-secondary">
                {tech}
              </Badge>
            </li>
          ))}
        </ul>
        <div className="mt-auto flex items-center gap-4 pt-2 text-sm font-medium">
          <span className="inline-flex items-center gap-1 text-brand">
            Case study
            <ArrowUpRightIcon aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
          {project.repositoryUrl ? (
            <a href={project.repositoryUrl} target="_blank" rel="noopener noreferrer" className="relative z-10 text-foreground-secondary hover:text-foreground">
              GitHub
            </a>
          ) : null}
          {project.demoUrl ? (
            <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="relative z-10 text-foreground-secondary hover:text-foreground">
              Live demo
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
