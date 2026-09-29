import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

import { Reveal } from "@/components/motion/reveal";
import { ProjectCard } from "@/components/projects/project-card";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { getFeaturedProjects } from "@/data/projects";

export function FeaturedProjects() {
  const projects = getFeaturedProjects(4);

  return (
    <section className="container-content py-20 md:py-28" aria-labelledby="featured-projects-heading">
      <Reveal inView>
        <SectionHeading
          id="featured-projects-heading"
          eyebrow="Selected work"
          title="Case studies from production systems"
          description="Business platforms built for real operations. Each one is a sanitised professional case study describing the problem, the architecture, and the engineering decisions."
          action={
            <Button asChild variant="outline">
              <Link href="/projects">
                All projects
                <ArrowRightIcon aria-hidden="true" data-icon="inline-end" />
              </Link>
            </Button>
          }
        />
      </Reveal>
      <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project, index) => (
          <Reveal key={project.slug} inView delay={index * 0.06} className="h-full">
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
