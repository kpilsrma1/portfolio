import { MailIcon } from "lucide-react";

import { ContactForm } from "@/components/forms/contact-form";
import { PageHeader } from "@/components/page-header";
import { SocialLinks } from "@/components/social-links";
import { Button } from "@/components/ui/button";
import { getSocialLinks, siteConfig } from "@/config/site";
import { isContactFormEnabled } from "@/lib/contact";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Contact",
  description: `Get in touch with ${siteConfig.name} about software development, full-stack engineering, and product challenges.`,
  path: "/contact",
});

export default function ContactPage() {
  const formEnabled = isContactFormEnabled();
  const socialLinks = getSocialLinks();
  const hasAnyChannel = formEnabled || socialLinks.length > 0;

  return (
    <>
      <PageHeader eyebrow="Contact" title={siteConfig.contactCta.headline} description={siteConfig.contactCta.supporting} />

      <section className="container-content grid gap-10 py-14 md:py-20 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
        <div>
          <h2 className="text-h2 font-semibold text-foreground">Direct channels</h2>
          <p className="mt-4 leading-relaxed text-foreground-secondary">
            {hasAnyChannel
              ? "Email is the most reliable way to reach me. For professional networking, LinkedIn works too."
              : "This page lists every way to reach me once the details below are confirmed."}
          </p>

          {siteConfig.email ? (
            <div className="mt-6">
              <Button asChild size="lg" className="h-11 px-5">
                <a href={`mailto:${siteConfig.email}`} data-testid="contact-email">
                  <MailIcon aria-hidden="true" data-icon="inline-start" />
                  {siteConfig.email}
                </a>
              </Button>
            </div>
          ) : null}

          {socialLinks.filter((link) => link.id !== "email").length > 0 ? (
            <div className="mt-6">
              <h3 className="eyebrow">Profiles</h3>
              <SocialLinks links={socialLinks.filter((link) => link.id !== "email")} className="mt-3" />
            </div>
          ) : null}

          {!hasAnyChannel ? (
            <div className="surface-card mt-6 p-5" data-testid="contact-unconfigured">
              <p className="font-medium text-foreground">Contact details are being finalised.</p>
              <p className="mt-1 text-sm leading-relaxed text-foreground-secondary">
                Direct contact links will appear here as soon as they are confirmed. Until then, the About and Experience pages describe my
                background and current role.
              </p>
            </div>
          ) : null}

          {siteConfig.availability.open ? (
            <p className="mt-8 inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-3 py-1.5 text-sm text-brand">
              <span className="size-2 rounded-full bg-brand" aria-hidden="true" />
              {siteConfig.availability.label}
            </p>
          ) : null}
        </div>

        <div>
          {formEnabled ? (
            <>
              <h2 className="text-h2 font-semibold text-foreground">Send a message</h2>
              <p className="mt-4 mb-6 leading-relaxed text-foreground-secondary">
                Include a little context about the project or role and I will get back to you by email.
              </p>
              <ContactForm />
            </>
          ) : (
            <div className="surface-card p-6 md:p-8" data-testid="contact-form-disabled">
              <h2 className="text-h3 font-semibold text-foreground">Contact form</h2>
              <p className="mt-2 text-sm leading-relaxed text-foreground-secondary">
                The message form on this page is switched off until an email delivery provider is configured. Use the direct channels on
                this page instead.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
