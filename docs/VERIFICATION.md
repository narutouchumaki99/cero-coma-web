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
| Lector de pantalla | NVDA manual | Bloqueo de producción |
| Objetivos táctiles | Controles interactivos de al menos 44 × 44 px | Superado |
| Accesibilidad automática | axe-core 4.12.1, seis vistas y diálogo | Cero incidencias |
| Rendimiento | Lighthouse y observación de tareas largas | Superado |
| Móvil físico | Recorrido en dispositivo real | Bloqueo de producción |

## Lighthouse de staging

| Página | Rendimiento | Accesibilidad | Buenas prácticas | SEO | LCP | CLS | TBT |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Inicio | 100 | 100 | 100 | 66 | 1.729 ms | 0 | 0 ms |
| Proyectos | 100 | 100 | 100 | 66 | 1.732 ms | 0,034 | 0 ms |
| Tu carta | 99 | 100 | 100 | 66 | 1.739 ms | 0 | 0 ms |

El 66 de SEO responde al bloqueo intencional de rastreo de esta vista previa. No se retirará `noindex` para mejorar una puntuación de staging. LCP y CLS cumplen los objetivos; INP necesita datos de campo después del lanzamiento. Tras estabilizar la carga, las interacciones probadas no generaron tareas superiores a 50 ms.

## Alcance pendiente

NVDA y la revisión móvil física requieren dispositivos y operación humana. Se mantienen como puerta explícita de producción, no como defecto oculto del staging.
