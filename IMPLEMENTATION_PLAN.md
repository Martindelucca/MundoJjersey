# Editorial routing plan

## Productos a pedido — 2026-07-18, implementado

- Sanity incorpora `saleMode` para todos los productos, con `stock` inicial y compatibilidad legacy; oculta talles/stock para `onRequest` y muestra “A pedido” en el preview.
- Web centraliza `inStock`, `onRequest` y `outOfStock`. Los catálogos agrupan los dos estados visibles en ese orden; Home conserva solo stock y relacionados excluyen agotados.
- Card y ficha muestran copy, talle y CTA específicos. WhatsApp usa el mensaje de pedido acordado con enlace; Product JSON-LD mapea a `InStock`, `BackOrder` y `OutOfStock`.
- Readiness valida modalidad, variantes condicionales y colecciones con producto visible.
- Validación local aprobada: Studio schema test, web tests de WhatsApp/catálogo/contenido/diseño/SEO, Astro check y build web.

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

## Client-facing Studio workflow — 2026-07-13

- The client publishes Products, Teams, and optional Leagues directly. Site configuration is internal and is labelled accordingly in Studio navigation.
- Product loading is organized into Producto, Fotos, Precio y stock, and Colecciones y publicación. Shirts are blocked in Studio unless they include `club` or `selection`; `retro` is supplementary only.
- Direct publishing triggers the existing Sanity-to-Vercel rebuild workflow. The exact hosted Studio URL and the client Editor invitation remain external owner actions; the owner must deploy the Studio or create its hostname before client access. No deploy, hostname, or membership change was performed locally.

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

## Phase 3 — semantics, related relevance, mobile menu, and product image (2026-07-13, implemented)

### Decisions

- `ProductCard` accepts only `h2` or `h3` for its title, defaults to `h2`, and gives both levels identical title styling, including compact mobile font size, line height, and overflow wrapping. Catalog root, category, and collection grids retain the default `h2`; Home arrivals and product-detail related products explicitly use `h3`.
- Related products use the existing ordered `productsQuery` result only. The current product is excluded, then candidates are ranked by exact team slug match (100), garment category (10), and any shared editorial tag (1). Equal scores retain original query order (`isFeatured desc, _createdAt desc`); zero-score candidates stay in that fallback order. Results are capped at three.
- The native mobile `<details>` menu keeps its no-JS behavior. When JavaScript is available, each menu instance closes after a link click; one document-level Escape listener closes all open site-header menus even when focus has moved outside, then restores focus to the originating menu summary (or the first open summary).
- Only `.product-detail__media img` uses `object-fit: contain` so the full garment remains visible. Product card images stay `object-fit: cover`; the detail container, sticky desktop behavior, background, and responsive structure are unchanged.

### Affected files

- `apps/web/src/components/ProductCard.astro`
- `apps/web/src/components/SiteHeader.astro`
- `apps/web/src/lib/catalog/related-products.ts`
- `apps/web/src/pages/index.astro`
- `apps/web/src/pages/producto/[slug].astro`
- `apps/web/src/styles/global.css`
- `apps/web/scripts/test-catalog.mjs`
- `apps/web/scripts/validate-design.mjs`
- `MEMORY.md`
- `IMPLEMENTATION_PLAN.md`

### Acceptance and validation

- Source contracts cover the visually identical `h2`/`h3` card titles, compact mobile heading rules, document-level Escape, link close/focus restoration behavior, and the distinct detail `contain` / card `cover` image rules.
- Executable catalog coverage verifies current-product exclusion, ranking precedence, missing team/tags, stable positive-score and fallback ordering, fewer than three candidates, and the three-product cap.
- No changes were made to Home arrival ordering/count, filters, mobile card density, About, FAQ, CTA/WhatsApp copy, facts, stock, or pagination.
- Passed on 2026-07-13: `npm run check`; web `test`, `test:content`, `test:catalog`, and `test:design`; live `content:check` (`Content readiness OK. Checked 6 products.`); and `npm run build:web`. Focused `git diff --check` found no whitespace errors (Git emitted only LF/CRLF conversion warnings). Browser/screenshot tooling was unavailable, so no visual runtime verification was performed.

## Phase 3.1 — compact product conversion (2026-07-13, implemented)

### Decisions

- Remove the duplicated product facts block. Category remains in the kicker; compact metadata assembles only available brand, team, and season values with ` · ` separators.
- Keep product detail order as header, price/availability, sizes, WhatsApp CTA plus its single supporting sentence, then the optional description.
- Use one full-width gold WhatsApp CTA with a product-specific accessible label and a small circular `↗` mark. It has no WhatsApp-green treatment, hint, nested panel, broad shadow, or sticky/fixed behavior.
- At `<=780px`, only product-detail content density is reduced to `1rem` padding and `0.85rem` gap. Title, price, sizes, CTA touch target, and body text retain their readable existing sizing.
- At `<=780px`, shared `ProductCard` keeps its compact horizontal/bottom padding and gap, while asymmetric `0.9rem 0.7rem 0.7rem` body padding adds breathing room above the first team · season line across catalog, Home arrivals, and related products. Desktop is unchanged.

### Non-goals

- No changes to WhatsApp URL/message generation, inventory/stock logic, related-product logic, catalog cards, image containment, or global mobile layout.
- No sticky or fixed conversion control is introduced.

### Acceptance and validation

- Source-level contracts cover absent facts/hint markup and styles, conditional metadata without empty separators, CTA order before description, visible CTA labels and arrow, retained trust copy, CTA dimensions/colors/motion, and no sticky/fixed CTA. Browser verification remains pending.
- Passed on 2026-07-13: `npm run check`; web `test`, `test:content`, `test:catalog`, and `test:design`; live `content:check` (`Content readiness OK. Checked 6 products.`); and `npm run build:web`. Focused `git diff --check` found no whitespace errors (Git emitted only existing LF/CRLF conversion warnings). This does not constitute runtime visual validation.

## Phase 4 — visual polish (2026-07-13, implemented)

### Decisions

- Remove the global grain pseudo-element entirely. The fixed desktop grid in `body::before` remains as the only global texture at opacity `0.08`, and is disabled at `<=780px` to reduce mobile paint and visual noise.
- Preserve the navy background gradients and the decorative header baseline as deliberate brand motifs. Preserve the final CTA as the sole strong gradient surface.
- Bordered product cards, product-detail media/content, and the header catalog CTA rely on border and surface contrast rather than wide permanent shadows. The mobile menu keeps restrained `0 4px 8px` functional elevation.
- Remove the non-communicating rotated category rectangle. Category labels/cues and product availability, season, and stock labels remain intact.
- Limit card/category lift to `-2px`, category image zoom to `1.02`, and button lift to the existing `-1px`; remove header/footer hover skew. Reduced-motion rules explicitly stop transformed CTA marks, category imagery, and the footer disclosure glyph.
- Flatten generic empty states to a dark brand-tinted surface with a smaller radius. The light Home empty state explicitly uses dark heading/body tokens; its WhatsApp CTA remains available.
- At `<=780px`, Home section padding begins at `3.3rem`, with arrivals at `2.8rem`; hero, category-card density, imagery, FAQ, and final CTA layout remain unchanged.

### Non-goals

- No changes to typography, page structure, copy, About image, catalog filters/density, product data or routes, detail order/CTA behavior, FAQ, arrivals ordering/count, or pagination.

### Acceptance and validation

- Design contracts now assert the absent grain and fake tile rectangle; the desktop-only grid's fixed, non-interactive pseudo-element contract; restrained shadows and motion; retained meaningful badges; mobile Home rhythm; retained final-CTA gradient; and the mobile menu's header/content stacking order.
- `validate-design.mjs` extracts the current `:root` hex tokens and declared sRGB mixes before computing WCAG contrast ratios for white/cream on navy/ink, gold on ink, dark/muted-light text on cream, and both declared Home empty-state gradient endpoints (AA `4.5:1` normal-text threshold).
- Passed on 2026-07-13: `npm run check`; web `test`, `test:content`, `test:catalog`, and `test:design`; live `content:check` (`Content readiness OK. Checked 6 products.`); and `npm run build:web`. The build emitted Astro's existing Vite unused-import warning for `@astrojs/internal-helpers/remote`, but completed successfully. Browser tooling was unavailable, so final visual verification is source/asset-level; manual visual checks remain at 320px, 375px, 390px, 780px, and desktop.

## Phase 5 — performance, technical SEO, sharing, and release QA (2026-07-13, implemented)

### Decisions

- Static `sitemap.xml` and `robots.txt` endpoints use the normalized origin of `PUBLIC_SITE_URL` (the same source as Astro `site`) with the request origin only as a local fallback. Sitemap URLs include the root/catalog, centralized categories/editorial collections, and Sanity product slugs; Sanity failures omit product URLs without preventing static outputs.
- `BaseLayout` emits safe baseline WebSite/Organization JSON-LD. Product pages add Product/Offer JSON-LD only when a non-local configured canonical product URL exists. JSON-LD serialization escapes `<` to prevent script termination.
- Hero and local category assets now use Astro image metadata; Sanity card/detail images use generated responsive `srcset`/`sizes`. Hero/detail images are high-priority; category/card images remain lazy. Detail image containment and card crop remain unchanged.
- `og.png` was generated locally from the existing branded SVG with the already-installed transitive `sharp` capability and verified as a real 1200×630 PNG. Layout metadata now references it.
- `ready` first rejects a missing, local, or non-pure `PUBLIC_SITE_URL` (credentials, path, query, and hash are disallowed); runtime URL consumers normalize origins defensively. After `build:web`, `test:release` validates generated `dist`, including at least one sitemap-derived product page and Product JSON-LD for every emitted product URL. A normal local `build:web` remains supported.

### Remaining manual QA

Browser tooling remains unavailable. `docs/release-qa.md` defines the required preview checks at 320/375/390/780/1024/1440px, keyboard, zoom, reduced motion, Lighthouse capture, Rich Results Test, social debuggers, and preview-to-production process. No Lighthouse, Core Web Vital, visual, or social crawler result is claimed until measured in preview.

### Checks run

- Passed: `npm run check` (0 errors, 0 warnings, 0 hints).
- Passed: web `test`, `test:content`, `test:catalog`, `test:design`, and `test:seo`.
- Passed live: `npm --workspace @mundo-jjersey/web run content:check` (`Content readiness OK. Checked 6 products.`).
- Passed: `npm run build:web` (seven catalog routes, six product routes, plus `/sitemap.xml` and `/robots.txt`; Astro emitted its pre-existing Vite unused-import warning for `@astrojs/internal-helpers/remote`).
- Passed: `npm --workspace @mundo-jjersey/web run test:release` (six generated product routes) and focused `git diff --check` (no whitespace errors; Git printed existing LF/CRLF notices).

## Hero asset unification — 2026-07-13

- Home usa `HERODESKTOP.svg` como única fuente visual en todos los breakpoints. Desktop conserva el hero full-bleed y su overlay; mobile cambia solo el layout a texto sobre navy seguido de la misma imagen en 16:9, sin altura mínima de viewport.
- Los contratos de diseño cubren una única fuente de hero, media móvil 16:9, altura móvil natural y el tratamiento desktop full-bleed con overlay; no incluyen afirmaciones visuales frágiles.
- La revisión visual en runtime sigue pendiente.

## Product cards mobile — 2026-07-18

- En `<=780px`, el marco 4:5 recorta cualquier desborde y posiciona la imagen fuera del cálculo del track con `object-fit: contain`; desktop conserva `cover`.
- El título mobile gana jerarquía y los textos de identidad, precio y talles se reducen levemente, sin ocultar información.
- La vista previa usa “Talle” cuando hay exactamente uno disponible y “Talles” cuando hay más de uno.
