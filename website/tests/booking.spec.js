// @ts-check
const { test, expect } = require("@playwright/test");

test.describe("Google Calendar booking links", () => {
  test("booking CTAs point to Google Calendar with cleannz10@gmail.com", async ({ page }) => {
    await page.goto("/");
    const visibleLinks = page.locator("[data-booking]").filter({ visible: true });
    await expect(visibleLinks.first()).toBeVisible();
    const count = await visibleLinks.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const link = visibleLinks.nth(i);
      const href = await link.getAttribute("href");
      expect(href).toContain("calendar.google.com");
      expect(href).toContain("cleannz10@gmail.com");
      await expect(link).toHaveAttribute("target", "_blank");
      await expect(link).toHaveAttribute("rel", /noopener/);
    }
  });

  test("contact page has book on calendar CTA", async ({ page }) => {
    await page.goto("/contact.html");
    const bookBtn = page.getByRole("link", { name: /Book on Google Calendar/i }).first();
    await expect(bookBtn).toHaveAttribute("href", /cleannz10@gmail.com/);
  });
});
