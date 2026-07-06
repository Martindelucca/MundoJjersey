# Mundo JJersey

Catálogo administrable para camisetas de fútbol retro y actuales. El sitio no incluye carrito ni pagos: cada producto deriva consultas a WhatsApp.

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
