# Fase 6 Drop Futbolero Editorial Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the public catalog surfaces so Mundo JJersey feels like a specific football-streetwear drop brand rather than a generic AI-built catalog.

**Architecture:** Keep the existing Astro components and global CSS. Drive the redesign through stronger semantic sections, stricter design-contract tests, improved copy, richer CSS materiality, and targeted component markup changes without touching Sanity schema or routes.

**Tech Stack:** Astro 5, vanilla CSS, Sanity static data, npm workspaces.

---

### Task 1: Visual Contract

**Files:**
- Modify: `apps/web/scripts/validate-design.mjs`

- [ ] Add assertions for `drop-scene`, `hero__spec-sheet`, `drop-marquee`, `category-grid--drop`, `product-card__ticket`, `product-detail__sheet`, fixed grain, and absence of old repeated generic labels.
- [ ] Run `npm --workspace @mundo-jjersey/web run test:design` and confirm it fails before implementation.

### Task 2: Home Drop Scene

**Files:**
- Modify: `apps/web/src/pages/index.astro`
- Modify: `apps/web/src/styles/global.css`

- [ ] Replace the text-only hero with a split drop scene containing a visual product/spec panel and a kinetic text band.
- [ ] Replace generic category copy with collection/drop language.
- [ ] Keep CTA to `/catalogo` and fallback empty state.

### Task 3: Category Navigation

**Files:**
- Modify: `apps/web/src/components/CategoryTile.astro`
- Modify: `apps/web/src/pages/index.astro`
- Modify: `apps/web/src/styles/global.css`

- [ ] Make category tiles support `tone` and `featured` treatment.
- [ ] Render camisetas as the dominant category and camperas/shorts as supporting lanes.
- [ ] Avoid equal three-card layout on desktop while preserving single-column mobile.

### Task 4: Product Cards

**Files:**
- Modify: `apps/web/src/components/ProductCard.astro`
- Modify: `apps/web/src/styles/global.css`

- [ ] Add a ticket/label strip with category, brand, and stock.
- [ ] Keep image dominant and price secondary.
- [ ] Preserve links to `/producto/[slug]`.

### Task 5: Catalog And Category Pages

**Files:**
- Modify: `apps/web/src/pages/catalogo.astro`
- Modify: `apps/web/src/pages/catalogo/[category].astro`
- Modify: `apps/web/src/styles/global.css`

- [ ] Give catalog/category pages a stronger editorial intro with facts and category rail.
- [ ] Keep category links accessible and active state visible.
- [ ] Preserve empty states.

### Task 6: Product Detail Sheet

**Files:**
- Modify: `apps/web/src/pages/producto/[slug].astro`
- Modify: `apps/web/src/styles/global.css`

- [ ] Reframe the detail page as a product sheet with garment facts and variant rows.
- [ ] Make WhatsApp CTA visually dominant but not checkout-like.
- [ ] Keep related products and fallback states.

### Task 7: Verification

**Files:**
- Verify all changed files.

- [ ] Run `npm test`.
- [ ] Run `npm run check`.
- [ ] Run `npm run build:web`.
- [ ] Inspect `git status --short --branch` and report changed files.
