import Link from "next/link";

import { Monogram } from "@/components/layout/logo";
import { SocialLinks } from "@/components/social-links";
import { getSocialLinks, siteConfig } from "@/config/site";

interface SiteFooterProps {
  hasResume: boolean;
}

export function SiteFooter({ hasResume }: SiteFooterProps) {
  const year = new Date().getFullYear();
  const socialLinks = getSocialLinks();

  return (
    <footer className="border-t border-border bg-surface/40">
      <div className="container-content grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr] md:py-16">
        <div className="max-w-sm">
          <div className="flex items-center gap-2.5">
            <Monogram />
            <span className="text-sm font-semibold tracking-tight">{siteConfig.name}</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-foreground-secondary">
            {siteConfig.professionalTitle} at {siteConfig.currentCompany}. {siteConfig.shortDescription}
          </p>
        </div>

        <nav aria-label="Footer">
          <h2 className="eyebrow">Navigate</h2>
          <ul className="mt-4 grid grid-cols-2 gap-2 text-sm md:grid-cols-1">
            {siteConfig.footerNavigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-foreground-secondary transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="eyebrow">Elsewhere</h2>
          <ul className="mt-4 flex flex-col gap-2 text-sm">
            {socialLinks.length > 0 ? (
              <li>
                <SocialLinks links={socialLinks} variant="list" />
              </li>
            ) : (
              <li className="text-foreground-secondary">Profile links will appear here once configured.</li>
            )}
            <li>
              <Link
                href={hasResume ? siteConfig.resumePath : "/resume"}
                className="text-foreground-secondary transition-colors hover:text-foreground"
              >
                Résumé
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="text-foreground-secondary transition-colors hover:text-foreground">
                Privacy
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-content flex flex-col gap-2 py-5 font-mono text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {siteConfig.fullName}
          </p>
          <p>Built with Next.js, TypeScript, and Tailwind CSS.</p>
        </div>
      </div>
    </footer>
  );
}
