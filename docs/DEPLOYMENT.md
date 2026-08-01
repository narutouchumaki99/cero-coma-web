# Despliegue y paso a producción

## Estado actual

La rama `main` publica una vista previa verificada mediante GitHub Pages y GitHub Actions. La entrega actual tiene estas protecciones:

- URL estándar: `https://narutouchumaki99.github.io/cero-coma-web/`;

- meta `noindex, nofollow, noarchive` en todos los documentos;
- `robots.txt` con bloqueo completo;
- `.nojekyll` para servir los archivos literalmente;
- ningún archivo `CNAME`;
- contactos vacíos y sin enlaces simulados;
- dominio y DNS fuera del alcance del despliegue.

El workflow inicial terminó correctamente el 1 de agosto de 2026 y la URL estándar respondió con HTTPS, las tres rutas públicas y la página 404 personalizada.

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
- Revisión manual con lector de pantalla y móvil físico registrada.

## Puerta de producción

No continuar hasta aprobar todos estos puntos:

1. contactos reales;
2. contenido legal;
3. permiso de medios y revisión de privacidad;
4. llamadas a la acción definitivas;
5. revisión móvil física;
6. aprobación visual explícita de CERO;
7. comprobación de originalidad y derechos de CERO;
8. recorrido manual con NVDA;
9. decisión explícita de lanzamiento.

## Dominio personalizado — procedimiento posterior

Este procedimiento no forma parte del staging actual.

1. Registrar por escrito los registros DNS vigentes y su TTL.
2. Preparar los valores de reversión.
3. Añadir y verificar el dominio en GitHub Pages antes de cambiar DNS.
4. Crear `CNAME` en el repositorio solo después de esa verificación.
5. Cambiar únicamente los registros autorizados.
6. Esperar propagación, activar HTTPS y comprobar redirecciones.
7. Si falla la validación, restaurar los registros documentados.

Al mismo tiempo hay que retirar `noindex`, abrir `robots.txt`, añadir URL canónica, actualizar el sitemap con la fecha de lanzamiento y repetir la auditoría completa.
