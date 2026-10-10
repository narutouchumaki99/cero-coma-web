# Web pública de CeroComa

Origen de <https://cerocomasoluciones.com/>: `narutouchumaki99/cero-coma-web`, rama `main`, Cloudflare Pages. Sitio estático, sin build. Checkout local: `C:/Users/otman/cerocoma-web-publicada`.

Fuentes vigentes: [CLAUDE.md](CLAUDE.md), [config.js](assets/js/config.js), [llms.txt](llms.txt) y el contexto compartido `C:/Users/otman/cerocoma/docs/CANON.md`. FAENA se desarrolla en otro repo (`narutouchumaki99/cerocoma`); este presenta FAENA y CeroComa Producciones.

Oferta de FAENA: Gratis/Básico/Pro/Red, activación manual. Contrastar importes y derechos con <https://faena.cerocomasoluciones.com/precios> y el catálogo técnico de la app antes de cambiar HTML o metadatos.

Historial sustituido: [.github/archive/canon-2026-10-10](.github/archive/canon-2026-10-10/README.md), con manifiesto y SHA-256. La copia divergente del monorepo está archivada y no sirve este dominio.

Cambios mediante rama y PR. La integración en main publica automáticamente; comprobar después el dominio. No ejecutar el workflow histórico de JSON ni publicar demostraciones como negocios reales.

La portada y `/faena/` comparten `assets/css/story.css` y `assets/js/story.js`: titulares breves, escenas visuales y explicación en tres pasos. Reutilizan los recursos de Historia, Recorrido y las capturas de la app. Los vídeos decorativos se cargan al aparecer y se pausan fuera de pantalla; el botón de movimiento y la preferencia del sistema permiten una presentación estática. `motion.css` y `motion.js` gestionan las transiciones entre páginas.

Las cinco capturas JPG aportadas por el propietario el 10-10-2026 son la referencia visual vigente de FAENA: carta, plato, editor, secciones y publicación. Se conservan completas en `assets/media/faena/`, con el sufijo `20261010`. Carta y editor aparecen a la vista; los detalles se abren con desplegables HTML, también sin JavaScript. Las funciones visibles en la carta de RedBar dependen del plan.
