# Despliegue y paso a producción

## Estado actual

La web es **pública e indexable** en `https://cerocomasoluciones.com` desde el 5 de agosto de 2026 (Cloudflare Pages, despliegue automático desde `main`). La entrega actual declara:

- URL canónica en cada página de contenido;
- `robots.txt` abierto, con referencia al sitemap;
- `noindex` únicamente en `404.html`;
- `.nojekyll` para servir los archivos literalmente;
- ningún archivo `CNAME`: el dominio lo resuelve Cloudflare, y ese archivo lo desviaría a GitHub Pages;
- contacto público real (correo, WhatsApp y teléfono), servido en el HTML y declarado en `config.js`.

La URL de GitHub Pages (`https://narutouchumaki99.github.io/cero-coma-web/`) se conserva como respaldo en `config.stagingUrl`.

### Pendiente tras la apertura

- ~~Aviso legal y política de privacidad~~: publicados el 5 de agosto de 2026 en `/aviso-legal/` y `/privacidad/`, enlazados desde el pie y en el sitemap. Pendiente la aprobación del titular.
- **Aprobación visual explícita de CERO**: el manifiesto sigue en `staging-candidate` con `productionApproved: false`, aunque la originalidad y los derechos constan confirmados por el propietario.
- **Permiso y revisión de privacidad del material de Studio**: sigue sin publicarse.
- **Revisión en móvil físico y recorrido con NVDA**: sin registrar.

## Publicar la vista previa

1. Crear o seleccionar un repositorio público independiente.
2. Subir la rama `main`.
3. En **Settings → Pages**, escoger **GitHub Actions** como fuente.
4. Ejecutar el workflow “Publicar vista previa en GitHub Pages”.
5. Revisar la URL estándar de Pages y conservarla como entorno no indexable.

La acción publica la raíz tal cual: no compila, transforma ni inyecta configuración.

## Criterios de aceptación del staging

- Navegación, 404 y rutas relativas correctas.
- Menú móvil, búsqueda, filtros, diálogo, historial y pestañas operativos con teclado.
- Restauración de foco al cerrar diálogos.
- Sin scroll horizontal en los tamaños de prueba.
- Zoom al 200 % utilizable.
- Movimiento reducido sin animaciones dependientes del tiempo.
- Revisión automática de accesibilidad sin incidencias críticas.
- Lighthouse y objetivos de carga documentados.
- Los cinco estados de CERO, su API, movimiento reducido y versión estática verificados.
- El GLB fuente permanece fuera del artefacto público; solo se despliegan sus cinco derivados WebP registrados.
- Revisión manual con lector de pantalla y móvil físico registrada.

## Puerta de producción

Estado a 5 de agosto de 2026, cuando el operador decidió abrir la web a buscadores:

1. contactos reales — **cerrado** (correo, WhatsApp y teléfono publicados);
2. contenido legal — **abierto**;
3. permiso de medios y revisión de privacidad — **abierto** (Studio sigue sin imágenes);
4. llamadas a la acción definitivas — **cerrado** (app enlazada y contacto directo);
5. revisión móvil física — **abierto**;
6. aprobación visual explícita de CERO — **abierto**;
7. comprobación de originalidad y derechos de CERO — **cerrado** (confirmado por el propietario el 3 de agosto de 2026);
8. recorrido manual con NVDA — **abierto**;
9. decisión explícita de lanzamiento — **cerrada el 5 de agosto de 2026**.

La apertura se decidió con los puntos 2, 3, 5, 6 y 8 todavía abiertos. El más urgente es el 2: publicar un canal de contacto sin aviso legal ni política de privacidad deja la web incompleta frente al RGPD y la LSSI.

## Dominio personalizado — procedimiento posterior

Este procedimiento no forma parte del staging actual.

1. Registrar por escrito los registros DNS vigentes y su TTL.
2. Preparar los valores de reversión.
3. Añadir y verificar el dominio en GitHub Pages antes de cambiar DNS.
4. Crear `CNAME` en el repositorio solo después de esa verificación.
5. Cambiar únicamente los registros autorizados.
6. Esperar propagación, activar HTTPS y comprobar redirecciones.
7. Si falla la validación, restaurar los registros documentados.

La retirada de `noindex`, la apertura de `robots.txt`, la URL canónica y la fecha del sitemap se aplicaron el 5 de agosto de 2026. El validador (`node tests/validate-site.mjs`) ahora comprueba lo contrario que en staging: rechaza `noindex` en las páginas de contenido, exige la canónica, rechaza un `Disallow: /` completo y obliga a que los contactos del HTML coincidan con `config.js`.
