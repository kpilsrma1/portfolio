import { describe, expect, it } from "vitest";

import { absoluteUrl, getSocialLinks, siteConfig, siteUrl } from "@/config/site";

describe("site config", () => {
  it("uses an https site URL without a trailing slash", () => {
    expect(siteUrl).toMatch(/^https:\/\//);
    expect(siteUrl.endsWith("/")).toBe(false);
  });

  it("builds absolute URLs from paths", () => {
    expect(absoluteUrl("/projects")).toBe(`${siteUrl.toLowerCase()}/projects`);
    expect(absoluteUrl()).toBe(`${siteUrl.toLowerCase()}/`);
  });

  it("only exposes social links that are configured", () => {
    const links = getSocialLinks();
    const expected = [siteConfig.githubUrl, siteConfig.linkedinUrl, siteConfig.email].filter(Boolean).length;
    expect(links).toHaveLength(expected);
    for (const link of links) {
      expect(link.href).not.toMatch(/example\.com|YOUR_/i);
    }
  });

  it("keeps navigation hrefs unique and rooted", () => {
    const hrefs = siteConfig.navigation.map((item) => item.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
    expect(hrefs.every((href) => href.startsWith("/"))).toBe(true);
  });
});
