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
| `candidate/rendered/cero-idle.webp` | Estado neutral | Render del modelo 3D aportado por el propietario | `staging-candidate` | Solo staging |
| `candidate/rendered/cero-focus.webp` | Estado de enfoque | Render del modelo 3D aportado por el propietario | `staging-candidate` | Solo staging |
| `candidate/rendered/cero-think.webp` | Estado de orden | Render del modelo 3D aportado por el propietario | `staging-candidate` | Solo staging |
| `candidate/rendered/cero-build.webp` | Estado de construcción | Render del modelo 3D aportado por el propietario | `staging-candidate` | Solo staging |
| `candidate/rendered/cero-ready.webp` | Estado listo | Render del modelo 3D aportado por el propietario | `staging-candidate` | Solo staging |
| `assets/media/mascot/manifest.json` | Registro público de versión, dimensiones, procedencia y revisión | Documentación de esta entrega | Vigente | Público en staging |
| `assets/media/mascot/cero.glb` | Avatar 3D animado de la guía CERO (5 clips: idle/focus/think/build/ready; solo escritorio) | Derivado optimizado y riggeado del modelo del propietario | `staging-candidate` | Solo staging |
| `assets/vendor/model-viewer/` | Visor `model-viewer` 4.3.1 alojado en local | Google, licencia Apache-2.0 incluida | Vigente | Público en staging |

El modelo fuente es un GLB de 13.389.496 bytes, 1.935.288 triángulos, 992.914 vértices, tres texturas y ninguna animación o esqueleto. Se conserva fuera del repositorio público por peso. Para la guía se publica un **derivado optimizado** (`cero.glb`, 322.804 bytes: ~8,5k vértices, cuantización KHR, texturas 1024/512 px) verificado por huella en el manifiesto y el validador. Los cinco renders WebP (49.046 bytes en conjunto) siguen siendo la entrega para móvil, ahorro de datos y equipos sin WebGL.

Derechos (3 de agosto de 2026): el propietario confirmó en sesión que el modelo es de su autoría (generado por él con Tripo). Con esa confirmación se autoriza la publicación del derivado en staging; el GLB fuente permanece fuera del repositorio.
