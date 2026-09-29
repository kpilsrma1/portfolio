"use client";

import { useState } from "react";

import { ProjectCard } from "@/components/projects/project-card";
import type { Project } from "@/types/content";
import { cn } from "@/lib/utils";

interface ProjectFilterProps {
  projects: Project[];
  categories: string[];
}

const ALL = "All";

export function ProjectFilter({ projects, categories }: ProjectFilterProps) {
  const [active, setActive] = useState<string>(ALL);
  const visible = active === ALL ? projects : projects.filter((project) => project.category === active);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter projects by category">
        {[ALL, ...categories].map((category) => {
          const selected = category === active;
          return (
            <button
              key={category}
              type="button"
              aria-pressed={selected}
              onClick={() => setActive(category)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                selected
                  ? "border-brand/60 bg-brand/10 text-brand"
                  : "border-border text-foreground-secondary hover:border-border-strong hover:text-foreground",
              )}
            >
              {category}
            </button>
          );
        })}
      </div>

      <p className="sr-only" role="status">
        Showing {visible.length} of {projects.length} projects
      </p>

      {visible.length > 0 ? (
        <ul className="grid gap-6 md:grid-cols-2">
          {visible.map((project) => (
            <li key={project.slug}>
              <ProjectCard project={project} headingLevel="h2" />
            </li>
          ))}
        </ul>
      ) : (
        <p className="surface-card p-8 text-center text-foreground-secondary">No projects in this category yet.</p>
      )}
    </div>
  );
}
