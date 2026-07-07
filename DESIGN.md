# Design

## Product

Mundo JJersey is a public brand catalog for new football jerseys. It uses Astro for the static frontend and Sanity as the product source. The core journey is: feel the brand, browse jerseys, open a product, consult through WhatsApp.

## Design Direction

The primary direction is a balanced street-catalog system: premium deep blue foundation with streetwear energy in hero composition, cards, badges, section rhythm and calls to action.

The site should feel modern, football-aware and commercial, inspired by the strong hero, simple navigation and clean product grids of KickOffs, with the catalog confidence and collection depth associated with Classic Football Shirts. These references guide structure and trust, not direct visual copying.

## Visual Personality

- Energetic, young, bold.
- Premium but close.
- Football culture without literal football clichés.
- Commercial without becoming a marketplace.
- Retro-modern without looking old or nostalgic by default.

## Color System

Use the palette below as the primary identity system.

| Token | Hex | Role |
|---|---:|---|
| `--color-ink` | `#071525` | Deepest text / premium navy-black |
| `--color-navy` | `#0B1F3A` | Main brand background |
| `--color-blue` | `#123B63` | Secondary panels, hover states, depth |
| `--color-gold` | `#C9A24A` | Primary accent, CTAs, badges, active states |
| `--color-gold-soft` | `#E0C878` | Highlight, subtle accents, dividers |
| `--color-cream` | `#F7F3EA` | Controlled light sections and product contrast |
| `--color-white` | `#FFFFFF` | Text on navy, product surfaces |
| `--color-text-dark` | `#111827` | Text on light surfaces |

### Color Rules

- Navy is the base identity color. It should carry the brand more than cream.
- Gold is an accent, never the dominant surface color.
- Cream is allowed for contrast and product-card breathing room, but must not turn the site into beige luxury.
- Body text must maintain WCAG AA contrast.
- Avoid default gray-on-tinted-background text. Muted text should be a darker blue/ink mix, not generic gray.

## Typography

The site should use a bold display voice with a highly legible UI/body voice.

Recommended stack:

- Display: `Oswald`, `Bebas Neue`, `Anton`, `Archivo Black`, or another condensed/bold sports-street typeface.
- Body/UI: `Plus Jakarta Sans`, `Sora`, `Manrope`, or a similar modern sans.
- Fallbacks: `ui-sans-serif`, `system-ui`, `sans-serif`.

### Type Rules

- Hero headings should be large, condensed and confident, but must not overflow mobile screens.
- Display letter-spacing should not be tighter than `-0.04em`.
- Body line length should stay near 65-75 characters.
- Section titles should vary in rhythm; avoid using the same tiny uppercase eyebrow above every section.

## Layout System

### Header

- Simple, compact and confident.
- Should prioritize brand, catalog, key categories and WhatsApp/contact.
- Avoid a bulky marketplace nav in Fase 4.
- Mobile navigation must be clear and touch-friendly.

### Home

Recommended order:

1. Header.
2. Hero with strong brand statement and CTA to catalog.
3. New arrivals / latest jerseys.
4. Main categories: Clubes, Selecciones, Retro.
5. Featured products.
6. Retro or special collection block.
7. About us with human story and selection criteria.
8. Trust / buying benefits: WhatsApp, payment methods, shipping, changes.
9. FAQ.
10. Footer.

### Catalog

- Product grid should feel curated, not like a marketplace wall.
- Cards should make image and shirt identity dominant.
- Price and stock should be clear but not visually louder than the product.
- Empty state should sound human and brand-consistent.

### Product Detail

- Large image first.
- Clear title, price, stock and sizes.
- WhatsApp CTA must be visually dominant.
- Related products should feel like a curated continuation, not generic recommendations.

## Components

### Buttons

- Primary CTA uses gold on navy or navy on gold depending on context.
- Buttons are pill-shaped or strongly rounded.
- Hover should use transform/opacity/color transitions, not layout changes.
- Active state may compress slightly with `transform: scale(0.98)`.

### Product Cards

- Use strong image area, clear title, team/season metadata, price and stock.
- Cards can use layered or framed treatments, but avoid generic gray borders.
- Hover can lift or reveal secondary information, but content must remain accessible without hover.

### Category Tiles

- Large, high-impact blocks for Clubes, Selecciones and Retro.
- Should feel like merch/drop navigation, not basic category buttons.

### Trust Blocks

- Communicate WhatsApp consultation, payment methods, shipping and changes.
- Keep copy direct and short.
- Use icons only if custom/lightweight; avoid generic thick icon sets.

### FAQ

- Simple questions focused on availability, sizing, payment, shipping and changes.
- Should build trust before WhatsApp consultation.

## Motion

Motion level is moderate.

- Use hover transitions on cards and CTAs.
- Use subtle fade/slide entry only when it does not block content.
- Animate `transform` and `opacity`, not layout properties.
- Include `@media (prefers-reduced-motion: reduce)` for all transitions/animations.
- Do not add heavy scroll libraries in Fase 4.

## Accessibility

- Target WCAG AA.
- Maintain visible focus states.
- Ensure tap targets are comfortable on mobile.
- Reduced motion must be supported.
- Do not rely on color alone to communicate stock or availability.
- Product images need useful alt text, with fallback to product title.

## Content Voice

The voice is direct, young and confident. It should sound like a curated football/streetwear brand, not a corporate store.

Use language like:

- “Nuevos ingresos”
- “Camisetas seleccionadas”
- “Retro y actuales”
- “Consultá por WhatsApp”
- “Stock disponible”
- “Elegidas con criterio”

Avoid language like:

- “Checkout”
- “Añadir al carrito”
- “Catálogo administrable” on public pages
- “Deploy” or internal tooling terms
- Generic e-commerce filler

## Fase 4 Scope

Fase 4 should implement the visual system, not new catalog functionality.

Included:

- Brand/documentation setup.
- Visual token refactor.
- Home redesign.
- Catalog visual polish.
- Product detail visual polish.
- Trust, about and FAQ sections.
- Moderate accessible motion.

Excluded:

- Advanced filters.
- Search.
- Cart.
- Payments.
- Checkout.
- New Sanity schemas unless absolutely necessary.
- Vercel/webhook production setup.
