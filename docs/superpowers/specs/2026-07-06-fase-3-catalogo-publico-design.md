# Fase 3: Catálogo Público Con Sanity

## Objetivo

Conectar Astro con Sanity y construir el catálogo público inicial de Mundo JJersey: listado de productos, detalle por slug y CTA de consulta por WhatsApp.

## Alcance

La fase 3 implementa el flujo completo `Sanity -> Astro build -> /catalogo -> /catalogo/[slug] -> WhatsApp`.

Queda fuera de alcance: carrito, pagos, login, filtros avanzados, buscador full-text, analytics avanzados, panel custom de Sanity y rediseño visual final.

## Arquitectura Recomendada

La web usará Astro SSG. Durante el build, Astro consultará Sanity con GROQ y generará HTML estático para el catálogo y las páginas de producto. Esta decisión prioriza performance, SEO, baja complejidad operativa y menor superficie de seguridad.

Sanity será la fuente de datos para productos, equipos, ligas y configuración del sitio. Vercel debe reconstruir el sitio cuando Sanity dispare un webhook de publicación.

## Jerarquía De Páginas

```txt
Homepage (/)
├── Catálogo (/catalogo)
│   └── Producto (/catalogo/[slug])
└── Redes / contacto externo
```

## Mapa De URLs

| Página | URL | Fuente de datos | Propósito |
|---|---|---|---|
| Home | `/` | Estática en esta fase | Entrada al sitio |
| Catálogo | `/catalogo` | `product[]` | Listar camisetas |
| Producto | `/catalogo/[slug]` | `product` por slug | Mostrar detalle y CTA WhatsApp |

## Modelo De Datos Consumido

El frontend consume los schemas existentes de Sanity:

- `product`: título, slug, imágenes, precio, equipo, liga, temporada, stock, talles, descripción, destacado.
- `team`: nombre, slug, país, escudo.
- `league`: nombre, slug, país, logo.
- `siteSettings`: título, descripción, WhatsApp, mensaje base e Instagram.

Todas las camisetas son nuevas, por lo tanto no existe campo `condition`.

## Componentes Y Módulos

| Unidad | Responsabilidad |
|---|---|
| `src/lib/sanity/client.ts` | Crear cliente Sanity con variables de entorno. |
| `src/lib/sanity/queries.ts` | Centralizar GROQ. |
| `src/lib/sanity/types.ts` | Tipar los datos usados por Astro. |
| `src/lib/sanity/image.ts` | Construir URLs de imágenes de Sanity. |
| `src/lib/whatsapp.ts` | Generar links de WhatsApp seguros. |
| `src/components/ProductCard.astro` | Mostrar tarjeta de producto. |
| `src/components/WhatsAppButton.astro` | Renderizar CTA de WhatsApp. |
| `src/pages/catalogo.astro` | Renderizar listado del catálogo. |
| `src/pages/catalogo/[slug].astro` | Renderizar detalle de producto. |

## Reglas De Render

- Productos con `stock > 0`: mostrar disponibles y CTA activo.
- Productos con `stock === 0`: mostrar “Sin stock” y CTA alternativo “Consultar reposición”.
- Producto sin liga: se renderiza igual.
- Producto sin imagen: se muestra placeholder visual simple.
- Catálogo vacío: se muestra estado vacío en español.
- `siteSettings.whatsappNumber` tiene prioridad; si falta, usar `PUBLIC_WHATSAPP_NUMBER`.

## Seguridad

- No usar token privado para dataset público.
- No exponer `SANITY_READ_TOKEN` ni ninguna variable sensible con prefijo `PUBLIC_`.
- Las queries solo piden campos necesarios.
- No renderizar HTML arbitrario desde Sanity.
- El mensaje de WhatsApp se codifica con `encodeURIComponent`.
- El número de WhatsApp se normaliza para aceptar solo dígitos.
- Si falta `PUBLIC_SITE_URL`, no incluir URL de producto en el mensaje de WhatsApp.

## Performance Y SEO

- HTML estático con Astro SSG.
- Sanity CDN habilitado para lecturas públicas.
- Imágenes servidas desde Sanity con URLs construidas y tamaños controlados.
- `/catalogo` y `/catalogo/[slug]` tienen `title` y `description` específicos.
- Detalle de producto incluye breadcrumb visual simple.

## Verificación

Antes de cerrar la fase deben pasar:

```bash
npm test
npm run check
npm run build:web
npm run build:studio
```

Además, se debe agregar prueba para `buildWhatsAppUrl` y mantener la validación de schemas existente.
