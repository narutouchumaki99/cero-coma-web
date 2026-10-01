(function () {
  "use strict";

  // Medición con GA4 solo con consentimiento. Sin ID en config.js este archivo
  // no hace nada. Con ID: muestra el aviso, carga gtag.js únicamente si se
  // acepta y envía unos pocos eventos de clic con nombre propio.

  const config = window.CEROCOMA_CONFIG || {};
  const id = config.analytics && config.analytics.ga4MeasurementId;
  if (!id || !/^G-[A-Z0-9]+$/.test(id)) return;

  const STORAGE_KEY = "cerocoma-consent";
  const root = (document.body && document.body.dataset.siteRoot) || "./";
  let loaded = false;

  function readChoice() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      return null;
    }
  }

  function saveChoice(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch (error) {
      // Sin almacenamiento la elección dura lo que la visita.
    }
  }

  function gtag() {
    window.dataLayer.push(arguments);
  }

  function load() {
    if (loaded) return;
    loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = gtag;
    gtag("consent", "default", {
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied"
    });
    gtag("js", new Date());
    gtag("config", id);

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
    document.head.append(script);
  }

  function revoke() {
    if (window.gtag) window.gtag("consent", "update", { analytics_storage: "denied" });
    // Borra las cookies _ga del dominio para que el rechazo sea efectivo ya.
    document.cookie.split(";").forEach((cookie) => {
      const name = cookie.split("=")[0].trim();
      if (!name.startsWith("_ga")) return;
      const domain = location.hostname.replace(/^www\./, "");
      document.cookie = `${name}=; Max-Age=0; path=/; domain=.${domain}`;
      document.cookie = `${name}=; Max-Age=0; path=/`;
    });
  }

  function track(name, params) {
    if (loaded && window.gtag) window.gtag("event", name, params || {});
  }

  // Un solo listener: clasifica el clic por el destino del enlace.
  function classify(link) {
    const href = link.getAttribute("href") || "";
    if (href.startsWith("https://wa.me/")) return "click_whatsapp";
    if (href.startsWith("mailto:")) return "click_email";
    if (href.startsWith("tel:")) return "click_phone";
    if (/faena\.cerocomasoluciones\.com\/menu\//.test(href)) return "view_menu_example";
    if (/faena\.cerocomasoluciones\.com\/?$/.test(href)) return "click_faena_app";
    if (/(^|\/)faena\/?$/.test(href)) return "click_cta";
    return null;
  }

  document.addEventListener("click", (event) => {
    const link = event.target.closest && event.target.closest("a[href]");
    if (!link) return;
    const name = classify(link);
    if (name) {
      track(name, {
        link_text: link.textContent.trim().slice(0, 80),
        link_url: link.href,
        page_path: location.pathname
      });
    }
  });

  function banner() {
    const node = document.createElement("div");
    node.className = "consent";
    node.setAttribute("role", "region");
    node.setAttribute("aria-label", "Aviso de cookies");
    node.innerHTML = `
      <p>Usamos Google Analytics para saber qué páginas se visitan y mejorar la web. Solo se activa si lo aceptas. <a href="${root}privacidad/#navegador">Más información</a>.</p>
      <div class="consent__actions">
        <button class="button button--light" type="button" data-consent="granted">Aceptar medición</button>
        <button class="button consent__reject" type="button" data-consent="denied">Rechazar</button>
      </div>`;
    node.addEventListener("click", (event) => {
      const button = event.target.closest("[data-consent]");
      if (!button) return;
      const value = button.dataset.consent;
      saveChoice(value);
      if (value === "granted") load();
      else revoke();
      node.remove();
    });
    document.body.append(node);
  }

  // La política de privacidad tiene dos variantes de la sección de cookies;
  // solo con un ID configurado es verdad la que habla de Google Analytics.
  document.querySelectorAll("[data-analytics-state]").forEach((node) => {
    node.hidden = node.dataset.analyticsState !== "on";
  });

  document.querySelectorAll("[data-cookie-settings]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!document.querySelector(".consent")) banner();
    });
  });

  const choice = readChoice();
  if (choice === "granted") load();
  else if (choice !== "denied") banner();
})();
