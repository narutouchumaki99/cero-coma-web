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
      // URL pública de la app de Tu carta. Vacía hasta que exista un despliegue
      // accesible: la demo no muestra enlaces sin destino real.
      url: ""
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
