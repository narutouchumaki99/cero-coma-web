# Cero Coma — web pública v1

Web corporativa estática de Cero Coma. La versión actual está preparada como **vista previa no indexable** para GitHub Pages.

Staging activo: <https://narutouchumaki99.github.io/cero-coma-web/>

## Alcance

- HTML5 semántico, CSS, JavaScript vanilla y SVG.
- Sin backend, framework, dependencias de ejecución ni proceso de build.
- Páginas públicas: inicio, proyectos, Tu carta en Cero Coma y error 404.
- Datos públicos centralizados en `window.CEROCOMA_CONFIG` y `window.CEROCOMA_PROJECTS`.
- CERO integrado en el Compresor conceptual mediante SVG, CSS y JavaScript vanilla.
- API de demostración disponible en `window.CEROCOMA_MASCOT`, limitada al staging.
- Solo se incluyen los dos proyectos autorizados para esta vista previa.
- No existe `CNAME` y no se modifica el dominio ni su DNS.

## Abrir en local

La navegación básica funciona abriendo `index.html` directamente. Para comprobar el comportamiento equivalente a GitHub Pages, sirve la carpeta con un servidor estático:

```powershell
npx --yes serve . --listen 4173
```

No hace falta instalar paquetes para ejecutar la web.

## Validar

```powershell
node tests/validate-site.mjs
```

La validación comprueba documentos HTML, títulos principales, `noindex`, referencias locales, configuración de staging, archivos de Pages y ausencia de rutas locales o patrones habituales de secretos en los archivos servidos.

## Estructura

```text
assets/
  css/                    Estilos y tokens
  fonts/                  Manrope autocontenida y licencia OFL
  icons/                  Iconos auxiliares
  js/                     Configuración, datos e interacción
  media/brand/approved/   Maestros de marca 1.0
  media/mascot/           Maestro y manifiesto del candidato CERO
docs/                     Estado de contenido, activos y despliegue
proyectos/                Explorador público
tu-carta-en-cero-coma/    Página del producto
tests/                    Comprobaciones sin dependencias
```

## Antes de producción

La vista previa mantiene `noindex`, `robots.txt` bloqueado y no lleva dominio personalizado. Contactos, contenido legal, permisos de medios, llamadas a la acción definitivas, aprobación visual y de derechos de CERO, NVDA y revisión móvil física deben cerrarse antes de una publicación de producción. El procedimiento completo está en `docs/DEPLOYMENT.md`.

## Licencias y procedencia

La identidad visual pertenece a Cero Coma. Manrope se redistribuye bajo SIL Open Font License 1.1; la licencia se incluye en `assets/fonts/OFL.txt`. Consulta `docs/ASSET_STATUS.md` para la procedencia de cada familia de activos.
