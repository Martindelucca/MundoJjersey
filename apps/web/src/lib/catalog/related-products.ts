import type { ProductSummary } from '../sanity/types';
import { getProductAvailability } from './availability.ts';

function getRelatedProductScore(product: ProductSummary, candidate: ProductSummary): number {
  const sameTeam = Boolean(product.team?.slug && product.team.slug === candidate.team?.slug);
  const sameCategory = product.category === candidate.category;
  const sharedEditorialTag = product.editorialTags?.some((tag) => candidate.editorialTags?.includes(tag));

  return (sameTeam ? 100 : 0) + (sameCategory ? 10 : 0) + (sharedEditorialTag ? 1 : 0);
}

export function getRelatedProducts(product: ProductSummary, products: ProductSummary[]): ProductSummary[] {
  return products
    .map((candidate, index) => ({ candidate, index, score: getRelatedProductScore(product, candidate) }))
    .filter(({ candidate }) =>
      candidate._id !== product._id
      && getProductAvailability(candidate).status !== 'outOfStock'
    )
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, 3)
    .map(({ candidate }) => candidate);
}
