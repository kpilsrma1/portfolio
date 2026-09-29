import { expect, test } from "@playwright/test";

test.describe("mobile navigation", () => {
  test("hides the desktop links and navigates through the menu sheet", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("navigation", { name: "Primary" })).toBeHidden();

    const trigger = page.getByTestId("mobile-menu-trigger");
    await expect(trigger).toBeVisible();
    await trigger.click();

    const sheet = page.getByRole("dialog", { name: "Navigation" });
    await expect(sheet).toBeVisible();
    await expect(sheet.getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "page");

    await sheet.getByRole("link", { name: "About" }).click();
    await expect(page).toHaveURL(/\/about$/);
    await expect(sheet).toBeHidden();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("closes the sheet with the close button", async ({ page }) => {
    await page.goto("/projects");
    await page.getByTestId("mobile-menu-trigger").click();
    const sheet = page.getByRole("dialog", { name: "Navigation" });
    await expect(sheet).toBeVisible();
    await sheet.getByRole("button", { name: "Close" }).click();
    await expect(sheet).toBeHidden();
    await expect(page).toHaveURL(/\/projects$/);
  });

  test("keeps content within the viewport width", async ({ page }) => {
    await page.goto("/projects/property-records-platform");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflow).toBe(false);
  });
});
