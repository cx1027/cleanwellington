// @ts-check
const { test, expect } = require("@playwright/test");

test.describe("Mobile navigation", () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test("hamburger opens and closes main nav", async ({ page }) => {
    await page.goto("/");
    const toggle = page.getByRole("button", { name: "Open menu" });
    const nav = page.locator("#site-nav");

    await expect(nav).not.toHaveClass(/is-open/);
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(nav).toHaveClass(/is-open/);

    await nav.getByRole("link", { name: "Services" }).click();
    await expect(page).toHaveURL(/services\.html/);
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(nav).not.toHaveClass(/is-open/);
  });
});
