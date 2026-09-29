import Link from "next/link";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function Monogram({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex size-8 shrink-0 items-center justify-center rounded-md border border-border-strong bg-surface font-mono text-[0.8rem] font-semibold tracking-tight text-foreground",
        className,
      )}
    >
      {siteConfig.initials}
    </span>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-md text-sm font-semibold tracking-tight text-foreground",
        className,
      )}
      aria-label={`${siteConfig.name}, home`}
    >
      <Monogram className="transition-colors group-hover:border-brand/60" />
      <span className="hidden sm:inline">{siteConfig.name}</span>
    </Link>
  );
}
