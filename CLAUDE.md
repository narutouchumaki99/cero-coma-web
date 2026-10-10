# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Idioma

El sitio, la documentación interna y los mensajes de commit están en español. Trabaja en español.

## Qué es este repositorio

Web pública de Cero Coma, servida en <https://cerocomasoluciones.com>. Sitio estático puro: HTML + CSS + JavaScript vanilla. **Sin build, sin dependencias, sin tests.** El repositorio se publica tal cual, así que cada archivo del árbol es una URL accesible.

Existe una segunda copia divergente de esta web en el monorepo `cerocoma/apps/web` (rama `feat/web-secciones-empresa`, con secciones Hostelería/Studio/Empresa y mascota animada). **No comparte historia git con este repositorio y no está publicada.** El que sirve el dominio es este.

## Comandos

```bash
npx --yes serve . --listen 4173
```

No hay linter ni suite de pruebas aquí. El validador `tests/validate-site.mjs` —comprueba canónicas, `noindex`, `robots.txt` y que los contactos del HTML coincidan con `config.js`— existe solo en la copia del monorepo; si se hacen cambios estructurales, conviene traerlo y ejecutar `node tests/validate-site.mjs`.

Verificar lo que sirve el dominio (el edge puede tardar unos segundos en actualizarse tras un push):

```bash
curl -s "https://cerocomasoluciones.com/?cb=$RANDOM" | head -40
```

## Publicación

Push a `main` → despliegue automático, sin staging intermedio: lo que entra en `main` es producción.

- **Cloudflare Pages** sirve el dominio (es el despliegue que cuenta).
- `.github/workflows/pages.yml` publica además en GitHub Pages como respaldo.
- `.github/workflows/chatgpt-producciones.yml` es de la época en que ChatGPT editaba Producciones (escribía `producciones/contenido.json` y hacía push). **Se desactiva en GitHub el 10-10-2026**: la página ya no lee ese JSON. Sus manuales están archivados fuera del repo, en `C:\Users\otman\facturacion\archivo-producciones-chatgpt\`.

## Arquitectura: dos mundos que no se mezclan

### 1. Sitio de marca

Portada, `proyectos/`, `faena/`, `contacto/`, `aviso-legal/`, `privacidad/` y `404.html`, más las páginas de búsqueda que cuelgan de FAENA: por tipo de local (`carta-digital-bares/`, `carta-digital-cafeterias/`, `carta-digital-restaurantes/`) y guías (`como-digitalizar-carta-restaurante/`, `cambiar-precios-carta-qr/`), todas con `legal.css`. Desde el 1-10-2026 la web se centra solo en FAENA. Cada página carga, en este orden, `tokens.css` → `base.css` → su hoja (`home` / `projects` / `product` / `legal` / `error`) → `motion.css`, y `config.js` → `site.js` → (`projects-data.js` + `projects.js` donde aplique) → `motion.js`.

- **`assets/js/config.js` es la fuente de verdad** de marca, URLs y contactos (`window.CEROCOMA_CONFIG`, congelado). Los contactos se sirven además escritos en el HTML para que funcionen sin JavaScript; `site.js` solo los genera si la lista llega vacía. Un cambio de contacto se hace en los dos sitios.
- **`assets/js/projects-data.js`** (`window.CEROCOMA_PROJECTS`) es el contenido del explorador de proyectos; `projects.js` pinta buscador, filtros, tarjetas y diálogo. Añadir un proyecto es añadir un objeto ahí, sin tocar HTML.
- **`motion.js`** gobierna las apariciones por scroll (`data-reveal`, `data-reveal-stagger`), el recorrido (`data-recorrido`) y el fundido entre páginas, este último **solo como respaldo** cuando el navegador no soporta View Transitions entre documentos. Todo el movimiento se apaga con `prefers-reduced-motion`.
- **`site.js`** gobierna menú móvil, año del pie, enlaces de contacto y el compresor de la portada.
- Las subpáginas declaran `data-site-root="../"` en `<body>` y la portada `"./"`. Cualquier script que construya rutas hacia `assets/` debe leer `document.body.dataset.siteRoot` en lugar de usar rutas relativas a la página: es el fallo clásico al mover contenido a una subcarpeta.

### 2. Producciones

Desde el 10-10-2026, `producciones/` es la página del estudio **CeroComa Producciones** (webs que se recorren como una película) **con la identidad de marca**: `tokens.css` → `base.css` → `producciones.css` → `motion.css`, y `config.js` → `site.js` → `motion.js` → `producciones.js` (solo el vídeo de portada). HTML fijo, sin JSON. Está en el sitemap, en el menú y en el pie; **solo el índice** se indexa. CeroComa Studio sigue oculto (`visibility: "private"` en `projects-data.js`).

- `producciones/assets/`: bucle de portada (`portada-m.mp4` vertical; `portada-h.mp4`, cuatro paneles), sus fotos fijas, las fotos 3:4 de las tarjetas y la imagen para compartir.
- Los **ejemplos** son webs de clientes inventados con su propia marca y **no se re-tematizan**: `la-maqueta/` y `del-cafeto/` (motor `scrub-engine.js` + plantilla editorial), `mechada-hot/` (despiece en fotogramas, carta y pedido por WhatsApp en modo demo) y `duero-lento/` (3D de partículas en un solo archivo). Llevan `noindex` en el HTML y por `X-Robots-Tag` en `_headers`, y siempre la etiqueta de ejemplo con marca inventada.
- **Sus fuentes están fuera del repo**, en `C:\Users\otman\facturacion\demos\`: `la-maqueta/web`, `del-cafeto/web`, `landing-mechada-hot/fuente` (`node construir.mjs` → `web/`) y `lab-3d/fuente/03-bodega-duero` (`node construir.mjs 03-bodega-duero`). Se edita allí, se construye y se copia aquí.
- Los botones de WhatsApp de los ejemplos van a 3tmen con un mensaje que dice que es un ejemplo, nunca como si el negocio existiera.

## Reglas del sitio que no son evidentes

- **Al añadir una página**: `<link rel="canonical">` con su URL definitiva, entrada en `sitemap.xml` y enlace desde el pie si procede. `noindex` en el HTML solo en `404.html`; lo demás que no deba indexarse (documentación interna, los ejemplos de `producciones/`) va por `X-Robots-Tag` en `_headers`, nunca con `Disallow` en `robots.txt`, que impediría leer la cabecera.
- **Cloudflare ofusca los `mailto:`** y los convierte en `/cdn-cgi/l/email-protection#…`, que necesita JavaScript. Donde el correo debe leerse sin él (páginas legales, JSON-LD), envolverlo en `<!--email_off-->…<!--/email_off-->`; ya está aplicado en portada, aviso legal y privacidad.
- **No borrar `googleb7de5be3ec7cd0b5.html`**: es la verificación de Google Search Console.
- `_redirects` mantiene el 301 de `/tu-carta-en-cero-coma/*` → `/faena/`. Esa URL antigua está indexada: no romperla.
- `robots.txt` excluye `/docs/`, `/tests/` y `/README.md`, que aquí ya no existen. Como el despliegue publica la raíz entera, cualquier carpeta de trabajo que se añada será una URL pública.
- Los renders de la mascota (`assets/media/mascot/ody/ody-<estado>.webp`, consumidos por `about.js`) conservan una denominación que el validador de la otra copia prohíbe en contenido público. Si se renombran, hay que tocar archivos y manifiesto a la vez.
- Tras un push, algunos edge sirven aún la versión anterior durante unos segundos: reintentar con cache-buster antes de dar algo por roto.

## Marca

- Tipografía **Manrope** autoalojada (`assets/fonts`, licencia OFL). Colores, espaciados y curvas de movimiento en `assets/css/tokens.css`: `--zero` (negro), `--ivory` (fondo), `--gold` / `--gold-ink` (acentos). No introducir valores sueltos fuera de los tokens.
- Estilo editorial: numeración «01 /», filetes finos, antetítulos en mayúscula con guion dorado, secciones alternando ivory / oscuro / blanco.
- Tono del copy: sobrio y honesto. No prometer lo que no está construido ni inventar canales de contacto.
- Accesibilidad asumida en todo el sitio: skip-link, foco visible, HTML que funciona sin JavaScript y movimiento desactivado con `prefers-reduced-motion`.
