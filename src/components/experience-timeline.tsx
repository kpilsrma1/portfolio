import type { ExperienceEntry } from "@/types/content";

interface ExperienceTimelineProps {
  entries: ExperienceEntry[];
}

export function ExperienceTimeline({ entries }: ExperienceTimelineProps) {
  return (
    <ol className="relative flex flex-col gap-10 border-l border-border pl-8 md:pl-10">
      {entries.map((entry) => (
        <li key={entry.id} className="relative">
          <span
            aria-hidden="true"
            className="absolute top-1.5 -left-[2.55rem] flex size-4 items-center justify-center rounded-full border border-brand/60 bg-background md:-left-[3.05rem]"
          >
            <span className="size-1.5 rounded-full bg-brand" />
          </span>
          <article className="surface-card p-6 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-h3 font-semibold text-foreground">{entry.title}</h3>
                <p className="mt-1 text-foreground-secondary">
                  {entry.company}
                  {entry.location ? ` · ${entry.location}` : ""}
                </p>
              </div>
              <span className="rounded-full border border-brand/40 bg-brand/10 px-2.5 py-1 font-mono text-xs text-brand">
                {entry.datesVerified && entry.dateRange ? entry.dateRange : entry.current ? "Current" : "Past role"}
              </span>
            </div>
            <p className="mt-5 text-foreground-secondary">{entry.summary}</p>
            <ul className="mt-5 flex flex-col gap-2.5 text-[0.95rem] leading-relaxed text-foreground-secondary">
              {entry.highlights.map((highlight) => (
                <li key={highlight} className="flex gap-3">
                  <span aria-hidden="true" className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-brand" />
                  {highlight}
                </li>
              ))}
            </ul>
            <ul className="mt-6 flex flex-wrap gap-1.5" aria-label="Technologies used">
              {entry.technologies.map((tech) => (
                <li key={tech} className="rounded-md border border-border bg-surface px-2 py-0.5 font-mono text-[0.7rem] text-muted-foreground">
                  {tech}
                </li>
              ))}
            </ul>
          </article>
        </li>
      ))}
    </ol>
  );
}
