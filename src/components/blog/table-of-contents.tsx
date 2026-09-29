import type { TocEntry } from "@/types/content";
import { cn } from "@/lib/utils";

interface TableOfContentsProps {
  entries: TocEntry[];
}

export function TableOfContents({ entries }: TableOfContentsProps) {
  if (entries.length < 3) return null;

  return (
    <nav aria-label="Table of contents" className="surface-card p-5">
      <p className="eyebrow">On this page</p>
      <ol className="mt-3 flex flex-col gap-1.5 text-sm">
        {entries.map((entry) => (
          <li key={entry.id} className={cn(entry.depth === 3 && "pl-3")}>
            <a href={`#${entry.id}`} className="text-foreground-secondary transition-colors hover:text-foreground">
              {entry.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
