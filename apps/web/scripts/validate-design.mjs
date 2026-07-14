import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const rootDir = resolve(import.meta.dirname, '../../..');

function parseHexColor(value) {
  const match = value.match(/^#([\da-f]{6})$/i);
  assert.ok(match, `Expected a six-digit hex color, received ${value}.`);
  const hex = match[1];
  return [0, 2, 4].map((index) => Number.parseInt(hex.slice(index, index + 2), 16));
}

function mixSrgb(first, second, secondWeight) {
  return first.map((channel, index) => channel * (1 - secondWeight) + second[index] * secondWeight);
}

function relativeLuminance(rgb) {
  const channels = rgb.map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.04045
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrastRatio(foreground, background) {
  const [lighter, darker] = [relativeLuminance(foreground), relativeLuminance(background)].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
}

function assertContrast(name, foreground, background, minimum) {
  const ratio = contrastRatio(foreground, background);
  assert.ok(ratio >= minimum, `${name} contrast ${ratio.toFixed(2)}:1 must meet ${minimum}:1.`);
}

function parseSrgbTokenMix(value, name) {
  const match = value.match(
    /^color-mix\(in srgb,\s*var\(--(?<first>color-[\w-]+)\),\s*var\(--(?<second>color-[\w-]+)\)\s+(?<secondWeight>\d+(?:\.\d+)?)%\)$/
  );
  assert.ok(match?.groups, `${name} must be an sRGB mix of two color tokens.`);
  return {
    first: match.groups.first,
    second: match.groups.second,
    secondWeight: Number(match.groups.secondWeight) / 100
  };
}

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
  productGallery,
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
  readProjectFile('apps/web/src/components/ProductGallery.astro'),
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
assert.doesNotMatch(css, /body::after/);
assert.doesNotMatch(css, /mix-blend-mode/);
assert.match(css, /hero__poster/);
assert.doesNotMatch(css, /buying-flow/);
assert.match(css, /category-grid--drop/);
assert.match(css, /category-tile--image/);
assert.match(css, /final-cta/);
assert.match(css, /product-card__identity/);
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

const rootRule = css.match(/:root\s*{(?<body>[^}]*)}/)?.groups?.body ?? '';
const requiredColorTokens = [
  'color-blue',
  'color-ink',
  'color-navy',
  'color-gold',
  'color-gold-soft',
  'color-cream',
  'color-white',
  'color-text-dark'
];
const tokenValues = Object.fromEntries(
  requiredColorTokens.map((token) => {
    const value = rootRule.match(new RegExp(`--${token}:\\s*(#[\\da-f]{6})\\s*;`, 'i'))?.[1];
    assert.ok(value, `:root must declare --${token} as a six-digit hex color.`);
    assert.ok(new RegExp(`var\\(--${token}\\)`).test(css), `--${token} must be used by the stylesheet.`);
    return [token, parseHexColor(value)];
  })
);
const mutedLightDeclaration = rootRule.match(/--color-muted-light:\s*(?<value>[^;]+);/)?.groups?.value ?? '';
const mutedLightMix = parseSrgbTokenMix(mutedLightDeclaration, '--color-muted-light');
assert.equal(mutedLightMix.first, 'color-ink');
assert.equal(mutedLightMix.second, 'color-blue');
assert.equal(mutedLightMix.secondWeight, 0.45);
const mutedLight = mixSrgb(
  tokenValues[mutedLightMix.first],
  tokenValues[mutedLightMix.second],
  mutedLightMix.secondWeight
);
assertContrast('White on navy', tokenValues['color-white'], tokenValues['color-navy'], 4.5);
assertContrast('Cream on ink', tokenValues['color-cream'], tokenValues['color-ink'], 4.5);
assertContrast('Gold on ink', tokenValues['color-gold'], tokenValues['color-ink'], 4.5);
assertContrast('Dark text on cream', tokenValues['color-text-dark'], tokenValues['color-cream'], 4.5);
assertContrast('Muted-light text on cream', mutedLight, tokenValues['color-cream'], 4.5);

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
assert.match(siteHeader, /querySelectorAll<HTMLDetailsElement>\('\.site-header__menu'\)/);
assert.match(siteHeader, /menu\.addEventListener\('click'/);
assert.match(siteHeader, /closest\('a'\)/);
assert.match(siteHeader, /if \(link && menu\.contains\(link\)\) \{\s*menu\.removeAttribute\('open'\)/);
assert.match(siteHeader, /document\.addEventListener\('keydown'/);
assert.match(siteHeader, /event\.key !== 'Escape'/);
assert.match(siteHeader, /querySelectorAll<HTMLDetailsElement>\('\.site-header__menu\[open\]'\)/);
assert.match(siteHeader, /openMenus\.forEach\(\(menu\) => menu\.removeAttribute\('open'\)\)/);
assert.match(siteHeader, /focusedMenu \?\? openMenus\[0\]\)\.querySelector\('summary'\)\?\.focus\(\)/);

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
assert.match(categoryTile, /imageSrc\?: ImageMetadata/);
assert.match(categoryTile, /category-tile--image/);
assert.match(categoryTile, /<a class=\{className\}/);

assert.match(productCard, /product-card__badge/);
assert.match(productCard, /product-card__identity/);
assert.match(productCard, /Disponible/);
assert.match(productCard, /Sin stock/);
assert.doesNotMatch(productCard, /product-card__ticket|product-card__season|Equipo a confirmar|Tanda actual/);
assert.doesNotMatch(productCard, /Nuevo ingreso/);
assert.match(productCard, /headingLevel\?: 'h2' \| 'h3'/);
assert.match(productCard, /headingLevel === 'h3'/);
const productHeadingRule = css.match(/\.product-card__body :is\(h2, h3\)\s*\{(?<body>[^}]*)}/)?.groups?.body ?? '';
assert.match(productHeadingRule, /font-size:\s*clamp\(1\.3rem, 2\.4vw, 1\.65rem\)/);
assert.match(productHeadingRule, /line-height:\s*1/);
assert.match(productHeadingRule, /text-wrap:\s*balance/);

assert.match(productGallery, /href=\{imageUrl\}/);
assert.match(productGallery, /aria-current=\{index === 0 \? 'true' : undefined\}/);
assert.doesNotMatch(productGallery, /aria-pressed|<noscript/);
assert.match(productGallery, /event\.preventDefault\(\)/);
assert.match(productGallery, /event\.key === ' '/);

assert.match(whatsappButton, /rel="noreferrer"/);
assert.match(whatsappButton, /aria-label/);
assert.match(whatsappButton, /available \? 'Consultar por WhatsApp' : 'Consultar disponibilidad'/);
assert.match(whatsappButton, /whatsapp-button__mark/);
assert.match(whatsappButton, /aria-hidden="true">↗/);
assert.match(whatsappButton, /\{href \? \(/);
assert.match(whatsappButton, /contact-unavailable/);
assert.doesNotMatch(whatsappButton, /whatsapp-button__hint/);

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
assert.match(home, /<ProductCard product=\{product\} headingLevel="h3" \/>/);
assert.match(home, /drop-scene/);
assert.match(home, /hero__poster/);
assert.match(home, /import heroImage from '\.\.\/\.\.\/fotos\/HERODESKTOP\.svg'/);
assert.equal((home.match(/HERODESKTOP\.svg/g) ?? []).length, 1, 'Home must import one hero asset source.');
assert.doesNotMatch(home, /HERO1/);
const heroMedia = home.match(/<div class="hero__poster" aria-hidden="true">(?<content>[\s\S]*?)<\/div>/)?.groups?.content ?? '';
assert.match(heroMedia, /<Image src=\{heroImage\} alt="" loading="eager" decoding="async" fetchpriority="high" \/>/);
assert.doesNotMatch(heroMedia, /<picture>|<source|HERO1/);
const desktopHeroRule = css.match(/\.hero\s*{(?<body>[^}]*)}/)?.groups?.body ?? '';
const desktopHeroPosterRule = css.match(/\.hero__poster\s*{(?<body>[^}]*)}/)?.groups?.body ?? '';
const desktopHeroOverlayRule = css.match(/\.hero__poster::after\s*{(?<body>[^}]*)}/)?.groups?.body ?? '';
const desktopHeroImageRule = css.match(/\.hero__poster img\s*{(?<body>[^}]*)}/)?.groups?.body ?? '';
assert.match(desktopHeroRule, /min-height:\s*100dvh/);
assert.match(desktopHeroPosterRule, /position:\s*absolute/);
assert.match(desktopHeroPosterRule, /inset:\s*0/);
assert.match(desktopHeroOverlayRule, /radial-gradient/);
assert.match(desktopHeroOverlayRule, /linear-gradient\(90deg/);
assert.match(desktopHeroImageRule, /object-fit:\s*cover/);
assert.match(desktopHeroImageRule, /object-position:\s*54% center/);
assert.match(css, /\.hero__poster img\s*{(?<body>[^}]*)display:\s*block/);
const mobileHeroStyles = css.match(/@media \(max-width: 780px\)\s*{(?<body>[\s\S]*?)\n}\n\n@media \(max-width: 359px\)/)?.groups?.body ?? '';
const mobileHeroRule = mobileHeroStyles.match(/\.hero\s*{(?<body>[^}]*)}/)?.groups?.body ?? '';
const mobileHeroPosterRule = mobileHeroStyles.match(/\.hero__poster\s*{(?<body>[^}]*)}/)?.groups?.body ?? '';
assert.match(mobileHeroRule, /min-height:\s*auto/);
assert.match(mobileHeroPosterRule, /position:\s*relative/);
assert.match(mobileHeroPosterRule, /aspect-ratio:\s*16\s*\/\s*9/);
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
const mobileProductCardBodyRule = mobileGarmentRoutes.match(/\.product-card__body\s*{(?<body>[^}]*)}/)?.groups?.body ?? '';
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
assert.match(mobileProductCardBodyRule, /padding:\s*0\.9rem 0\.7rem 0\.7rem/);
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

assert.match(productDetail, /const productMetadata =/);
assert.match(productDetail, /formatProductMetadata\(product\.brand, product\.team\?\.name, product\.season\)/);
assert.match(productDetail, /El mensaje incluye este producto\. Te respondemos por disponibilidad, talle y env[ií]o\./);
assert.match(productDetail, /parseSiteOrigin\(import\.meta\.env\.PUBLIC_SITE_URL\)/);
assert.match(productDetail, /product-detail__sizes/);
assert.match(productDetail, /product-detail__sheet/);
assert.match(productDetail, /<ProductGallery images=\{product\.images\} image=\{product\.image\} productTitle=\{product\.title\} \/>/);
assert.match(productDetail, /getRelatedProducts/);
assert.match(productDetail, /<ProductCard product=\{relatedProduct\} headingLevel="h3" \/>/);
assert.doesNotMatch(productDetail, /product-detail__confirm/);
assert.doesNotMatch(css, /product-detail__confirm/);
assert.doesNotMatch(productDetail, /product-detail__facts/);
assert.doesNotMatch(css, /product-detail__facts/);
assert.doesNotMatch(css, /whatsapp-button__hint/);
assert.ok(
  productDetail.indexOf('product-detail__sizes') < productDetail.indexOf('product-detail__cta')
    && productDetail.indexOf('product-detail__cta') < productDetail.indexOf('product-detail__description'),
  'Product CTA must follow sizes and precede the description.'
);
const whatsappButtonRule = css.match(/\.whatsapp-button\s*{(?<body>[^}]*)}/)?.groups?.body ?? '';
assert.match(whatsappButtonRule, /display:\s*flex/);
assert.match(whatsappButtonRule, /width:\s*100%/);
assert.match(whatsappButtonRule, /min-height:\s*56px/);
assert.match(whatsappButtonRule, /background:\s*var\(--color-gold\)/);
const whatsappLabelRule = css.match(/\.whatsapp-button__label\s*{(?<body>[^}]*)}/)?.groups?.body ?? '';
assert.match(whatsappLabelRule, /min-width:\s*0/);
assert.match(whatsappLabelRule, /white-space:\s*nowrap/);
assert.doesNotMatch(whatsappLabelRule, /text-overflow|overflow:\s*hidden/);
const narrowMobileStart = css.indexOf('@media (max-width: 359px)');
const narrowMobileEnd = css.indexOf('@media (prefers-reduced-motion: reduce)', narrowMobileStart);
const narrowMobileRule = css.slice(narrowMobileStart, narrowMobileEnd);
assert.match(narrowMobileRule, /\.whatsapp-button\s*{(?<body>[^}]*)padding-inline:\s*0\.65rem/);
assert.match(narrowMobileRule, /\.whatsapp-button__label\s*{(?<body>[^}]*)font-size:\s*0\.9rem/);
assert.match(css, /\.whatsapp-button__mark\s*{(?<body>[^}]*)border-radius:\s*999px/);
assert.match(css, /\.whatsapp-button:hover \.whatsapp-button__mark\s*{(?<body>[^}]*)transform:\s*translate/);
assert.match(reducedMotionRule, /\.whatsapp-button:hover \.whatsapp-button__mark,[\s\S]*?\.whatsapp-button:active \.whatsapp-button__mark,[\s\S]*?transform:\s*none !important/);
assert.match(reducedMotionRule, /\.button--with-mark:hover span:last-child,[\s\S]*?\.category-tile--image:hover \.category-tile__image,[\s\S]*?\.whatsapp-button:hover \.whatsapp-button__mark/);
assert.doesNotMatch(css, /\.product-detail__cta\s*{[^}]*position:\s*(?:sticky|fixed)/);
assert.doesNotMatch(css, /\.whatsapp-button\s*{[^}]*position:\s*(?:sticky|fixed)/);
assert.match(css, /\.product-gallery__main img\s*{(?<body>[^}]*)object-fit:\s*contain/);
const productGalleryThumbnailsRule = css.match(/\.product-gallery__thumbnails\s*{(?<body>[^}]*)}/)?.groups?.body ?? '';
assert.match(productGalleryThumbnailsRule, /max-height:\s*calc\(100dvh - 3rem\)/);
assert.match(productGalleryThumbnailsRule, /overflow-y:\s*auto/);
assert.match(css, /\.product-gallery__thumbnail\s*{(?<body>[^}]*)min-width:\s*44px/);
assert.match(css, /\.product-card__media img\s*{(?<body>[^}]*)object-fit:\s*cover/);

const productCardHover = css.match(/\.product-card:hover\s*{(?<body>[^}]*)}/)?.groups?.body ?? '';
assert.match(productCardHover, /transform:\s*translateY\(-2px\)/);
assert.doesNotMatch(productCardHover, /background|border-color|color\s*:|box-shadow/);

const catalogChipRule = css.match(/\.catalog-chips (?:span|li)\s*{(?<body>[^}]*)}/)?.groups?.body ?? '';
assert.doesNotMatch(catalogChipRule, /cursor:\s*pointer|transition:|transform:/);

const productCardRule = css.match(/\.product-card\s*{(?<body>[^}]*)}/)?.groups?.body ?? '';
assert.doesNotMatch(productCardRule, /background-color 180ms|border-color 180ms|color 180ms|box-shadow 180ms/);
assert.doesNotMatch(productCardRule, /box-shadow/);

const productDetailMediaRule = css.match(/\.product-detail__media\s*{(?<body>[^}]*)}/)?.groups?.body ?? '';
const productDetailContentRule = css.match(/\.product-detail__content\s*{(?<body>[^}]*)}/)?.groups?.body ?? '';
const headerCtaRule = css.match(/\.site-header__cta\s*{(?<body>[^}]*)}/)?.groups?.body ?? '';
assert.doesNotMatch(productDetailMediaRule, /box-shadow/);
assert.doesNotMatch(productDetailContentRule, /box-shadow/);
assert.doesNotMatch(headerCtaRule, /box-shadow/);
assert.doesNotMatch(css, /\.category-tile::before/);
assert.match(css, /\.product-card__badge/);
assert.match(css, /\.stock-label/);
assert.match(css, /\.final-cta\s*{(?<body>[\s\S]*?)background:\s*[\s\S]*?linear-gradient/);
assert.match(css, /\.category-tile--image:hover \.category-tile__image\s*{(?<body>[^}]*)transform:\s*scale\(1\.02\)/);
assert.doesNotMatch(css, /skewX\(/);

const globalTextureRule = css.match(/body::before\s*{(?<body>[^}]*)}/)?.groups?.body ?? '';
assert.match(globalTextureRule, /position:\s*fixed/);
assert.match(globalTextureRule, /inset:\s*0/);
assert.match(globalTextureRule, /pointer-events:\s*none/);
assert.match(globalTextureRule, /opacity:\s*0\.08/);
const mobileRule = css.match(/@media \(max-width: 780px\)\s*{(?<body>[\s\S]*?)\n}\n\n@media \(max-width: 359px\)/)?.groups?.body ?? '';
assert.match(mobileRule, /body::before\s*{(?<body>[^}]*)display:\s*none/);
assert.match(mobileRule, /\.home-section\s*{(?<body>[^}]*)padding-block:\s*clamp\(3\.3rem/);
assert.match(mobileRule, /\.home-section--arrivals\s*{(?<body>[^}]*)padding-top:\s*clamp\(2\.8rem/);
const mobileMenuPanelRule = mobileRule.match(/\.site-header__menu-panel\s*{(?<body>[^}]*)}/)?.groups?.body ?? '';
const mobileMenuRule = mobileRule.match(/\.site-header__menu\s*{(?<body>[^}]*)}/)?.groups?.body ?? '';
assert.match(mobileMenuRule, /position:\s*relative/);
assert.match(mobileMenuRule, /z-index:\s*21/);
assert.match(mobileMenuPanelRule, /position:\s*absolute/);
assert.match(mobileMenuPanelRule, /z-index:\s*30/);
assert.match(mobileMenuPanelRule, /box-shadow:\s*0 4px 8px/);
const homeEmptyHeadingRule = css.match(/\.empty-state--home h2\s*{(?<body>[^}]*)}/)?.groups?.body ?? '';
const homeEmptyCopyRule = [...css.matchAll(/\.empty-state--home p\s*{(?<body>[^}]*)}/g)].at(-1)?.groups?.body ?? '';
assert.match(homeEmptyHeadingRule, /color:\s*var\(--color-text-dark\)/);
assert.match(homeEmptyCopyRule, /color:\s*var\(--color-muted-light\)/);
assert.ok(
  Number(siteHeaderRule.match(/z-index:\s*(\d+)/)?.[1]) > Number(css.match(/body > \*\s*{(?<body>[^}]*)}/)?.groups?.body.match(/z-index:\s*(\d+)/)?.[1]),
  'The mobile menu stacking context must remain above page content.'
);
assert.ok(
  Number(mobileMenuRule.match(/z-index:\s*(\d+)/)?.[1]) > Number(siteHeaderRule.match(/z-index:\s*(\d+)/)?.[1]),
  'The mobile details menu must remain above the header layer.'
);
assert.ok(
  Number(mobileMenuPanelRule.match(/z-index:\s*(\d+)/)?.[1]) > Number(mobileMenuRule.match(/z-index:\s*(\d+)/)?.[1]),
  'The mobile menu panel must remain above its details control.'
);
const homeEmptyRule = css.match(/\.empty-state--home\s*{(?<body>[^}]*)}/)?.groups?.body ?? '';
const homeEmptyGradient = homeEmptyRule.match(
  /linear-gradient\(135deg,\s*var\(--(?<start>color-[\w-]+)\),\s*(?<end>color-mix\(in srgb,\s*var\(--color-[\w-]+\),\s*var\(--color-[\w-]+\)\s+\d+(?:\.\d+)?%\))\)/
)?.groups;
assert.ok(homeEmptyGradient, 'Home empty state must declare its light gradient endpoints.');
assert.equal(homeEmptyGradient.start, 'color-cream');
const homeEmptyEndMix = parseSrgbTokenMix(homeEmptyGradient.end, 'Home empty-state gradient end');
assert.equal(homeEmptyEndMix.first, 'color-gold-soft');
assert.equal(homeEmptyEndMix.second, 'color-cream');
assert.equal(homeEmptyEndMix.secondWeight, 0.82);
const homeEmptyGradientEnd = mixSrgb(
  tokenValues[homeEmptyEndMix.first],
  tokenValues[homeEmptyEndMix.second],
  homeEmptyEndMix.secondWeight
);
assertContrast('Home empty-state heading on cream endpoint', tokenValues['color-text-dark'], tokenValues[homeEmptyGradient.start], 4.5);
assertContrast('Home empty-state heading on gold-soft/cream endpoint', tokenValues['color-text-dark'], homeEmptyGradientEnd, 4.5);
assertContrast('Home empty-state body', mutedLight, tokenValues['color-cream'], 4.5);

console.log('Design contract validated.');
