import assert from 'node:assert/strict';
import { schemaTypes } from '../schemas/index.ts';

const schemasByName = new Map(schemaTypes.map((schema) => [schema.name, schema]));

for (const schemaName of ['product', 'team', 'league', 'siteSettings']) {
  assert.ok(schemasByName.has(schemaName), `Missing schema: ${schemaName}`);
}

const product = schemasByName.get('product');
const productFields = new Set(product.fields.map((field) => field.name));

for (const fieldName of [
  'title',
  'slug',
  'images',
  'price',
  'team',
  'league',
  'season',
  'stock',
  'sizes'
]) {
  assert.ok(productFields.has(fieldName), `Missing product field: ${fieldName}`);
}

assert.equal(productFields.has('condition'), false, 'Product should not include condition');

const stockField = product.fields.find((field) => field.name === 'stock');

assert.equal(stockField.type, 'number');
assert.equal(typeof stockField.validation, 'function');

console.log('Sanity schemas validated.');
