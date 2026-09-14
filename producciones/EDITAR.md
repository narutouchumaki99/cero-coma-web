# Cómo reeditar Producciones (ChatGPT u otra IA)

Para que ChatGPT **publique solo**, sin pasar por otra persona: [`CHATGPT.md`](CHATGPT.md).

Para que **Codex** adapte la página a un cliente (idempotente, fotos suyas, el visitante entiende el servicio): [`CODEX.md`](CODEX.md).

Esta carpeta es el escaparate. **No toques** `index.html` ni `mechada-hot/` salvo que cambies la estructura.

## 1. Textos

Edita `contenido.json`. Campos:

- `titulo`, `lead`, `cta`, `cta_mensaje`, `aviso`
- cada serie: `titulo`, `texto`
- `rama`: nombre, texto, href, portada

`whatsapp` es solo el número, sin `+` ni espacios: `34643403723`.

## 2. Fotos

Sustituye el archivo **manteniendo el mismo nombre**:

| Hueco | Archivo |
| --- | --- |
| Hamburguesa sartén | `fotos/hamburguesas/01-sarten.jpg` |
| Hamburguesa hero | `fotos/hamburguesas/02-hero.jpg` |
| Hamburguesa fuego | `fotos/hamburguesas/03-fuego.jpg` |
| Hamburguesa detalle | `fotos/hamburguesas/04-detalle.jpg` |
| Tarta chocolate noche | `fotos/tartas/01-chocolate.jpg` |
| Tarta frutos | `fotos/tartas/02-frutos.jpg` |
| Cheesecake clásica | `fotos/tartas/03-clasica.jpg` |
| Cheesecake nutella | `fotos/tartas/04-nutella.jpg` |
| Cheesecake limón | `fotos/tartas/05-limon.jpg` |
| Cheesecake pistacho | `fotos/tartas/06-pistacho.jpg` |
| Cheesecake oreo | `fotos/tartas/07-oreo.jpg` |
| Puesto | `fotos/escena/01-puesto.jpg` |
| Parrilla | `fotos/escena/02-parrilla.jpg` |
| Ambiente | `fotos/escena/03-ambiente.jpg` |
| Puesto cerca | `fotos/escena/04-puesto-cerca.jpg` |
| Portada Mechada | `mechada-hot/portada.jpg` |

Para **añadir** una foto: súbela a la carpeta de la serie y añade un objeto `{ "src": "fotos/.../nuevo.jpg", "alt": "..." }` en el array `fotos` de `contenido.json`.

Formatos: JPG o WebP. Vertical 3:4 o 9:16 funciona mejor. Sin texto pintado encima.

## 3. Comprobar

Abre `/producciones/` en el navegador. Si el JSON está mal formado, la página usa una copia de reserva embebida y no verás el cambio.

La landing de Mechada Hot (`mechada-hot/`) es otra rama: se edita aparte, tal cual.
