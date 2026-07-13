import type { ProductSummary, ProductVariant } from '../sanity/types';

export interface SizeAvailability {
  size: string;
  available: boolean;
}

export interface ProductAvailability {
  available: boolean;
  sizes: SizeAvailability[];
  totalStock: number | null;
}

export function getTotalStock(variants: ProductVariant[] = []): number {
  return variants.reduce((total, variant) => total + Math.max(0, variant.stock || 0), 0);
}

export function isAvailable(variants: ProductVariant[] = []): boolean {
  return getTotalStock(variants) > 0;
}

export function getAvailableSizes(variants: ProductVariant[] = []): string[] {
  return variants.filter((variant) => variant.stock > 0).map((variant) => variant.size);
}

export function getProductAvailability(product: ProductSummary): ProductAvailability {
  const variants = product.variants || [];
  return {
    available: isAvailable(variants),
    sizes: variants.map((variant) => ({ size: variant.size, available: variant.stock > 0 })),
    totalStock: getTotalStock(variants)
  };
}
