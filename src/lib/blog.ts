import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";

import matter from "gray-matter";
import readingTime from "reading-time";

import type { BlogFrontmatter, BlogPostMeta, TocEntry } from "@/types/content";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export interface BlogPost {
  meta: BlogPostMeta;
  content: string;
  toc: TocEntry[];
}

/**
 * Reads every MDX file in `content/blog` and returns the published posts,
 * newest first. Drafts are excluded here so that routes, feeds, and the
 * sitemap all share the same filter.
 */
export async function getPublishedPosts(): Promise<BlogPostMeta[]> {
  const all = await readAllPosts();
  return all
    .filter((post) => post.meta.status === "published")
    .map((post) => post.meta)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!isSafeSlug(slug)) return null;

  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  let raw: string;
  try {
    raw = await fs.readFile(filePath, "utf8");
  } catch {
    return null;
  }

  const post = parsePost(slug, raw);
  return post.meta.status === "published" ? post : null;
}

export async function getRelatedPosts(current: BlogPostMeta, limit = 2): Promise<BlogPostMeta[]> {
  const posts = await getPublishedPosts();
  return posts
    .filter((post) => post.slug !== current.slug)
    .map((post) => ({
      post,
      overlap: post.tags.filter((tag) => current.tags.includes(tag)).length,
    }))
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, limit)
    .map(({ post }) => post);
}

export async function getAllTags(): Promise<string[]> {
  const posts = await getPublishedPosts();
  return Array.from(new Set(posts.flatMap((post) => post.tags))).sort();
}

async function readAllPosts(): Promise<BlogPost[]> {
  let entries: string[];
  try {
    entries = await fs.readdir(BLOG_DIR);
  } catch {
    return [];
  }

  const files = entries.filter((name) => name.endsWith(".mdx"));
  return Promise.all(
    files.map(async (file) => {
      const raw = await fs.readFile(path.join(BLOG_DIR, file), "utf8");
      return parsePost(file.replace(/\.mdx$/, ""), raw);
    }),
  );
}

function parsePost(slug: string, raw: string): BlogPost {
  const { data, content } = matter(raw);
  const frontmatter = normaliseFrontmatter(slug, data);
  const stats = readingTime(content);

  return {
    meta: {
      ...frontmatter,
      slug,
      readingTime: stats.text,
      wordCount: stats.words,
    },
    content,
    toc: extractToc(content),
  };
}

function normaliseFrontmatter(slug: string, data: Record<string, unknown>): BlogFrontmatter {
  const title = typeof data.title === "string" ? data.title : null;
  const description = typeof data.description === "string" ? data.description : null;
  const date = toIsoDate(data.date);

  if (!title || !description || !date) {
    throw new Error(`Blog post "${slug}" is missing a title, description, or date in its frontmatter.`);
  }

  return {
    title,
    description,
    date,
    updated: toIsoDate(data.updated) ?? undefined,
    tags: Array.isArray(data.tags) ? data.tags.filter((tag): tag is string => typeof tag === "string") : [],
    status: data.status === "published" ? "published" : "draft",
    author: typeof data.author === "string" ? data.author : undefined,
  };
}

function toIsoDate(value: unknown): string | null {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10);
  return null;
}

/**
 * Collects h2 and h3 headings, skipping fenced code blocks, and derives the
 * same ids that rehype-slug produces.
 */
export function extractToc(content: string): TocEntry[] {
  const entries: TocEntry[] = [];
  const seen = new Map<string, number>();
  let inFence = false;

  for (const line of content.split("\n")) {
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match) continue;

    const depth = match[1].length as 2 | 3;
    const text = match[2].replace(/[*_`]/g, "");
    let id = slugify(text);
    const count = seen.get(id) ?? 0;
    seen.set(id, count + 1);
    if (count > 0) id = `${id}-${count}`;

    entries.push({ id, text, depth });
  }

  return entries;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

function isSafeSlug(slug: string): boolean {
  return /^[a-z0-9-]+$/.test(slug);
}

export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
