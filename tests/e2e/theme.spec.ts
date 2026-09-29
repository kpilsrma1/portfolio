import { expect, test } from "@playwright/test";

test.describe("theme toggle", () => {
  test("defaults to dark, switches to light, and persists across reloads", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");
    await expect(html).toHaveClass(/\bdark\b/);

    const toggle = page.getByTestId("theme-toggle");
    await expect(toggle).toHaveAccessibleName("Switch to light theme");
    await toggle.click();

    await expect(html).toHaveClass(/\blight\b/);
    await expect(html).not.toHaveClass(/\bdark\b/);
    await expect(toggle).toHaveAccessibleName("Switch to dark theme");

    await page.reload();
    await expect(page.locator("html")).toHaveClass(/\blight\b/);

    await page.goto("/projects");
    await expect(page.locator("html")).toHaveClass(/\blight\b/);

    await page.getByTestId("theme-toggle").click();
    await expect(page.locator("html")).toHaveClass(/\bdark\b/);
  });
});
