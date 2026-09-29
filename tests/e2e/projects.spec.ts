import { expect, test } from "@playwright/test";

test.describe("projects", () => {
  test("lists every published case study and filters by category", async ({ page }) => {
    await page.goto("/projects");

    const cards = page.getByTestId("project-card");
    await expect(cards).toHaveCount(3);
    await expect(page.getByRole("status")).toContainText("Showing 3 of 3");

    await page.getByRole("button", { name: "Records Platform" }).click();
    await expect(cards).toHaveCount(1);
    await expect(page.getByRole("status")).toContainText("Showing 1 of 3");
    await expect(page.getByRole("button", { name: "Records Platform" })).toHaveAttribute("aria-pressed", "true");

    await page.getByRole("button", { name: "All" }).click();
    await expect(cards).toHaveCount(3);
  });

  test("opens a case study with all sections and related work", async ({ page }) => {
    await page.goto("/projects");
    await page.getByRole("link", { name: "Property Records Platform" }).first().click();

    await expect(page).toHaveURL(/\/projects\/property-records-platform$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Property Records Platform");

    for (const heading of ["Overview", "Business problem", "Architecture", "Design and engineering decisions", "Results and lessons learned"]) {
      await expect(page.getByRole("heading", { level: 2, name: heading })).toBeVisible();
    }

    await expect(page.getByText("Confidential case study")).toBeVisible();
    await expect(page.getByRole("link", { name: /GitHub/ })).toHaveCount(0);

    const related = page.getByRole("region", { name: "More case studies" });
    await expect(related.getByTestId("project-card")).toHaveCount(2);
  });

  test("returns the custom 404 for an unknown slug", async ({ page }) => {
    const response = await page.goto("/projects/does-not-exist");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Page not found");
    await expect(page.getByRole("link", { name: "View projects" })).toHaveAttribute("href", "/projects");
  });
});
