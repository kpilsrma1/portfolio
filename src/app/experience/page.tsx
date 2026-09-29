import { ExperienceTimeline } from "@/components/experience-timeline";
import { PageHeader } from "@/components/page-header";
import { siteConfig } from "@/config/site";
import { education } from "@/data/education";
import { experience } from "@/data/experience";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Experience",
  description: `Professional experience of ${siteConfig.name}: ${siteConfig.yearsOfExperience} of full-stack development at ${siteConfig.currentCompany}, plus education.`,
  path: "/experience",
});

export default function ExperiencePage() {
  return (
    <>
      <PageHeader
        eyebrow="Experience"
        title="Professional experience"
        description={`${siteConfig.yearsOfExperience} of building and maintaining business applications across backend, frontend, databases, and deployment.`}
      />

      <section className="container-content py-14 md:py-20" aria-labelledby="roles-heading">
        <h2 id="roles-heading" className="sr-only">
          Roles
        </h2>
        <ExperienceTimeline entries={experience} />
      </section>

      <section className="border-t border-border bg-surface/40" aria-labelledby="education-heading">
        <div className="container-content py-14 md:py-20">
          <p className="eyebrow">Education</p>
          <h2 id="education-heading" className="mt-3 text-h2 font-semibold text-foreground">
            Academic background
          </h2>
          <ul className="mt-8 grid gap-4 md:grid-cols-2">
            {education.map((entry) => (
              <li key={entry.id} className="surface-card p-6">
                <p className="text-base font-semibold text-foreground">{entry.degree}</p>
                {entry.field || entry.detail ? (
                  <p className="mt-1 text-sm text-foreground-secondary">{[entry.field, entry.detail].filter(Boolean).join(" · ")}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
