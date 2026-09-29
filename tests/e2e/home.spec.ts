import { expect, test } from "@playwright/test";

test.describe("home page", () => {
  test("renders the hero, featured work, and footer", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/Kapil Sharma/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Building scalable software");
    await expect(page.getByRole("link", { name: "Explore my work" })).toHaveAttribute("href", "/projects");

    const cards = page.getByTestId("project-card");
    await expect(cards).toHaveCount(3);

    await expect(page.getByRole("contentinfo")).toContainText(`© ${new Date().getFullYear()} Kapil Sharma`);
  });

  test("marks the current page in the primary navigation", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Primary" });
    await expect(nav.getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "page");
    await expect(nav.getByRole("link", { name: "Projects" })).not.toHaveAttribute("aria-current", "page");
  });

  test("exposes the skip link as the first focusable element", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Skip to main content" })).toBeFocused();
  });

  test("includes Person and WebSite structured data", async ({ page }) => {
    await page.goto("/");
    const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
    const types = scripts.map((json) => (JSON.parse(json) as { "@type": string })["@type"]);
    expect(types).toEqual(expect.arrayContaining(["Person", "WebSite"]));
  });
});
