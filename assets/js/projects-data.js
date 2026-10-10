(function () {
  "use strict";

  window.CEROCOMA_PROJECTS = Object.freeze([
    Object.freeze({
      id: "tu-carta",
      slug: "faena",
      name: "FAENA",
      category: "Producto",
      status: "En producción",
      featured: true,
      visibility: "public",
      summary: "Carta digital editable, publicación por versiones y QR permanente para bares, cafeterías y restaurantes.",
      problem: "Actualizar una carta no debería exigir maquetar otra web ni reimprimir el QR.",
      audience: "Negocios de hostelería que necesitan una carta clara y mantenible.",
      currentState: "App publicada con Gratis, Básico, Pro y Red. La importación se revisa antes de publicar; Básico y Pro se activan por contacto y Red sigue en piloto acompañado.",
      workingFeatures: Object.freeze([
        "Editor y publicación por versiones con QR permanente",
        "Importación de fotos o PDF con revisión humana",
        "Fotos, estilos, logo y filtros de dieta desde Básico",
        "Idiomas y Decide en CeroComa en Pro y Red",
        "Equipo, mesas y comandas en Red, con puesta en marcha acompañada"
      ]),
      simulatedFeatures: Object.freeze([]),
      nextMilestone: "Validar la operación de Red en locales reales y medir tiempo de publicación y costes de IA.",
      blockers: Object.freeze([
        "Cupos, zonas, precio y avisos con móvil bloqueado de Red pendientes de aceptación",
        "Costes y topes de IA todavía provisionales",
        "Sin pago desde la carta ni cobro automático de planes"
      ]),
      publicRoute: "faena/",
      lastUpdated: "2026-10-10",
      media: Object.freeze([])
    }),
    Object.freeze({
      id: "producciones",
      slug: "producciones",
      name: "CeroComa Producciones",
      category: "Servicio",
      status: "Por encargo",
      featured: false,
      visibility: "public",
      summary: "Webs que se recorren como una película, imágenes, vídeo y 3D a partir de tu producto real.",
      problem: "Un buen producto necesita una presentación clara que ayude a enseñarlo y venderlo.",
      audience: "Negocios que necesitan presentar productos, espacios o servicios en su web y redes.",
      currentState: "Servicio público por encargo, con presupuesto acordado y cuatro ejemplos de marcas inventadas identificados como demostraciones.",
      workingFeatures: Object.freeze([
        "Guion y web de una página con escenas al bajar",
        "Imágenes y vídeo con IA a partir del producto real",
        "3D cuando el producto lo necesita",
        "Adaptación móvil y material vertical para redes"
      ]),
      simulatedFeatures: Object.freeze([
        "La Maqueta, Del Cafeto, Mechada Hot y Duero Lento son marcas inventadas para mostrar la técnica"
      ]),
      nextMilestone: "Preparar cada encargo con producto, guion, alcance y presupuesto acordados.",
      blockers: Object.freeze([
        "Material y permisos del cliente antes de producir y publicar"
      ]),
      publicRoute: "producciones/",
      lastUpdated: "2026-10-10",
      media: Object.freeze([])
    })
  ]);
})();
