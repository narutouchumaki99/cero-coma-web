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

- Los ocho tamaños entre 320 × 568 y 1920 × 1080 mantienen el ancho del documento igual al viewport, sin solapamiento entre mascota, estado, vía de fases y controles.
- En móvil el orden visual comprobado es mascota, estado, rango, fases y ayuda.
- Los botones del compresor miden 44 × 44 px y el rango mantiene 44 px de altura.
- `file://`, servidor local, JavaScript desactivado y `features.mascotDemo: false` conservan el estado neutral esperado.
- Teclado, `Escape`, restauración de foco y anuncio de las cinco fases funcionan sin mover el foco.
- Movimiento reducido y puntero táctil no alteran la mirada; al salir o quedar fuera de pantalla vuelve a `0px, 0px`.
- axe-core 4.12.1: cero infracciones en 320 px, 768 px, 1440 px y menú móvil abierto.
- Lighthouse local: rendimiento 99, accesibilidad 100, buenas prácticas 100; LCP 1.803 ms, CLS 0,00013 y TBT 0 ms.
- Cuatro transiciones consecutivas no registraron tareas largas; veinte eventos de puntero en un mismo frame solicitaron una sola actualización visual.
- El incremento servido atribuible a la integración es de 22.233 bytes sin comprimir, frente al límite de 100 KB.

Las capturas de los ocho tamaños se generan en `output/playwright/` y se excluyen del repositorio. La aprobación visual, la revisión de originalidad y derechos, NVDA y el móvil físico siguen siendo comprobaciones humanas obligatorias antes de producción.

## Lighthouse del staging publicado

| Página | Rendimiento | Accesibilidad | Buenas prácticas | SEO | LCP | CLS | TBT |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Inicio | 100 | 100 | 100 | 63 | 1.188 ms | 0 | 0 ms |
| Proyectos | 100 | 100 | 100 | 63 | 1.186 ms | 0 | 0 ms |
| Tu carta | 100 | 100 | 100 | 63 | 1.055 ms | 0 | 0 ms |

El 63 de SEO responde al bloqueo intencional de rastreo de esta vista previa. No se retirará `noindex` para mejorar una puntuación de staging. LCP y CLS cumplen los objetivos; INP necesita datos de campo después del lanzamiento. Tras estabilizar la carga, las interacciones probadas no generaron tareas superiores a 50 ms.

## Comprobación remota

- URL: `https://narutouchumaki99.github.io/cero-coma-web/`.
- HTTPS activo y sin dominio personalizado.
- Inicio, proyectos y producto responden correctamente bajo el subdirectorio del repositorio.
- Ruta desconocida: código 404 y documento personalizado.
- `robots.txt`: bloqueo completo de staging.
- Configuración servida: entorno `staging`, dos proyectos públicos y cero contactos.
- axe-core 4.12.1: cero incidencias en las tres páginas publicadas.
- CERO 1.0.0: cinco estados, cuatro eventos para cuatro cambios reales, ancho correcto a 390 y 1440 px y manifiesto limitado a staging.
- Maestro SVG, CSS, JavaScript y manifiesto de CERO responden con código 200 y tipos MIME correctos.
- Lighthouse remoto de Inicio tras la integración: rendimiento 100, accesibilidad 100, buenas prácticas 100, LCP 1.188 ms, CLS 0 y TBT 0 ms.
- GitHub Pages publicó correctamente el commit de interfaz `ed28e93` mediante la ejecución `30700508355`.
- Consola del navegador: cero errores durante navegación e interacciones.

## Alcance pendiente

NVDA y la revisión móvil física requieren dispositivos y operación humana. Se mantienen como puerta explícita de producción, no como defecto oculto del staging.
