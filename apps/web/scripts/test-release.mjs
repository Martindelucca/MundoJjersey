import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { loadEnv } from 'vite';
import { parseSiteOrigin, parseSiteUrl } from '../src/lib/site-origin.ts';
import { assertJsonLdScriptsAreSafe, assertWhatsAppLinksAreSafe } from './release-url-safety.mjs';

const distDir = resolve(import.meta.dirname, '../dist');
const rootDir = resolve(import.meta.dirname, '../../..');
const releaseOriginFix = 'Set PUBLIC_SITE_URL to the public deployment origin, e.g. https://example.com.';
const configuredSiteUrl = process.env.PUBLIC_SITE_URL || loadEnv('production', rootDir, '').PUBLIC_SITE_URL;

export function assertPublicOrigin(value, context) {
  assert.ok(value, `${context} is missing. ${releaseOriginFix}`);

  const siteOrigin = parseSiteOrigin(value);
  const url = parseSiteUrl(value);
  if (!siteOrigin || !url) {
    assert.fail(`${context} is not a valid absolute URL. ${releaseOriginFix}`);
  }

  assert.ok(url.protocol === 'http:' || url.protocol === 'https:', `${context} must use http or https. ${releaseOriginFix}`);
  assert.equal(url.username, '', `${context} must not include a username. ${releaseOriginFix}`);
  assert.equal(url.password, '', `${context} must not include a password. ${releaseOriginFix}`);
  assert.ok(['', '/'].includes(url.pathname), `${context} must not include a path. ${releaseOriginFix}`);
  assert.equal(url.search, '', `${context} must not include a query string. ${releaseOriginFix}`);
  assert.equal(url.hash, '', `${context} must not include a hash. ${releaseOriginFix}`);
  assert.ok(!siteOrigin.isLocal, `${context} uses a local origin (${siteOrigin.origin}). ${releaseOriginFix}`);
  return siteOrigin.origin;
}

function assertNoLocalOrigin(value, context) {
  const urls = value.match(/https?:\/\/[^\s"'<>]+/g) || [];
  for (const url of urls) {
    const siteOrigin = parseSiteOrigin(url);
    assert.ok(!siteOrigin?.isLocal, `${context} uses a local origin (${siteOrigin?.origin || url}). ${releaseOriginFix}`);
  }
}

const configuredOrigin = assertPublicOrigin(configuredSiteUrl, 'PUBLIC_SITE_URL');

if (process.argv.includes('--origin-only')) {
  console.log('Release origin validation passed.');
  process.exit(0);
}

async function readDistFile(relativePath) {
  try {
    return await readFile(resolve(distDir, relativePath), 'utf8');
  } catch {
    throw new Error(`Missing build output: dist/${relativePath}`);
  }
}

async function listFiles(directory, prefix = '') {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => entry.isDirectory()
    ? listFiles(resolve(directory, entry.name), `${prefix}${entry.name}/`)
    : [`${prefix}${entry.name}`]
  ));
  return nested.flat();
}

const sitemap = await readDistFile('sitemap.xml');
const robots = await readDistFile('robots.txt');
const expectedPaths = ['/', '/catalogo', '/catalogo/camisetas', '/catalogo/camperas', '/catalogo/shorts', '/catalogo/conjuntos', '/catalogo/camisetas/clubes', '/catalogo/camisetas/selecciones', '/catalogo/camisetas/retro'];

assert.match(sitemap, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
assert.match(sitemap, /<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/);
for (const path of expectedPaths) {
  assert.match(sitemap, new RegExp(`<loc>[^<]+${path === '/' ? '\\/' : path.replaceAll('/', '\\/')}</loc>`), `Sitemap is missing ${path}`);
}

const sitemapUrl = robots.match(/^Sitemap: (https?:\/\/\S+\/sitemap\.xml)$/m)?.[1];
assert.ok(sitemapUrl, 'robots.txt must contain an absolute sitemap URL.');
assertNoLocalOrigin(robots, 'robots.txt');
assert.match(robots, /^User-agent: \*$/m);
assert.match(robots, /^Allow: \/$/m);

const sitemapLocations = [...sitemap.matchAll(/<loc>(https?:\/\/[^<]+)<\/loc>/g)].map((match) => match[1]);
assert.ok(sitemapLocations.length > 0, 'sitemap.xml must contain absolute locations.');
for (const location of sitemapLocations) {
  const locationOrigin = parseSiteOrigin(location);
  assert.ok(locationOrigin, `Sitemap location is not a valid URL: ${location}`);
  assert.ok(!locationOrigin.isLocal, `Sitemap location uses a local origin: ${location}`);
  assert.equal(locationOrigin.origin, configuredOrigin, `Sitemap location must use configured origin ${configuredOrigin}: ${location}`);
}

const files = await listFiles(distDir);
const htmlFiles = files.filter((file) => file === 'index.html' || file.endsWith('/index.html'));
for (const file of htmlFiles) {
  const html = await readDistFile(file);
  assert.match(html, /<link rel="canonical" href="https?:\/\//, `${file} is missing an absolute canonical URL.`);
  assert.match(html, /<meta property="og:url" content="https?:\/\//, `${file} is missing an absolute OG URL.`);
  assert.match(html, /<meta property="og:image" content="https?:\/\//, `${file} is missing an absolute OG image URL.`);
  assert.match(html, /<meta name="twitter:image" content="https?:\/\//, `${file} is missing an absolute Twitter image URL.`);
  assertNoLocalOrigin(html.match(/<link rel="canonical"[^>]+>/)?.[0] || '', `${file} canonical`);
  assertNoLocalOrigin(html.match(/<meta property="og:(?:url|image)"[^>]+>/g)?.join('\n') || '', `${file} OG metadata`);
  assertNoLocalOrigin(html.match(/<meta name="twitter:(?:title|description|image)"[^>]+>/g)?.join('\n') || '', `${file} Twitter metadata`);
  assertWhatsAppLinksAreSafe(html, file);
  assertJsonLdScriptsAreSafe(html, file);
}

const productUrls = [...sitemap.matchAll(/<loc>(https?:\/\/[^<]+\/producto\/[^<]+)<\/loc>/g)].map((match) => match[1]);
assert.ok(productUrls.length > 0, `Release build emitted zero product URLs in sitemap.xml. ${releaseOriginFix}`);
const productHtml = productUrls.map((productUrl) => {
  const pathname = new URL(productUrl).pathname.replace(/^\//, '');
  return `${pathname}/index.html`;
});
for (const productFile of productHtml) {
  const html = await readDistFile(productFile);
  assert.match(html, /"@type":"Product"/, `${productFile} is missing Product JSON-LD.`);
  assert.match(html, /"priceCurrency":"ARS"/, `${productFile} is missing ARS offer data.`);
  assert.match(html, /https:\/\/schema\.org\/(InStock|OutOfStock|BackOrder)/, `${productFile} has invalid offer availability.`);
}

const og = await readFile(resolve(distDir, 'og.png'));
assert.equal(og.toString('ascii', 1, 4), 'PNG', 'dist/og.png is not a PNG file.');
assert.equal(og.readUInt32BE(16), 1200, 'dist/og.png width must be 1200.');
assert.equal(og.readUInt32BE(20), 630, 'dist/og.png height must be 630.');

console.log(`Release build validation passed (${productHtml.length} sitemap product route${productHtml.length === 1 ? '' : 's'} found).`);
