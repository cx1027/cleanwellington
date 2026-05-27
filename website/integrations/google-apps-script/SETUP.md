# Google Sheet setup for quote form

Follow these steps once, logged in as **cleannz10@gmail.com**.

## 1. Create the spreadsheet

1. Go to [Google Sheets](https://sheets.google.com) → **Blank spreadsheet**.
2. Name it **CleanWellington Quote Requests**.
3. Rename the first tab to **Quotes** (exact name).
4. Add this header row in row 1:

   | Timestamp | Name | Email | Phone | Suburb | Service | Property Size | Preferred Date | Message |

5. Copy the **Spreadsheet ID** from the URL:
   `https://docs.google.com/spreadsheets/d/THIS_PART_IS_THE_ID/edit`

## 2. Add the script

1. In the spreadsheet: **Extensions → Apps Script**.
2. Delete any default code and paste the contents of [`Code.gs`](./Code.gs).
3. Set `SHEET_ID` to your spreadsheet ID.
4. Confirm `NOTIFY_EMAIL` is `cleannz10@gmail.com`.
5. (Optional) Set `SECRET_TOKEN` to a random string, then set the same value in `assets/js/config.js` as `FORM_SECRET`.
6. **Save** the project.

## 3. Deploy as web app

1. Click **Deploy → New deployment**.
2. Type: **Web app**.
3. **Execute as**: Me (`cleannz10@gmail.com`).
4. **Who has access**: Anyone.
5. Click **Deploy** and authorize when prompted.
6. Copy the **Web app URL** (ends with `/exec`).

## 4. Connect the website

1. Open [`assets/js/config.js`](../../assets/js/config.js).
2. Set `SHEET_WEBAPP_URL` to your Web app URL.
3. Save and re-upload / redeploy your static site.

## 5. Test

1. Open `quote.html` on your live or local site.
2. Submit a test quote.
3. Check the **Quotes** sheet for a new row and your inbox for the notification email.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Form says "not connected" | `SHEET_WEBAPP_URL` is empty in `config.js` |
| CORS / network error | Redeploy web app; ensure access is **Anyone** |
| Sheet not found | Tab must be named **Quotes** exactly |
| No email | Check spam; confirm MailApp authorization on first run |

After changing `Code.gs`, create a **New deployment** (or manage versions) so the live URL uses the latest code.
