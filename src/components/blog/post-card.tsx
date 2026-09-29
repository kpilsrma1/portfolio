import Link from "next/link";

import type { BlogPostMeta } from "@/types/content";

interface PostCardProps {
  post: BlogPostMeta;
  headingLevel?: "h2" | "h3";
}

export function PostCard({ post, headingLevel: Heading = "h3" }: PostCardProps) {
  return (
    <article className="surface-card relative flex h-full flex-col gap-3 p-5 transition-colors hover:border-border-strong focus-within:border-brand/60 md:p-6">
      <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
        <time dateTime={post.date}>{formatShortDate(post.date)}</time>
        <span aria-hidden="true">·</span>
        <span>{post.readingTime}</span>
      </div>
      <Heading className="text-h3 font-semibold text-foreground">
        <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0 focus-visible:outline-none">
          {post.title}
        </Link>
      </Heading>
      <p className="text-sm leading-relaxed text-foreground-secondary">{post.description}</p>
      <ul className="mt-auto flex flex-wrap gap-1.5 pt-2" aria-label="Tags">
        {post.tags.map((tag) => (
          <li key={tag} className="rounded-md border border-border px-2 py-0.5 font-mono text-[0.7rem] text-muted-foreground">
            {tag}
          </li>
        ))}
      </ul>
    </article>
  );
}

function formatShortDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
