# CleanWellington — Static Website

English-language static site for a Wellington, NZ cleaning service. Five pages, editorial-coastal design, Google Calendar booking, and quote form → Google Sheet.

## Pages

| Page | File | Purpose |
|------|------|---------|
| Home | `index.html` | Hero, service preview, CTAs |
| Services | `services.html` | Residential, deep clean, move, office |
| Areas | `regions.html` | Wellington suburbs + stylised map |
| Quote | `quote.html` | Quote form → Google Sheet + email |
| Contact | `contact.html` | Email, hours, booking |

## Local preview

```bash
cd website
python3 -m http.server 8080
```

Open [http://localhost:8080](http://localhost:8080).

## Configuration

Edit [`assets/js/config.js`](assets/js/config.js):

- **`BOOKING_URL`** — Google Calendar template (default adds `cleannz10@gmail.com`). Replace with an [Appointment Schedules](https://support.google.com/calendar/answer/10729749) link if you enable it.
- **`SHEET_WEBAPP_URL`** — Deployed Apps Script web app URL (required for quote form).
- **`FORM_SECRET`** — Optional; must match `SECRET_TOKEN` in Apps Script.

## Quote form → Google Sheet

See **[integrations/google-apps-script/SETUP.md](integrations/google-apps-script/SETUP.md)** for one-time setup.

## Functional tests (Playwright)

```bash
npm install
npx playwright install chromium
npm test
```

Tests cover navigation, booking links, quote form validation/submission (mocked API), mobile menu, and page content. Reports are written to `playwright-report/` after a run.

## Deploy

Upload the entire `website` folder to any static host (Netlify, GitHub Pages, Cloudflare Pages, S3, etc.). No build step required.

## Hero image

Home hero: [Unsplash — waterfront/interior](https://unsplash.com/photos/photo-1566073771259-6a8506099945) (loaded via CDN). Replace with your own image in `index.html` and `assets/img/` if preferred.

## Design

Built following the project `/frontend_design` skill: Fraunces + Instrument Sans, harbour teal / sand / copper palette, asymmetric layouts, CSS motion with `prefers-reduced-motion` support.
