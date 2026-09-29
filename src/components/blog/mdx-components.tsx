import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

/**
 * Component overrides for MDX content. Links stay accessible and external
 * links open safely; everything else falls through to semantic HTML styled by
 * `.prose-article` in globals.css.
 */
export const mdxComponents = {
  a: ({ href = "", children, ...props }: ComponentPropsWithoutRef<"a">) => {
    const isInternal = href.startsWith("/") || href.startsWith("#");
    if (isInternal) {
      return (
        <Link href={href} {...props}>
          {children}
        </Link>
      );
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  },
  h2: ({ id, children, ...props }: ComponentPropsWithoutRef<"h2">) => (
    <h2 id={id} {...props}>
      <a href={`#${id}`} className="no-underline decoration-transparent text-inherit hover:text-brand">
        {children}
      </a>
    </h2>
  ),
};
