import { describe, expect, it } from "vitest";

import { isActivePath } from "@/components/layout/nav-link";

describe("isActivePath", () => {
  it("matches the home link only on the root path", () => {
    expect(isActivePath("/", "/")).toBe(true);
    expect(isActivePath("/projects", "/")).toBe(false);
  });

  it("marks section links active for nested routes", () => {
    expect(isActivePath("/projects", "/projects")).toBe(true);
    expect(isActivePath("/projects/property-records-platform", "/projects")).toBe(true);
    expect(isActivePath("/projects-archive", "/projects")).toBe(false);
  });

  it("supports exact matching", () => {
    expect(isActivePath("/blog/some-post", "/blog", true)).toBe(false);
    expect(isActivePath("/blog", "/blog", true)).toBe(true);
  });
});
