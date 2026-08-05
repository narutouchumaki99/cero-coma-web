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
      // URL pública de la app de Tu carta. Verificada en línea el 3-08-2026.
      url: "https://cerocoma-menu.vercel.app"
    }),
    contacts: Object.freeze({
      email: "avancemos@cerocomasoluciones.com",
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
