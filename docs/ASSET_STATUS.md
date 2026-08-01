# Estado y procedencia de activos

Fecha de revisión: 1 de agosto de 2026.

## Identidad maestra

Los archivos de `assets/media/brand/approved/` proceden del Brand Kit 1.0 y son la única fuente usada para símbolo, wordmark, favicon e icono de aplicación.

| Archivo | Uso | Procedencia | Estado |
| --- | --- | --- | --- |
| `symbol-primary.svg` | Símbolo sobre fondo claro | Brand Kit 1.0 / maestros | Aprobado |
| `symbol-primary-white.svg` | Símbolo sobre fondo oscuro | Brand Kit 1.0 / maestros | Aprobado |
| `symbol-active.svg` | Estado activo claro | Brand Kit 1.0 / maestros | Aprobado; reservado a proceso |
| `symbol-active-white.svg` | Estado activo oscuro | Brand Kit 1.0 / maestros | Aprobado; reservado a proceso |
| `wordmark-horizontal-brand.svg` | Cabecera clara | Brand Kit 1.0 / maestros | Aprobado |
| `wordmark-horizontal-white.svg` | Pie oscuro | Brand Kit 1.0 / maestros | Aprobado |
| `favicon.svg`, `favicon.ico`, `app-icon.svg` | Identidad de navegador y aplicación | Brand Kit 1.0 | Aprobado |

## Iconos auxiliares

Los iconos de `assets/icons/` proceden del paquete de recursos visuales v0.3. Se usan solo como pictogramas funcionales; ningún logotipo provisional de ese paquete se ha incorporado.

- Procedencia: paquete interno v0.3, carpetas de iconos web y flujo de Carta.
- Estado: vector auxiliar provisional apto para prototipo web.
- Autorización: uso interno concedido por el alcance de esta implementación.
- Tratamiento: decorativos cuando el texto contiguo ya comunica la función; en esos casos llevan texto alternativo vacío.

## Tipografía

| Activo | Procedencia | Licencia | Estado |
| --- | --- | --- | --- |
| `manrope-latin.woff2` | Subconjunto generado por `next/font` desde Google Fonts | SIL OFL 1.1 | Autocontenido |
| `manrope-latin-ext.woff2` | Subconjunto generado por `next/font` desde Google Fonts | SIL OFL 1.1 | Autocontenido |
| `OFL.txt` | Repositorio oficial de Google Fonts | SIL OFL 1.1 | Incluido |

## Medios de proyecto

`window.CEROCOMA_PROJECTS` usa la interfaz de medios con campos de ruta, dimensiones, texto alternativo, procedencia, autorización y estado cuando exista material publicable. En esta versión ambos arrays están vacíos:

- Tu carta se representa con composiciones HTML y CSS, no con capturas que puedan mostrar datos de prueba.
- Studio omite por completo el medio hasta disponer de permiso y una versión sin datos identificables.

## Mascota CERO

| Archivo | Uso | Procedencia | Estado | Autorización |
| --- | --- | --- | --- | --- |
| `assets/media/mascot/candidate/cero-web-v1.svg` | Maestro vectorial reutilizable | Especificación propia del personaje CERO y sistema visual Cero Coma 1.0 | `staging-candidate` | Solo staging |
| SVG embebido en `index.html` | Reacciones por estado dentro del Compresor conceptual | Adaptación interactiva del maestro | `staging-candidate` | Solo staging |
| `assets/media/mascot/manifest.json` | Registro público de versión, dimensiones, procedencia y revisión | Documentación de esta entrega | Vigente | Público en staging |

El candidato usa únicamente geometría vectorial y colores planos. No incorpora renders previos, fotografía, vídeo, filtros, gradientes ni recursos de terceros. La comprobación formal de originalidad y derechos sigue pendiente y bloquea su paso a producción.
