import { RssIcon } from "lucide-react";

import { PostCard } from "@/components/blog/post-card";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { getAllTags, getPublishedPosts } from "@/lib/blog";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Blog",
  description: "Practical articles on .NET, React, databases, and deployment from production experience.",
  path: "/blog",
});

export default async function BlogPage() {
  const [posts, tags] = await Promise.all([getPublishedPosts(), getAllTags()]);

  return (
    <>
      <PageHeader
        eyebrow="Blog"
        title="Engineering notes"
        description="Practical, documentation-grounded articles on .NET, React, databases, and deployment. New pieces are added as they are finished and reviewed."
      >
        <Button asChild variant="outline">
          <a href="/feed.xml">
            <RssIcon aria-hidden="true" data-icon="inline-start" />
            RSS feed
          </a>
        </Button>
      </PageHeader>

      <section className="container-content py-14 md:py-20" aria-label="Articles">
        {tags.length > 0 ? (
          <ul className="mb-8 flex flex-wrap gap-2" aria-label="Topics">
            {tags.map((tag) => (
              <li key={tag} className="rounded-full border border-border px-3 py-1 font-mono text-xs text-muted-foreground">
                {tag}
              </li>
            ))}
          </ul>
        ) : null}

        {posts.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} headingLevel="h2" />
            ))}
          </div>
        ) : (
          <div className="surface-card p-8 text-center">
            <p className="font-medium text-foreground">No articles published yet.</p>
            <p className="mt-1 text-sm text-foreground-secondary">Drafts are in progress and will appear here once reviewed.</p>
          </div>
        )}
      </section>
    </>
  );
}
