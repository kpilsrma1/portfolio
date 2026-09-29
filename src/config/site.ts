/**
 * Central site configuration.
 *
 * Every piece of profile information that appears on the site comes from this
 * file or from the typed data files in `src/data`. Page components never hold
 * profile facts of their own.
 *
 * Optional fields that are left `undefined` are omitted from the UI. Do not put
 * placeholder emails or URLs here; the site treats every configured value as
 * real and publishes it.
 */

export interface NavItem {
  label: string;
  href: string;
}

export interface SocialLink {
  id: "github" | "linkedin" | "email";
  label: string;
  href: string;
}

const DEFAULT_SITE_URL = "https://KapilSahrma.mageiatech.com";

/**
 * The hostname above is reproduced exactly as supplied by the site owner and
 * has not been verified against DNS. Override it with NEXT_PUBLIC_SITE_URL once
 * the final hostname is confirmed.
 */
export const siteUrl = normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL);

export const siteConfig = {
  name: "Kapil Sharma",
  fullName: "Kapil Sharma",
  initials: "KS",
  professionalTitle: "Full-Stack Software Developer",
  employmentTitle: "Senior Software Developer / Full-Stack Developer",
  currentCompany: "LnP Infotech Pvt. Ltd.",
  yearsOfExperience: "3.5 years",
  /**
   * Employment dates are unknown until the résumé is supplied. The UI shows
   * the role as current and hides the date range while this is false.
   */
  employmentDatesVerified: false,

  shortDescription:
    "Full-stack software developer building reliable web applications, robust APIs, and data-driven platforms with .NET, React, and modern web technologies.",
  longerIntroduction: [
    "I am a full-stack software developer at LnP Infotech Pvt. Ltd. with 3.5 years of experience building business applications end to end: backend APIs in C# and ASP.NET Core, data layers on SQL Server and PostgreSQL, and frontends in React, TypeScript, and Angular.",
    "Most of my work has been on operational software for real businesses, where the interesting problems are workflows, data integrity, and keeping systems maintainable while requirements change. I care about clear boundaries between layers, APIs that are predictable to consume, and deployments that can be reasoned about.",
    "I work across the whole stack, including containerising applications with Docker, running them behind Nginx on Linux, and debugging production issues when they happen.",
  ],

  hero: {
    eyebrow: "Full-Stack Software Developer",
    headline: "Building scalable software for real-world business problems.",
    supporting:
      "I design and develop reliable web applications, robust APIs, and data-driven platforms using .NET, React, and modern web technologies.",
    technologies: [".NET", "React", "TypeScript", "SQL Server", "Docker"],
  },

  /**
   * Availability is opt-in. The indicator is hidden while `open` is false.
   */
  availability: {
    open: false,
    label: "Open to new opportunities",
  },

  /**
   * Location is only published when a value is supplied here.
   */
  location: undefined as string | undefined,

  /**
   * Contact channels. Leave undefined until the real values are confirmed.
   * These are read by the contact page, footer, and JSON-LD.
   */
  email: undefined as string | undefined,
  githubUrl: undefined as string | undefined,
  linkedinUrl: undefined as string | undefined,

  /**
   * Résumé PDF location inside `public/`. The file is not part of the
   * repository; `src/lib/resume.ts` checks whether it exists at build time.
   */
  resumePath: "/resume/kapil-sharma-resume.pdf",

  navigation: [
    { label: "Home", href: "/" },
    { label: "Projects", href: "/projects" },
    { label: "About", href: "/about" },
    { label: "Experience", href: "/experience" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ] satisfies NavItem[],

  footerNavigation: [
    { label: "Projects", href: "/projects" },
    { label: "About", href: "/about" },
    { label: "Experience", href: "/experience" },
    { label: "Blog", href: "/blog" },
    { label: "Uses", href: "/uses" },
    { label: "Contact", href: "/contact" },
  ] satisfies NavItem[],

  contactCta: {
    headline: "Have a project or engineering challenge in mind?",
    supporting:
      "I'm interested in discussing software development, full-stack engineering, and practical product challenges.",
  },
} as const;

export type SiteConfig = typeof siteConfig;

/**
 * Social links that are actually configured, in display order.
 */
export function getSocialLinks(): SocialLink[] {
  const links: SocialLink[] = [];
  if (siteConfig.githubUrl) {
    links.push({ id: "github", label: "GitHub", href: siteConfig.githubUrl });
  }
  if (siteConfig.linkedinUrl) {
    links.push({ id: "linkedin", label: "LinkedIn", href: siteConfig.linkedinUrl });
  }
  if (siteConfig.email) {
    links.push({ id: "email", label: "Email", href: `mailto:${siteConfig.email}` });
  }
  return links;
}

export function absoluteUrl(path = "/"): string {
  return new URL(path, siteUrl).toString();
}

function normalizeUrl(value: string): string {
  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  return withProtocol.replace(/\/+$/, "");
}
