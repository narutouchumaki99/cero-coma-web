(function () {
  "use strict";

  // El formulario de la portada no manda nada a ningún servidor: compone el
  // mensaje y lo abre en WhatsApp, que es el canal que el titular atiende.
  const formulario = document.querySelector("[data-form-whatsapp]");
  if (!formulario) return;

  const config = window.CEROCOMA_CONFIG || {};
  const whatsapp = (config.contacts && config.contacts.whatsapp) || "https://wa.me/34643403723";

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const negocio = (formulario.elements.negocio.value || "").trim();
    const mensaje = (formulario.elements.mensaje.value || "").trim();

    const partes = ["Hola 3tmen, te escribo desde la web."];
    if (negocio) partes.push(`Mi negocio: ${negocio}.`);
    if (mensaje) partes.push(mensaje);

    const destino = `${whatsapp.split("?")[0]}?text=${encodeURIComponent(partes.join(" "))}`;
    window.open(destino, "_blank", "noopener");
  });
})();
