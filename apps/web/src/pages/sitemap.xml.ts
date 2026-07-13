import type { APIRoute } from 'astro';
import { catalogCategories } from '../lib/catalog/categories';
import { editorialCollections } from '../lib/catalog/editorial-collections';
import { buildSitemapXml } from '../lib/seo';
import { hasSanityConfig, sanityClient } from '../lib/sanity/client';
import { productSlugsQuery } from '../lib/sanity/queries';

export const prerender = true;

export const GET: APIRoute = async ({ url, site }) => {
  let productPaths: string[] = [];

  if (hasSanityConfig) {
    try {
      const products = await sanityClient.fetch<Array<{ slug?: string }>>(productSlugsQuery);
      productPaths = products
        .map((product) => product.slug?.trim())
        .filter((slug): slug is string => Boolean(slug))
        .map((slug) => `/producto/${encodeURIComponent(slug)}`);
    } catch {
      productPaths = [];
    }
  }

  const staticPaths = [
    '/',
    '/catalogo',
    ...catalogCategories.map((category) => `/catalogo/${category.slug}`),
    ...editorialCollections.map((collection) => `/catalogo/camisetas/${collection.slug}`)
  ];

  return new Response(buildSitemapXml([...staticPaths, ...productPaths], site || import.meta.env.PUBLIC_SITE_URL || url.origin), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' }
  });
};
