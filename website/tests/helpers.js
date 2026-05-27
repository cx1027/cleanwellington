/** @param {import('@playwright/test').Page} page */
async function clickNavLink(page, label) {
  const toggle = page.getByRole("button", { name: "Open menu" });
  if (await toggle.isVisible()) {
    await toggle.click();
    await page.locator("#site-nav").waitFor({ state: "visible" });
  }
  await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: label }).click();
}

/** @param {import('@playwright/test').Page} page */
async function setSheetWebappUrl(page, url) {
  await page.evaluate((webappUrl) => {
    // eslint-disable-next-line no-undef
    SITE_CONFIG.SHEET_WEBAPP_URL = webappUrl;
  }, url);
}

/** @param {import('@playwright/test').Page} page */
async function fillValidQuoteForm(page) {
  await page.locator("#name").fill("Jane Tester");
  await page.locator("#email").fill("jane@example.com");
  await page.locator("#phone").fill("021 123 4567");
  await page.locator("#suburb").fill("Te Aro");
  await page.locator("#service").selectOption("Residential");
  await page.locator("#propertySize").fill("2 bed");
}

module.exports = { clickNavLink, setSheetWebappUrl, fillValidQuoteForm };
