(function () {
  "use strict";

  window.CEROCOMA_PROJECTS = Object.freeze([
    Object.freeze({
      id: "tu-carta",
      slug: "faena",
      name: "FAENA",
      category: "Producto",
      status: "Desarrollo activo",
      featured: true,
      visibility: "public",
      summary: "Un flujo para convertir una carta existente en una versión digital editable, publicable y conectada a un QR permanente.",
      problem: "Publicar y mantener una carta digital suele repartir el trabajo entre archivos, maquetación, enlaces y códigos QR.",
      audience: "Negocios de hostelería que necesitan una carta digital clara y mantenible.",
      currentState: "Aplicación desplegada y en uso: editor, publicación con QR permanente, equipo con roles e invitaciones por correo. La extracción con proveedor real exige revisión humana antes de tocar la carta.",
      workingFeatures: Object.freeze([
        "Edición manual de categorías y productos",
        "Publicación versionada con dirección permanente",
        "Generación y descarga de QR",
        "Subida y preparación de páginas",
        "Extracción real validada con revisión humana obligatoria",
        "Aprobación de resultados revisados al borrador editable",
        "Equipo con roles: propietario, gerente y personal",
        "Invitaciones por correo con la identidad de CeroComa"
      ]),
      simulatedFeatures: Object.freeze([
        "La demostración de esta web explica el flujo con archivos de ejemplo, sin conexión al producto ni a la IA"
      ]),
      nextMilestone: "Cerrar el procesamiento duradero y ejecutar un piloto controlado con un negocio real.",
      blockers: Object.freeze([
        "Procesamiento duradero (cola persistente)",
        "Piloto con un negocio real"
      ]),
      publicRoute: "faena/",
      lastUpdated: "2026-08-11",
      media: Object.freeze([])
    }),
    Object.freeze({
      id: "producciones",
      slug: "producciones",
      name: "CeroComa Producciones",
      category: "Servicio",
      status: "Ejemplos publicados",
      featured: false,
      visibility: "public",
      summary: "Webs de una sola página que se recorren como una película al bajar, con el producto del negocio en el centro de cada escena.",
      problem: "Un buen producto se pierde en una web plana o en una foto suelta: no se ve de dónde viene, cómo se hace ni el detalle que lo hace distinto.",
      audience: "Negocios con un producto que luce al enseñarlo: hostelería, cafeterías, bodegas e inmobiliarias.",
      currentState: "Cuatro ejemplos con marcas inventadas y dos piezas propias publicadas: la historia de CeroComa y el recorrido de FAENA. Las imágenes se hacen con IA, y se dice.",
      workingFeatures: Object.freeze([
        "Recorrido en vídeo al hacer scroll, en el móvil y en el ordenador",
        "Escenas en 3D en tiempo real cuando el producto pide girarlo",
        "Guion escrito y enseñado antes de producir nada",
        "Botón de WhatsApp al final de la película",
        "Vídeo vertical para redes con el mismo material"
      ]),
      simulatedFeatures: Object.freeze([
        "Los ejemplos son marcas inventadas: sus negocios, datos y pedidos son de demostración"
      ]),
      nextMilestone: "Primer encargo con un negocio real y su producto de verdad.",
      blockers: Object.freeze([
        "Primer cliente real"
      ]),
      publicRoute: "producciones/",
      lastUpdated: "2026-10-10",
      media: Object.freeze([])
    }),
    Object.freeze({
      id: "studio",
      slug: "cero-coma-studio",
      name: "CeroComa Studio",
      category: "Servicio",
      status: "Validación comercial",
      featured: false,
      // Despublicado el 1-10-2026: la web se centra solo en FAENA.
      visibility: "private",
      summary: "Una línea de trabajo para convertir espacios, ideas y propuestas comerciales en materiales visuales comprensibles.",
      problem: "Muchos negocios necesitan mostrar una transformación o propuesta antes de poder construirla o venderla.",
      audience: "Negocios y profesionales que necesitan explicar visualmente una propuesta de espacio o servicio.",
      currentState: "Propuesta en validación comercial. Los materiales públicos aún están sujetos a permiso y revisión de privacidad.",
      workingFeatures: Object.freeze([
        "Definición de propuesta visual",
        "Preparación de demostraciones y prototipos interactivos",
        "Validación comercial directa"
      ]),
      simulatedFeatures: Object.freeze([]),
      nextMilestone: "Validar el servicio con una colaboración real y autorizar una muestra publicable.",
      blockers: Object.freeze([
        "Permiso de publicación de medios",
        "Recorte y eliminación de datos identificables",
        "Primera validación comercial"
      ]),
      publicRoute: "",
      lastUpdated: "2026-08-01",
      media: Object.freeze([])
    })
  ]);
})();

