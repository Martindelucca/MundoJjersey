import assert from 'node:assert/strict';
import {
  catalogCategories,
  getCatalogCategoryBySlug,
  getCatalogCategoryByValue
} from '../src/lib/catalog/categories.ts';
import { getAvailableSizes, getTotalStock, isAvailable } from '../src/lib/catalog/availability.ts';

assert.deepEqual(
  catalogCategories.map((category) => category.slug),
  ['camisetas', 'camperas', 'shorts']
);

assert.equal(getCatalogCategoryBySlug('camperas')?.value, 'jacket');
assert.equal(getCatalogCategoryByValue('shorts')?.plural, 'Shorts');
assert.equal(getCatalogCategoryBySlug('botines'), undefined);

const variants = [
  { size: 'S', stock: 0 },
  { size: 'M', stock: 2 },
  { size: 'L', stock: 1 }
];

assert.equal(getTotalStock(variants), 3);
assert.equal(isAvailable(variants), true);
assert.deepEqual(getAvailableSizes(variants), ['M', 'L']);
assert.equal(isAvailable([{ size: 'XL', stock: 0 }]), false);

console.log('Catalog helpers validated.');
