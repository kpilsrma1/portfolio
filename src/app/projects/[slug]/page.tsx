import { ArrowLeftIcon, LockIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { Reveal } from "@/components/motion/reveal";
import { ArchitectureDiagram } from "@/components/projects/architecture-diagram";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectMockup } from "@/components/projects/project-mockup";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getProjectBySlug, getPublishedProjects, getRelatedProjects } from "@/data/projects";
import { buildMetadata } from "@/lib/metadata";
import type { ProjectSection } from "@/types/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return getPublishedProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};

  return buildMetadata({
    title: project.title,
    description: project.description,
    path: `/projects/${project.slug}`,
    type: "article",
  });
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const related = getRelatedProjects(project);

  return (
    <article>
      <header className="relative overflow-hidden border-b border-border">
        <div aria-hidden="true" className="grid-texture pointer-events-none absolute inset-0 opacity-60" />
        <div className="container-content relative grid gap-10 py-14 md:grid-cols-[1.2fr_1fr] md:items-center md:py-20">
          <Reveal>
            <Link
              href="/projects"
              className="inline-flex items-center gap-1.5 text-sm text-foreground-secondary transition-colors hover:text-foreground"
            >
              <ArrowLeftIcon aria-hidden="true" className="size-4" />
              All projects
            </Link>
            <p className="eyebrow mt-8">{project.category}</p>
            <h1 className="mt-4 text-h1 font-semibold text-foreground">{project.title}</h1>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-foreground-secondary">{project.subtitle}</p>
            <dl className="mt-8 grid grid-cols-2 gap-6 text-sm sm:grid-cols-3">
              <div>
                <dt className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">Role</dt>
                <dd className="mt-1.5 text-foreground">{project.role}</dd>
              </div>
              {project.duration ? (
                <div>
                  <dt className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">Duration</dt>
                  <dd className="mt-1.5 text-foreground">{project.duration}</dd>
                </div>
              ) : null}
              <div>
                <dt className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">Visibility</dt>
                <dd className="mt-1.5 inline-flex items-center gap-1.5 text-foreground">
                  {project.confidential ? (
                    <>
                      <LockIcon aria-hidden="true" className="size-3.5 text-muted-foreground" />
                      Confidential case study
                    </>
                  ) : (
                    "Public"
                  )}
                </dd>
              </div>
            </dl>
            {(project.demoUrl || project.repositoryUrl) && (
              <div className="mt-8 flex flex-wrap gap-3">
                {project.demoUrl ? (
                  <Button asChild>
                    <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                      Live demo
                    </a>
                  </Button>
                ) : null}
                {project.repositoryUrl ? (
                  <Button asChild variant="outline">
                    <a href={project.repositoryUrl} target="_blank" rel="noopener noreferrer">
                      Source code
                    </a>
                  </Button>
                ) : null}
              </div>
            )}
          </Reveal>
          <Reveal delay={0.1}>
            <ProjectMockup variant={project.mockup} title={project.title} className="shadow-[0_30px_60px_-40px_rgba(0,0,0,0.8)]" />
          </Reveal>
        </div>
      </header>

      <div className="container-content grid gap-12 py-14 lg:grid-cols-[1fr_18rem] lg:gap-16 lg:py-20">
        <div className="flex flex-col gap-14">
          <CaseSection id="overview" title="Overview">
            <p>{project.description}</p>
          </CaseSection>

          <CaseSection id="problem" title="Business problem">
            {project.businessProblem.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </CaseSection>

          <CaseSection id="workflow" title="Users and workflow">
            {project.usersAndWorkflow.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <ul className="mt-2 grid gap-2 sm:grid-cols-2">
              {project.functionalAreas.map((area) => (
                <li key={area} className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground">
                  {area}
                </li>
              ))}
            </ul>
          </CaseSection>

          <CaseSection id="contributions" title="My role and contributions">
            <p>
              Worked as a {project.role.toLowerCase()} within a team. The list below describes the areas I contributed to; it is
              scoped to what I worked on and does not represent the entire platform.
            </p>
            <ul className="flex flex-col gap-2.5">
              {project.contributions.map((item) => (
                <li key={item} className="flex gap-3">
                  <span aria-hidden="true" className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-brand" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CaseSection>

          <CaseSection id="stack" title="Technical stack">
            <ul className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <li key={tech}>
                  <Badge variant="outline" className="h-auto px-2.5 py-1 font-mono text-xs text-foreground">
                    {tech}
                  </Badge>
                </li>
              ))}
            </ul>
          </CaseSection>

          <CaseSection id="architecture" title="Architecture">
            <ArchitectureDiagram layers={project.architecture} title={project.title} />
          </CaseSection>

          <CaseSection id="challenges" title="Technical challenges">
            <SubSections sections={project.challenges} />
          </CaseSection>

          <CaseSection id="decisions" title="Design and engineering decisions">
            <SubSections sections={project.decisions} />
          </CaseSection>

          <CaseSection id="outcomes" title="Results and lessons learned">
            <ul className="flex flex-col gap-2.5">
              {project.outcomes.map((item) => (
                <li key={item} className="flex gap-3">
                  <span aria-hidden="true" className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-brand" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm text-muted-foreground">
              Quantified business metrics are not published for this engagement; the results above describe delivered functionality
              and engineering outcomes.
            </p>
          </CaseSection>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <nav aria-label="On this page" className="surface-card p-5">
            <p className="eyebrow">Contents</p>
            <ol className="mt-3 flex flex-col gap-1.5 text-sm">
              {[
                ["overview", "Overview"],
                ["problem", "Business problem"],
                ["workflow", "Users and workflow"],
                ["contributions", "Role and contributions"],
                ["stack", "Technical stack"],
                ["architecture", "Architecture"],
                ["challenges", "Challenges"],
                ["decisions", "Decisions"],
                ["outcomes", "Results"],
              ].map(([id, label]) => (
                <li key={id}>
                  <a href={`#${id}`} className="text-foreground-secondary transition-colors hover:text-foreground">
                    {label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>
      </div>

      {related.length > 0 ? (
        <section className="border-t border-border bg-surface/40" aria-labelledby="related-heading">
          <div className="container-content py-14 md:py-20">
            <p className="eyebrow">Related</p>
            <h2 id="related-heading" className="mt-3 text-h2 font-semibold text-foreground">
              More case studies
            </h2>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {related.map((item) => (
                <ProjectCard key={item.slug} project={item} />
              ))}
            </div>
            <div className="mt-10">
              <Button asChild variant="outline">
                <Link href="/projects">
                  <ArrowLeftIcon aria-hidden="true" data-icon="inline-start" />
                  Back to all projects
                </Link>
              </Button>
            </div>
          </div>
        </section>
      ) : null}
    </article>
  );
}

function CaseSection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-24">
      <h2 id={`${id}-heading`} className="text-h2 font-semibold text-foreground">
        {title}
      </h2>
      <div className="mt-5 flex flex-col gap-4 text-[1.0325rem] leading-relaxed text-foreground-secondary">{children}</div>
    </section>
  );
}

function SubSections({ sections }: { sections: ProjectSection[] }) {
  return (
    <div className="flex flex-col gap-6">
      {sections.map((section) => (
        <div key={section.heading} className="surface-card p-5 md:p-6">
          <h3 className="text-h3 font-semibold text-foreground">{section.heading}</h3>
          <div className="mt-3 flex flex-col gap-3">
            {section.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
