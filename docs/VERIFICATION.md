# Matriz de verificación

## Tamaños de navegador

| Anchura × altura | Estado |
| --- | --- |
| 320 × 568 | Superado en las tres páginas |
| 375 × 812 | Superado en las tres páginas |
| 390 × 844 | Superado en las tres páginas |
| 768 × 1024 | Superado en las tres páginas |
| 1024 × 768 | Superado en las tres páginas |
| 1366 × 768 | Superado en las tres páginas |
| 1440 × 900 | Superado en las tres páginas |
| 1920 × 1080 | Superado en las tres páginas |

Esa tabla corresponde a las tres páginas de contenido originales. Las dos páginas legales publicadas el 5 de agosto de 2026 se verificaron aparte, con otro método: ver «Páginas legales» más abajo.

## Comprobaciones

| Área | Evidencia esperada | Estado |
| --- | --- | --- |
| Rutas y enlaces | Script local y recorrido de navegador | Superado |
| Apertura directa | Las tres páginas cargan con `file://` y servidor local | Superado |
| 404 | Documento personalizado válido y ruta desconocida con código 404 | Superado |
| Teclado | Menú, rango, filtros, diálogo y pestañas | Superado |
| Enlace de salto | Primer foco y traslado a `main` | Superado |
| Escape y foco | Cierre de `dialog` y retorno al disparador | Superado |
| Historial y hash | Apertura directa, limpieza al cerrar y botón Atrás | Superado |
| Zoom 200 % | Reflujo equivalente a 720 px sin desbordamiento | Superado |
| Reduced motion | Duración efectiva de 0,01 ms | Superado |
| CERO sin JavaScript | Figura neutral, mensaje y fases legibles | Superado |
| API de CERO | Cinco estados, estado desconocido seguro y eventos sin duplicados | Superado |
| Mirada de CERO | Un `requestAnimationFrame`, reinicio al salir y al quedar fuera de vista | Superado |
| Colores forzados | Contorno de fase y geometría visibles con colores del sistema | Superado |
| Lector de pantalla | NVDA manual | Bloqueo de producción |
| Objetivos táctiles | Controles interactivos de al menos 44 × 44 px | Superado |
| Accesibilidad automática | axe-core 4.12.1, seis vistas y diálogo | Cero incidencias |
| Rendimiento | Lighthouse y observación de tareas largas | Superado |
| Móvil físico | Recorrido en dispositivo real | Bloqueo de producción |

## Candidato CERO — validación local

- El modelo 3D aportado se representa mediante cinco renders WebP de 512 × 512 px; el `.glb` de 13.389.496 bytes no forma parte de los archivos públicos.
- Los cinco estados cargan su imagen correcta y el conjunto visual pesa 49.046 bytes.
- Los ocho tamaños entre 320 × 568 y 1920 × 1080 mantienen el ancho del documento igual al viewport, sin solapamiento entre mascota, estado, vía de fases y controles.
- En móvil el orden visual comprobado es mascota, estado, rango, fases y ayuda.
- Los botones del compresor miden 44 × 44 px y el rango mantiene 44 px de altura.
- `file://`, servidor local, JavaScript desactivado y `features.mascotDemo: false` conservan el estado neutral esperado.
- Teclado, `Escape`, restauración de foco y anuncio de las cinco fases funcionan sin mover el foco.
- Movimiento reducido y puntero táctil no alteran la mirada; al salir o quedar fuera de pantalla vuelve a `0px, 0px`.
- axe-core 4.12.1: cero infracciones en 320 px, 768 px, 1440 px y menú móvil abierto.
- Lighthouse local: rendimiento 99, accesibilidad 100, buenas prácticas 100; LCP 1.954 ms, CLS 0,00013 y TBT 0 ms.
- Cuatro transiciones consecutivas no registraron tareas largas; veinte eventos de puntero en un mismo frame solicitaron una sola actualización visual.
- El incremento servido atribuible a esta sustitución es de 49.732 bytes sin comprimir, frente al límite de 100 KB.

Las capturas de los ocho tamaños se generan en `output/playwright/` y se excluyen del repositorio. No se recibió licencia ni documentación de procedencia junto al modelo; la aprobación visual, la revisión de originalidad y derechos, NVDA y el móvil físico siguen siendo comprobaciones humanas obligatorias antes de producción.

## Lighthouse del staging publicado

| Página | Rendimiento | Accesibilidad | Buenas prácticas | SEO | LCP | CLS | TBT |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Inicio | 100 | 100 | 100 | 63 | 1.395 ms | 0 | 24 ms |
| Proyectos | 100 | 100 | 100 | 63 | 1.186 ms | 0 | 0 ms |
| Tu carta | 100 | 100 | 100 | 63 | 1.055 ms | 0 | 0 ms |

El 63 de SEO responde al bloqueo intencional de rastreo de esta vista previa. No se retirará `noindex` para mejorar una puntuación de staging. LCP y CLS cumplen los objetivos; INP necesita datos de campo después del lanzamiento. Tras estabilizar la carga, las interacciones probadas no generaron tareas superiores a 50 ms.

## Lighthouse tras la apertura a buscadores — 5 de agosto de 2026

Medido sobre el dominio público (`lighthouse@12`, Edge headless), ya sin `noindex` y con las dos páginas legales publicadas.

| Página | Rend. | Acces. | B. prácticas | SEO | LCP | CLS | TBT |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Inicio | 100 | 96 | 100 | 92 | 1,1 s | 0,015 | 20 ms |
| Proyectos | 98 | 100 | 100 | 92 | 1,1 s | 0,085 | 0 ms |
| Tu carta | 98 | 100 | 100 | 92 | 1,2 s | 0 | 130 ms |
| Aviso legal | 100 | 100 | 100 | 92 | 0,9 s | 0 | 0 ms |
| Privacidad | 100 | 100 | 100 | 92 | 0,9 s | 0 | 0 ms |

El SEO sube de 63 a 92: los 37 puntos que faltaban eran el bloqueo intencional de staging. Solo quedan dos auditorías sin superar en todo el sitio:

- **`robots-txt` (las cinco páginas).** Cloudflare inyecta su propio bloque antes del archivo del repositorio, con la directiva `Content-Signal: search=yes,ai-train=no,use=reference`, que no forma parte del estándar y Lighthouse marca como desconocida. El archivo del repositorio es correcto; los rastreadores ignoran las líneas que no entienden, así que `Allow`, los `Disallow` internos y `Sitemap` siguen aplicándose. Se retira desde Cloudflare (Scrape Shield / AI Crawl Control), no desde el repositorio.
- **`color-contrast` (solo Inicio).** Los capítulos inactivos de «El recorrido» se atenúan a `opacity: 0.3` con desenfoque hasta que el scroll los activa; en reposo, su texto queda en 1,5–2,0 : 1. Es un efecto deliberado, anterior a esta apertura. No se aplica sin JavaScript ni con `prefers-reduced-motion`, y desde hoy tampoco con `prefers-contrast: more` ni con colores forzados, donde el recorrido se muestra legible de entrada. La atenuación por defecto se mantiene: cambiarla es una decisión de diseño del operador.

### Páginas legales — verificación propia

Medido en el navegador sobre el sitio publicado, cargando cada página en un marco del ancho indicado y comprobando el desbordamiento real.

| Anchura | Aviso legal | Privacidad |
| --- | --- | --- |
| 320 | Sin scroll horizontal | Sin scroll horizontal |
| 375 | `scrollWidth` = `clientWidth` | `scrollWidth` = `clientWidth` |
| 390 | `scrollWidth` = `clientWidth` | `scrollWidth` = `clientWidth` |
| 768 | `scrollWidth` = `clientWidth` | `scrollWidth` = `clientWidth` |
| 1024 | `scrollWidth` = `clientWidth` | `scrollWidth` = `clientWidth` |
| 1366 | `scrollWidth` = `clientWidth` | `scrollWidth` = `clientWidth` |
| 1440 | `scrollWidth` = `clientWidth` | `scrollWidth` = `clientWidth` |
| 1920 | `scrollWidth` = `clientWidth` | `scrollWidth` = `clientWidth` |

Estructura y teclado en ambas: un solo `h1`, un `main`, `lang="es"`, enlace de salto presente con destino existente, y el menú abre y cierra con `Escape` sin que el foco se pierda (queda en un botón de la cabecera).

Queda fuera de esta comprobación lo que exige criterio humano: lectura con NVDA y recorrido en dispositivo físico.

**Dos métodos que dan falsos positivos y no deben usarse aquí.** Las capturas con Edge headless a 390 px recortan un render más ancho, porque Windows impone un ancho mínimo de ventana: aparentan un desbordamiento que no existe. Y a 320 px, comparar `scrollWidth` con `clientWidth` dentro de un marco da 320 frente a 305 por la barra de desplazamiento, en las cinco páginas por igual, incluidas las tres ya certificadas. La comprobación válida es empujar el desplazamiento horizontal y ver si se mueve: en las cinco páginas se queda en cero.

## Comprobación remota

- URL: `https://narutouchumaki99.github.io/cero-coma-web/`.
- HTTPS activo y sin dominio personalizado.
- Inicio, proyectos y producto responden correctamente bajo el subdirectorio del repositorio.
- Ruta desconocida: código 404 y documento personalizado.
- `robots.txt`: bloqueo completo de staging.
- Configuración servida: entorno `staging`, dos proyectos públicos y cero contactos.
- axe-core 4.12.1: cero incidencias en las tres páginas publicadas.
- CERO 2.0.0: cinco estados, cuatro eventos para cuatro cambios reales, ancho correcto a 390 y 1440 px y manifiesto limitado a staging.
- Los cinco renders WebP, CSS, JavaScript y manifiesto de CERO responden con código 200 y tipos MIME correctos; el GLB fuente no se publica.
- Lighthouse remoto de Inicio tras la integración del modelo: rendimiento 100, accesibilidad 100, buenas prácticas 100, LCP 1.395 ms, CLS 0 y TBT 24 ms.
- GitHub Pages publicó correctamente el commit de interfaz `ceb2b87` mediante la ejecución `30703685953`.
- Consola del navegador: cero errores durante navegación e interacciones.

## Alcance pendiente

NVDA y la revisión móvil física requieren dispositivos y operación humana. El titular dio por cerrada la puerta de producción el 5 de agosto de 2026, pero **este documento no registra su ejecución**: nadie ha anotado un recorrido con lector de pantalla ni en un teléfono real. No son defectos conocidos; son comprobaciones sin evidencia. Si se ejecutan, conviene anotarlas aquí con fecha y dispositivo.
