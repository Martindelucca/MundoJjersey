# Mundo JJersey

Catálogo administrable para camisetas, camperas, shorts y conjuntos completos de fútbol. El sitio no incluye carrito ni pagos: cada producto deriva consultas a WhatsApp.

## Stack

- Astro para el frontend público.
- Sanity Studio para administrar productos.
- TypeScript.
- CSS global inicialmente, con estructura preparada para evolucionar a Tailwind si hace falta.
- Vercel para deploy.

## Estructura

```txt
apps/
  web/      Frontend Astro
  studio/   Sanity Studio
```

## Scripts

```bash
npm install
npm test
npm run dev:web
npm run dev:studio
npm run build:web
npm run build:studio
npm run check
npm run ready
```

## Variables

Copiar `.env.example` a `.env.local` y completar los valores de Sanity y WhatsApp antes de conectar datos reales.

La web pública y los scripts de validación leen `.env.local` desde la raíz del repositorio. Para el Studio local, usar `apps/studio/.env.local`.

La web lee datos públicos de Sanity durante el build. No exponer tokens privados con prefijo `PUBLIC_`.

Variables clave:

- `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_API_VERSION`: lectura de productos para la web pública.
- `SANITY_READ_TOKEN`: opcional, solo si el dataset no es público. No usar prefijo `PUBLIC_`.
- `PUBLIC_SITE_URL`: dominio final para canonical, Open Graph y links de producto en WhatsApp.
- `PUBLIC_WHATSAPP_NUMBER`: fallback público si no existe `siteSettings.whatsappNumber` en Sanity. Usar formato internacional, por ejemplo `5491112345678`.
- `PUBLIC_INSTAGRAM_URL`: fallback público si no existe `siteSettings.instagramUrl` en Sanity.
- `SANITY_STUDIO_PROJECT_ID`, `SANITY_STUDIO_DATASET`: configuración del Studio.

Prioridad de contacto en la web:

- WhatsApp: primero `siteSettings.whatsappNumber`, después `PUBLIC_WHATSAPP_NUMBER`.
- Instagram: primero `siteSettings.instagramUrl`, después `PUBLIC_INSTAGRAM_URL`.

Assets pendientes para producción:

- Reemplazar el monograma SVG temporal por logo real.
- Reemplazar `/og.svg` por una placa Open Graph con foto real de producto cuando haya assets de marca.

## Rutas públicas

```txt
/catalogo
/catalogo/camisetas
/catalogo/camisetas/clubes
/catalogo/camisetas/selecciones
/catalogo/camisetas/retro
/catalogo/camperas
/catalogo/shorts
/catalogo/conjuntos
/producto/[slug]
```

## Producción

Para que las cargas en Sanity actualicen el sitio estático sin intervención del desarrollador:

1. Crear un Deploy Hook en Vercel para el proyecto web.
2. Crear un webhook en Sanity apuntando al Deploy Hook.
3. Filtrar el webhook para cambios de `product`, `team`, `league` y `siteSettings`.
4. Agregar CORS en Sanity para `http://localhost:4321` y el dominio final de producción.
5. Invitar al colaborador que carga productos con rol `Editor`, no `Administrator`.

## Migración de productos existentes

Cada producto usa `variants` como fuente única de stock. Los conjuntos completos tienen foto, precio y stock propios por talle; no comparten stock con camperas sueltas.
