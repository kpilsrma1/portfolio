import { absoluteUrl, siteConfig, siteUrl } from "@/config/site";
import { skillGroups } from "@/data/skills";

/**
 * Person and WebSite JSON-LD. Only configured profile links are included in
 * `sameAs`; nothing here is fabricated.
 */
export function StructuredData() {
  const sameAs = [siteConfig.githubUrl, siteConfig.linkedinUrl].filter((value): value is string => Boolean(value));

  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": absoluteUrl("/#person"),
    name: siteConfig.fullName,
    jobTitle: siteConfig.professionalTitle,
    description: siteConfig.shortDescription,
    url: siteUrl,
    worksFor: {
      "@type": "Organization",
      name: siteConfig.currentCompany,
    },
    knowsAbout: skillGroups.flatMap((group) => group.skills),
    ...(sameAs.length > 0 ? { sameAs } : {}),
    ...(siteConfig.email ? { email: `mailto:${siteConfig.email}` } : {}),
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    name: siteConfig.name,
    url: siteUrl,
    description: siteConfig.shortDescription,
    inLanguage: "en",
    author: { "@id": absoluteUrl("/#person") },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serialize(person) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serialize(website) }}
      />
    </>
  );
}

/**
 * Escapes `<` so that no content can close the script tag early.
 */
function serialize(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
