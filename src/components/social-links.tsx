import { MailIcon } from "lucide-react";

import { GitHubIcon, LinkedInIcon } from "@/components/icons/brand-icons";
import type { SocialLink } from "@/config/site";
import { cn } from "@/lib/utils";

const icons = {
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  email: MailIcon,
} as const;

interface SocialLinksProps {
  links: SocialLink[];
  variant?: "list" | "inline";
  className?: string;
}

export function SocialLinks({ links, variant = "inline", className }: SocialLinksProps) {
  if (links.length === 0) return null;

  return (
    <ul className={cn(variant === "list" ? "flex flex-col gap-2" : "flex flex-wrap items-center gap-2", className)}>
      {links.map((link) => {
        const Icon = icons[link.id];
        const external = link.id !== "email";
        return (
          <li key={link.id}>
            <a
              href={link.href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer me" } : { rel: "me" })}
              className={cn(
                "inline-flex items-center gap-2 text-sm text-foreground-secondary transition-colors hover:text-foreground",
                variant === "inline" && "rounded-lg border border-border px-3 py-2 hover:border-border-strong",
              )}
            >
              <Icon aria-hidden="true" className="size-4" />
              {link.label}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
