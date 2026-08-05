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

**Correo de contacto — 5 de agosto de 2026.** Se publicó `avancemos@cerocomasoluciones.com` para sustituir al Gmail, y se revirtió el mismo día al comprobar que el buzón no recibe. Los dos servidores del dominio responden `554 5.7.1 Relay access denied`, y devuelven el mismo error para una dirección inventada del dominio: no es que el buzón no exista, es que Hostinger no reconoce `cerocomasoluciones.com` como dominio suyo para correo entrante. El DNS sí está completo (MX, SPF `include:_spf.mail.hostinger.com`, DMARC, `autodiscover` y `autoconfig`); lo que falta es activar el servicio de correo del dominio en el panel de Hostinger y crear el buzón. Hasta entonces la web publica el Gmail, verificado como operativo. El cambio afecta a `config.js`, las tres páginas de contenido, las dos legales y el JSON-LD, y arrastra el proveedor declarado en la política de privacidad: con Gmail es Google, con el dominio sería Hostinger (que además está en la UE, lo que cambia el párrafo de transferencias internacionales).

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

| # | Tarea | Quién | Estado |
| --- | --- | --- | --- |
| 2.1 | Alta en Google Search Console, verificar dominio y enviar `sitemap.xml` | **Operador** (requiere su cuenta) | **Pendiente** |
| 2.2 | `og:image` 1200×630 y metadatos sociales en las cinco páginas | Claude | **Hecho**: `assets/media/social/og-image.png` (50 KB) |
| 2.3 | JSON-LD `Organization` con nombre, URL, logo, correo y teléfono | Claude | **Hecho** en la portada, con logo cuadrado de 512 px |
| 2.4 | Revisar `title` y `meta description` | Claude | **Revisado**: las cinco descripciones son únicas y miden 75–109 caracteres. Ver la nota sobre los títulos |
| 2.5 | Reglas en el validador: `og:image`, `twitter:card` y coherencia del JSON-LD con `config.js` | Claude | **Hecho**, con prueba en negativo |
| 2.6 | Alta en Bing Webmaster Tools | Operador | **Pendiente**, opcional |

**Cómo se generaron las imágenes.** No hay ImageMagick ni Inkscape en el equipo (`convert` es el de Windows, que formatea volúmenes: no usarlo). Se rasterizaron con Edge en modo headless desde dos plantillas HTML que usan los tokens y la tipografía reales, guardadas en `recursos-locales/og/` (fuera de git, igual que el GLB de CERO):

```
msedge --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
  --window-size=1200,630 --screenshot=og-image.png file:///…/og-image.source.html
```

**Nota sobre los títulos.** Son decisión de marca, así que no se han tocado. Pero conviene saber el coste: ni `Cero Coma — De la intención a la realidad` ni `Tu carta en Cero Coma` contienen las palabras que alguien teclea al buscar (carta digital, QR, digitalizar procesos, Valladolid). Se encuentran buscando la marca, no el problema. Si en algún momento interesa captar a quien aún no conoce el nombre, ese es el sitio por donde empezar.

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
| 3.6 | Pasada de Lighthouse y registro de objetivos de carga | Claude | **Hecho**: cinco páginas medidas, cifras en `docs/VERIFICATION.md` |

De la pasada de Lighthouse salen dos asuntos que no estaban en el plan:

- **`robots.txt` marcado como no válido en las cinco páginas.** Lo causa la directiva `Content-Signal` que inyecta Cloudflare, no el archivo del repositorio. Es cosmético para la puntuación —los rastreadores ignoran directivas desconocidas— y se retira desde el panel de Cloudflare. **Operador**, si quiere el 100 en SEO.
- **Contraste de «El recorrido» en la portada.** Los capítulos inactivos quedan en 1,5–2,0 : 1 mientras están atenuados. Se ha añadido la salida por `prefers-contrast: more` y colores forzados sin tocar el efecto. Subirlo por defecto exigiría una opacidad de reposo cercana a 0,85, que prácticamente elimina el difuminado: **es una decisión de diseño del operador**, no un arreglo técnico.

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
