const SITE_CONFIG = {
  businessName: "CleanWellington",
  email: "cleannz10@gmail.com",
  location: "Wellington, New Zealand",
  // Replace with your Google Appointment Schedules URL if you enable it
  BOOKING_URL:
    "https://calendar.google.com/calendar/render?action=TEMPLATE&text=CleanWellington%20Booking&add=cleannz10@gmail.com&details=Please%20include%20your%20phone%20number%20and%20preferred%20service.&location=Wellington%2C%20New%20Zealand",
  // Paste your deployed Apps Script web app URL after setup (see integrations/google-apps-script/SETUP.md)
  SHEET_WEBAPP_URL: "https://script.google.com/macros/s/AKfycbzDn5IrZRAivw24cBh47hPQb_cgDkGQukwlFFR78JxjlxHnYmuJ_5DwefQNOM5ZOFjMbg/exec",
  // Optional shared secret — must match SECRET_TOKEN in Code.gs if set
  FORM_SECRET: "",
};

function applyBookingLinks() {
  document.querySelectorAll("[data-booking]").forEach((el) => {
    el.href = SITE_CONFIG.BOOKING_URL;
    if (el.tagName === "A") {
      el.target = "_blank";
      el.rel = "noopener noreferrer";
    }
  });
}

document.addEventListener("DOMContentLoaded", applyBookingLinks);
