import { expect, test } from "@playwright/test";

const sections = [
  { label: "Projects", path: "/projects", heading: /Case studies/ },
  { label: "About", path: "/about", heading: /Full-Stack Software Developer/ },
  { label: "Experience", path: "/experience", heading: /./ },
  { label: "Blog", path: "/blog", heading: /./ },
  { label: "Contact", path: "/contact", heading: /engineering challenge/ },
];

test.describe("primary navigation", () => {
  for (const section of sections) {
    test(`navigates to ${section.label}`, async ({ page }) => {
      await page.goto("/");
      const nav = page.getByRole("navigation", { name: "Primary" });
      await nav.getByRole("link", { name: section.label }).click();

      await expect(page).toHaveURL(new RegExp(`${section.path}$`));
      await expect(page.getByRole("heading", { level: 1 })).toContainText(section.heading);
      await expect(nav.getByRole("link", { name: section.label })).toHaveAttribute("aria-current", "page");
    });
  }

  test("footer links reach uses, privacy, and resume", async ({ page }) => {
    await page.goto("/");
    const footer = page.getByRole("contentinfo");

    await footer.getByRole("link", { name: "Uses" }).click();
    await expect(page).toHaveURL(/\/uses$/);

    await footer.getByRole("link", { name: "Privacy" }).click();
    await expect(page).toHaveURL(/\/privacy$/);

    await footer.getByRole("link", { name: "Résumé" }).click();
    await expect(page).toHaveURL(/\/resume/);
  });
});
