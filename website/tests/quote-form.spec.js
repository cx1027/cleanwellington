// @ts-check
const { test, expect } = require("@playwright/test");
const { setSheetWebappUrl, fillValidQuoteForm } = require("./helpers");

test.describe("Quote form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/quote.html");
  });

  test("shows validation errors when required fields are empty", async ({ page }) => {
    await page.getByRole("button", { name: /Send quote request/i }).click();
    await expect(page.locator("#name.error")).toBeVisible();
    await expect(page.locator("#email.error")).toBeVisible();
    await expect(page.locator("#phone.error")).toBeVisible();
    await expect(page.locator("#suburb.error")).toBeVisible();
    await expect(page.locator("#service.error")).toBeVisible();
    await expect(page.getByText("Please enter your name")).toBeVisible();
  });

  test("shows error for invalid email", async ({ page }) => {
    await page.locator("#name").fill("Test User");
    await page.locator("#email").fill("not-an-email");
    await page.locator("#phone").fill("021 000 0000");
    await page.locator("#suburb").fill("CBD");
    await page.locator("#service").selectOption("Residential");
    await page.getByRole("button", { name: /Send quote request/i }).click();
    await expect(page.locator("#email.error")).toBeVisible();
    await expect(page.getByText("Please enter a valid email")).toBeVisible();
  });

  test("shows not-connected message when SHEET_WEBAPP_URL is empty", async ({ page }) => {
    await fillValidQuoteForm(page);
    await page.getByRole("button", { name: /Send quote request/i }).click();
    const alert = page.locator("#form-alert");
    await expect(alert).toBeVisible();
    await expect(alert).toContainText(/not connected yet/i);
    await expect(alert).toContainText("cleannz10@gmail.com");
    await expect(page.locator("#form-wrap")).toBeVisible();
  });

  test("shows success panel after successful submission", async ({ page }) => {
    const mockUrl = "https://script.google.com/macros/s/mock/exec";
    await setSheetWebappUrl(page, mockUrl);

    await page.route(mockUrl, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true }),
      });
    });

    await fillValidQuoteForm(page);
    await page.getByRole("button", { name: /Send quote request/i }).click();

    await expect(page.locator("#form-success.is-visible")).toBeVisible();
    await expect(page.locator("#form-success")).toContainText(/Thank you/i);
    await expect(page.locator("#form-wrap")).toBeHidden();
    await expect(
      page.locator("#form-success").getByRole("link", { name: /Book on Google Calendar/i })
    ).toBeVisible();
  });

  test("shows error when API returns failure", async ({ page }) => {
    const mockUrl = "https://script.google.com/macros/s/mock-fail/exec";
    await setSheetWebappUrl(page, mockUrl);

    await page.route(mockUrl, async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ success: false, error: "Server error" }),
      });
    });

    await fillValidQuoteForm(page);
    await page.getByRole("button", { name: /Send quote request/i }).click();

    const alert = page.locator("#form-alert");
    await expect(alert).toBeVisible();
    await expect(alert).toContainText(/Something went wrong/i);
    await expect(page.locator("#form-wrap")).toBeVisible();
  });

  test("honeypot blocks submission silently", async ({ page }) => {
    await fillValidQuoteForm(page);
    await page.locator("#website").fill("spam-bot");
    await page.getByRole("button", { name: /Send quote request/i }).click();
    await expect(page.locator("#form-alert")).toBeHidden();
    await expect(page.locator("#form-success")).not.toHaveClass(/is-visible/);
    await expect(page.locator("#form-wrap")).toBeVisible();
  });
});
