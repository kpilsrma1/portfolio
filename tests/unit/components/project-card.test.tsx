import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProjectCard } from "@/components/projects/project-card";
import { getProjectBySlug } from "@/data/projects";

describe("ProjectCard", () => {
  const project = getProjectBySlug("property-records-platform")!;

  it("links the title to the case study and shows the confidential marker", () => {
    render(<ProjectCard project={project} />);

    const card = screen.getByTestId("project-card");
    const link = within(card).getByRole("link", { name: project.title });
    expect(link).toHaveAttribute("href", `/projects/${project.slug}`);
    expect(within(card).getByText("Confidential")).toBeInTheDocument();
    expect(within(card).queryByRole("link", { name: /github/i })).not.toBeInTheDocument();
    expect(within(card).queryByRole("link", { name: /live demo/i })).not.toBeInTheDocument();
  });

  it("shows at most five technologies", () => {
    render(<ProjectCard project={project} />);
    const list = screen.getByRole("list", { name: "Technologies" });
    expect(within(list).getAllByRole("listitem").length).toBeLessThanOrEqual(5);
  });

  it("renders external links only when a repository or demo URL exists", () => {
    render(
      <ProjectCard
        project={{ ...project, confidential: false, repositoryUrl: "https://github.test/repo", demoUrl: "https://demo.test" }}
      />,
    );
    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute("rel", "noopener noreferrer");
    expect(screen.getByRole("link", { name: "Live demo" })).toHaveAttribute("target", "_blank");
  });
});
