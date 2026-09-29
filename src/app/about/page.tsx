import { ArrowRightIcon, FileTextIcon } from "lucide-react";
import Link from "next/link";

import { ExperienceTimeline } from "@/components/experience-timeline";
import { Monogram } from "@/components/layout/logo";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { education } from "@/data/education";
import { experience } from "@/data/experience";
import { skillGroups } from "@/data/skills";
import { buildMetadata } from "@/lib/metadata";
import { hasResumeFile } from "@/lib/resume";

export const metadata = buildMetadata({
  title: "About",
  description: `${siteConfig.name} is a full-stack software developer at ${siteConfig.currentCompany} working across .NET backends, React and Angular frontends, SQL databases, and Docker deployments.`,
  path: "/about",
});

export default function AboutPage() {
  const hasResume = hasResumeFile();

  return (
    <>
      <PageHeader
        eyebrow="About"
        title={`${siteConfig.professionalTitle} with ${siteConfig.yearsOfExperience} of building business software.`}
        description={siteConfig.longerIntroduction[0]}
      >
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="outline" size="lg" className="h-11 px-5">
            <Link href={hasResume ? siteConfig.resumePath : "/resume"} {...(hasResume ? { target: "_blank", rel: "noopener" } : {})}>
              <FileTextIcon aria-hidden="true" data-icon="inline-start" />
              {hasResume ? "Download résumé" : "Résumé"}
            </Link>
          </Button>
          <Button asChild variant="ghost" size="lg" className="h-11 px-4">
            <Link href="/contact">
              Contact
              <ArrowRightIcon aria-hidden="true" data-icon="inline-end" />
            </Link>
          </Button>
        </div>
      </PageHeader>

      <section className="container-content grid gap-12 py-14 md:py-20 lg:grid-cols-[1fr_20rem] lg:gap-16" aria-labelledby="intro-heading">
        <div className="max-w-2xl">
          <h2 id="intro-heading" className="text-h2 font-semibold text-foreground">
            Background
          </h2>
          <div className="mt-5 flex flex-col gap-4 text-[1.0325rem] leading-relaxed text-foreground-secondary">
            {siteConfig.longerIntroduction.slice(1).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <h3 className="mt-12 text-h3 font-semibold text-foreground">Engineering interests</h3>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {[
              "API design and clear service boundaries",
              "Relational data modelling and query performance",
              "Multi-tenant application architecture",
              "Business workflow automation",
              "Containerised deployment and reverse proxies",
              "Maintaining and improving long-lived systems",
            ].map((interest) => (
              <li key={interest} className="rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-foreground">
                {interest}
              </li>
            ))}
          </ul>
        </div>

        <aside className="flex flex-col gap-4">
          <div className="surface-card p-5">
            <div className="flex items-center gap-3">
              <Monogram className="size-12 text-base" />
              <div>
                <p className="font-semibold text-foreground">{siteConfig.fullName}</p>
                <p className="text-sm text-foreground-secondary">{siteConfig.professionalTitle}</p>
              </div>
            </div>
            <dl className="mt-5 grid gap-3 text-sm">
              <div className="flex justify-between gap-4 border-t border-border pt-3">
                <dt className="text-muted-foreground">Company</dt>
                <dd className="text-right text-foreground">{siteConfig.currentCompany}</dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-border pt-3">
                <dt className="text-muted-foreground">Experience</dt>
                <dd className="text-right text-foreground">{siteConfig.yearsOfExperience}</dd>
              </div>
              {siteConfig.location ? (
                <div className="flex justify-between gap-4 border-t border-border pt-3">
                  <dt className="text-muted-foreground">Location</dt>
                  <dd className="text-right text-foreground">{siteConfig.location}</dd>
                </div>
              ) : null}
              <div className="flex justify-between gap-4 border-t border-border pt-3">
                <dt className="text-muted-foreground">Core stack</dt>
                <dd className="text-right text-foreground">{siteConfig.hero.technologies.join(", ")}</dd>
              </div>
            </dl>
          </div>

          <div className="surface-card p-5">
            <h2 className="eyebrow">Education</h2>
            <ul className="mt-4 flex flex-col gap-4">
              {education.map((entry) => (
                <li key={entry.id}>
                  <p className="font-medium text-foreground">{entry.degree}</p>
                  {entry.field || entry.detail ? (
                    <p className="mt-0.5 text-sm text-foreground-secondary">
                      {[entry.field, entry.detail].filter(Boolean).join(" · ")}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>

      <section className="border-y border-border bg-surface/40" aria-labelledby="timeline-heading">
        <div className="container-content py-14 md:py-20">
          <p className="eyebrow">Work experience</p>
          <h2 id="timeline-heading" className="mt-3 text-h2 font-semibold text-foreground">
            Timeline
          </h2>
          <div className="mt-10">
            <ExperienceTimeline entries={experience} />
          </div>
        </div>
      </section>

      <section className="container-content py-14 md:py-20" aria-labelledby="skills-heading">
        <p className="eyebrow">Technology expertise</p>
        <h2 id="skills-heading" className="mt-3 text-h2 font-semibold text-foreground">
          What I work with
        </h2>
        <dl className="mt-10 grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-2">
          {skillGroups.map((group) => (
            <div key={group.id} className="bg-card p-6">
              <dt className="text-base font-semibold text-foreground">{group.name}</dt>
              <dd className="mt-3 flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <span key={skill} className="rounded-md border border-border bg-surface px-2.5 py-1 font-mono text-xs text-foreground-secondary">
                    {skill}
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}
