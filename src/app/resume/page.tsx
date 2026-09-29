import { DownloadIcon, FileTextIcon } from "lucide-react";
import Link from "next/link";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/metadata";
import { hasResumeFile } from "@/lib/resume";

export const metadata = buildMetadata({
  title: "Résumé",
  description: `Résumé of ${siteConfig.name}, ${siteConfig.professionalTitle}.`,
  path: "/resume",
});

export default function ResumePage() {
  const hasResume = hasResumeFile();

  return (
    <>
      <PageHeader
        eyebrow="Résumé"
        title={hasResume ? "Download my résumé" : "Résumé"}
        description={
          hasResume
            ? "A PDF summary of my experience, skills, and education."
            : "The PDF résumé is not published on this site yet. In the meantime, the About and Experience pages carry the same information."
        }
      >
        {hasResume ? (
          <Button asChild size="lg" className="h-11 px-5">
            <a href={siteConfig.resumePath} download data-testid="resume-download">
              <DownloadIcon aria-hidden="true" data-icon="inline-start" />
              Download PDF
            </a>
          </Button>
        ) : (
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="h-11 px-5">
              <Link href="/experience">
                <FileTextIcon aria-hidden="true" data-icon="inline-start" />
                View experience
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-11 px-5">
              <Link href="/contact">Request a copy</Link>
            </Button>
          </div>
        )}
      </PageHeader>

      {hasResume ? (
        <section className="container-content py-14 md:py-20">
          <div className="surface-card overflow-hidden">
            <object data={siteConfig.resumePath} type="application/pdf" className="h-[80vh] w-full" aria-label="Résumé PDF preview">
              <p className="p-6 text-foreground-secondary">
                Your browser cannot display the PDF inline.{" "}
                <a href={siteConfig.resumePath} className="text-brand underline underline-offset-4">
                  Download it instead
                </a>
                .
              </p>
            </object>
          </div>
        </section>
      ) : (
        <section className="container-content py-14 md:py-20">
          <div className="surface-card max-w-2xl p-6 md:p-8">
            <h2 className="text-h3 font-semibold text-foreground">What you can find here now</h2>
            <ul className="mt-4 flex flex-col gap-3 text-foreground-secondary">
              <li>
                <Link href="/about" className="text-brand underline-offset-4 hover:underline">
                  About
                </Link>{" "}
                for background, education, and technology expertise.
              </li>
              <li>
                <Link href="/experience" className="text-brand underline-offset-4 hover:underline">
                  Experience
                </Link>{" "}
                for the role timeline and responsibilities.
              </li>
              <li>
                <Link href="/projects" className="text-brand underline-offset-4 hover:underline">
                  Projects
                </Link>{" "}
                for case studies from production systems.
              </li>
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
