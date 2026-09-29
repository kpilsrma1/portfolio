import type { Metadata } from "next";

import { absoluteUrl, siteConfig } from "@/config/site";

interface PageMetadataOptions {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
  noIndex?: boolean;
}

/**
 * Builds per-page metadata with a canonical URL derived from the single
 * configured site URL.
 *
 * Next.js replaces the whole `openGraph` object when a page defines one, so
 * the root `opengraph-image.tsx` is referenced explicitly here to keep social
 * previews on every page.
 */
export function buildMetadata({
  title,
  description,
  path,
  type = "website",
  publishedTime,
  modifiedTime,
  tags,
  noIndex = false,
}: PageMetadataOptions): Metadata {
  const url = absoluteUrl(path);
  const socialTitle = `${title} · ${siteConfig.name}`;
  const image = {
    url: absoluteUrl("/opengraph-image"),
    width: 1200,
    height: 630,
    alt: `${siteConfig.name} · ${siteConfig.professionalTitle}`,
  };

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: socialTitle,
      description,
      url,
      siteName: siteConfig.name,
      type,
      locale: "en_US",
      images: [image],
      ...(type === "article"
        ? {
            publishedTime,
            modifiedTime,
            authors: [siteConfig.fullName],
            tags,
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [image.url],
    },
  };
}
