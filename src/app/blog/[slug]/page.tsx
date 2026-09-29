import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypePrettyCode, { type Options as PrettyCodeOptions } from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

import { mdxComponents } from "@/components/blog/mdx-components";
import { PostCard } from "@/components/blog/post-card";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { Button } from "@/components/ui/button";
import { absoluteUrl, siteConfig } from "@/config/site";
import { formatDate, getPostBySlug, getPublishedPosts, getRelatedPosts } from "@/lib/blog";
import { buildMetadata } from "@/lib/metadata";

export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  return buildMetadata({
    title: post.meta.title,
    description: post.meta.description,
    path: `/blog/${post.meta.slug}`,
    type: "article",
    publishedTime: post.meta.date,
    modifiedTime: post.meta.updated,
    tags: post.meta.tags,
  });
}

const prettyCodeOptions: PrettyCodeOptions = {
  theme: { dark: "github-dark-default", light: "github-light-default" },
  keepBackground: false,
  defaultLang: "plaintext",
};

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const [{ content }, related] = await Promise.all([
    compileMDX({
      source: post.content,
      components: mdxComponents,
      options: {
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [rehypeSlug, [rehypePrettyCode, prettyCodeOptions]],
        },
      },
    }),
    getRelatedPosts(post.meta),
  ]);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: post.meta.title,
    description: post.meta.description,
    datePublished: post.meta.date,
    dateModified: post.meta.updated ?? post.meta.date,
    author: { "@type": "Person", name: post.meta.author ?? siteConfig.fullName, url: absoluteUrl("/") },
    keywords: post.meta.tags.join(", "),
    mainEntityOfPage: absoluteUrl(`/blog/${post.meta.slug}`),
    wordCount: post.meta.wordCount,
  };

  return (
    <article>
      <header className="relative overflow-hidden border-b border-border">
        <div aria-hidden="true" className="grid-texture pointer-events-none absolute inset-0 opacity-60" />
        <div className="container-content relative py-14 md:py-20">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-foreground-secondary transition-colors hover:text-foreground">
            <ArrowLeftIcon aria-hidden="true" className="size-4" />
            All articles
          </Link>
          <div className="mt-8 flex flex-wrap items-center gap-2 font-mono text-xs text-muted-foreground">
            <time dateTime={post.meta.date}>{formatDate(post.meta.date)}</time>
            <span aria-hidden="true">·</span>
            <span>{post.meta.readingTime}</span>
            <span aria-hidden="true">·</span>
            <span>{post.meta.author ?? siteConfig.fullName}</span>
          </div>
          <h1 className="mt-4 max-w-3xl text-h1 font-semibold text-foreground">{post.meta.title}</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-foreground-secondary">{post.meta.description}</p>
          <ul className="mt-6 flex flex-wrap gap-1.5" aria-label="Tags">
            {post.meta.tags.map((tag) => (
              <li key={tag} className="rounded-md border border-border px-2 py-0.5 font-mono text-[0.7rem] text-muted-foreground">
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </header>

      <div className="container-content grid gap-12 py-14 lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-16 lg:py-20">
        <div className="prose-article">{content}</div>
        <aside className="order-first lg:order-none lg:sticky lg:top-24 lg:self-start">
          <TableOfContents entries={post.toc} />
        </aside>
      </div>

      {related.length > 0 ? (
        <section className="border-t border-border bg-surface/40" aria-labelledby="related-posts-heading">
          <div className="container-content py-14 md:py-20">
            <p className="eyebrow">Keep reading</p>
            <h2 id="related-posts-heading" className="mt-3 text-h2 font-semibold text-foreground">
              Related articles
            </h2>
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {related.map((item) => (
                <PostCard key={item.slug} post={item} />
              ))}
            </div>
          </div>
        </section>
      ) : (
        <div className="container-content pb-14">
          <Button asChild variant="outline">
            <Link href="/blog">
              <ArrowLeftIcon aria-hidden="true" data-icon="inline-start" />
              Back to all articles
            </Link>
          </Button>
        </div>
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c") }} />
    </article>
  );
}
