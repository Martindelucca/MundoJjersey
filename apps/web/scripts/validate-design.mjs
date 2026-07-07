import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const rootDir = resolve(import.meta.dirname, '../../..');

async function readProjectFile(path) {
  return readFile(resolve(rootDir, path), 'utf8');
}

const [
  product,
  design,
  css,
  baseLayout,
  siteHeader,
  siteFooter,
  sectionHeader,
  categoryTile,
  productCard,
  whatsappButton,
  trustBlock,
  faqBlock,
  ...pages
] = await Promise.all([
  readProjectFile('PRODUCT.md'),
  readProjectFile('DESIGN.md'),
  readProjectFile('apps/web/src/styles/global.css'),
  readProjectFile('apps/web/src/layouts/BaseLayout.astro'),
  readProjectFile('apps/web/src/components/SiteHeader.astro'),
  readProjectFile('apps/web/src/components/SiteFooter.astro'),
  readProjectFile('apps/web/src/components/SectionHeader.astro'),
  readProjectFile('apps/web/src/components/CategoryTile.astro'),
  readProjectFile('apps/web/src/components/ProductCard.astro'),
  readProjectFile('apps/web/src/components/WhatsAppButton.astro'),
  readProjectFile('apps/web/src/components/TrustBlock.astro'),
  readProjectFile('apps/web/src/components/FAQBlock.astro'),
  readProjectFile('apps/web/src/pages/index.astro'),
  readProjectFile('apps/web/src/pages/catalogo.astro'),
  readProjectFile('apps/web/src/pages/producto/[slug].astro'),
  readProjectFile('apps/web/src/pages/catalogo/[category].astro')
]);

assert.match(product, /## Register/);
assert.match(product, /brand/);

assert.match(design, /# Design/);
assert.match(design, /#0B1F3A/);
assert.match(design, /#C9A24A/);
assert.match(design, /WCAG AA/);

const forbiddenPublicTerms = [
  'checkout',
  'carrito',
  'Añadir al carrito',
  'pago online',
  'pagos online',
  'comprar online',
  'comprar ahora',
  'deploy',
  'Catálogo administrable'
];
const publicPageContent = pages.join('\n').toLocaleLowerCase('es-AR');

for (const term of forbiddenPublicTerms) {
  assert.equal(
    publicPageContent.includes(term.toLocaleLowerCase('es-AR')),
    false,
    `Public pages must not contain forbidden term: ${term}`
  );
}

assert.match(css, /--color-navy/);
assert.match(css, /--color-gold/);
assert.match(css, /prefers-reduced-motion/);
assert.match(css, /:focus-visible/);
assert.match(css, /--font-display/);
assert.match(css, /body::before/);
assert.match(css, /position:\s*fixed/);
assert.match(css, /drop-marquee/);
assert.match(css, /category-grid--drop/);
assert.match(css, /product-card__ticket/);
assert.match(css, /product-detail__sheet/);

const reducedMotionRule = css.match(/@media \(prefers-reduced-motion: reduce\)\s*{(?<body>[\s\S]*)}\s*$/)?.groups?.body ?? '';
assert.match(reducedMotionRule, /transition-property:\s*none/);

assert.match(baseLayout, /import SiteHeader/);
assert.match(baseLayout, /import SiteFooter/);
assert.match(baseLayout, /<SiteHeader\s*\/>/);
assert.match(baseLayout, /<SiteFooter\s*\/>/);

assert.match(siteHeader, /href="\/"/);
assert.match(siteHeader, /Mundo JJersey/);
assert.match(siteHeader, /href: '\/catalogo'/);
assert.match(siteHeader, /href: '#contacto'/);
assert.match(siteHeader, /Ver cat[aá]logo/);

assert.match(siteFooter, /id="contacto"/);
assert.match(siteFooter, /WhatsApp/);
assert.doesNotMatch(siteFooter.toLocaleLowerCase('es-AR'), /checkout|carrito/);

assert.match(sectionHeader, /interface Props/);
assert.match(sectionHeader, /label\?: string/);
assert.match(sectionHeader, /title: string/);
assert.match(sectionHeader, /copy\?: string/);
assert.match(sectionHeader, /variant\?: 'default' \| 'light' \| 'compact'/);
assert.match(sectionHeader, /<header/);

assert.match(categoryTile, /interface Props/);
assert.match(categoryTile, /title: string/);
assert.match(categoryTile, /copy: string/);
assert.match(categoryTile, /href: string/);
assert.match(categoryTile, /label\?: string/);
assert.match(categoryTile, /className = \['category-tile'/);
assert.match(categoryTile, /<a class=\{className\}/);

assert.match(productCard, /product-card__badge/);
assert.match(productCard, /product-card__ticket/);
assert.match(productCard, /Disponible/);
assert.match(productCard, /Sin stock/);
assert.doesNotMatch(productCard, /Nuevo ingreso/);

assert.match(whatsappButton, /rel="noreferrer"/);
assert.match(whatsappButton, /aria-label/);

assert.match(trustBlock, /interface Props/);
assert.match(trustBlock, /title: string/);
assert.match(trustBlock, /copy: string/);
assert.match(trustBlock, /class="trust-block"/);

assert.match(faqBlock, /consulta/i);
assert.match(faqBlock, /nuev[oa]s/i);
assert.match(faqBlock, /talles/i);
assert.match(faqBlock, /env[ií]os/i);
assert.match(faqBlock, /pago/i);

const home = pages[0];
const catalog = pages[1];
const productDetail = pages[2];
assert.match(home, /import ProductCard/);
assert.match(home, /import CategoryTile/);
assert.match(home, /import TrustBlock/);
assert.match(home, /import FAQBlock/);
assert.match(home, /hasSanityConfig/);
assert.match(home, /productsQuery/);
assert.match(home, /slice\(0, 4\)/);
assert.match(home, /drop-scene/);
assert.match(home, /hero__spec-sheet/);
assert.match(home, /drop-marquee/);
assert.match(home, /Nuevos ingresos/);
assert.match(home, /Entrá por categoría/);
assert.match(home, /catalogCategories/);
assert.match(home, /category-grid--drop/);
assert.doesNotMatch(home, /label=\{`0\$\{index \+ 1\}`\}/);

assert.match(catalog, /<ul class="catalog-chips"/);
assert.doesNotMatch(catalog, /<nav class="catalog-chips"/);
assert.match(catalog, /catalogCategories/);
assert.match(catalog, /catalog-hero__facts/);

assert.match(productDetail, /Te respondemos por disponibilidad, talle y env[ií]o\./);
assert.match(productDetail, /localhost|127\.0\.0\.1/);
assert.match(productDetail, /product-detail__sizes/);
assert.match(productDetail, /product-detail__sheet/);

const productCardHover = css.match(/\.product-card:hover\s*{(?<body>[^}]*)}/)?.groups?.body ?? '';
assert.match(productCardHover, /transform:/);
assert.doesNotMatch(productCardHover, /background|border-color|color\s*:|box-shadow/);

const catalogChipRule = css.match(/\.catalog-chips (?:span|li)\s*{(?<body>[^}]*)}/)?.groups?.body ?? '';
assert.doesNotMatch(catalogChipRule, /cursor:\s*pointer|transition:|transform:/);

const productCardRule = css.match(/\.product-card\s*{(?<body>[^}]*)}/)?.groups?.body ?? '';
assert.doesNotMatch(productCardRule, /background-color 180ms|border-color 180ms|color 180ms|box-shadow 180ms/);

console.log('Design contract validated.');
