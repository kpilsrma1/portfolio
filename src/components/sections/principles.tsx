import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/section-heading";
import { principles } from "@/data/principles";

export function Principles() {
  return (
    <section className="border-y border-border bg-surface/40" aria-labelledby="principles-heading">
      <div className="container-content py-20 md:py-28">
        <Reveal inView>
          <SectionHeading
            id="principles-heading"
            eyebrow="How I work"
            title="Engineering principles"
            description="The approach behind the work, applied consistently across backend, frontend, and deployment."
          />
        </Reveal>
        <ol className="mt-12 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {principles.map((principle, index) => (
            <li key={principle.title} className="bg-card p-6">
              <Reveal inView delay={index * 0.04}>
                <span className="font-mono text-xs text-brand">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 text-base font-semibold text-foreground">{principle.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground-secondary">{principle.description}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
