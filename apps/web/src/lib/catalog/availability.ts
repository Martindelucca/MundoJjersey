import type { ProductVariant } from '../sanity/types';

export function getTotalStock(variants: ProductVariant[] = []): number {
  return variants.reduce((total, variant) => total + Math.max(0, variant.stock || 0), 0);
}

export function isAvailable(variants: ProductVariant[] = []): boolean {
  return getTotalStock(variants) > 0;
}

export function getAvailableSizes(variants: ProductVariant[] = []): string[] {
  return variants.filter((variant) => variant.stock > 0).map((variant) => variant.size);
}
