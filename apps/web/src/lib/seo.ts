import type { ProductDetail } from './sanity/types';
import { isSafeExternalUrl, parseSiteOrigin } from './site-origin.ts';

export type JsonLd = Record<string, unknown> | Array<Record<string, unknown>>;

export function getSiteOrigin(value?: string | URL): string {
  const fallback = 'http://localhost:4321';
  return parseSiteOrigin(value)?.origin || fallback;
}

export function getAbsoluteUrl(path: string, site?: string | URL): string {
  return new URL(path, `${getSiteOrigin(site)}/`).toString();
}

export function escapeXml(value: string): string {
  return value.replace(/[<>&"']/g, (character) => ({
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    '"': '&quot;',
    "'": '&apos;'
  })[character] || character);
}

export function buildSitemapXml(paths: string[], site?: string | URL): string {
  const urls = [...new Set(paths.map((path) => getAbsoluteUrl(path, site)))];
  const entries = urls.map((url) => `  <url><loc>${escapeXml(url)}</loc></url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
}

export function buildRobotsTxt(site?: string | URL): string {
  return `User-agent: *\nAllow: /\nSitemap: ${getAbsoluteUrl('/sitemap.xml', site)}\n`;
}

export function serializeJsonLd(data: JsonLd): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export function buildSiteStructuredData(site?: string | URL, instagramUrl?: string): JsonLd {
  const origin = getSiteOrigin(site);
  const organization: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Mundo JJersey',
    url: origin,
    logo: getAbsoluteUrl('/brand-mark.png', origin)
  };

  if (instagramUrl && isSafeExternalUrl(instagramUrl)) {
    organization.sameAs = [instagramUrl];
  }

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Mundo JJersey',
      url: origin
    },
    organization
  ];
}

export function buildProductStructuredData(
  product: ProductDetail,
  options: { url: string; imageUrl?: string; category?: string; available: boolean }
): JsonLd {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    url: options.url,
    category: options.category,
    offers: {
      '@type': 'Offer',
      url: options.url,
      priceCurrency: 'ARS',
      price: product.price,
      availability: `https://schema.org/${options.available ? 'InStock' : 'OutOfStock'}`
    }
  };

  if (options.imageUrl) schema.image = options.imageUrl;
  if (product.description?.trim()) schema.description = product.description.trim();
  if (product.brand?.trim()) schema.brand = { '@type': 'Brand', name: product.brand.trim() };
  if (!options.category) delete schema.category;

  return schema;
}
