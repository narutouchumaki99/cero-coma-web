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
- `.github/workflows/chatgpt-producciones.yml` permite que un `repository_dispatch` externo reescriba `producciones/contenido.json` y haga push a `main` por su cuenta. Al tocar `producciones/`, contar con esa carrera.

## Arquitectura: dos mundos que no se mezclan

### 1. Sitio de marca

Portada, `proyectos/`, `faena/`, `contacto/`, `aviso-legal/`, `privacidad/` y `404.html`. Cada página carga, en este orden, `tokens.css` → `base.css` → su hoja (`home` / `projects` / `product` / `legal` / `error`) → `motion.css`, y `config.js` → `site.js` → (`projects-data.js` + `projects.js` donde aplique) → `motion.js`.

- **`assets/js/config.js` es la fuente de verdad** de marca, URLs y contactos (`window.CEROCOMA_CONFIG`, congelado). Los contactos se sirven además escritos en el HTML para que funcionen sin JavaScript; `site.js` solo los genera si la lista llega vacía. Un cambio de contacto se hace en los dos sitios.
- **`assets/js/projects-data.js`** (`window.CEROCOMA_PROJECTS`) es el contenido del explorador de proyectos; `projects.js` pinta buscador, filtros, tarjetas y diálogo. Añadir un proyecto es añadir un objeto ahí, sin tocar HTML.
- **`motion.js`** gobierna las apariciones por scroll (`data-reveal`, `data-reveal-stagger`), el recorrido (`data-recorrido`) y el fundido entre páginas, este último **solo como respaldo** cuando el navegador no soporta View Transitions entre documentos. Todo el movimiento se apaga con `prefers-reduced-motion`.
- **`site.js`** gobierna menú móvil, año del pie, enlaces de contacto y el compresor de la portada.
- Las subpáginas declaran `data-site-root="../"` en `<body>` y la portada `"./"`. Cualquier script que construya rutas hacia `assets/` debe leer `document.body.dataset.siteRoot` en lugar de usar rutas relativas a la página: es el fallo clásico al mover contenido a una subcarpeta.

### 2. Producciones

`producciones/` y `producciones/mechada-hot/` son páginas **autónomas**: CSS en línea, tipografías de Google (Archivo Black, Barlow, IBM Plex Mono), sin `tokens.css` ni `site.js`. No alinearlas con el sistema de marca salvo petición explícita.

- `producciones/contenido.json` es la fuente de verdad de textos y fotos. `index.html` lo pinta por `fetch` y lleva una **copia de respaldo embebida** en `<script id="contenido-local">`: al cambiar el JSON hay que sincronizar esa copia, o un fallo de red mostrará la versión anterior.
- Los playbooks `producciones/CODEX.md`, `CHATGPT.md` y `EDITAR.md` mandan sobre esa carpeta: huecos de foto con nombres fijos (`fotos/producto/01.jpg`, `fotos/escena/`, `fotos/review/`), un cliente = un `cliente.json`, reescritura completa del JSON (nunca fusionarlo con el cliente anterior) y borrado de las fotos que queden huérfanas. Leerlos antes de tocar nada ahí.
- `mechada-hot/` es una landing cerrada de ~1.450 líneas con dos vídeos que suman 12 MB. Es, con diferencia, lo más pesado del sitio.

## Reglas del sitio que no son evidentes

- **Al añadir una página**: `<link rel="canonical">` con su URL definitiva, entrada en `sitemap.xml` y enlace desde el pie si procede. `noindex` solo en `404.html`.
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
