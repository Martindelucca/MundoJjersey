# Mundo JJersey

Catalogo administrable para camisetas de futbol retro y actuales. El sitio no incluye carrito ni pagos: cada producto deriva consultas a WhatsApp.

## Stack

- Astro para el frontend publico.
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
npm run dev:web
npm run dev:studio
npm run build:web
npm run check
```

## Variables

Copiar `.env.example` a `.env.local` y completar los valores de Sanity y WhatsApp antes de conectar datos reales.
