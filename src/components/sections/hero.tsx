import { ArrowRightIcon, FileTextIcon, MailIcon } from "lucide-react";
import Link from "next/link";

import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

interface HeroProps {
  hasResume: boolean;
}

export function Hero({ hasResume }: HeroProps) {
  const { hero } = siteConfig;

  return (
    <section className="relative overflow-hidden border-b border-border" aria-labelledby="hero-heading">
      <div aria-hidden="true" className="grid-texture pointer-events-none absolute inset-0" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-[-10%] h-[28rem] w-[28rem] rounded-full bg-brand/10 blur-3xl"
      />
      <div className="container-content relative grid gap-12 py-20 md:grid-cols-[1.35fr_1fr] md:items-center md:py-28 lg:py-32">
        <div>
          <Reveal>
            <p className="eyebrow">{hero.eyebrow}</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 id="hero-heading" className="mt-5 max-w-[16ch] text-display font-semibold text-foreground">
              {hero.headline}
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-foreground-secondary md:text-xl">{hero.supporting}</p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="h-11 px-5 text-[0.95rem]">
                <Link href="/projects">
                  Explore my work
                  <ArrowRightIcon aria-hidden="true" data-icon="inline-end" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-11 px-5 text-[0.95rem]">
                <Link
                  href={hasResume ? siteConfig.resumePath : "/resume"}
                  {...(hasResume ? { target: "_blank", rel: "noopener" } : {})}
                >
                  <FileTextIcon aria-hidden="true" data-icon="inline-start" />
                  {hasResume ? "Download résumé" : "Résumé"}
                </Link>
              </Button>
              <Button asChild variant="ghost" size="lg" className="h-11 px-4 text-[0.95rem]">
                <Link href="/contact">
                  <MailIcon aria-hidden="true" data-icon="inline-start" />
                  Contact me
                </Link>
              </Button>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-10 font-mono text-xs tracking-wide text-muted-foreground">
              {hero.technologies.join(" · ")}
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="hidden md:block">
          <HeroPanel />
        </Reveal>
      </div>
    </section>
  );
}

/**
 * Decorative panel: an abstract representation of a request flowing through
 * the layers Kapil works in. Purely visual, hidden from assistive tech.
 */
function HeroPanel() {
  const layers = [
    { label: "React · TypeScript", detail: "typed UI" },
    { label: "ASP.NET Core API", detail: "validation · auth" },
    { label: "EF Core · Dapper", detail: "data access" },
    { label: "SQL Server · PostgreSQL", detail: "storage" },
    { label: "Docker · Nginx · Linux", detail: "runtime" },
  ];

  return (
    <div aria-hidden="true" className="surface-card relative ml-auto w-full max-w-sm p-5 shadow-[0_30px_60px_-40px_rgba(0,0,0,0.8)]">
      <div className="flex items-center justify-between font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">
        <span>request lifecycle</span>
        <span className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-brand" />
          200 OK
        </span>
      </div>
      <ol className="mt-5 flex flex-col gap-2">
        {layers.map((layer, i) => (
          <li
            key={layer.label}
            className="flex items-center justify-between rounded-lg border border-border bg-surface px-3.5 py-2.5"
            style={{ marginLeft: `${i * 6}px`, marginRight: `${(layers.length - 1 - i) * 6}px` }}
          >
            <span className="text-sm font-medium text-foreground">{layer.label}</span>
            <span className="font-mono text-[0.65rem] text-muted-foreground">{layer.detail}</span>
          </li>
        ))}
      </ol>
      <div className="mt-5 flex items-center justify-between border-t border-border pt-4 font-mono text-[0.65rem] text-muted-foreground">
        <span>{siteConfig.yearsOfExperience} · full-stack</span>
        <span>{siteConfig.currentCompany}</span>
      </div>
    </div>
  );
}
