import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

import { PostCard } from "@/components/blog/post-card";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import type { BlogPostMeta } from "@/types/content";

interface WritingProps {
  posts: BlogPostMeta[];
}

export function Writing({ posts }: WritingProps) {
  if (posts.length === 0) return null;

  return (
    <section className="container-content py-20 md:py-28" aria-labelledby="writing-heading">
      <Reveal inView>
        <SectionHeading
          id="writing-heading"
          eyebrow="Technical writing"
          title="Notes from building and running software"
          description="Practical articles on .NET, React, databases, and deployment, grounded in official documentation and production work."
          action={
            <Button asChild variant="outline">
              <Link href="/blog">
                All articles
                <ArrowRightIcon aria-hidden="true" data-icon="inline-end" />
              </Link>
            </Button>
          }
        />
      </Reveal>
      <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {posts.slice(0, 3).map((post, index) => (
          <Reveal key={post.slug} inView delay={index * 0.05} className="h-full">
            <PostCard post={post} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
