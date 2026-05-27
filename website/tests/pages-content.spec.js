// @ts-check
const { test, expect } = require("@playwright/test");

test.describe("Page content", () => {
  test("services page lists all three service types", async ({ page }) => {
    await page.goto("/services.html");
    await expect(page.locator("#residential")).toBeVisible();
    await expect(page.locator("#deep")).toBeVisible();
    await expect(page.locator("#office")).toBeVisible();
    await expect(page.locator("#move")).toHaveCount(0);
    await expect(page.getByText(/From \$95/i)).toBeVisible();
  });

  test("regions page shows Wellington suburbs and map", async ({ page }) => {
    await page.goto("/regions.html");
    await expect(page.getByText("Wellington CBD")).toBeVisible();
    await expect(page.getByText("Te Aro")).toBeVisible();
    await expect(page.locator(".map-panel svg")).toBeVisible();
    await expect(page.getByRole("link", { name: /Get a quote for your suburb/i })).toHaveAttribute(
      "href",
      /quote\.html/
    );
  });

  test("contact page shows email and hours", async ({ page }) => {
    await page.goto("/contact.html");
    await expect(
      page.locator("main").getByRole("link", { name: "cleannz10@gmail.com" })
    ).toHaveAttribute("href", "mailto:cleannz10@gmail.com");
    await expect(page.getByText("Monday – Friday")).toBeVisible();
    await expect(page.getByText("Saturday")).toBeVisible();
    await expect(page.getByRole("link", { name: /View all service areas/i })).toHaveAttribute(
      "href",
      /regions\.html/
    );
  });

  test("home service preview cards link to services", async ({ page }) => {
    await page.goto("/");
    const residentialLink = page.getByRole("link", { name: /Explore residential/i });
    await expect(residentialLink).toHaveAttribute("href", /services\.html#residential/);
  });
});
