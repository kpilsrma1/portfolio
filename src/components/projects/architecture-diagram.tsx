import { ArrowDownIcon } from "lucide-react";

import type { ArchitectureLayer } from "@/types/content";

interface ArchitectureDiagramProps {
  layers: ArchitectureLayer[];
  title: string;
}

/**
 * A layered architecture diagram rendered from typed data. Layers flow top to
 * bottom; each box lists the components that live in that layer.
 */
export function ArchitectureDiagram({ layers, title }: ArchitectureDiagramProps) {
  return (
    <figure className="surface-card p-4 md:p-6">
      <ol aria-label={`${title} architecture, top layer to bottom layer`} className="flex flex-col items-stretch gap-2">
        {layers.map((layer, index) => (
          <li key={layer.name} className="flex flex-col gap-2">
            <div className="rounded-lg border border-border-strong bg-surface p-3 md:p-4">
              <p className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-brand">{layer.name}</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {layer.items.map((item) => (
                  <li key={item} className="rounded-md border border-border bg-card px-2.5 py-1 text-sm text-foreground">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            {index < layers.length - 1 ? (
              <ArrowDownIcon aria-hidden="true" className="mx-auto size-4 text-muted-foreground" />
            ) : null}
          </li>
        ))}
      </ol>
      <figcaption className="mt-4 font-mono text-xs text-muted-foreground">
        High-level layering. Requests flow from the top layer down; dependencies point the same way.
      </figcaption>
    </figure>
  );
}
