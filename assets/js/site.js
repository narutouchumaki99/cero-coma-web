(function () {
  "use strict";

  const config = window.CEROCOMA_CONFIG || {};

  function setupYear() {
    document.querySelectorAll("[data-current-year]").forEach((node) => {
      node.textContent = String(new Date().getFullYear());
    });
  }

  function setupMobileMenu() {
    const dialog = document.querySelector("[data-menu-dialog]");
    const openButton = document.querySelector("[data-menu-open]");
    const closeButton = dialog && dialog.querySelector("[data-menu-close]");

    if (!dialog || !openButton || !closeButton || typeof dialog.showModal !== "function") {
      return;
    }

    openButton.addEventListener("click", () => {
      dialog.showModal();
      openButton.setAttribute("aria-expanded", "true");
      closeButton.focus();
    });

    closeButton.addEventListener("click", () => dialog.close());

    dialog.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => dialog.close());
    });

    dialog.addEventListener("close", () => {
      openButton.setAttribute("aria-expanded", "false");
      openButton.focus();
    });
  }

  function setupContactLinks() {
    const region = document.querySelector("[data-contact-region]");
    if (!region) return;

    const contacts = config.contacts || {};
    const values = [
      contacts.email ? { label: "Escribir por correo", href: `mailto:${contacts.email}` } : null,
      contacts.phone ? { label: "Llamar", href: `tel:${contacts.phone}` } : null,
      contacts.whatsapp ? { label: "Abrir WhatsApp", href: contacts.whatsapp } : null,
      contacts.linkedin ? { label: "Ver LinkedIn", href: contacts.linkedin } : null
    ].filter(Boolean);

    if (!values.length || !config.features || !config.features.contactLinks) return;

    const state = region.querySelector("[data-contact-state]");
    const list = region.querySelector("[data-contact-links]");
    if (!state || !list) return;

    state.textContent = "Elige un canal de contacto.";
    values.forEach(({ label, href }) => {
      const link = document.createElement("a");
      link.className = "button button--dark";
      link.href = href;
      link.textContent = label;
      if (/^https?:/.test(href)) {
        link.target = "_blank";
        link.rel = "noreferrer";
      }
      list.append(link);
    });
    list.hidden = false;
  }

  function setupCompressor() {
    const compressor = document.querySelector("[data-compressor]");
    if (!compressor) return;

    const range = compressor.querySelector("input[type='range']");
    const decrease = compressor.querySelector("[data-compressor-decrease]");
    const increase = compressor.querySelector("[data-compressor-increase]");
    const status = compressor.querySelector("[data-compressor-status]");
    const result = compressor.querySelector("[data-compressor-result]");
    const steps = Array.from(compressor.querySelectorAll("[data-compressor-step]"));
    const messages = [
      "Cinco partes todavía separadas.",
      "La información empieza a ordenarse.",
      "Las piezas comparten una misma lógica.",
      "El recorrido queda listo para activarse.",
      "Listo para funcionar."
    ];

    if (!range || !decrease || !increase || !status || !result || steps.length !== messages.length) return;

    function render(announce) {
      const level = Number(range.value);
      compressor.dataset.level = String(level);
      steps.forEach((step, index) => {
        const active = index <= level;
        step.dataset.active = String(active);
        step.setAttribute("aria-hidden", String(!active));
      });
      decrease.disabled = level === Number(range.min);
      increase.disabled = level === Number(range.max);
      range.setAttribute("aria-valuetext", messages[level]);
      result.textContent = messages[level];
      if (announce) status.textContent = messages[level];
    }

    range.addEventListener("input", () => render(true));
    decrease.addEventListener("click", () => {
      range.value = String(Math.max(Number(range.min), Number(range.value) - 1));
      render(true);
      range.focus();
    });
    increase.addEventListener("click", () => {
      range.value = String(Math.min(Number(range.max), Number(range.value) + 1));
      render(true);
      range.focus();
    });

    render(false);
  }

  setupYear();
  setupMobileMenu();
  setupContactLinks();
  setupCompressor();
})();

