import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

import { Reveal } from "@/components/motion/reveal";
import { SocialLinks } from "@/components/social-links";
import { Button } from "@/components/ui/button";
import { getSocialLinks, siteConfig } from "@/config/site";

export function ContactCta() {
  const links = getSocialLinks();

  return (
    <section className="border-t border-border" aria-labelledby="contact-cta-heading">
      <div className="container-content py-20 md:py-28">
        <Reveal inView>
          <div className="surface-card relative overflow-hidden p-8 md:p-14">
            <div aria-hidden="true" className="grid-texture pointer-events-none absolute inset-0 opacity-50" />
            <div className="relative max-w-2xl">
              <p className="eyebrow">Contact</p>
              <h2 id="contact-cta-heading" className="mt-3 text-h2 font-semibold text-foreground">
                {siteConfig.contactCta.headline}
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-foreground-secondary">{siteConfig.contactCta.supporting}</p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button asChild size="lg" className="h-11 px-5">
                  <Link href="/contact">
                    Get in touch
                    <ArrowRightIcon aria-hidden="true" data-icon="inline-end" />
                  </Link>
                </Button>
                <SocialLinks links={links} />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
