import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { getCurrentRole } from "@/data/experience";

export function ExperiencePreview() {
  const role = getCurrentRole();
  if (!role) return null;

  return (
    <section className="container-content py-20 md:py-28" aria-labelledby="experience-heading">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        <Reveal inView>
          <SectionHeading
            id="experience-heading"
            eyebrow="Experience"
            title="Shipping business software end to end"
            description={`${siteConfig.yearsOfExperience} of professional development, currently at ${role.company}.`}
            action={
              <Button asChild variant="outline">
                <Link href="/experience">
                  Full timeline
                  <ArrowRightIcon aria-hidden="true" data-icon="inline-end" />
                </Link>
              </Button>
            }
            className="lg:flex-col lg:items-start"
          />
        </Reveal>
        <Reveal inView delay={0.08}>
          <article className="surface-card p-6 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-h3 font-semibold text-foreground">{role.title}</h3>
                <p className="mt-1 text-foreground-secondary">{role.company}</p>
              </div>
              <span className="rounded-full border border-brand/40 bg-brand/10 px-2.5 py-1 font-mono text-xs text-brand">
                {role.datesVerified && role.dateRange ? role.dateRange : "Current"}
              </span>
            </div>
            <p className="mt-5 text-foreground-secondary">{role.summary}</p>
            <ul className="mt-5 flex flex-col gap-2.5 text-[0.95rem] leading-relaxed text-foreground-secondary">
              {role.highlights.map((highlight) => (
                <li key={highlight} className="flex gap-3">
                  <span aria-hidden="true" className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-brand" />
                  {highlight}
                </li>
              ))}
            </ul>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
