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
  readProjectFile('apps/web/src/components/FAQBlock.astro'),
  readProjectFile('apps/web/src/pages/index.astro'),
  readProjectFile('apps/web/src/pages/catalogo.astro'),
  readProjectFile('apps/web/src/pages/producto/[slug].astro'),
  readProjectFile('apps/web/src/pages/catalogo/[category].astro'),
  readProjectFile('apps/web/src/pages/catalogo/[category]/[collection].astro')
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
assert.match(css, /hero__poster/);
assert.doesNotMatch(css, /buying-flow/);
assert.match(css, /category-grid--drop/);
assert.match(css, /category-tile--image/);
assert.match(css, /final-cta/);
assert.match(css, /product-card__ticket/);
assert.match(css, /product-detail__sheet/);

const skipLinkRule = css.match(/\.skip-link\s*{(?<body>[^}]*)}/)?.groups?.body ?? '';
const siteHeaderRule = css.match(/\.site-header\s*{(?<body>[^}]*)}/)?.groups?.body ?? '';
assert.match(skipLinkRule, /z-index:\s*4\d/);
assert.match(siteHeaderRule, /z-index:\s*20/);

const summaryFocusRule = css.match(/\.site-header__menu summary:focus-visible,\s*\.faq-block__item summary:focus-visible,\s*\.site-footer__mobile-navigation summary:focus-visible\s*{(?<body>[^}]*)}/)?.groups?.body ?? '';
assert.match(summaryFocusRule, /outline:\s*3px solid var\(--color-gold-soft\)/);

const mobileMenuSummaryRule = css.match(/\.site-header__menu summary\s*{(?<body>[^}]*)}/)?.groups?.body ?? '';
assert.match(mobileMenuSummaryRule, /min-height:\s*44px/);

const reducedMotionRule = css.match(/@media \(prefers-reduced-motion: reduce\)\s*{(?<body>[\s\S]*)}\s*$/)?.groups?.body ?? '';
assert.match(reducedMotionRule, /transition-property:\s*none/);

assert.match(baseLayout, /import SiteHeader/);
assert.match(baseLayout, /import SiteFooter/);
assert.match(baseLayout, /getSiteContact/);
assert.match(baseLayout, /<SiteHeader whatsappUrl=\{siteContact\.whatsappUrl\} \/>/);
assert.match(baseLayout, /<SiteFooter whatsappUrl=\{siteContact\.whatsappUrl\} instagramUrl=\{siteContact\.instagramUrl\} \/>/);

assert.match(siteHeader, /href="\/"/);
assert.match(siteHeader, /Mundo JJersey/);
assert.match(siteHeader, /href="\/catalogo"/);
assert.match(siteHeader, /href: '#contacto'/);
assert.match(siteHeader, /Ver cat[aá]logo/);

assert.match(siteFooter, /id="contacto"/);
assert.match(siteFooter, /WhatsApp/);
assert.match(siteFooter, /Conjuntos/);
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
assert.match(categoryTile, /imageSrc\?: string/);
assert.match(categoryTile, /category-tile--image/);
assert.match(categoryTile, /<a class=\{className\}/);

assert.match(productCard, /product-card__badge/);
assert.match(productCard, /product-card__ticket/);
assert.match(productCard, /Disponible/);
assert.match(productCard, /Sin stock/);
assert.doesNotMatch(productCard, /Nuevo ingreso/);

assert.match(whatsappButton, /rel="noreferrer"/);
assert.match(whatsappButton, /aria-label/);

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
assert.match(home, /import FAQBlock/);
assert.match(home, /hasSanityConfig/);
assert.match(home, /productsQuery/);
assert.match(home, /slice\(0, 4\)/);
assert.match(home, /drop-scene/);
assert.match(home, /hero__poster/);
assert.match(home, /Fútbol para vestir todos los días/);
assert.doesNotMatch(home, /drop-marquee/);
assert.doesNotMatch(home, /buying-flow/);
assert.match(home, /Recién colgadas/);
assert.match(home, /editorialCategories/);
assert.match(home, /Clubes/);
assert.match(home, /Selecciones/);
assert.match(home, /Retro/);
assert.match(home, /Camperas/);
assert.match(home, /Entrá por cultura/);
assert.match(home, /final-cta/);
assert.match(home, /contactHref/);
assert.match(home, /catalogCategories/);
assert.match(home, /category-grid--drop/);
assert.doesNotMatch(home, /label=\{`0\$\{index \+ 1\}`\}/);
assert.doesNotMatch(home, /Foto de los dueños de Mundo JJersey pendiente/);
assert.doesNotMatch(home, /role="img"/);
assert.match(home, /import aboutImage from '\.\.\/\.\.\/fotos\/nosotros\.JPEG'/);
assert.match(home, /<Image\s+src=\{aboutImage\}\s+alt="Los amigos detrás de Mundo JJersey cuando eran chicos\."\s+loading="lazy"\s+decoding="async"\s*\/>/);
assert.match(home, /líneas Premium/);
assert.doesNotMatch(home, /about-section__portrait/);
assert.doesNotMatch(home, /<span>Mundo JJersey<\/span>/);
assert.doesNotMatch(home, /trust-block|about-section__trust/);

const aboutCopy = home.match(/<div class="about-section__copy">(?<content>[\s\S]*?)<\/div>/)?.groups?.content ?? '';
assert.equal((aboutCopy.match(/<p>/g) ?? []).length, 3, 'About copy must have exactly three paragraphs.');
assert.match(aboutCopy, /Somos Mundo JJersey, amigos de toda la vida\. Creamos este proyecto para compartir nuestra selección de camisetas actuales y retro de colección\./);
assert.match(aboutCopy, /Sabemos lo difícil que es encontrar esa camiseta que buscás\. Tenemos algunos modelos en stock y también traemos camisetas a pedido\./);
assert.match(aboutCopy, /Trabajamos con líneas Premium y revisamos cada camiseta antes de sumarla al catálogo\./);
assert.match(css, /\.about-section__media\s*{(?<body>[^}]*)aspect-ratio:\s*4\s*\/\s*3/);
assert.match(css, /\.about-section__media img\s*{(?<body>[^}]*)object-fit:\s*contain/);
assert.doesNotMatch(css, /about-section__portrait/);

const mobileGarmentRoutes = css.match(/@media \(max-width: 780px\)\s*{(?<body>[\s\S]*?)\n}\n\n@media \(max-width: 359px\)/)?.groups?.body ?? '';
const mobileGarmentRoutesRule = mobileGarmentRoutes.match(/\.garment-routes\s*{(?<body>[^}]*)}/)?.groups?.body ?? '';
const mobileGarmentRoutesRow = mobileGarmentRoutes.match(/\.garment-routes div\s*{(?<body>[^}]*)}/)?.groups?.body ?? '';
const garmentRoutesFocusRule = css.match(/\.garment-routes a:focus-visible\s*{(?<body>[^}]*)}/)?.groups?.body ?? '';
assert.match(mobileGarmentRoutesRule, /border:\s*0/);
assert.match(mobileGarmentRoutesRule, /border-block:\s*1px solid/);
assert.doesNotMatch(mobileGarmentRoutesRule, /border-(?:left|right):/);
assert.match(mobileGarmentRoutesRule, /min-width:\s*0/);
assert.match(mobileGarmentRoutesRule, /max-width:\s*100%/);
assert.match(mobileGarmentRoutesRow, /flex-wrap:\s*nowrap/);
assert.match(mobileGarmentRoutesRow, /min-width:\s*0/);
assert.match(mobileGarmentRoutesRow, /max-width:\s*100%/);
assert.match(mobileGarmentRoutesRow, /overflow-x:\s*auto/);
assert.match(mobileGarmentRoutes, /\.garment-routes a\s*{(?<body>[^}]*)min-height:\s*44px/);
assert.match(mobileGarmentRoutes, /\.garment-routes a\s*{(?<body>[^}]*)white-space:\s*nowrap/);
assert.match(mobileGarmentRoutes, /\.garment-routes a\s*{(?<body>[^}]*)flex:\s*0 0 auto/);
assert.match(garmentRoutesFocusRule, /box-shadow:\s*[\s\S]*?inset\s+0\s+0\s+0\s+2px\s+var\(--color-gold-soft\)/);
assert.match(garmentRoutesFocusRule, /inset\s+0\s+0\s+0\s+4px\s+var\(--color-ink\)/);

const categoryCatalog = pages[3];
const collectionCatalog = pages[4];
assert.match(catalog, /CatalogCategoryNavigation/);
assert.match(catalog, /activeSlug="catalogo"/);
assert.doesNotMatch(catalog, /<ul class="catalog-chips"/);
assert.match(catalog, /catalog-hero--compact/);
assert.doesNotMatch(catalog, /catalog-hero__actions/);
assert.doesNotMatch(catalog, /catalog-hero__facts/);
assert.doesNotMatch(catalog, /hero__stamp/);
assert.match(catalog, /Escribir por WhatsApp/);
assert.match(categoryCatalog, /catalog-hero--compact/);
assert.match(collectionCatalog, /catalog-hero--compact/);

for (const filteredCatalog of [categoryCatalog, collectionCatalog]) {
  assert.doesNotMatch(filteredCatalog, /catalog-hero__actions/);
  assert.doesNotMatch(filteredCatalog, /catalog-hero__facts/);
  assert.match(filteredCatalog, /Escribir por WhatsApp/);
}

assert.match(productDetail, /Te respondemos por disponibilidad, talle y env[ií]o\./);
assert.match(productDetail, /localhost|127\.0\.0\.1/);
assert.match(productDetail, /product-detail__sizes/);
assert.match(productDetail, /product-detail__sheet/);
assert.doesNotMatch(productDetail, /product-detail__confirm/);
assert.doesNotMatch(css, /product-detail__confirm/);

const productCardHover = css.match(/\.product-card:hover\s*{(?<body>[^}]*)}/)?.groups?.body ?? '';
assert.match(productCardHover, /transform:/);
assert.doesNotMatch(productCardHover, /background|border-color|color\s*:|box-shadow/);

const catalogChipRule = css.match(/\.catalog-chips (?:span|li)\s*{(?<body>[^}]*)}/)?.groups?.body ?? '';
assert.doesNotMatch(catalogChipRule, /cursor:\s*pointer|transition:|transform:/);

const productCardRule = css.match(/\.product-card\s*{(?<body>[^}]*)}/)?.groups?.body ?? '';
assert.doesNotMatch(productCardRule, /background-color 180ms|border-color 180ms|color 180ms|box-shadow 180ms/);

console.log('Design contract validated.');
