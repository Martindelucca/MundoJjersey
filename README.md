# Mundo JJersey

Catálogo administrable para camisetas, camperas y shorts de fútbol. El sitio no incluye carrito ni pagos: cada producto deriva consultas a WhatsApp.

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
```

## Variables

Copiar `.env.example` a `.env.local` y completar los valores de Sanity y WhatsApp antes de conectar datos reales.

La web lee datos públicos de Sanity durante el build. No exponer tokens privados con prefijo `PUBLIC_`.

## Rutas públicas

```txt
/catalogo
/catalogo/camisetas
/catalogo/camperas
/catalogo/shorts
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

Si ya hay productos cargados con el modelo anterior (`stock` y `sizes`), completá el nuevo campo `variants` en Sanity antes de publicar cambios. El frontend calcula disponibilidad únicamente desde `variants`.
