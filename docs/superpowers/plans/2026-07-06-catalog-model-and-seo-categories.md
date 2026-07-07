# Catalog Model And SEO Categories Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the catalog model to support product categories, per-size stock, SEO category routes, and production setup for the Mundo JJersey catalog.

**Architecture:** Products remain a single Sanity document type with `category`, `brand`, and `variants`. The public site keeps `/catalogo` for all products, adds `/catalogo/camisetas`, `/catalogo/camperas`, and `/catalogo/shorts`, and moves product detail pages to `/producto/[slug]` to avoid route collisions.

**Tech Stack:** Astro 5, Sanity Studio 3, TypeScript, npm workspaces, static generation on Vercel.

---

### Task 1: Schema Contract Tests

**Files:**
- Modify: `apps/studio/scripts/validate-schemas.mjs`
- Test: `apps/studio/scripts/validate-schemas.mjs`

- [ ] **Step 1: Update schema assertions first**

Assert `product` has `variants`, `category`, and `brand`; assert it no longer exposes legacy `stock` and `sizes`; assert image alt validation exists; assert slug uniqueness exists on product, team, and league.

- [ ] **Step 2: Run failing schema test**

Run: `npm --workspace @mundo-jjersey/studio run test`

Expected: FAIL because the schema has not been migrated yet.

- [ ] **Step 3: Implement schema changes**

Update product, team, and league schemas to satisfy the new contract.

- [ ] **Step 4: Run passing schema test**

Run: `npm --workspace @mundo-jjersey/studio run test`

Expected: PASS with `Sanity schemas validated.`

### Task 2: Catalog Helper Tests

**Files:**
- Create: `apps/web/scripts/test-catalog.mjs`
- Create: `apps/web/src/lib/catalog/categories.ts`
- Create: `apps/web/src/lib/catalog/availability.ts`
- Modify: `package.json`

- [ ] **Step 1: Write catalog helper tests first**

Cover category URL mapping, category lookup by slug, stock totals from variants, and available-size formatting.

- [ ] **Step 2: Run failing catalog helper test**

Run: `node --experimental-strip-types apps/web/scripts/test-catalog.mjs`

Expected: FAIL because catalog helpers do not exist yet.

- [ ] **Step 3: Implement minimal helpers**

Add category metadata and variant availability helpers.

- [ ] **Step 4: Wire helper test into root test**

Add `test:catalog` to `apps/web/package.json` and root `npm test`.

### Task 3: Sanity Studio Singleton

**Files:**
- Create: `apps/studio/deskStructure.ts`
- Modify: `apps/studio/sanity.config.ts`

- [ ] **Step 1: Add singleton structure**

Expose one fixed `siteSettings` document in Studio navigation.

- [ ] **Step 2: Wire structureTool**

Use `structureTool({ structure })` in `sanity.config.ts`.

### Task 4: Frontend Data Model

**Files:**
- Modify: `apps/web/src/lib/sanity/queries.ts`
- Modify: `apps/web/src/lib/sanity/types.ts`
- Modify: `apps/web/src/lib/whatsapp.ts`
- Modify: `apps/web/scripts/test-whatsapp.mjs`

- [ ] **Step 1: Update WhatsApp tests first**

Assert message templates support `{productTitle}`, `{category}`, and `{productUrl}`.

- [ ] **Step 2: Run failing WhatsApp test**

Run: `npm --workspace @mundo-jjersey/web run test`

Expected: FAIL because `buildWhatsAppUrl` does not accept category/template yet.

- [ ] **Step 3: Update queries and types**

Use `category`, `brand`, and `variants` instead of `stock` and `sizes`.

- [ ] **Step 4: Update WhatsApp helper**

Keep the current fallback while supporting Sanity templates.

### Task 5: Route Migration And SEO Category Pages

**Files:**
- Create: `apps/web/src/pages/producto/[slug].astro`
- Create: `apps/web/src/pages/catalogo/[category].astro`
- Delete: `apps/web/src/pages/catalogo/[slug].astro`
- Modify: `apps/web/src/pages/catalogo.astro`
- Modify: `apps/web/src/pages/index.astro`
- Modify: `apps/web/src/components/ProductCard.astro`

- [ ] **Step 1: Move product detail route**

Move detail logic to `/producto/[slug]` and update all product links.

- [ ] **Step 2: Add category static paths**

Generate only `camisetas`, `camperas`, and `shorts` under `/catalogo/[category]`.

- [ ] **Step 3: Update catalog and home navigation**

Use real category links instead of inert chips.

### Task 6: Product UI And Styles

**Files:**
- Modify: `apps/web/src/components/ProductCard.astro`
- Modify: `apps/web/src/components/WhatsAppButton.astro`
- Modify: `apps/web/src/pages/producto/[slug].astro`
- Modify: `apps/web/src/styles/global.css`

- [ ] **Step 1: Render variant availability**

Show total stock and per-size availability from variants.

- [ ] **Step 2: Render category and brand**

Show category and brand in cards and detail.

- [ ] **Step 3: Preserve accessibility**

Keep focus-visible states, meaningful headings, and reduced motion behavior.

### Task 7: Production Setup Docs And Headers

**Files:**
- Create: `vercel.json`
- Modify: `README.md`

- [ ] **Step 1: Add safe headers**

Add minimal security headers that do not risk breaking Sanity/image loading.

- [ ] **Step 2: Document manual production steps**

Document Vercel deploy hooks, Sanity webhook filters, CORS, and editor role setup.

### Task 8: Final Verification

**Files:**
- Verify all changed files.

- [ ] **Step 1: Run full verification**

Run: `npm test && npm run check && npm run build:web && npm run build:studio`

Expected: PASS for tests, Astro check, web build, and Studio build.

- [ ] **Step 2: Verify git status**

Run: `git status --short --branch`

Expected: only intentional modified/new files remain before commit.
