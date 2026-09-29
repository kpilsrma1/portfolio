import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/section-heading";
import { skillGroups } from "@/data/skills";

export function Expertise() {
  return (
    <section className="border-y border-border bg-surface/40" aria-labelledby="expertise-heading">
      <div className="container-content py-20 md:py-28">
        <Reveal inView>
          <SectionHeading
            id="expertise-heading"
            eyebrow="Technical expertise"
            title="Depth on the .NET backend, fluency across the stack"
            description="Grouped by where they are used. Backend and databases are the day-to-day core; the rest is applied on every project that ships."
          />
        </Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group, index) => (
            <Reveal key={group.id} inView delay={index * 0.05} className="h-full">
              <article className="surface-card flex h-full flex-col gap-4 p-5 md:p-6">
                <div>
                  <h3 className="text-h3 font-semibold text-foreground">{group.name}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-foreground-secondary">{group.description}</p>
                </div>
                <ul className="flex flex-wrap gap-2">
                  {group.skills.map((skill, skillIndex) => (
                    <li
                      key={skill}
                      className={
                        skillIndex < 2 && index < 3
                          ? "rounded-md border border-brand/30 bg-brand/5 px-2.5 py-1 font-mono text-xs text-foreground"
                          : "rounded-md border border-border bg-surface px-2.5 py-1 font-mono text-xs text-foreground-secondary"
                      }
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
