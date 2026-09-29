import { PageHeader } from "@/components/page-header";
import { ProjectFilter } from "@/components/projects/project-filter";
import { getProjectCategories, getPublishedProjects } from "@/data/projects";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Projects",
  description:
    "Case studies from production business platforms: veterinary operations, travel management, and multi-tenant property records, built with .NET, React, and SQL Server.",
  path: "/projects",
});

export default function ProjectsPage() {
  const projects = getPublishedProjects();
  const categories = getProjectCategories();

  return (
    <>
      <PageHeader
        eyebrow="Projects"
        title="Case studies from production systems"
        description="Professional work on business platforms. Each case study is sanitised: no client names, internal URLs, or production data. Source code links appear only where a repository is public."
      />
      <section className="container-content py-14 md:py-20" aria-label="All projects">
        <ProjectFilter projects={projects} categories={categories} />
      </section>
    </>
  );
}
