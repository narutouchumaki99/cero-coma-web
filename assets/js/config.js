(function () {
  "use strict";

  window.CEROCOMA_CONFIG = Object.freeze({
    brand: Object.freeze({
      name: "CeroComa",
      tagline: "De la intención a la realidad.",
      promise: "CeroComa convierte lo complicado en algo listo para funcionar.",
      version: "1.0"
    }),
    site: Object.freeze({
      // Web pública e indexable en el dominio propio (Cloudflare Pages) desde
      // el 5 de agosto de 2026, con contacto real publicado.
      environment: "production",
      publicDomain: "cerocomasoluciones.com",
      publicUrl: "https://cerocomasoluciones.com/",
      stagingUrl: "https://narutouchumaki99.github.io/cero-coma-web/",
      repositoryBase: "/",
      lastUpdated: "2026-08-05"
    }),
    app: Object.freeze({
      // URL pública de la app FAENA, en subdominio propio. Verificada en línea
      // el 1-10-2026 (antes, faena-web-two.vercel.app).
      url: "https://faena.cerocomasoluciones.com"
    }),
    analytics: Object.freeze({
      // ID de medición de GA4 («G-XXXXXXXXXX»). Mientras esté vacío no se carga
      // nada, no aparece el aviso de cookies y la política de privacidad sigue
      // diciendo que no hay cookies. Al rellenarlo, analytics.js activa las tres
      // cosas a la vez. No inventar un ID: se copia del panel de GA4.
      ga4MeasurementId: ""
    }),
    contacts: Object.freeze({
      email: "cerocomasoluciones@gmail.com",
      phone: "+34643403723",
      whatsapp: "https://wa.me/34643403723",
      linkedin: ""
    }),
    features: Object.freeze({
      conceptCompressor: true,
      mascotDemo: true,
      projectSearch: true,
      projectDialog: true,
      contactLinks: true,
      studioMedia: false,
      customDomain: true
    })
  });
})();
