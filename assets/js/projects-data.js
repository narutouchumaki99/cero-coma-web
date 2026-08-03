(function () {
  "use strict";

  window.CEROCOMA_PROJECTS = Object.freeze([
    Object.freeze({
      id: "tu-carta",
      slug: "tu-carta-en-cero-coma",
      name: "Tu carta en Cero Coma",
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
        "Invitaciones por correo con la identidad de Cero Coma"
      ]),
      simulatedFeatures: Object.freeze([
        "La demostración de esta web explica el flujo con archivos de ejemplo, sin conexión al producto ni a la IA"
      ]),
      nextMilestone: "Cerrar el procesamiento duradero y ejecutar un piloto controlado con un negocio real.",
      blockers: Object.freeze([
        "Procesamiento duradero (cola persistente)",
        "Piloto con un negocio real"
      ]),
      publicRoute: "tu-carta-en-cero-coma/",
      lastUpdated: "2026-08-03",
      media: Object.freeze([])
    }),
    Object.freeze({
      id: "studio",
      slug: "cero-coma-studio",
      name: "Cero Coma Studio",
      category: "Servicio",
      status: "Validación comercial",
      featured: false,
      visibility: "public",
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

