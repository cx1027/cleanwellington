(function () {
  const form = document.getElementById("quote-form");
  const successPanel = document.getElementById("form-success");
  const formWrap = document.getElementById("form-wrap");
  const alertBox = document.getElementById("form-alert");
  if (!form) return;

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    field.classList.add("error");
    let msg = field.parentElement.querySelector(".error-msg");
    if (!msg) {
      msg = document.createElement("span");
      msg.className = "error-msg";
      msg.setAttribute("role", "alert");
      field.parentElement.appendChild(msg);
    }
    msg.textContent = message;
  }

  function clearErrors() {
    form.querySelectorAll(".error").forEach((el) => el.classList.remove("error"));
    form.querySelectorAll(".error-msg").forEach((el) => el.remove());
    if (alertBox) alertBox.hidden = true;
  }

  function validate() {
    clearErrors();
    let valid = true;

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();
    const suburb = form.suburb.value.trim();
    const service = form.service.value;
    const honeypot = form.website?.value;

    if (honeypot) return false;

    if (!name) {
      showError("name", "Please enter your name");
      valid = false;
    }
    if (!email || !emailRe.test(email)) {
      showError("email", "Please enter a valid email");
      valid = false;
    }
    if (!phone) {
      showError("phone", "Please enter your phone number");
      valid = false;
    }
    if (!suburb) {
      showError("suburb", "Please enter your suburb");
      valid = false;
    }
    if (!service) {
      showError("service", "Please select a service");
      valid = false;
    }

    return valid;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const url = SITE_CONFIG.SHEET_WEBAPP_URL;
    if (!url) {
      if (alertBox) {
        alertBox.hidden = false;
        alertBox.textContent =
          "Quote form is not connected yet. Please email us at cleannz10@gmail.com or ask the site owner to configure Google Sheets.";
        alertBox.className = "form-alert form-alert--error";
      }
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.classList.add("is-loading");

    const payload = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      suburb: form.suburb.value.trim(),
      service: form.service.value,
      propertySize: form.propertySize?.value?.trim() || "",
      preferredDate: form.preferredDate?.value || "",
      message: form.message?.value?.trim() || "",
      secret: SITE_CONFIG.FORM_SECRET || "",
    };

    try {
      const res = await fetch(url, {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Submission failed");
      }

      form.reset();
      if (formWrap) formWrap.hidden = true;
      if (successPanel) successPanel.classList.add("is-visible");
    } catch (err) {
      console.error(err);
      if (alertBox) {
        alertBox.hidden = false;
        alertBox.textContent =
          "Something went wrong. Please try again or email cleannz10@gmail.com directly.";
        alertBox.className = "form-alert form-alert--error";
      }
    } finally {
      submitBtn.disabled = false;
      submitBtn.classList.remove("is-loading");
    }
  });
})();
