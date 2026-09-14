# Playbook Codex — adaptar Producciones a un cliente

Repo: `narutouchumaki99/cero-coma-web`  
Rama: `main`  
Solo tocas `producciones/`.  
Fuente de verdad: `producciones/contenido.json` + archivos listados ahí.  
Layout: `producciones/index.html` (no lo reescribas; pinta lo que dice el JSON).

Este documento es **idempotente**: si lo corres dos veces con el mismo `cliente.json`, el resultado es el mismo árbol, sin fotos huérfanas ni series del cliente anterior.

---

## 0. Qué tiene que entender quien entra

En 10 segundos, sin leer el pie:

1. **Qué es:** no es un catálogo. Es un servicio a medida: cogemos el producto del cliente y lo ponemos en escena para redes.
2. **Para quién:** un local con un plato (hamburguesa, tarta, cheesecake, lo que sea).
3. **Qué recibe:** fotos de producto + escena (+ review si hay) y un CTA para encargar.
4. **Prueba:** una rama de muestra (hoy Mechada Hot). No se vende como si fuera el local del visitante.

Orden de la página (fijo, no lo cambies):

| Bloque | Función | No es |
| --- | --- | --- |
| Hero (`rotulo`, `titulo`, `lead`, CTA) | Tesis del servicio | El menú del cliente |
| Serie `producto` | El plato de cerca | Ambiente |
| Serie `escena` | El plato donde se come | Estudio blanco |
| Serie `review` (opcional) | Una persona reacciona al plato | Influencer genérico |
| Rama | Ejemplo de un encargo ya montado | El servicio entero |
| `aviso` | Honestidad: demo / IA / no es el local real | Letra pequeña de abogado |

Si el visitante no entiende el servicio, el fallo es de este orden o de mezclar dos mundos visuales en la misma serie.

---

## 1. Variables del cliente (entrada)

Antes de editar, rellena `producciones/cliente.json` a partir de `producciones/cliente.plantilla.json`.

Campos mínimos:

- `nombre` — marca del cliente (ej. `Mechada Hot`, `La Cheesecake Fest`)
- `producto` — una frase (`hamburguesa smash`, `cheesecake porción`)
- `mundo` — `noche-fuego` **o** `obrador-claro`. Nunca los dos en la misma serie.
- `whatsapp` — solo dígitos
- `fotos.producto[]`, `fotos.escena[]`, `fotos.review[]` — rutas locales o ya en el repo
- `rama` — si este cliente tiene landing propia (`mechada-hot/`) o `null`

Idempotencia de entrada: un cliente = un `cliente.json`. No concatenar con el cliente previo.

---

## 2. Huecos canónicos (nombres estables)

Copias **encima**, no inventas `foto-final-2b.jpg`.

```
producciones/fotos/producto/01.jpg
producciones/fotos/producto/02.jpg
producciones/fotos/producto/03.jpg
producciones/fotos/escena/01.jpg
producciones/fotos/escena/02.jpg
producciones/fotos/escena/03.jpg
producciones/fotos/review/01.jpg     # solo si hay review
```

Series en el JSON con ids fijos: `producto`, `escena`, `review` (omite `review` si no hay foto).

Títulos visibles (se adaptan al producto, no a la carpeta):

- producto → el plato (`Hamburguesas`, `Tartas`, `Cheesecakes`)
- escena → `Puesta en escena`
- review → `Review`

---

## 3. Paso a paso (hazlo en este orden)

### Paso A — Leer, no mezclar

1. Lee este archivo, `EDITAR.md` y el `cliente.json`.
2. Lista las fotos que te han pasado. Descarta las que tengan texto pintado, marca de agua de otro, o un mundo visual distinto al `mundo` del cliente.
3. Elige como máximo 3 producto + 3 escena + 1 review. Mejor 2+2+1 nítidas que 8 mediocres.

### Paso B — Vaciar el cliente anterior

1. Reescribe `contenido.json` **entero**. No hagas merge con las series viejas (`hamburguesas`, `tartas`, etc.).
2. Tras escribir el JSON, borra cualquier archivo bajo `producciones/fotos/` que **no** esté referenciado en ese JSON.
3. No toques `producciones/mechada-hot/` salvo que el `cliente.json` sea Mechada Hot.

Esto es la idempotencia: el árbol queda determinado solo por `cliente.json`.

### Paso C — Copiar fotos a los huecos

1. Redimensiona a JPG vertical 3:4 o 9:16 si puedes. Sin texto encima.
2. Sobrescribe `fotos/producto/01.jpg`, `02.jpg`… en el orden: **hero de cerca → detalle → variante**.
3. Escena: **puesto/local → acción (parrilla, obrador) → ambiente**.
4. Review: una sola imagen, persona + plato. El plato se lee.

### Paso D — Redactar el JSON

Plantilla de sentido (cambia el producto, no la estructura):

- `rotulo`: `Servicio a medida`
- `titulo`: `Tu {producto}, puesto en escena.`
- `lead`: qué hacemos + qué pone el cliente + qué entregamos. 2–4 frases. Sin jerga.
- Serie producto: el plato manda.
- Serie escena: el plato donde se come.
- Serie review: alguien prueba el plato (si hay foto).
- `cta`: `Encargar una pieza`
- `cta_mensaje`: `Hola, quiero un encargo de Producciones para {nombre}.`
- `aviso`: demo / generada / no es el local oficial.

`whatsapp` solo dígitos.

### Paso E — Sincronizar el fallback

Si `index.html` tiene `<script id="contenido-local">`, copia dentro el mismo JSON que `contenido.json`. Si no, la página vieja se verá cuando falle el fetch.

No reescribas CSS, canvas de chispas, ni el renderer.

### Paso F — Commit único

```
chatgpt: {nombre} — producto, escena y servicio
```

Un commit. No dejes el JSON apuntando a fotos que no subiste.

### Paso G — Comprobar

Abre https://cerocomasoluciones.com/producciones/ (espera ~1 min).

Checklist:

- [ ] El H1 nombra el producto del cliente
- [ ] El lead explica el servicio sin el nombre de otro cliente
- [ ] Cada foto de producto se lee como ese plato
- [ ] La escena no es un estudio blanco
- [ ] No quedan tartas si el cliente es hamburguesa (y al revés)
- [ ] El CTA abre WhatsApp
- [ ] El aviso sigue siendo honesto
- [ ] Correr el playbook otra vez con el mismo `cliente.json` no añade series ni archivos

---

## 4. Consistencia visual

Un cliente, un mundo:

- `noche-fuego`: carbon, brasa, cobre, humo. Hamburguesa, festival, parrilla.
- `obrador-claro`: lino, kraft, luz de ventana. Cheesecake, porción, obrador.

No pongas cheesecake de lino junto a smash de brasas **en la misma serie**. Si el servicio enseña *varias* líneas (demo de Cero Coma, no un cliente), usa series separadas y dilo en el `lead`.

Alts: describen lo que se ve, no el prompt.

---

## 5. Qué no hacer

- No toques `index.html` de la raíz, `faena/`, `.github/`.
- No dejes commits vacíos.
- No concatenes el cliente nuevo al JSON viejo.
- No uses `fotos/hamburguesas/` ni `fotos/tartas/` en clientes nuevos: esos nombres son del pasado. Huecos canónicos: `producto/`, `escena/`, `review/`.
- No prometas entrega, precio o “IA en vivo” si no está en `cliente.json`.

---

## Prompt para pegar en Codex

```
Repo: narutouchumaki99/cero-coma-web
Rama: main
Lee producciones/CODEX.md entero y síguelo en orden A→G.
Idempotente: el árbol final depende solo de producciones/cliente.json.
Usa las fotos que te adjunto / que están en el chat.
Rellena producciones/cliente.json y luego aplica el playbook.
No toques nada fuera de producciones/.
Commit único a main cuando el checklist del paso G esté cubierto.
```
