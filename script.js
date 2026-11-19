/**
 * Canna_MPU – Landingpage Interaktionen (Entwurfsstand)
 * Hinweis: Es werden keinerlei Daten an externe Server oder Tracking-Dienste gesendet.
 */
(function () {
  "use strict";

  /* 1. Mobile Navigation */
  const navToggle = document.getElementById("nav-toggle");
  const siteNav = document.getElementById("site-nav");

  if (navToggle && siteNav) {
    const closeNav = () => {
      siteNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Menü öffnen");
    };

    navToggle.addEventListener("click", () => {
      const isOpen = siteNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Menü schließen" : "Menü öffnen");
    });

    siteNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeNav);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && siteNav.classList.contains("is-open")) {
        closeNav();
        navToggle.focus();
      }
    });
  }

  /* 2. FAQ Akkordeon */
  const triggers = document.querySelectorAll("[data-accordion] .faq-item__trigger");
  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const expanded = trigger.getAttribute("aria-expanded") === "true";
      const panelId = trigger.getAttribute("aria-controls");
      const panel = panelId ? document.getElementById(panelId) : null;

      trigger.setAttribute("aria-expanded", String(!expanded));
      if (panel) {
        panel.hidden = expanded;
      }
    });
  });

  /* 3. Rechtliche Platzhalter-Modals */
  document.querySelectorAll("[data-open-dialog]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-open-dialog");
      const dialog = id ? document.getElementById(id) : null;
      if (dialog && typeof dialog.showModal === "function") {
        dialog.showModal();
      }
    });
  });

  document.querySelectorAll("dialog.legal-dialog").forEach((dialog) => {
    dialog.querySelectorAll("[data-close-dialog]").forEach((closeBtn) => {
      closeBtn.addEventListener("click", () => dialog.close());
    });

    dialog.addEventListener("click", (event) => {
      const rect = dialog.getBoundingClientRect();
      const clickedOutside =
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom;
      if (clickedOutside) {
        dialog.close();
      }
    });
  });

  /* 4. Lead-Formular: Streng lokale Validierung im Entwurfsmodus */
  const form = document.getElementById("lead-form");
  const errorBox = document.getElementById("form-error");
  const resultBox = document.getElementById("form-result");
  const resultSummary = document.getElementById("form-result-summary");

  if (form && errorBox && resultBox && resultSummary) {
    const nameInput = document.getElementById("lead-name");
    const emailInput = document.getElementById("lead-email");
    const consentInput = document.getElementById("lead-consent");

    const showError = (message, focusTarget) => {
      errorBox.textContent = message;
      errorBox.hidden = false;
      resultBox.hidden = true;
      if (focusTarget) {
        focusTarget.setAttribute("aria-invalid", "true");
        focusTarget.focus();
      }
    };

    const clearInvalid = () => {
      [nameInput, emailInput, consentInput].forEach((el) => {
        if (el) el.removeAttribute("aria-invalid");
      });
    };

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      clearInvalid();

      const nameVal = nameInput ? nameInput.value.trim() : "";
      const emailVal = emailInput ? emailInput.value.trim() : "";
      const situationRadio = form.querySelector('input[name="situation"]:checked');
      const situationVal = situationRadio ? situationRadio.value : "";
      const hasConsent = consentInput ? consentInput.checked : false;

      if (nameVal.length < 2) {
        showError("Bitte gib deinen Namen an.", nameInput);
        return;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!emailPattern.test(emailVal)) {
        showError("Bitte gib eine gültige E-Mail-Adresse an.", emailInput);
        return;
      }

      if (!hasConsent) {
        showError(
          "Bitte bestätige die Datenschutz-Einwilligung, um den Anfrageentwurf zu prüfen.",
          consentInput
        );
        return;
      }

      errorBox.hidden = true;
      resultSummary.textContent = [
        "Name: " + nameVal,
        "E-Mail: " + emailVal,
        "Situation: " + situationVal,
        "DSGVO-Einwilligung: erteilt",
        "Status: Lokal geprüft – noch kein Server-Versand (Entwurfsmodus)"
      ].join("\n");
      resultBox.hidden = false;
      resultBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }
})();
