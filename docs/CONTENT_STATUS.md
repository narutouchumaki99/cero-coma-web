# Estado del contenido

Fecha de revisión: 1 de agosto de 2026.

## Publicable en staging

| Área | Estado | Criterio aplicado |
| --- | --- | --- |
| Nombre público | Aprobado | Se usa “Cero Coma” en texto y maestros 1.0 en imagen. |
| Promesa | Aprobada | “Cero Coma convierte lo complicado en algo listo para funcionar.” |
| Tu carta en Cero Coma | Verificado para staging | Separa funciones operativas, validación local y trabajo pendiente. |
| Cero Coma Studio | Prudente | Solo se presenta como propuesta en validación comercial. |
| Proyectos | Limitado a lo publicable | El JavaScript servido contiene únicamente las dos fichas públicas. |
| CERO | Candidato de staging | La mascota acompaña al Compresor conceptual; no simula conversación ni servicios conectados. |

## Decisiones de contenido

- La extracción de Tu carta se describe como validada localmente con proveedor real y revisión humana obligatoria.
- No se afirma disponibilidad comercial, publicación automática, infraestructura cloud validada ni piloto completado.
- La demostración del producto está rotulada como conceptual y no conecta con el producto real.
- Studio no muestra imágenes: el material disponible aún necesita permiso, recorte y revisión de privacidad.
- No se usan fotografías de stock ni testimonios, cifras o resultados sin evidencia.
- Desde el 5 de agosto de 2026 se publica contacto real: correo, WhatsApp y teléfono. Los enlaces se sirven en el HTML (funcionan sin JavaScript) y el validador obliga a que coincidan con `config.js`.
- CERO comunica cinco estados visuales y textuales mediante renders derivados del modelo 3D aportado. La imagen es decorativa para lectores de pantalla y el cambio relevante se anuncia en una región de estado.

## Bloqueos de producción

Cerrados el 5 de agosto de 2026:

1. Contactos reales y canal principal.
2. Llamadas a la acción definitivas.
3. Decisión de indexación, metadatos canónicos y publicación del dominio.
4. Comprobación de originalidad y derechos de CERO.

5. Contenido legal publicado y enlazado: `/aviso-legal/` y `/privacidad/`, con los datos del titular (autónomo) y el detalle de proveedores que acceden a los datos de contacto.

6. Aprobación del contenido legal por el titular (5 de agosto de 2026).
7. Aprobación visual de CERO (5 de agosto de 2026): manifiesto 2.3.0 en `production-approved`.

Siguen abiertos con la web ya indexable:

1. Permiso explícito y revisión de privacidad para cualquier medio de Studio.
2. Revisión en dispositivos móviles físicos y recorrido con NVDA. El titular dio por cerrada la puerta de producción el 5 de agosto de 2026; no consta registro de ejecución de estas dos pruebas, que requieren dispositivo y lector de pantalla reales.

La ausencia de `CNAME` debe mantenerse: el dominio lo sirve Cloudflare Pages.
