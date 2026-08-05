# Plan para poner la web al día

Fecha: 5 de agosto de 2026. Punto de partida: la web pasó a pública e indexable ese mismo día (commit `a9d5ca0`), con contacto real publicado y sin `noindex`.

Este plan cierra lo que quedó abierto al abrirla. Está ordenado por urgencia real, no por comodidad: primero lo que expone al negocio, después lo que hace que la encuentren, y al final lo que estaba declarado como puerta de producción.

Cada tarea dice **quién** puede hacerla y **cómo se comprueba** que está hecha. Una tarea no se da por cerrada sin su comprobación.

---

## Estado verificado hoy

| Área | Estado |
| --- | --- |
| Dominio, HTTPS y despliegue | Correcto (Cloudflare Pages, auto-deploy desde `main`) |
| Indexación | Abierta: sin `noindex`, `robots.txt` permite, canónicas puestas, sitemap al día |
| Contacto | Publicado: correo, WhatsApp y teléfono, servidos en el HTML |
| Rutas, 404, consola, validador | Sin incidencias (115 archivos, 4 documentos) |
| Textos legales | Publicados el 5 de agosto de 2026: `/aviso-legal/` y `/privacidad/`, pendientes de que el titular los apruebe |
| Imagen social (`og:image`) | Ausente en las tres páginas |
| Alta en buscadores | Sin hacer |
| Manifiesto de CERO | Sigue en `staging-candidate`, `productionApproved: false` |
| Móvil físico y NVDA | Sin registrar |
| Medios de Studio | Sin permiso ni revisión de privacidad |
| Rutas internas (`docs/`, `tests/`, `README.md`) | Accesibles por URL directa; excluidas del índice el mismo día (ver nota) |

**Detectado y resuelto al preparar este plan:** el despliegue publica la raíz tal cual, así que `docs/`, `tests/` y `README.md` responden 200 en el dominio. Con `robots.txt` bloqueado no importaba; al abrirlo, pasaron a ser rastreables. Se han excluido del índice con un `Disallow` selectivo y el validador ahora lo exige. Comprobado además que `recursos-locales/` (donde vive el GLB fuente de CERO) **no está en git**, así que nunca se ha publicado.

**Hecho relevante:** la web **no usa cookies ni analítica**. El único almacenamiento es un `sessionStorage` que recuerda que se cerró la guía CERO: es almacenamiento técnico para una preferencia de interfaz. Por tanto **no hace falta banner de cookies**, y la política de cookies se resuelve con un párrafo dentro de la de privacidad.

---

## Fase 0 — Datos del titular — **CERRADA** (5 de agosto de 2026)

| # | Dato | Valor |
| --- | --- | --- |
| 0.1 | Titular | Othmane Abdellouli Atti |
| 0.2 | NIF | 01862734X (letra de control verificada) |
| 0.3 | Domicilio a efectos de notificaciones | Calle Madre de Dios 21, Valladolid |
| 0.4 | Condición | Empresario individual (autónomo) |
| 0.5 | Inscripción registral | No aplica por ser autónomo |

---

## Fase 1 — Legal (urgente)

La web publica un canal de contacto y enlaza a una aplicación que registra usuarios. Sin aviso legal ni política de privacidad, la web está incompleta frente a la LSSI-CE y el RGPD desde el momento en que es indexable.

| # | Tarea | Quién | Estado |
| --- | --- | --- | --- |
| 1.1 | Crear `/aviso-legal/` con la plantilla de página existente | Claude | **Hecho** |
| 1.2 | Crear `/privacidad/` con responsable, finalidades, base legítima, conservación, destinatarios, derechos y almacenamiento técnico | Claude | **Hecho** |
| 1.3 | Enlazar ambas en el pie de las páginas que tienen pie | Claude | **Hecho** (la 404 no tiene pie; queda anotado) |
| 1.4 | Añadirlas a `sitemap.xml` | Claude | **Hecho**: cinco URLs |
| 1.5 | Reglas en el validador: existen, están enlazadas desde el pie y figuran en el sitemap | Claude | **Hecho**, con prueba en negativo |
| 1.6 | Revisar el contenido y aprobarlo | Operador | **Pendiente** |

Hoja de estilos nueva `assets/css/legal.css`: los `h1`/`h2` de marca llegan a 5,4 rem y están pensados para titulares de portada, no para un documento con apartados. La hoja reduce la escala y fija el ancho de lectura en `--measure` (68ch) manteniendo tipografía y color de marca.

**Alcance de lo que puedo redactar:** borradores completos y correctos en estructura, según los requisitos de la LSSI-CE art. 10 y el RGPD art. 13. No soy abogado: si en algún momento se tratan datos sensibles, se contratan encargados de tratamiento o llega un cliente con exigencias contractuales, conviene una revisión profesional. Para el caso actual (web informativa con contacto por correo y WhatsApp), un texto estándar bien hecho cubre el supuesto.

**Dependencia a alinear:** la aplicación (`cerocoma-menu`) registra cuentas, roles e invitaciones, así que tiene su propio tratamiento de datos. La política de la web debe distinguir entre *contactar con Cero Coma* y *usar la aplicación*, y no contradecir lo que diga la app.

---

## Fase 2 — Que la encuentren y se comparta bien

Con el `noindex` retirado, Google tardará de días a un par de semanas en indexarla por su cuenta. Esto lo acelera y mejora cómo aparece.

| # | Tarea | Quién | Comprobación |
| --- | --- | --- | --- |
| 2.1 | Alta en Google Search Console, verificar dominio y enviar `sitemap.xml` | **Operador** (requiere su cuenta) | Sitemap aceptado y páginas en "Inspección de URL" |
| 2.2 | Generar `og:image` 1200×630 (marca sobre `--zero #0d0e0f`, wordmark ivory) y añadir `og:image`, `og:image:width/height`, `og:image:alt` y `twitter:card` en las tres páginas | Claude | Vista previa correcta al pegar el enlace en WhatsApp y LinkedIn |
| 2.3 | Añadir JSON-LD `Organization`: nombre, URL, logo, correo, teléfono | Claude | Sin errores en la prueba de resultados enriquecidos de Google |
| 2.4 | Revisar `title` y `meta description` de las tres páginas pensando en qué se teclea al buscar | Claude + operador | Descripciones únicas, por debajo de ~155 caracteres |
| 2.5 | Regla en el validador: toda página de contenido declara `og:image` | Claude | Prueba en negativo |
| 2.6 | Alta en Bing Webmaster Tools | Operador | Opcional, 10 minutos |

**Nota sobre el correo:** Cloudflare ofusca el `mailto:` servido (`/cdn-cgi/l/email-protection`), de modo que el botón de correo necesita JavaScript. Protege de bots de spam, y WhatsApp y teléfono no están afectados. Recomendación: dejarlo activo. Si se prefiere lo contrario, se desactiva en Cloudflare → Scrape Shield → Email Address Obfuscation.

---

## Fase 3 — Cerrar la puerta de producción declarada

Puntos que los propios documentos del proyecto exigían antes de producción y que siguen abiertos.

| # | Tarea | Quién | Comprobación |
| --- | --- | --- | --- |
| 3.1 | Recorrer la web en un móvil físico: menú, compresor, guía CERO, demo de Tu carta, botones de contacto | Operador | Incidencias anotadas en `docs/VERIFICATION.md` |
| 3.2 | Corregir lo que salga de 3.1 | Claude | Nueva pasada en el mismo dispositivo |
| 3.3 | Recorrido con NVDA (orden de foco, saltos, región de estado de CERO, diálogos) | Operador | Registro en `docs/VERIFICATION.md` |
| 3.4 | Aprobación visual explícita de CERO y paso del manifiesto a producción (`status`, `authorization`, `productionApproved`) | Operador aprueba, Claude aplica | Validador actualizado a los valores nuevos |
| 3.5 | Decidir sobre los medios de Studio: permiso, recorte y revisión de privacidad, o mantenerlo sin imágenes | Operador | `docs/ASSET_STATUS.md` actualizado |
| 3.6 | Pasada de Lighthouse y registro de objetivos de carga | Claude | Cifras en `docs/VERIFICATION.md` |

---

## Fase 4 — Que no se vuelva a desfasar

El problema de fondo era este: la web cambió de estado y los documentos, el validador y los textos siguieron diciendo lo de antes durante dos días.

| # | Tarea | Quién | Comprobación |
| --- | --- | --- | --- |
| 4.1 | Cerrar cada punto de este plan actualizando en el **mismo commit** el código, el documento afectado y el validador | Claude | Ningún commit deja `DEPLOYMENT.md` o `CONTENT_STATUS.md` contradiciendo al código |
| 4.2 | Mantener la regla de probar en negativo cada comprobación nueva del validador | Claude | La regla falla cuando debe fallar |
| 4.3 | Revisión trimestral: contacto vigente, textos legales al día, enlaces externos vivos | Operador | Fecha de revisión anotada en `CONTENT_STATUS.md` |

---

## Orden recomendado y esfuerzo

| Momento | Qué | Esfuerzo |
| --- | --- | --- |
| Ahora | Fase 0 (aportar los cinco datos) | 5 minutos del operador |
| Mismo día | Fase 1 completa | ~1 sesión de trabajo |
| Mismo día | 2.1 (Search Console) en cuanto exista lo legal | 15 minutos del operador |
| Después | 2.2 a 2.5 | ~1 sesión |
| Esta semana | 3.1 y 3.3 (móvil y NVDA) | 1–2 horas del operador |
| Según salga | 3.2, 3.4, 3.6 | variable |
| Cuando haya material | 3.5 (Studio) | pendiente de decisión |

**Camino crítico:** 0 → 1 → 2.1. Lo demás puede ir en paralelo.

Una observación sobre el orden: la Fase 1 va antes que el alta en Search Console a propósito. Es preferible que Google indexe una web que ya tiene sus textos legales que corregirlo después de que la haya rastreado.
