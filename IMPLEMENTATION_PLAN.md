# Editorial routing plan

## Goal

Add explicit editorial routes for shirt collections without changing the existing product taxonomy:

- `/catalogo/camisetas/clubes`
- `/catalogo/camisetas/selecciones`
- `/catalogo/camisetas/retro`

## Data model

Products use an optional `editorialTags` array. Its permitted values are `club`, `selection`, and `retro`. It is a multiselect field, so a product can appear in more than one editorial collection. Tags are explicit metadata and must never be inferred from product name, country, team, league, or season.

## Routing and query approach

- A centralized typed mapping resolves public collection slugs (`clubes`, `selecciones`, `retro`) to their Sanity editorial tag, route copy, and navigation label.
- The nested Astro route `/catalogo/[category]/[collection]` will generate only the three valid `camisetas` collection routes.
- Its Sanity query filters by both the garment category and editorial tag, preserving the catalog ordering: `isFeatured desc, _createdAt desc`.

## Files affected

- `apps/studio/schemas/product.ts`
- `apps/studio/scripts/validate-schemas.mjs`
- `apps/web/src/lib/sanity/types.ts`
- `apps/web/src/lib/sanity/queries.ts`
- `apps/web/src/lib/catalog/editorial-collections.ts`
- `apps/web/src/components/CatalogCategoryNavigation.astro`
- `apps/web/src/components/ShirtCollectionNavigation.astro`
- `apps/web/src/pages/catalogo/[category]/[collection].astro`
- `apps/web/src/pages/catalogo/[category].astro`
- `apps/web/src/pages/index.astro`
- `apps/web/scripts/test-catalog.mjs`
- `IMPLEMENTATION_PLAN.md`

## Risks and migration

Existing shirts were manually tagged in Sanity on 2026-07-13. No automatic classification or migration is included.

## Acceptance criteria

1. Sanity exposes `editorialTags` as a multiselect limited to `club`, `selection`, and `retro`.
2. Web types and projections include the tags.
3. Public slugs map centrally and type-safely to editorial tags and route metadata.
4. A product query filters on garment category and editorial tag with standard catalog ordering.
5. The nested static routes render correct metadata, canonical URL, product grid, and empty-state WhatsApp fallback.
6. Home tiles target the three nested routes; Camperas remains `/catalogo/camperas`.
7. Automated coverage verifies valid routes, mappings/query behavior, and Home destinations.

## Status

Phase 0 completed on 2026-07-13. The shirts category and each editorial collection route render server-side navigation for `Todas`, `Clubes`, `Selecciones`, and `Retro`, while the garment-category navigation remains separate and collection navigation is limited to shirts. Content readiness now blocks release when a shirt lacks a `club` or `selection` tag, tags are invalid or duplicated, or any public shirt collection (`club`, `selection`, `retro`) is empty. Existing validation for prices, images and alt text, variants, sizes, stock, team, and WhatsApp remains in place. WhatsApp and Instagram were manually verified; WhatsApp remains the blocking conversion gate. A live Sanity content check is only recorded as passed when `content:check` is executed successfully against the configured environment.

## Phase 1 — storefront readiness (2026-07-13, implemented)

### Decisions

- Use compact browsing headers on `/catalogo`, `/catalogo/[category]`, and `/catalogo/camisetas/[collection]`: title, concise description, garment navigation, and shirt-collection navigation where applicable.
- Remove generic pre-grid WhatsApp explainers, facts, and stamps from filtered routes. Keep the WhatsApp CTA in every empty state.
- Reuse `CatalogCategoryNavigation` at the root catalog with `catalogo` active. Separate shirt collections using a full-width top divider instead of a decorative side stripe.

### Files

- `apps/web/src/pages/catalogo.astro`
- `apps/web/src/pages/catalogo/[category].astro`
- `apps/web/src/pages/catalogo/[category]/[collection].astro`
- `apps/web/src/styles/global.css`
- `apps/web/scripts/test-catalog.mjs`
- `apps/web/scripts/validate-design.mjs`
- `MEMORY.md`

### Acceptance and validation

- All catalog routes use the explicit compact header and retain accessible, no-JS navigation with 44px chip targets and active states.
- The compact mobile spacing is designed for the first product to begin or peek in a 667–750px-tall viewport without fixed viewport positioning.
- Passed on 2026-07-13: `npm run check`, web `test`, `test:content`, `test:catalog`, `test:design`, and `npm run build:web`.
- Live `npm --workspace @mundo-jjersey/web run content:check` passed with `Content readiness OK.` and `Checked 6 products.` The read-only Home-order arrivals query was also completed; its results are reported with this implementation.
- Focused `git diff --check` passed on the Phase 1 files; it reported no whitespace errors (only existing CRLF conversion warnings from Git).

## Validation commands

```sh
npm run check
npm --workspace @mundo-jjersey/web run test:catalog
npm --workspace @mundo-jjersey/web run test:content
npm --workspace @mundo-jjersey/web run test:design
npm run build:web
npm --workspace @mundo-jjersey/studio run test
npm --workspace @mundo-jjersey/web run content:check
```

The Phase 0 live `content:check` was run against Sanity on 2026-07-13 and correctly failed: `Camiseta Retro Liverpool Alternativa 2006/07` has only `retro` and needs an additional `club` or `selection` tag. The web build generated exactly the three intended nested routes.

## Responsive catalog density — 2026-07-13

### Decisions

- `/catalogo`, category routes, and shirt-collection routes use the same compact header before their product grids: title, concise description, and category navigation (plus collection navigation when applicable).
- The root catalog no longer shows a pre-grid stamp, generic WhatsApp explainer/CTA, or facts. Its empty state remains the recovery path with WhatsApp.
- At `<=780px`, each category or collection chip row is a single horizontal touch-scroll row with 44px link targets. Rows stay separated by the existing collection divider and never require JavaScript or hidden items.
- Product cards use a compact treatment from 360px through 780px (also shared by Home): two equal columns, 4:5 media, condensed body spacing, and no redundant ticket. A compact team · season identity line remains visible alongside the title, image link, price, availability/stock, and size preview. At 320–359px the grid is one column.
- Do not paginate the current live inventory of 6 products. Revisit true server/static pagination when published inventory exceeds 16 products; do not use infinite scroll, hidden pre-rendered products, or client-side load-more.

### Acceptance and validation

- All catalog routes are compact before the grid; empty states retain their WhatsApp CTA.
- Mobile filters remain one approximately 44px row per navigation level and scroll within their own container.
- At 360–780px product grids use two columns with non-clipping compact content; at 320–359px they use one column. Desktop card rules are unchanged.
- Tests lock the compact root header, empty-state CTA, navigation overflow behavior, responsive grid breakpoints, and retained product conversion information.
- Passed on 2026-07-13: `npm run check`; web `test`, `test:content`, `test:catalog`, and `test:design`; `npm run build:web`; and focused `git diff --check` (no whitespace errors; Git emitted only existing CRLF conversion warnings). Browser/screenshot tooling was not available, so responsive inspection was source-level at 320px, 375px, 390px, 780px, and desktop breakpoints.

## Revised Phase 2 — About evidence and concise copy (2026-07-13, implemented)

### Decisions

- Do not add a separate trust block. The existing FAQ remains the only objection-handling section and is unchanged in this phase.
- Replace the decorative gold text placeholder in Home About with `apps/web/fotos/nosotros.JPEG`, a 4:3 childhood photo of the friends behind Mundo JJersey. It is presented as contained brand evidence, not as a full-bleed hero or cropped portrait.
- Use Astro local-image metadata via `<Image>`, useful Spanish alt text, lazy loading, async decoding, intrinsic dimensions, and a stable 4:3 media box. Desktop uses balanced two-column layout; mobile stacks at full available width without an imposed portrait crop.
- Reduce About from four paragraphs to three while preserving the friends/project and collectible-shirt focus, the stock/request context, and `líneas Premium` with product review and quality/value intent.

### Affected files

- `apps/web/src/pages/index.astro`
- `apps/web/src/styles/global.css`
- `apps/web/src/env.d.ts`
- `apps/web/scripts/validate-design.mjs`
- `MEMORY.md`
- `IMPLEMENTATION_PLAN.md`

### Acceptance and validation

- About renders the new local photo with the alt text `Los amigos detrás de Mundo JJersey cuando eran chicos.` and no gold text-only placeholder.
- The source/CSS preserves the photo's 4:3 ratio with `object-fit: contain`, so both people are not forced into a tall portrait crop; its intrinsic image dimensions prevent layout shift.
- About contains exactly three paragraphs and retains `líneas Premium`; no trust block is added and FAQ markup remains unchanged.
- Passed on 2026-07-13: `npm run check`; web `test`, `test:content`, `test:catalog`, and `test:design`; `npm run build:web`; and focused `git diff --check`. Browser/screenshot tooling was unavailable, so responsive verification was source/image-level for the mobile stacking rule and desktop two-column CSS.

### Refinement — mobile garment routes and About copy (2026-07-13)

- At `<=780px`, Home's garment routes are a light, divided quick-navigation strip: a short label and one non-wrapping, internally touch-scrollable row with 44px links. Desktop card styling remains unchanged.
- About uses the final approved three paragraphs: friendship and the current/retro collection; models in stock and shirts by request; and `líneas Premium` with each shirt reviewed before joining the catalog.
- Design validation locks the mobile no-wrap/internal-overflow/44px behavior and the exact three-paragraph About copy contract.
