import { FileTextIcon } from "lucide-react";
import Link from "next/link";

import { Logo } from "@/components/layout/logo";
import { MobileNav } from "@/components/layout/mobile-nav";
import { NavLink } from "@/components/layout/nav-link";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

interface SiteHeaderProps {
  hasResume: boolean;
}

export function SiteHeader({ hasResume }: SiteHeaderProps) {
  const resumeHref = hasResume ? siteConfig.resumePath : "/resume";

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
      <div className="container-content flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Logo />
          {siteConfig.availability.open ? (
            <span className="hidden items-center gap-2 rounded-full border border-border px-2.5 py-1 text-xs text-foreground-secondary lg:inline-flex">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand/60 motion-reduce:hidden" />
                <span className="relative inline-flex size-2 rounded-full bg-brand" />
              </span>
              {siteConfig.availability.label}
            </span>
          ) : null}
        </div>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {siteConfig.navigation.map((item) => (
              <li key={item.href}>
                <NavLink
                  href={item.href}
                  className="rounded-md px-3 py-2 text-sm font-medium text-foreground-secondary transition-colors hover:text-foreground"
                  activeClassName="text-foreground"
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <Button asChild variant="outline" size="default" className="hidden md:inline-flex">
            <Link href={resumeHref} {...(hasResume ? { target: "_blank", rel: "noopener" } : {})}>
              <FileTextIcon aria-hidden="true" />
              Résumé
            </Link>
          </Button>
          <MobileNav items={siteConfig.navigation} resumeHref={resumeHref} hasResume={hasResume} />
        </div>
      </div>
    </header>
  );
}
