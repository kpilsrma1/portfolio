import { describe, expect, it } from "vitest";

import { extractToc, formatDate, getAllTags, getPostBySlug, getPublishedPosts } from "@/lib/blog";

describe("blog content", () => {
  it("lists only published posts, newest first", async () => {
    const posts = await getPublishedPosts();
    expect(posts.length).toBeGreaterThan(0);
    expect(posts.every((post) => post.status === "published")).toBe(true);
    const dates = posts.map((post) => post.date);
    expect([...dates].sort().reverse()).toEqual(dates);
  });

  it("returns the published article with reading time and a table of contents", async () => {
    const post = await getPostBySlug("dockerizing-a-nextjs-application");
    expect(post).not.toBeNull();
    expect(post?.meta.title).toMatch(/Docker/);
    expect(post?.meta.readingTime).toMatch(/min read/);
    expect(post?.toc.some((entry) => entry.id === "the-dockerfile")).toBe(true);
  });

  it("hides drafts from direct lookup", async () => {
    const draft = await getPostBySlug("structuring-aspnet-core-applications");
    expect(draft).toBeNull();
  });

  it("rejects unsafe slugs without touching the filesystem", async () => {
    expect(await getPostBySlug("../package")).toBeNull();
    expect(await getPostBySlug("Upper Case")).toBeNull();
  });

  it("derives tags from published posts only", async () => {
    const tags = await getAllTags();
    expect(tags).toContain("docker");
    expect(tags).not.toContain("aspnet");
  });
});

describe("extractToc", () => {
  it("collects h2 and h3 headings and skips fenced code", () => {
    const toc = extractToc(
      [
        "# Title is ignored",
        "## First section",
        "Some text",
        "```bash",
        "## not a heading",
        "```",
        "### Nested *point*",
        "## First section",
      ].join("\n"),
    );

    expect(toc).toEqual([
      { id: "first-section", text: "First section", depth: 2 },
      { id: "nested-point", text: "Nested point", depth: 3 },
      { id: "first-section-1", text: "First section", depth: 2 },
    ]);
  });
});

describe("formatDate", () => {
  it("formats ISO dates in a readable long form", () => {
    expect(formatDate("2026-09-29")).toBe("29 September 2026");
  });
});
