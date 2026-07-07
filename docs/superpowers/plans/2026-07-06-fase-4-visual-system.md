# Fase 4 Visual System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the approved Mundo JJersey visual system: premium navy foundation, gold accents, streetwear energy, stronger home, polished catalog, polished product detail, trust/about/FAQ sections.

**Architecture:** Keep the existing Astro + Sanity SSG flow. Do not add new catalog functionality, filters, cart, checkout, or schema changes. Refactor visual code into clearer components and CSS sections while preserving the current routes and data layer.

**Tech Stack:** Astro 5, TypeScript, Sanity, CSS, npm scripts.

---

## Scope

Included: brand docs, visual token refactor, shared layout components, home redesign, catalog polish, product detail polish, trust/about/FAQ sections, moderate accessible motion, and lightweight design validation.

Excluded: filters, search, cart, online payments, checkout, new Sanity schemas, Vercel/webhook production setup, heavy animation libraries.

## Tasks

1. Add design validation script and test wiring.
2. Refactor visual tokens to navy/gold street-catalog system.
3. Add shared layout components: header, footer, section header.
4. Redesign home with hero, latest products, categories, about, trust and FAQ.
5. Polish product cards and catalog page.
6. Polish product detail and WhatsApp CTA.
7. Add accessible motion pass.
8. Run final verification.

## Verification

Run before completion:

```bash
npm test && npm run check && npm run build:web && npm run build:studio
```

Expected: Studio schema validation passes, WhatsApp helper test passes, design validation passes, Astro check reports 0 errors/warnings/hints, web build succeeds, Studio build succeeds.
