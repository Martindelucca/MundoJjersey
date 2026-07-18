import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import {
  buildProductStructuredData,
  buildRobotsTxt,
  buildSiteStructuredData,
  buildSitemapXml,
  escapeXml,
  getAbsoluteUrl,
  getSiteOrigin,
  serializeJsonLd
} from '../src/lib/seo.ts';
import { isLocalHostname, isSafeExternalUrl, parseSiteOrigin } from '../src/lib/site-origin.ts';
import { spawnSync } from 'node:child_process';
import { assertJsonLdScriptsAreSafe, assertWhatsAppLinksAreSafe } from './release-url-safety.mjs';

assert.deepEqual(parseSiteOrigin('https://user:secret@mundo.example.com/catalogo?ref=ad#drop'), {
  origin: 'https://mundo.example.com',
  isLocal: false
});
for (const localUrl of ['http://localhost:4321', 'http://shop.localhost', 'http://127.0.0.1', 'http://127.255.255.255', 'http://127.1', 'http://0.0.0.0', 'http://0', 'http://[::1]', 'http://::1', 'http://localhost.', 'http://foo.localhost.', 'http://[::ffff:127.0.0.1]', 'http://[::ffff:7f00:1]', 'http://[::ffff:0.0.0.0]']) {
  assert.equal(parseSiteOrigin(localUrl)?.isLocal, true, `${localUrl} must be local.`);
}
for (const hostname of ['localhost.', 'foo.localhost.', '[::1]', '::ffff:127.0.0.1', '::ffff:7f00:1']) {
  assert.equal(isLocalHostname(hostname), true, `${hostname} must be local.`);
}
assert.equal(isLocalHostname('[2001:4860:4860::8888]'), false, 'A public IPv6 host must not be local.');
assert.equal(isSafeExternalUrl('https://instagram.com/mundojjersey'), true);
for (const unsafeUrl of ['ftp://instagram.com/mundojjersey', 'https://user:secret@instagram.com/mundojjersey', 'https://localhost./mundojjersey']) {
  assert.equal(isSafeExternalUrl(unsafeUrl), false, `${unsafeUrl} must not be an external URL.`);
}

assert.equal(getSiteOrigin('https://mundo.example.com/'), 'https://mundo.example.com');
assert.equal(getAbsoluteUrl('/catalogo', 'https://mundo.example.com/'), 'https://mundo.example.com/catalogo');
assert.equal(escapeXml(`<&>"'`), '&lt;&amp;&gt;&quot;&apos;');
assert.match(buildSitemapXml(['/', '/producto/camiseta?color=azul&size=M'], 'https://mundo.example.com/'), /https:\/\/mundo\.example\.com\/producto\/camiseta\?color=azul&amp;size=M/);
assert.match(buildRobotsTxt('https://mundo.example.com/'), /^Sitemap: https:\/\/mundo\.example\.com\/sitemap\.xml$/m);
assert.match(buildSitemapXml(['/', '/catalogo']), /http:\/\/localhost:4321\/catalogo/, 'The helper has a safe local fallback when site configuration is absent.');
assert.doesNotMatch(serializeJsonLd({ value: '</script><script>alert(1)</script>' }), /<\/script>/i);

const siteSchema = buildSiteStructuredData('https://mundo.example.com/', 'https://instagram.com/mundojjersey');
assert.equal(siteSchema[0]['@type'], 'WebSite');
assert.equal(siteSchema[1]['@type'], 'Organization');
assert.deepEqual(siteSchema[1].sameAs, ['https://instagram.com/mundojjersey']);
assert.equal(buildSiteStructuredData('https://mundo.example.com/')[1].sameAs, undefined);
assert.equal(buildSiteStructuredData('https://mundo.example.com/', 'https://user:secret@localhost./mundojjersey')[1].sameAs, undefined);

assertWhatsAppLinksAreSafe('<a href="https://wa.me/5491100000000?text=Hola%20https%3A%2F%2Fmundo.example.com%2Fcatalogo">Consultar</a>', 'safe WhatsApp fixture');
assert.throws(() => assertWhatsAppLinksAreSafe('<a href="https://wa.me/5491100000000?text=Hola%20https%3A%2F%2Fuser%3Asecret%40localhost.%2Fcatalogo">Consultar</a>', 'unsafe WhatsApp fixture'), /local host or credentials/);
assertJsonLdScriptsAreSafe('<script type="application/ld+json">{"@context":"https://schema.org","sameAs":["https://instagram.com/mundojjersey"],"name":"not a URL"}</script>', 'safe JSON-LD fixture');
assert.throws(() => assertJsonLdScriptsAreSafe('<script type="application/ld+json">{"@context":"https://schema.org","sameAs":["https://user:secret@localhost./mundojjersey"]}</script>', 'unsafe sameAs fixture'), /local host or credentials/);

const productSchema = buildProductStructuredData({
  _id: 'product-1',
  title: 'Camiseta <segura>',
  slug: 'camiseta-segura',
  price: 120000,
  category: 'shirt',
  brand: '  Adidas  ',
  description: '  Una camiseta seleccionada.  '
}, {
  url: 'https://mundo.example.com/producto/camiseta-segura',
  imageUrl: 'https://cdn.sanity.io/image.jpg',
  category: 'Camiseta',
  availabilityStatus: 'inStock'
});
assert.equal(productSchema['@type'], 'Product');
assert.equal(productSchema.url, 'https://mundo.example.com/producto/camiseta-segura');
assert.equal(productSchema.image, 'https://cdn.sanity.io/image.jpg');
assert.equal(productSchema.description, 'Una camiseta seleccionada.');
assert.deepEqual(productSchema.brand, { '@type': 'Brand', name: 'Adidas' });
assert.equal(productSchema.offers.availability, 'https://schema.org/InStock');

const sparseProductSchema = buildProductStructuredData({
  _id: 'product-2', title: 'Sin opcionales', slug: 'sin-opcionales', price: 1, category: 'shirt', brand: ' '
}, { url: 'https://mundo.example.com/producto/sin-opcionales', availabilityStatus: 'outOfStock' });
assert.equal(sparseProductSchema.image, undefined);
assert.equal(sparseProductSchema.description, undefined);
assert.equal(sparseProductSchema.brand, undefined);
assert.equal(sparseProductSchema.category, undefined);
assert.equal(sparseProductSchema.offers.availability, 'https://schema.org/OutOfStock');
const onRequestProductSchema = buildProductStructuredData({
  _id: 'product-3', title: 'A pedido', slug: 'a-pedido', price: 2, category: 'shirt', brand: 'Adidas'
}, { url: 'https://mundo.example.com/producto/a-pedido', availabilityStatus: 'onRequest' });
assert.equal(onRequestProductSchema.offers.availability, 'https://schema.org/BackOrder');

const rootDir = resolve(import.meta.dirname, '../../..');
const sitemapRoute = await readFile(resolve(rootDir, 'apps/web/src/pages/sitemap.xml.ts'), 'utf8');
const robotsRoute = await readFile(resolve(rootDir, 'apps/web/src/pages/robots.txt.ts'), 'utf8');
const layout = await readFile(resolve(rootDir, 'apps/web/src/layouts/BaseLayout.astro'), 'utf8');
const detail = await readFile(resolve(rootDir, 'apps/web/src/pages/producto/[slug].astro'), 'utf8');
const gallery = await readFile(resolve(rootDir, 'apps/web/src/components/ProductGallery.astro'), 'utf8');
const sanityImageHelper = await readFile(resolve(rootDir, 'apps/web/src/lib/sanity/image.ts'), 'utf8');
const card = await readFile(resolve(rootDir, 'apps/web/src/components/ProductCard.astro'), 'utf8');
const home = await readFile(resolve(rootDir, 'apps/web/src/pages/index.astro'), 'utf8');
const categoryTile = await readFile(resolve(rootDir, 'apps/web/src/components/CategoryTile.astro'), 'utf8');

assert.match(sitemapRoute, /export const prerender = true/);
assert.match(sitemapRoute, /catalogCategories/);
assert.match(sitemapRoute, /editorialCollections/);
assert.match(sitemapRoute, /productSlugsQuery/);
assert.match(sitemapRoute, /site \|\| import\.meta\.env\.PUBLIC_SITE_URL \|\| url\.origin/);
assert.match(sitemapRoute, /try \{/);
assert.match(sitemapRoute, /catch \{/);
assert.match(robotsRoute, /buildRobotsTxt/);
assert.match(robotsRoute, /site \|\| import\.meta\.env\.PUBLIC_SITE_URL \|\| url\.origin/);
assert.match(layout, /structuredData\?: JsonLd/);
assert.match(layout, /openGraphImageUrl\?: string/);
assert.match(layout, /openGraphImageUrl \|\| new URL\('\/og\.png', siteOrigin\)/);
assert.match(layout, /serializeJsonLd/);
assert.match(layout, /buildSiteStructuredData/);
assert.match(layout, /\/og\.png/);
assert.match(detail, /buildProductStructuredData/);
assert.match(detail, /availabilityStatus: availability\.status/);
assert.match(detail, /parseSiteOrigin\(import\.meta\.env\.PUBLIC_SITE_URL\)/);
assert.match(detail, /!siteOrigin\.isLocal/);
assert.match(detail, /structuredData=\{productStructuredData\}/);
assert.match(detail, /openGraphImageUrl=\{canonicalProductUrl \? imageUrl \|\| undefined : undefined\}/);
assert.match(detail, /imageUrl: imageUrl \|\| undefined/);
assert.match(detail, /getImageUrl\(productImages\[0\], 1200\)/);
assert.match(detail, /getProductImages\(product\?\.images, product\?\.image\)/);
assert.match(home, /fetchpriority="high"/);
assert.match(home, /import heroImage from '\.\.\/\.\.\/fotos\/HERODESKTOP\.svg'/);
assert.match(home, /<Image src=\{heroImage\} alt="" loading="eager" decoding="async" fetchpriority="high" \/>/);
assert.doesNotMatch(home, /HERO1/);
assert.match(categoryTile, /<Image class="category-tile__image"/);
assert.match(categoryTile, /loading="lazy" decoding="async"/);
assert.match(categoryTile, /widths=\{\[320, 480, 640, 960\]\}/);
assert.match(card, /srcset=\{imageSrcSet\}/);
assert.match(card, /sizes="\(max-width: 359px\) 100vw/);
assert.match(card, /getImageSrcSet\(product\.image, \[320, 480, 640, 960, 1280\]\)/);
assert.match(card, /\(max-width: 780px\) 50vw, \(max-width: 1119px\) 50vw, 547px/);
assert.match(card, /loading="lazy" decoding="async"/);
assert.match(detail, /<ProductGallery images=\{product\.images\} image=\{product\.image\} productTitle=\{product\.title\} \/>/);
assert.match(gallery, /srcset=\{initialImageSrcSet\}/);
assert.match(gallery, /loading="eager"/);
assert.match(gallery, /fetchpriority="high"/);
assert.match(gallery, /getImageUrl\(productImage, 1200\)/);
assert.match(sanityImageHelper, /auto\('format'\)/, 'Gallery URLs use the existing auto-format Sanity helper.');

const rootPackage = await readFile(resolve(rootDir, 'package.json'), 'utf8');
const ogImage = await readFile(resolve(rootDir, 'apps/web/public/og.png'));
assert.match(rootPackage, /"ready": ".*test:release -- --origin-only.*test:release/);
assert.equal(ogImage.toString('ascii', 1, 4), 'PNG', 'public/og.png must be a PNG file.');
assert.equal(ogImage.readUInt32BE(16), 1200, 'public/og.png width must be 1200.');
assert.equal(ogImage.readUInt32BE(20), 630, 'public/og.png height must be 630.');

for (const invalidOrigin of [
  'http://localhost:4321',
  'http://127.0.0.1',
  'http://0.0.0.0',
  'http://[::1]',
  'http://localhost.',
  'http://[::ffff:127.0.0.1]',
  'https://user:secret@example.com',
  'https://example.com/catalogo',
  'https://example.com?ref=ad#drop'
]) {
  const result = spawnSync(process.execPath, ['--experimental-strip-types', resolve(import.meta.dirname, 'test-release.mjs'), '--origin-only'], {
    env: { ...process.env, PUBLIC_SITE_URL: invalidOrigin },
    encoding: 'utf8'
  });
  assert.notEqual(result.status, 0, `${invalidOrigin} must fail the release origin gate.`);
  assert.match(result.stderr, /Set PUBLIC_SITE_URL to the public deployment origin, e\.g\. https:\/\/example\.com\./);
}

console.log('SEO, structured data, and image performance contracts validated.');
