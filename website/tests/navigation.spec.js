// @ts-check
const { test, expect } = require("@playwright/test");
const { clickNavLink } = require("./helpers");

const pages = [
  { path: "/", file: "index.html", navLabel: "Home", heading: /Harbour-fresh spaces/i },
  { path: "/services.html", navLabel: "Services", heading: /Services shaped/i },
  { path: "/regions.html", navLabel: "Areas", heading: /Where we clean/i },
  { path: "/quote.html", navLabel: "Get a Quote", heading: /Tell us about your space/i },
  { path: "/contact.html", navLabel: "Contact", heading: /We are here for Wellington/i },
];

test.describe("Navigation", () => {
  test("home page loads with brand and hero", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/CleanWellington/i);
    await expect(page.locator(".logo")).toContainText("CleanWellington");
    await expect(page.locator(".hero h1")).toBeVisible();
  });

  for (const { path, navLabel, heading } of pages) {
    test(`nav link reaches ${path || "home"}`, async ({ page }) => {
      await page.goto("/services.html");
      await clickNavLink(page, navLabel);
      if (path === "/") {
        await expect(page).toHaveURL(/\/(index\.html)?(\?.*)?$/);
      } else {
        await expect(page).toHaveURL(new RegExp(path.replace(".", "\\.") + "(\\?.*)?$"));
      }
      await expect(page.getByRole("heading", { level: 1 })).toContainText(heading);
    });
  }

  test("footer email link is correct", async ({ page }) => {
    await page.goto("/");
    const emailLink = page.locator("footer").getByRole("link", { name: "cleannz10@gmail.com" });
    await expect(emailLink).toHaveAttribute("href", "mailto:cleannz10@gmail.com");
  });

  test("all main pages share header and footer", async ({ page }) => {
    for (const { path } of pages) {
      await page.goto(path);
      await expect(page.locator(".site-header")).toBeVisible();
      await expect(page.locator(".site-footer")).toBeVisible();
    }
  });
});
