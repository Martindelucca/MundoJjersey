import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import {
  catalogCategories,
  getCatalogCategoryBySlug,
  getCatalogCategoryByValue
} from '../src/lib/catalog/categories.ts';
import {
  editorialCollections,
  getEditorialCollectionBySlug
} from '../src/lib/catalog/editorial-collections.ts';
import {
  getAvailableSizes,
  getProductAvailability,
  getTotalStock,
  isAvailable
} from '../src/lib/catalog/availability.ts';
import { formatProductMetadata } from '../src/lib/catalog/product-metadata.ts';
import { getRelatedProducts } from '../src/lib/catalog/related-products.ts';
import { getProductImages } from '../src/lib/sanity/product-images.ts';
import { productsByCategoryAndEditorialTagQuery } from '../src/lib/sanity/queries.ts';

assert.deepEqual(
  catalogCategories.map((category) => category.slug),
  ['camisetas', 'camperas', 'shorts', 'conjuntos']
);

assert.equal(getCatalogCategoryBySlug('camperas')?.value, 'jacket');
assert.equal(getCatalogCategoryBySlug('pantalones'), undefined);
assert.equal(getCatalogCategoryByValue('set')?.plural, 'Conjuntos');
assert.equal(getCatalogCategoryByValue('shorts')?.plural, 'Shorts');
assert.equal(getCatalogCategoryBySlug('botines'), undefined);

assert.deepEqual(
  editorialCollections.map((collection) => collection.slug),
  ['clubes', 'selecciones', 'retro']
);
assert.equal(getEditorialCollectionBySlug('clubes')?.editorialTag, 'club');
assert.equal(getEditorialCollectionBySlug('selecciones')?.editorialTag, 'selection');
assert.equal(getEditorialCollectionBySlug('retro')?.editorialTag, 'retro');
assert.equal(getEditorialCollectionBySlug('actuales'), undefined);
assert.match(productsByCategoryAndEditorialTagQuery, /category == \$category/);
assert.match(productsByCategoryAndEditorialTagQuery, /\$editorialTag in editorialTags/);
assert.match(productsByCategoryAndEditorialTagQuery, /order\(isFeatured desc, _createdAt desc\)/);

const rootDir = resolve(import.meta.dirname, '../../..');
const home = await readFile(resolve(rootDir, 'apps/web/src/pages/index.astro'), 'utf8');
const rootCatalog = await readFile(resolve(rootDir, 'apps/web/src/pages/catalogo.astro'), 'utf8');
const categoryRoute = await readFile(resolve(rootDir, 'apps/web/src/pages/catalogo/[category].astro'), 'utf8');
const collectionRoute = await readFile(resolve(rootDir, 'apps/web/src/pages/catalogo/[category]/[collection].astro'), 'utf8');
const productDetail = await readFile(resolve(rootDir, 'apps/web/src/pages/producto/[slug].astro'), 'utf8');
const productGallery = await readFile(resolve(rootDir, 'apps/web/src/components/ProductGallery.astro'), 'utf8');
const shirtCollectionNavigation = await readFile(resolve(rootDir, 'apps/web/src/components/ShirtCollectionNavigation.astro'), 'utf8');
const catalogCategoryNavigation = await readFile(resolve(rootDir, 'apps/web/src/components/CatalogCategoryNavigation.astro'), 'utf8');
const globalStyles = await readFile(resolve(rootDir, 'apps/web/src/styles/global.css'), 'utf8');

for (const slug of ['clubes', 'selecciones', 'retro']) {
  assert.match(home, new RegExp(`href: '/catalogo/camisetas/${slug}'`));
  assert.match(collectionRoute, new RegExp(`collection: collection.slug`));
}

assert.doesNotMatch(home, /href: '\/catalogo\/camisetas'/);
assert.match(home, /href: '\/catalogo\/camperas'/);
assert.match(collectionRoute, /params: \{ category: 'camisetas', collection: collection.slug \}/);

assert.match(categoryRoute, /<CatalogCategoryNavigation activeSlug=\{categorySlug\} \/>/);
assert.match(collectionRoute, /<CatalogCategoryNavigation activeSlug=\{categorySlug\} \/>/);
assert.match(rootCatalog, /<CatalogCategoryNavigation activeSlug="catalogo" \/>/);
assert.doesNotMatch(rootCatalog, /<ul class="catalog-chips"/);
assert.match(rootCatalog, /catalog-hero catalog-hero--compact/);
assert.doesNotMatch(rootCatalog, /catalog-hero__actions/);
assert.doesNotMatch(rootCatalog, /catalog-hero__facts/);
assert.doesNotMatch(rootCatalog, /hero__stamp/);
assert.match(rootCatalog, /Escribir por WhatsApp/);
assert.match(categoryRoute, /category\?\.value === 'shirt' && <ShirtCollectionNavigation \/>/);
assert.match(collectionRoute, /<ShirtCollectionNavigation activeCollectionSlug=\{collection\?\.slug\} \/>/);
assert.match(categoryRoute, /catalog-hero catalog-hero--compact/);
assert.match(collectionRoute, /catalog-hero catalog-hero--compact/);

for (const filteredRoute of [categoryRoute, collectionRoute]) {
  assert.doesNotMatch(filteredRoute, /catalog-hero__actions/);
  assert.doesNotMatch(filteredRoute, /catalog-hero__facts/);
  assert.doesNotMatch(filteredRoute, /hero__stamp/);
  assert.match(filteredRoute, /Escribir por WhatsApp/);
}
assert.match(catalogCategoryNavigation, /aria-label="Categorías de prendas"/);
assert.match(shirtCollectionNavigation, /aria-label="Colecciones de camisetas"/);
assert.match(shirtCollectionNavigation, />Todas<\/a>/);
assert.match(shirtCollectionNavigation, /href="\/catalogo\/camisetas"/);
assert.match(shirtCollectionNavigation, /activeCollectionSlug === undefined \? 'page' : undefined/);
assert.doesNotMatch(shirtCollectionNavigation, /<script/);

assert.ok(shirtCollectionNavigation.includes('href={`/catalogo/camisetas/${collection.slug}`}'));
assert.match(shirtCollectionNavigation, /collection.slug === activeCollectionSlug \? 'page' : undefined/);

for (const [slug, label] of [['clubes', 'Clubes'], ['selecciones', 'Selecciones'], ['retro', 'Retro']]) {
  assert.equal(editorialCollections.find((collection) => collection.slug === slug)?.navigationLabel, label);
}

assert.match(globalStyles, /\.catalog-chips \{[\s\S]*?flex-wrap: wrap/);
assert.match(globalStyles, /\.catalog-chips a \{[\s\S]*?min-height: 44px/);
assert.match(globalStyles, /\.catalog-hero--compact/);
const mobileStyles = globalStyles.slice(globalStyles.indexOf('@media (max-width: 780px)'), globalStyles.indexOf('@media (max-width: 359px)'));
assert.match(mobileStyles, /\.catalog-chips \{[\s\S]*?flex-wrap: nowrap/);
assert.match(mobileStyles, /\.catalog-chips \{[\s\S]*?overflow-x: auto/);
assert.match(mobileStyles, /\.catalog-chips \{[\s\S]*?max-width: 100%/);
assert.match(mobileStyles, /\.catalog-chips li \{[\s\S]*?flex: 0 0 auto/);
assert.match(mobileStyles, /\.product-grid \{[\s\S]*?grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);
assert.match(globalStyles, /@media \(max-width: 359px\) \{[\s\S]*?\.product-grid \{[\s\S]*?grid-template-columns: 1fr/);
assert.match(mobileStyles, /\.product-card__media \{[\s\S]*?min-height: 0;[\s\S]*?aspect-ratio: 4 \/ 5/);
assert.match(mobileStyles, /\.product-card__identity,[\s\S]*?\.product-card__sizes \{[\s\S]*?font-size: 0.75rem/);
const compactProductHeadingRule = mobileStyles.match(/\.product-card__body :is\(h2, h3\)\s*\{(?<body>[^}]*)}/)?.groups?.body ?? '';
assert.match(compactProductHeadingRule, /font-size:\s*1rem/);
assert.match(compactProductHeadingRule, /line-height:\s*1\.08/);
assert.match(compactProductHeadingRule, /overflow-wrap:\s*anywhere/);
const productCard = await readFile(resolve(rootDir, 'apps/web/src/components/ProductCard.astro'), 'utf8');
assert.match(productCard, /<h2><a href=\{`\/producto\/\$\{product\.slug\}`\}>\{product\.title\}<\/a><\/h2>/);
assert.match(productCard, /product-card__price/);
assert.match(productCard, /product-card__sizes/);
assert.match(productCard, /sizesPreview/);
assert.match(productCard, /formatProductMetadata\(product\.brand, product\.team\?\.name, product\.season\)/);
assert.match(productCard, /\{identity && <p class="product-card__identity">\{identity\}<\/p>\}/);
assert.doesNotMatch(productCard, /Equipo a confirmar|Tanda actual|product-card__ticket|product-card__season|totalStock/);
assert.match(productCard, /Consultar disponibilidad/);
assert.match(productCard, /headingLevel\?: 'h2' \| 'h3'/);
assert.match(productCard, /const \{ product, headingLevel = 'h2' \} = Astro\.props/);
assert.match(productCard, /headingLevel === 'h3'/);
assert.match(home, /<ProductCard product=\{product\} headingLevel="h3" \/>/);
assert.match(productDetail, /<ProductCard product=\{relatedProduct\} headingLevel="h3" \/>/);
for (const catalogPage of [rootCatalog, categoryRoute, collectionRoute]) {
  assert.match(catalogPage, /<ProductCard product=\{product\} \/>/);
}
assert.match(productDetail, /formatProductMetadata\(product\.brand, product\.team\?\.name, product\.season\)/);
assert.match(productDetail, /<ProductGallery images=\{product\.images\} image=\{product\.image\} productTitle=\{product\.title\} \/>/);
assert.match(productGallery, /href=\{imageUrl\}/);
assert.match(productGallery, /aria-current=\{index === 0 \? 'true' : undefined\}/);
assert.doesNotMatch(productGallery, /aria-pressed/);
assert.match(productGallery, /data-product-gallery-thumbnail/);
assert.match(productGallery, /event\.preventDefault\(\)/);
assert.match(productGallery, /mainImage\.src = thumbnail\.dataset\.src/);
assert.match(productGallery, /item\.setAttribute\('aria-current', 'true'\)/);
assert.match(productGallery, /item\.removeAttribute\('aria-current'\)/);
assert.match(productGallery, /event\.key === ' '/);
const desktopGalleryThumbnailsRule = globalStyles.match(/\.product-gallery__thumbnails\s*\{(?<body>[^}]*)}/)?.groups?.body ?? '';
assert.match(desktopGalleryThumbnailsRule, /max-height:\s*calc\(100dvh - 3rem\)/);
assert.match(desktopGalleryThumbnailsRule, /overflow-y:\s*auto/);
assert.match(mobileStyles, /\.product-gallery__thumbnails\s*\{[\s\S]*?flex-direction:\s*row;[\s\S]*?max-height:\s*none;[\s\S]*?overflow-x:\s*auto/);
assert.equal(formatProductMetadata('Marca'), 'Marca');
assert.equal(formatProductMetadata('', '', ''), '');
assert.equal(formatProductMetadata('', 'Equipo', ''), 'Equipo');
assert.equal(formatProductMetadata('  ', '\t', '\n'), '');
assert.equal(formatProductMetadata('Marca', '  ', '\t'), 'Marca');
assert.equal(formatProductMetadata('  Marca  ', ' Equipo ', ' 2026 '), 'Marca · Equipo · 2026');
assert.equal(formatProductMetadata('Marca', 'Equipo'), 'Marca · Equipo');
assert.equal(formatProductMetadata('Marca', undefined, '2026'), 'Marca · 2026');
assert.equal(formatProductMetadata('Marca', 'Equipo', '2026'), 'Marca · Equipo · 2026');
const imageOne = { _type: 'image', asset: { _type: 'reference', _ref: 'image-one' }, alt: 'Frente' };
const imageTwo = { _type: 'image', asset: { _type: 'reference', _ref: 'image-two' }, alt: 'Dorso' };
const duplicateImageOne = { ...imageOne, alt: 'Frente repetido' };
assert.deepEqual(getProductImages([imageOne, imageTwo], imageOne), [imageOne, imageTwo]);
assert.deepEqual(getProductImages([imageOne, duplicateImageOne, imageTwo], imageTwo), [imageOne, imageTwo]);
assert.deepEqual(getProductImages(undefined, imageOne), [imageOne]);
assert.deepEqual(getProductImages([], imageOne), [imageOne]);
assert.deepEqual(getProductImages([{ _type: 'image' }], imageOne), [imageOne]);
assert.deepEqual(getProductImages([{ _type: 'image' }], undefined), []);
assert.match(globalStyles, /\.catalog-chips a:focus-visible \{[\s\S]*?box-shadow:[\s\S]*?inset 0 0 0 2px var\(--color-white\),[\s\S]*?inset 0 0 0 4px var\(--color-ink\)/);
const collectionNavigationRule = globalStyles.match(/\.catalog-navigation--collections\s*\{(?<body>[^}]*)}/)?.groups?.body ?? '';
assert.match(collectionNavigationRule, /border-top:/);
assert.doesNotMatch(collectionNavigationRule, /border-left|border-right/);

const variants = [
  { size: 'S', stock: 0 },
  { size: 'M', stock: 2 },
  { size: 'L', stock: 1 }
];

assert.equal(getTotalStock(variants), 3);
assert.equal(isAvailable(variants), true);
assert.deepEqual(getAvailableSizes(variants), ['M', 'L']);
assert.equal(isAvailable([{ size: 'XL', stock: 0 }]), false);

assert.deepEqual(
  getProductAvailability({
    _id: 'set-1',
    title: 'Conjunto River',
    slug: 'conjunto-river',
    price: 100,
    category: 'set',
    brand: 'Adidas',
    variants: [{ size: 'M', stock: 1 }, { size: 'L', stock: 0 }]
  }),
  { available: true, totalStock: 1, sizes: [{ size: 'M', available: true }, { size: 'L', available: false }] }
);

const currentProduct = {
  _id: 'current',
  title: 'Camiseta actual',
  slug: 'actual',
  price: 100,
  category: 'shirt',
  editorialTags: ['club'],
  brand: 'Marca',
  team: { slug: 'river' }
};
const sameTeam = { ...currentProduct, _id: 'same-team', slug: 'same-team', category: 'jacket' };
const sameCategoryAndTag = { ...currentProduct, _id: 'same-category-tag', slug: 'same-category-tag', team: { slug: 'boca' } };
const sameCategory = { ...currentProduct, _id: 'same-category', slug: 'same-category', editorialTags: ['retro'], team: { slug: 'boca' } };
const sharedTag = { ...currentProduct, _id: 'shared-tag', slug: 'shared-tag', category: 'jacket', team: { slug: 'boca' } };
const fallbackFirst = { ...currentProduct, _id: 'fallback-first', slug: 'fallback-first', category: 'jacket', editorialTags: ['retro'], team: { slug: 'boca' } };
const fallbackSecond = { ...fallbackFirst, _id: 'fallback-second', slug: 'fallback-second' };

assert.deepEqual(
  getRelatedProducts(currentProduct, [currentProduct, fallbackFirst, sameCategory, sharedTag, sameTeam, sameCategoryAndTag]).map((product) => product._id),
  ['same-team', 'same-category-tag', 'same-category']
);
assert.deepEqual(
  getRelatedProducts(currentProduct, [currentProduct, fallbackSecond, fallbackFirst]).map((product) => product._id),
  ['fallback-second', 'fallback-first']
);
assert.deepEqual(
  getRelatedProducts(currentProduct, [currentProduct, sameTeam]).map((product) => product._id),
  ['same-team'],
  'The current product must never appear in related products.'
);

const productWithoutTeamOrTags = {
  ...currentProduct,
  _id: 'without-team-or-tags',
  slug: 'without-team-or-tags',
  team: undefined,
  editorialTags: undefined
};
const sameCategoryWithoutTeamOrTags = {
  ...productWithoutTeamOrTags,
  _id: 'same-category-without-team-or-tags',
  slug: 'same-category-without-team-or-tags'
};

assert.deepEqual(
  getRelatedProducts(productWithoutTeamOrTags, [sameCategoryWithoutTeamOrTags]).map((product) => product._id),
  ['same-category-without-team-or-tags'],
  'Related products must handle missing team and editorialTags.'
);

const equalScoreFirst = { ...sameCategory, _id: 'equal-score-first', slug: 'equal-score-first' };
const equalScoreSecond = { ...sameCategory, _id: 'equal-score-second', slug: 'equal-score-second' };

assert.deepEqual(
  getRelatedProducts(currentProduct, [equalScoreSecond, equalScoreFirst]).map((product) => product._id),
  ['equal-score-second', 'equal-score-first'],
  'Equal positive scores must retain the original query order.'
);
assert.deepEqual(
  getRelatedProducts(currentProduct, [sameTeam]).map((product) => product._id),
  ['same-team'],
  'Related products must return fewer than three candidates when fewer exist.'
);

console.log('Catalog helpers and navigation validated.');
