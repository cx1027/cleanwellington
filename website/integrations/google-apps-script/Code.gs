/**
 * CleanWellington Quote Form → Google Sheet + Email
 *
 * Setup: see SETUP.md in this folder.
 */

const SHEET_ID = "YOUR_SPREADSHEET_ID_HERE";
const SHEET_NAME = "Quotes";
const NOTIFY_EMAIL = "cleannz10@gmail.com";
// Optional: set a random string and match SITE_CONFIG.FORM_SECRET in config.js
const SECRET_TOKEN = "";

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);

    if (SECRET_TOKEN && body.secret !== SECRET_TOKEN) {
      return jsonResponse({ success: false, error: "Unauthorized" }, 403);
    }

    if (body.website) {
      return jsonResponse({ success: true });
    }

    const name = (body.name || "").trim();
    const email = (body.email || "").trim();
    const phone = (body.phone || "").trim();
    const suburb = (body.suburb || "").trim();
    const service = (body.service || "").trim();

    if (!name || !email || !phone || !suburb || !service) {
      return jsonResponse({ success: false, error: "Missing required fields" }, 400);
    }

    const row = [
      new Date(),
      name,
      email,
      phone,
      suburb,
      service,
      (body.propertySize || "").trim(),
      body.preferredDate || "",
      (body.message || "").trim(),
    ];

    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    if (!sheet) {
      throw new Error('Sheet tab named "' + SHEET_NAME + '" not found');
    }
    sheet.appendRow(row);

    const subject = "CleanWellington quote: " + name + " — " + service;
    const text =
      "New quote request\n\n" +
      "Name: " + name + "\n" +
      "Email: " + email + "\n" +
      "Phone: " + phone + "\n" +
      "Suburb: " + suburb + "\n" +
      "Service: " + service + "\n" +
      "Property size: " + (body.propertySize || "—") + "\n" +
      "Preferred date: " + (body.preferredDate || "—") + "\n" +
      "Message:\n" + (body.message || "—");

    MailApp.sendEmail(NOTIFY_EMAIL, subject, text);

    return jsonResponse({ success: true });
  } catch (err) {
    return jsonResponse({ success: false, error: String(err.message) }, 500);
  }
}

function jsonResponse(obj, statusCode) {
  const output = ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
  return output;
}
