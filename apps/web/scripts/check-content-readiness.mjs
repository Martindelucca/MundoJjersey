import { createClient } from '@sanity/client';
import { getSanityEnv, loadLocalEnv } from './env.mjs';

loadLocalEnv();

const { projectId, dataset, apiVersion, useCdn, token } = getSanityEnv();

if (!projectId || projectId === 'replace-me') {
  console.error('Missing SANITY_PROJECT_ID or SANITY_STUDIO_PROJECT_ID.');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: token ? false : useCdn,
  token: token || undefined
});

const products = await client.fetch(`*[_type == "product"] {
  _id,
  title,
  "slug": slug.current,
  price,
  category,
  brand,
  season,
  images[]{alt, asset},
  variants[]{size, stock},
  team->{name}
}`);
const siteSettings = await client.fetch('*[_type == "siteSettings"][0]{title, whatsappNumber}');
const failures = [];
const warnings = [];

if (!siteSettings?.whatsappNumber && !process.env.PUBLIC_WHATSAPP_NUMBER) {
  failures.push('Missing WhatsApp number in siteSettings and PUBLIC_WHATSAPP_NUMBER.');
}

if (products.length === 0) {
  warnings.push('No products found. The site will build, but catalog pages will be empty.');
}

for (const product of products) {
  const label = product.title || product._id;
  const variants = Array.isArray(product.variants) ? product.variants : [];
  const images = Array.isArray(product.images) ? product.images : [];
  const sizes = variants.map((variant) => variant?.size).filter(Boolean);
  const duplicatedSize = sizes.find((size, index) => sizes.indexOf(size) !== index);
  const totalStock = variants.reduce((total, variant) => total + Math.max(0, variant?.stock || 0), 0);

  if (!product.title) failures.push(`${label}: missing title.`);
  if (!product.slug) failures.push(`${label}: missing slug.`);
  if (typeof product.price !== 'number') failures.push(`${label}: missing numeric price.`);
  if (!product.category) failures.push(`${label}: missing category.`);
  if (!product.brand) failures.push(`${label}: missing brand.`);
  if (!product.team?.name) failures.push(`${label}: missing team reference.`);
  if (images.length === 0) failures.push(`${label}: missing product image.`);
  if (images.some((image) => !image?.alt)) failures.push(`${label}: every image needs alt text.`);
  if (variants.length === 0) failures.push(`${label}: missing variants for size and stock.`);
  if (duplicatedSize) failures.push(`${label}: duplicated size ${duplicatedSize}.`);
  if (variants.some((variant) => !variant?.size || typeof variant?.stock !== 'number')) {
    failures.push(`${label}: every variant needs size and numeric stock.`);
  }
  if (totalStock === 0) warnings.push(`${label}: total stock is 0, product will appear unavailable.`);
}

for (const warning of warnings) {
  console.warn(`Warning: ${warning}`);
}

if (failures.length > 0) {
  console.error('Content readiness failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('Content readiness OK.');
console.log(`Checked ${products.length} product${products.length === 1 ? '' : 's'}.`);
