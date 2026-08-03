(function () {
  "use strict";

  window.CEROCOMA_CONFIG = Object.freeze({
    brand: Object.freeze({
      name: "Cero Coma",
      tagline: "De la intención a la realidad.",
      promise: "Cero Coma convierte lo complicado en algo listo para funcionar.",
      version: "1.0"
    }),
    site: Object.freeze({
      environment: "staging",
      publicDomain: "cerocomasoluciones.com",
      stagingUrl: "https://narutouchumaki99.github.io/cero-coma-web/",
      repositoryBase: "/cero-coma-web/",
      lastUpdated: "2026-08-01"
    }),
    app: Object.freeze({
      // URL pública de la app de Tu carta. Verificada en línea el 3-08-2026.
      url: "https://cerocoma-menu.vercel.app"
    }),
    contacts: Object.freeze({
      email: "",
      phone: "",
      whatsapp: "",
      linkedin: ""
    }),
    features: Object.freeze({
      conceptCompressor: true,
      mascotDemo: true,
      projectSearch: true,
      projectDialog: true,
      contactLinks: false,
      studioMedia: false,
      customDomain: false
    })
  });
})();
