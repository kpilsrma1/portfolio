import { expect, test } from "@playwright/test";

test.describe("about page", () => {
  test("describes background, skills, and education without unverified dates", async ({ page }) => {
    await page.goto("/about");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("3.5 years");
    await expect(page.getByText("LnP Infotech Pvt. Ltd.").first()).toBeVisible();
    await expect(page.getByText(/Master of Computer Applications/)).toBeVisible();
  });
});

test.describe("contact page", () => {
  test("shows an honest state when no channels or provider are configured", async ({ page }) => {
    await page.goto("/contact");

    const hasEmail = (await page.getByTestId("contact-email").count()) > 0;
    const formDisabled = (await page.getByTestId("contact-form-disabled").count()) > 0;
    const unconfigured = (await page.getByTestId("contact-unconfigured").count()) > 0;

    if (hasEmail) {
      await expect(page.getByTestId("contact-email")).toHaveAttribute("href", /^mailto:/);
    } else {
      expect(unconfigured || formDisabled).toBe(true);
    }

    await expect(page.locator("body")).not.toContainText(/YOUR_EMAIL|example\.com/);
  });
});

test.describe("blog", () => {
  test("lists only published articles and renders MDX with highlighted code", async ({ page }) => {
    await page.goto("/blog");
    await expect(page.getByRole("link", { name: /Dockerizing a Next.js application/ })).toBeVisible();
    await expect(page.locator("body")).not.toContainText("Structuring ASP.NET Core");

    await page.getByRole("link", { name: /Dockerizing a Next.js application/ }).click();
    await expect(page).toHaveURL(/\/blog\/dockerizing-a-nextjs-application$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Dockerizing");

    const toc = page.getByRole("navigation", { name: "Table of contents" });
    await toc.getByRole("link", { name: "The Dockerfile" }).click();
    await expect(page).toHaveURL(/#the-dockerfile$/);
    await expect(page.locator("pre code[data-theme]").first()).toBeVisible();
  });

  test("returns 404 for a draft slug", async ({ page }) => {
    const response = await page.goto("/blog/structuring-aspnet-core-applications");
    expect(response?.status()).toBe(404);
  });
});

test.describe("resume page", () => {
  test("never links to a missing PDF", async ({ page }) => {
    await page.goto("/resume");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    const download = page.getByTestId("resume-download");
    if ((await download.count()) > 0) {
      const href = await download.getAttribute("href");
      const response = await page.request.get(href!);
      expect(response.status()).toBe(200);
    } else {
      await expect(page.getByText(/not published on this site yet/i)).toBeVisible();
      await expect(page.locator('a[href$=".pdf"]')).toHaveCount(0);
    }
  });
});
