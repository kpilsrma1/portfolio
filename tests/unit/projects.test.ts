import { describe, expect, it } from "vitest";

import {
  getFeaturedProjects,
  getProjectBySlug,
  getProjectCategories,
  getPublishedProjects,
  getRelatedProjects,
  projects,
} from "@/data/projects";

describe("project data", () => {
  it("has unique slugs", () => {
    const slugs = projects.map((project) => project.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("publishes confidential case studies without client names, demo links, or repository links", () => {
    for (const project of getPublishedProjects()) {
      if (project.confidential) {
        expect(project.demoUrl).toBeUndefined();
        expect(project.repositoryUrl).toBeUndefined();
      }
    }
  });

  it("does not claim numeric business metrics", () => {
    const text = JSON.stringify(projects);
    expect(text).not.toMatch(/\d+\s?%/);
    expect(text).not.toMatch(/\d+x faster/i);
  });

  it("looks up projects by slug and returns undefined for unknown slugs", () => {
    expect(getProjectBySlug("property-records-platform")?.title).toBe("Property Records Platform");
    expect(getProjectBySlug("does-not-exist")).toBeUndefined();
  });

  it("returns featured projects within the requested limit", () => {
    expect(getFeaturedProjects(2)).toHaveLength(2);
    expect(getFeaturedProjects().every((project) => project.featured)).toBe(true);
  });

  it("resolves related projects and excludes the current one", () => {
    const current = getProjectBySlug("veterinary-management-platform");
    expect(current).toBeDefined();
    const related = getRelatedProjects(current!);
    expect(related.length).toBeGreaterThan(0);
    expect(related.some((project) => project.slug === current!.slug)).toBe(false);
  });

  it("derives a de-duplicated category list", () => {
    const categories = getProjectCategories();
    expect(new Set(categories).size).toBe(categories.length);
    expect(categories).toContain("Records Platform");
  });
});
