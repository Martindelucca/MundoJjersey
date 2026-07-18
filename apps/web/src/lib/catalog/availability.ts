import type {
  ProductAvailabilityStatus,
  ProductSummary,
  ProductVariant
} from '../sanity/types';

export interface SizeAvailability {
  size: string;
  available: boolean;
}

export interface ProductAvailability {
  status: ProductAvailabilityStatus;
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
  const totalStock = getTotalStock(variants);
  const status: ProductAvailabilityStatus = product.saleMode === 'onRequest'
    ? 'onRequest'
    : totalStock > 0
      ? 'inStock'
      : 'outOfStock';

  return {
    status,
    available: status === 'inStock',
    sizes: variants.map((variant) => ({ size: variant.size, available: variant.stock > 0 })),
    totalStock
  };
}

export function groupProductsByAvailability(products: ProductSummary[]): {
  inStock: ProductSummary[];
  onRequest: ProductSummary[];
} {
  return {
    inStock: products.filter((product) => getProductAvailability(product).status === 'inStock'),
    onRequest: products.filter((product) => getProductAvailability(product).status === 'onRequest')
  };
}
