# Traspaso — Web pública de Cero Coma

Documento de contexto para continuar el trabajo con cualquier IA o desarrollador, sin necesidad de conversaciones anteriores.

Última actualización: 3 de agosto de 2026.

## Qué es este proyecto

Web corporativa estática de **Cero Coma** ("De la intención a la realidad"). Es una **vista previa no indexable** desplegada en GitHub Pages:

- Staging: <https://narutouchumaki99.github.io/cero-coma-web/>
- Repositorio local: `C:\Users\otman\Desktop\cero-coma-web`
- Sin backend, sin frameworks, sin build: HTML5 semántico + CSS + JavaScript vanilla + SVG/WebP.
- Idioma: español. Todo el sitio lleva `noindex` y `robots.txt` bloqueado (es una preview, no producción).

Ojo: en el escritorio hay otras carpetas parecidas (`OneDrive\Desktop\CERO COMA`, brand kits, `tu carta en cerocoma\cerocoma-menu` que es una app Next.js aparte). **La web es solo `Desktop\cero-coma-web`.**

## Estructura

```text
index.html                  Portada
proyectos/index.html        Explorador de proyectos
tu-carta-en-cero-coma/      Página del producto principal
404.html                    Error
assets/css/                 tokens.css (variables), base.css, home.css, product.css, projects.css, mascot.css, error.css, motion.css
assets/js/                  config.js, site.js, mascot.js, projects.js, projects-data.js, product-demo.js, motion.js
assets/media/brand/approved/  Maestros de marca (no tocar sin aprobación)
docs/                       DEPLOYMENT.md, CONTENT_STATUS.md, ASSET_STATUS.md, VERIFICATION.md
tests/validate-site.mjs     Validador sin dependencias
```

## Identidad visual (mantener siempre)

- Tipografía: **Manrope** autoalojada (assets/fonts, licencia OFL).
- Colores en `assets/css/tokens.css`: `--zero #0d0e0f` (negro), `--ivory #f5f2eb` (fondo), `--gold #b69a61` / `--gold-ink #705a2e` (acentos), blanco.
- Estilo editorial minimalista: números tipo "01 /", líneas finas de borde, eyebrows en mayúsculas con guion dorado, secciones alternando ivory / dark / white.
- Tono del copy: sobrio y honesto; nunca prometer lo que no está construido ("La realidad antes que el discurso"). No inventar canales de contacto ni datos.
- Accesibilidad cuidada: skip-link, aria, focus visible, `prefers-reduced-motion` respetado, HTML funcional sin JavaScript.

## Trabajo hecho el 3 de agosto de 2026 (sin commit todavía)

Objetivo pedido por el propietario: web menos "por defecto", con difuminado entre pantallas y un recorrido que explique qué es Cero Coma.

1. **`assets/css/motion.css` (nuevo)** — Transiciones de página con View Transitions entre documentos (`@view-transition { navigation: auto }`) con fundido + blur; clases de respaldo `html.page-enter` / `html.page-leave`; estilos de aparición por scroll `[data-reveal]` (opacidad 0 + translateY + blur → nítido) con `--reveal-delay`. Todo dentro de `@media (prefers-reduced-motion: no-preference)`.
2. **`assets/js/motion.js` (nuevo)** — Añade `js-motion` al `<html>` (si no hay reduced motion); IntersectionObserver que revela `[data-reveal]`; `[data-reveal-stagger]` en un contenedor pone reveal en cascada (90 ms/hijo) a sus hijos; fallback de fundido entre páginas interceptando clics en enlaces internos **solo si** el navegador no soporta View Transitions entre documentos (detección: `"onpagereveal" in window`); lógica de la sección recorrido (contador, etiqueta, barra de progreso, capítulo activo).
3. **Sección "El recorrido" en `index.html`** — Sustituyó a "Método continuo". 5 capítulos: 00 Intención / 01 Entender / 02 Reducir / 03 Construir / 04 Validar. Raíl izquierdo sticky (contador grande, "/ 04", barra de progreso, etiqueta de fase) que se actualiza al hacer scroll; el capítulo activo nítido, el resto atenuado con blur. Estilos al final de la zona recorrido en `assets/css/home.css` (clases `.recorrido__*`). En móvil (≤48rem) el raíl se oculta.
4. **Cabecera con cristal** — `.site-header` en `base.css` ahora usa `color-mix` semitransparente + `backdrop-filter: blur(14px)` (con fallback a ivory sólido).
5. **Las 4 páginas** enlazan `motion.css` (último link) y `motion.js` (último script), y tienen atributos `data-reveal` / `data-reveal-stagger` en sus bloques principales.

Verificado: `node tests/validate-site.mjs` pasa (4 documentos, 88 archivos); comprobado en navegador real que el contador del recorrido avanza 00→04, la barra llega al 100 % y los bloques se revelan al entrar en viewport.

## Cómo trabajar

```powershell
# Servir en local (equivalente a Pages)
npx --yes serve . --listen 4173

# Validar antes de cerrar cualquier cambio
node tests/validate-site.mjs
```

Convenciones al añadir contenido:

- Bloques nuevos que deban aparecer con fundido: añadir `data-reveal` (y `style="--reveal-delay: 120ms"` para escalonar a mano), o `data-reveal-stagger` en el contenedor de una lista.
- No añadir movimiento fuera del patrón de `motion.css`; todo debe quedar desactivado con `prefers-reduced-motion`.
- No romper el funcionamiento sin JavaScript: los reveals solo ocultan contenido cuando `html.js-motion` existe.

## Estado y pendientes

- **Los cambios de arriba están solo en local, sin commit ni push.** Para publicarlos en el staging: commit en el repo y push a `main` (el workflow `.github/workflows/pages.yml` despliega).
- Pendientes de producto (ya declarados en la web): contactos reales sin configurar (`assets/js/config.js`), contenido legal, permisos de medios de Cero Coma Studio, aprobación final de la mascota CERO, revisión NVDA y móvil física. Ver `docs/DEPLOYMENT.md`.
- CSS heredado sin uso tras el cambio: las clases `.method-list*` en `home.css` ya no tienen HTML que las use (se pueden borrar con cuidado).
- Posibles siguientes pasos que el propietario ha insinuado: seguir puliendo el aspecto "profesional" del resto de páginas (Proyectos y Tu carta tienen menos tratamiento visual que la portada).
