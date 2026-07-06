# Fase 3 Catálogo Público Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the public catalog flow for Mundo JJersey with Astro SSG, Sanity data, product detail pages, and WhatsApp consultation CTAs.

**Architecture:** Astro fetches public Sanity data at build time and generates static `/catalogo` and `/catalogo/[slug]` pages. Sanity integration stays isolated under `apps/web/src/lib/sanity`, while WhatsApp URL creation stays in a small pure helper with tests.

**Tech Stack:** Astro 5, TypeScript, Sanity, GROQ, npm workspaces, Node test scripts.

---

## File Structure

- Modify: `apps/web/package.json` to add Sanity runtime dependencies and a web test script.
- Modify: `package.json` to run both Studio schema validation and web helper tests from `npm test`.
- Create: `apps/web/scripts/test-whatsapp.mjs` for a focused helper regression test.
- Create: `apps/web/src/lib/whatsapp.ts` for safe WhatsApp URL generation.
- Create: `apps/web/src/lib/sanity/client.ts` for the Sanity client.
- Create: `apps/web/src/lib/sanity/queries.ts` for GROQ query strings.
- Create: `apps/web/src/lib/sanity/types.ts` for frontend data types.
- Create: `apps/web/src/lib/sanity/image.ts` for Sanity image URL helpers.
- Create: `apps/web/src/components/ProductCard.astro` for catalog cards.
- Create: `apps/web/src/components/WhatsAppButton.astro` for CTA rendering.
- Create: `apps/web/src/pages/catalogo.astro` for the catalog listing.
- Create: `apps/web/src/pages/catalogo/[slug].astro` for static product detail pages.
- Modify: `apps/web/src/layouts/BaseLayout.astro` to support canonical URLs and optional per-page metadata.
- Modify: `apps/web/src/styles/global.css` to add minimal catalog styles.
- Modify: `.env.example` if the integration needs clearer Sanity variable names.

## Task 1: Add Web Test Harness For WhatsApp URLs

**Files:**
- Modify: `apps/web/package.json`
- Modify: `package.json`
- Create: `apps/web/scripts/test-whatsapp.mjs`
- Create later in this task: `apps/web/src/lib/whatsapp.ts`

- [ ] **Step 1: Write the failing web helper test**

Create `apps/web/scripts/test-whatsapp.mjs`:

```js
import assert from 'node:assert/strict';
import { buildWhatsAppUrl, normalizeWhatsAppNumber } from '../src/lib/whatsapp.ts';

assert.equal(normalizeWhatsAppNumber('+54 9 11 1234-5678'), '5491112345678');
assert.equal(normalizeWhatsAppNumber(''), '');

const url = buildWhatsAppUrl({
  phoneNumber: '+54 9 11 1234-5678',
  productTitle: 'Camiseta Boca Juniors 1998',
  productUrl: 'https://mundojjersey.com/catalogo/boca-1998'
});

assert.equal(
  url,
  'https://wa.me/5491112345678?text=Hola%2C%20quiero%20consultar%20por%20la%20camiseta%3A%20Camiseta%20Boca%20Juniors%201998.%20%C2%BFSigue%20disponible%3F%0Ahttps%3A%2F%2Fmundojjersey.com%2Fcatalogo%2Fboca-1998'
);

assert.equal(
  buildWhatsAppUrl({ phoneNumber: '', productTitle: 'Camiseta River Plate 1996' }),
  ''
);

console.log('WhatsApp helpers validated.');
```

- [ ] **Step 2: Add scripts that run the failing test**

Modify `apps/web/package.json` scripts:

```json
{
  "dev": "astro dev",
  "build": "astro build",
  "preview": "astro preview",
  "check": "astro check",
  "test": "node --experimental-strip-types scripts/test-whatsapp.mjs"
}
```

Modify root `package.json` scripts:

```json
{
  "dev:web": "npm --workspace @mundo-jjersey/web run dev",
  "dev:studio": "npm --workspace @mundo-jjersey/studio run dev",
  "build:web": "npm --workspace @mundo-jjersey/web run build",
  "build:studio": "npm --workspace @mundo-jjersey/studio run build",
  "check": "npm --workspace @mundo-jjersey/web run check",
  "test": "npm --workspace @mundo-jjersey/studio run test && npm --workspace @mundo-jjersey/web run test"
}
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npm test`

Expected: FAIL with module-not-found for `../src/lib/whatsapp.ts`.

- [ ] **Step 4: Implement the minimal WhatsApp helper**

Create `apps/web/src/lib/whatsapp.ts`:

```ts
interface BuildWhatsAppUrlInput {
  phoneNumber: string;
  productTitle: string;
  productUrl?: string;
}

export function normalizeWhatsAppNumber(phoneNumber: string): string {
  return phoneNumber.replace(/\D/g, '');
}

export function buildWhatsAppUrl({
  phoneNumber,
  productTitle,
  productUrl
}: BuildWhatsAppUrlInput): string {
  const normalizedPhoneNumber = normalizeWhatsAppNumber(phoneNumber);

  if (!normalizedPhoneNumber) {
    return '';
  }

  const messageLines = [
    `Hola, quiero consultar por la camiseta: ${productTitle}. ¿Sigue disponible?`
  ];

  if (productUrl) {
    messageLines.push(productUrl);
  }

  return `https://wa.me/${normalizedPhoneNumber}?text=${encodeURIComponent(messageLines.join('\n'))}`;
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm test`

Expected: PASS with `Sanity schemas validated.` and `WhatsApp helpers validated.`

## Task 2: Add Sanity Web Dependencies And Data Layer

**Files:**
- Modify: `apps/web/package.json`
- Create: `apps/web/src/lib/sanity/client.ts`
- Create: `apps/web/src/lib/sanity/queries.ts`
- Create: `apps/web/src/lib/sanity/types.ts`
- Create: `apps/web/src/lib/sanity/image.ts`

- [ ] **Step 1: Install Sanity web dependencies**

Run: `npm install @sanity/client@6.29.1 @sanity/image-url@1.1.0 --workspace @mundo-jjersey/web`

Expected: `apps/web/package.json` and root `package-lock.json` update.

- [ ] **Step 2: Create frontend Sanity types**

Create `apps/web/src/lib/sanity/types.ts`:

```ts
export interface SanityImageAssetRef {
  _ref: string;
  _type: 'reference';
}

export interface SanityImage {
  _type: 'image';
  asset?: SanityImageAssetRef;
  alt?: string;
}

export interface TeamSummary {
  name?: string;
  slug?: string;
  country?: string;
  badge?: SanityImage;
}

export interface LeagueSummary {
  name?: string;
  slug?: string;
  country?: string;
  logo?: SanityImage;
}

export interface ProductSummary {
  _id: string;
  title: string;
  slug: string;
  price: number;
  stock: number;
  season?: string;
  sizes?: string[];
  image?: SanityImage;
  team?: TeamSummary;
  league?: LeagueSummary;
}

export interface ProductDetail extends ProductSummary {
  description?: string;
  images?: SanityImage[];
}

export interface SiteSettings {
  title?: string;
  description?: string;
  whatsappNumber?: string;
  whatsappMessage?: string;
  instagramUrl?: string;
}
```

- [ ] **Step 3: Create Sanity client**

Create `apps/web/src/lib/sanity/client.ts`:

```ts
import { createClient } from '@sanity/client';

const projectId = import.meta.env.SANITY_PROJECT_ID;
const dataset = import.meta.env.SANITY_DATASET || 'production';
const apiVersion = import.meta.env.SANITY_API_VERSION || '2025-01-01';
const useCdn = import.meta.env.SANITY_USE_CDN !== 'false';

export const hasSanityConfig = Boolean(projectId && dataset);

export const sanityClient = createClient({
  projectId: projectId || 'missing-project-id',
  dataset,
  apiVersion,
  useCdn
});
```

- [ ] **Step 4: Create GROQ queries**

Create `apps/web/src/lib/sanity/queries.ts`:

```ts
export const productsQuery = `*[_type == "product"] | order(isFeatured desc, _createdAt desc) {
  _id,
  title,
  "slug": slug.current,
  price,
  stock,
  season,
  sizes,
  "image": images[0],
  team->{name, "slug": slug.current, country, badge},
  league->{name, "slug": slug.current, country, logo}
}`;

export const productSlugsQuery = `*[_type == "product" && defined(slug.current)] {
  "slug": slug.current
}`;

export const productBySlugQuery = `*[_type == "product" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  price,
  stock,
  season,
  sizes,
  description,
  images,
  "image": images[0],
  team->{name, "slug": slug.current, country, badge},
  league->{name, "slug": slug.current, country, logo}
}`;

export const siteSettingsQuery = `*[_type == "siteSettings"][0] {
  title,
  description,
  whatsappNumber,
  whatsappMessage,
  instagramUrl
}`;
```

- [ ] **Step 5: Create image URL helper**

Create `apps/web/src/lib/sanity/image.ts`:

```ts
import imageUrlBuilder from '@sanity/image-url';
import { sanityClient } from './client';
import type { SanityImage } from './types';

const builder = imageUrlBuilder(sanityClient);

export function getImageUrl(image: SanityImage | undefined, width = 800): string {
  if (!image?.asset?._ref) {
    return '';
  }

  return builder.image(image).width(width).auto('format').fit('max').url();
}
```

- [ ] **Step 6: Verify TypeScript and build still pass**

Run: `npm run check && npm run build:web`

Expected: `astro check` reports 0 errors and `astro build` succeeds.

## Task 3: Build Catalog Cards And Listing Page

**Files:**
- Create: `apps/web/src/components/ProductCard.astro`
- Create: `apps/web/src/pages/catalogo.astro`
- Modify: `apps/web/src/styles/global.css`

- [ ] **Step 1: Create ProductCard component**

Create `apps/web/src/components/ProductCard.astro`:

```astro
---
import { getImageUrl } from '../lib/sanity/image';
import type { ProductSummary } from '../lib/sanity/types';

interface Props {
  product: ProductSummary;
}

const { product } = Astro.props;
const imageUrl = getImageUrl(product.image, 640);
const isAvailable = product.stock > 0;
const price = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0
}).format(product.price);
---

<article class="product-card">
  <a class="product-card__media" href={`/catalogo/${product.slug}`} aria-label={`Ver ${product.title}`}>
    {imageUrl ? <img src={imageUrl} alt={product.image?.alt || product.title} loading="lazy" /> : <span>Sin imagen</span>}
  </a>
  <div class="product-card__body">
    <p class="product-card__meta">{product.team?.name || 'Equipo'}{product.season ? ` · ${product.season}` : ''}</p>
    <h2><a href={`/catalogo/${product.slug}`}>{product.title}</a></h2>
    <p class="product-card__price">{price}</p>
    <p class={isAvailable ? 'product-card__stock' : 'product-card__stock product-card__stock--empty'}>
      {isAvailable ? `${product.stock} disponible${product.stock === 1 ? '' : 's'}` : 'Sin stock'}
    </p>
  </div>
</article>
```

- [ ] **Step 2: Create catalog page with safe empty state**

Create `apps/web/src/pages/catalogo.astro`:

```astro
---
import ProductCard from '../components/ProductCard.astro';
import BaseLayout from '../layouts/BaseLayout.astro';
import { hasSanityConfig, sanityClient } from '../lib/sanity/client';
import { productsQuery } from '../lib/sanity/queries';
import type { ProductSummary } from '../lib/sanity/types';

const products = hasSanityConfig
  ? await sanityClient.fetch<ProductSummary[]>(productsQuery)
  : [];
---

<BaseLayout
  title="Catálogo | Mundo JJersey"
  description="Explorá camisetas de fútbol retro y actuales disponibles para consultar por WhatsApp."
>
  <main class="site-shell catalog-page">
    <section class="catalog-hero" aria-labelledby="catalog-title">
      <p class="eyebrow">Catálogo</p>
      <h1 id="catalog-title">Camisetas disponibles</h1>
      <p>Elegí una camiseta y consultanos directo por WhatsApp.</p>
    </section>

    {products.length > 0 ? (
      <section class="product-grid" aria-label="Productos">
        {products.map((product) => <ProductCard product={product} />)}
      </section>
    ) : (
      <section class="empty-state" aria-live="polite">
        <h2>El catálogo todavía no tiene productos cargados.</h2>
        <p>Cuando agregues camisetas desde Sanity Studio, van a aparecer acá automáticamente después del deploy.</p>
      </section>
    )}
  </main>
</BaseLayout>
```

- [ ] **Step 3: Add minimal catalog styles**

Append to `apps/web/src/styles/global.css`:

```css
.catalog-page {
  gap: 3rem;
}

.catalog-hero {
  max-width: 760px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.25rem;
}

.product-card {
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 1.25rem;
  background: rgba(255, 255, 255, 0.06);
}

.product-card__media {
  display: grid;
  min-height: 260px;
  place-items: center;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.72);
}

.product-card__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-card__body {
  display: grid;
  gap: 0.6rem;
  padding: 1rem;
}

.product-card__body h2 {
  margin: 0;
  font-size: 1.1rem;
}

.product-card__body a {
  color: inherit;
  text-decoration: none;
}

.product-card__meta,
.product-card__stock {
  margin: 0;
  color: rgba(255, 255, 255, 0.68);
  font-size: 0.9rem;
}

.product-card__stock--empty {
  color: #f8b4b4;
}

.product-card__price {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 700;
}

.empty-state {
  max-width: 680px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 1.25rem;
  background: rgba(255, 255, 255, 0.06);
}
```

- [ ] **Step 4: Verify catalog page builds without Sanity env vars**

Run: `npm run check && npm run build:web`

Expected: `/catalogo/index.html` is generated and build succeeds even when `SANITY_PROJECT_ID` is missing.

## Task 4: Build Product Detail Pages And WhatsApp CTA

**Files:**
- Create: `apps/web/src/components/WhatsAppButton.astro`
- Create: `apps/web/src/pages/catalogo/[slug].astro`
- Modify: `apps/web/src/styles/global.css`

- [ ] **Step 1: Create WhatsApp button component**

Create `apps/web/src/components/WhatsAppButton.astro`:

```astro
---
interface Props {
  href: string;
  available: boolean;
}

const { href, available } = Astro.props;
---

{href ? (
  <a class="button" href={href} target="_blank" rel="noreferrer">
    {available ? 'Consultar por WhatsApp' : 'Consultar reposición'}
  </a>
) : (
  <p class="contact-unavailable">WhatsApp no está configurado todavía.</p>
)}
```

- [ ] **Step 2: Create static product detail page**

Create `apps/web/src/pages/catalogo/[slug].astro`:

```astro
---
import ProductCard from '../../components/ProductCard.astro';
import WhatsAppButton from '../../components/WhatsAppButton.astro';
import BaseLayout from '../../layouts/BaseLayout.astro';
import { buildWhatsAppUrl } from '../../lib/whatsapp';
import { getImageUrl } from '../../lib/sanity/image';
import { hasSanityConfig, sanityClient } from '../../lib/sanity/client';
import { productBySlugQuery, productSlugsQuery, productsQuery, siteSettingsQuery } from '../../lib/sanity/queries';
import type { ProductDetail, ProductSummary, SiteSettings } from '../../lib/sanity/types';

export async function getStaticPaths() {
  if (!hasSanityConfig) {
    return [];
  }

  const slugs = await sanityClient.fetch<{ slug: string }[]>(productSlugsQuery);

  return slugs
    .filter((item) => item.slug)
    .map((item) => ({ params: { slug: item.slug } }));
}

const { slug } = Astro.params;
const product = await sanityClient.fetch<ProductDetail>(productBySlugQuery, { slug });
const settings = await sanityClient.fetch<SiteSettings | null>(siteSettingsQuery);
const relatedProducts = await sanityClient.fetch<ProductSummary[]>(productsQuery);

if (!product) {
  return Astro.redirect('/catalogo');
}

const imageUrl = getImageUrl(product.image, 960);
const price = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0
}).format(product.price);
const available = product.stock > 0;
const siteUrl = import.meta.env.PUBLIC_SITE_URL?.replace(/\/$/, '');
const productUrl = product && siteUrl ? `${siteUrl}/catalogo/${product.slug}` : undefined;
const whatsappNumber = settings?.whatsappNumber || import.meta.env.PUBLIC_WHATSAPP_NUMBER || '';
const whatsappUrl = buildWhatsAppUrl({
  phoneNumber: whatsappNumber,
  productTitle: product.title,
  productUrl
});
const visibleRelatedProducts = relatedProducts
  .filter((relatedProduct) => relatedProduct.slug !== product.slug)
  .slice(0, 3);
---

<BaseLayout
  title={`${product.title} | Mundo JJersey`}
  description={`Consultá por ${product.title} en Mundo JJersey.`}
>
  <main class="site-shell product-page">
    <nav class="breadcrumbs" aria-label="Migas de pan">
      <a href="/">Inicio</a>
      <span>/</span>
      <a href="/catalogo">Catálogo</a>
      <span>/</span>
      <span>{product.title}</span>
    </nav>

    <section class="product-detail">
      <div class="product-detail__media">
        {imageUrl ? <img src={imageUrl} alt={product.image?.alt || product.title} /> : <span>Sin imagen</span>}
      </div>
      <div class="product-detail__content">
        <p class="eyebrow">{product.team?.name || 'Camiseta'}</p>
        <h1>{product.title}</h1>
        <p class="product-detail__price">{price}</p>
        {product.season && <p>Temporada: {product.season}</p>}
        {product.sizes?.length ? <p>Talles: {product.sizes.join(', ')}</p> : null}
        <p>{available ? `${product.stock} disponible${product.stock === 1 ? '' : 's'}` : 'Sin stock'}</p>
        {product.description && <p>{product.description}</p>}
        <WhatsAppButton href={whatsappUrl} available={available} />
      </div>
    </section>

    {visibleRelatedProducts.length > 0 && (
      <section class="related-products" aria-labelledby="related-title">
        <h2 id="related-title">También te puede interesar</h2>
        <div class="product-grid">
          {visibleRelatedProducts.map((relatedProduct) => <ProductCard product={relatedProduct} />)}
        </div>
      </section>
    )}
  </main>
</BaseLayout>
```

- [ ] **Step 3: Add product detail styles**

Append to `apps/web/src/styles/global.css`:

```css
.breadcrumbs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

.breadcrumbs a {
  color: inherit;
}

.product-page {
  gap: 2rem;
}

.product-detail {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 0.8fr);
  gap: 2rem;
  align-items: start;
}

.product-detail__media {
  display: grid;
  min-height: 420px;
  place-items: center;
  overflow: hidden;
  border-radius: 1.5rem;
  background: rgba(255, 255, 255, 0.08);
}

.product-detail__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-detail__content {
  display: grid;
  gap: 1rem;
}

.product-detail__price {
  margin: 0;
  font-size: clamp(1.8rem, 5vw, 3rem);
  font-weight: 800;
}

.contact-unavailable {
  color: #f8b4b4;
}

.related-products {
  display: grid;
  gap: 1rem;
}

@media (max-width: 760px) {
  .product-detail {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 4: Verify detail pages build with no Sanity env vars**

Run: `npm run check && npm run build:web`

Expected: build succeeds; no dynamic product pages are generated without Sanity config, and `/catalogo` still builds.

## Task 5: Improve Base Metadata And Env Documentation

**Files:**
- Modify: `apps/web/src/layouts/BaseLayout.astro`
- Modify: `.env.example`
- Modify: `README.md`

- [ ] **Step 1: Add canonical support to BaseLayout**

Modify `apps/web/src/layouts/BaseLayout.astro` frontmatter and head:

```astro
---
import '../styles/global.css';

interface Props {
  title?: string;
  description?: string;
  canonicalPath?: string;
}

const {
  title = 'Mundo JJersey',
  description = 'Catálogo de camisetas de fútbol retro y actuales.',
  canonicalPath = Astro.url.pathname
} = Astro.props;

const siteUrl = import.meta.env.PUBLIC_SITE_URL || Astro.url.origin;
const canonicalUrl = new URL(canonicalPath, siteUrl).toString();
---

<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="description" content={description} />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="canonical" href={canonicalUrl} />
    <title>{title}</title>
  </head>
  <body>
    <slot />
  </body>
</html>
```

- [ ] **Step 2: Clarify environment variables**

Modify `.env.example` to keep these keys:

```dotenv
SANITY_PROJECT_ID=
SANITY_DATASET=production
SANITY_API_VERSION=2025-01-01
SANITY_USE_CDN=true
SANITY_READ_TOKEN=
PUBLIC_SITE_URL=http://localhost:4321
PUBLIC_WHATSAPP_NUMBER=
PUBLIC_GA_MEASUREMENT_ID=
SANITY_STUDIO_PROJECT_ID=
SANITY_STUDIO_DATASET=production
```

Do not add any public token variable.

- [ ] **Step 3: Update README scripts and phase notes**

Modify the README scripts block to include:

```bash
npm install
npm test
npm run dev:web
npm run dev:studio
npm run build:web
npm run build:studio
npm run check
```

Add this short note under Variables:

```md
La web lee datos públicos de Sanity durante el build. No exponer tokens privados con prefijo `PUBLIC_`.
```

- [ ] **Step 4: Verify metadata changes**

Run: `npm run check && npm run build:web`

Expected: check and build pass.

## Task 6: Final Verification And Commit

**Files:**
- All files modified in Tasks 1-5.

- [ ] **Step 1: Run full verification**

Run:

```bash
npm test && npm run check && npm run build:web && npm run build:studio
```

Expected:
- `Sanity schemas validated.`
- `WhatsApp helpers validated.`
- Astro check reports 0 errors.
- Web build succeeds.
- Studio build succeeds.

- [ ] **Step 2: Inspect git status**

Run: `git status --short --branch`

Expected: modified and new files only from this plan.

- [ ] **Step 3: Commit only after user approval**

If the user explicitly asks for a commit, run:

```bash
git add .env.example README.md package.json apps/web/package.json apps/web/scripts/test-whatsapp.mjs apps/web/src/lib/whatsapp.ts apps/web/src/lib/sanity/client.ts apps/web/src/lib/sanity/queries.ts apps/web/src/lib/sanity/types.ts apps/web/src/lib/sanity/image.ts apps/web/src/components/ProductCard.astro apps/web/src/components/WhatsAppButton.astro apps/web/src/pages/catalogo.astro apps/web/src/pages/catalogo/[slug].astro apps/web/src/layouts/BaseLayout.astro apps/web/src/styles/global.css package-lock.json
git commit -m "Add public catalog pages"
```

Do not push unless the user explicitly asks.

---

## Self-Review

- Spec coverage: the plan covers Sanity client, queries, types, image URLs, catalog page, product detail page, WhatsApp CTA, safety fallbacks, SEO metadata, tests, and full verification.
- Placeholder scan: no TBD/TODO placeholders remain; every task includes exact paths and code.
- Type consistency: `ProductSummary`, `ProductDetail`, `SiteSettings`, `buildWhatsAppUrl`, `getImageUrl`, query names, and component props are consistent across tasks.
