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
  'variants',
  'category',
  'editorialTags',
  'brand'
]) {
  assert.ok(productFields.has(fieldName), `Missing product field: ${fieldName}`);
}

assert.equal(productFields.has('condition'), false, 'Product should not include condition');
assert.equal(productFields.has('stock'), false, 'Product should not include legacy stock');
assert.equal(productFields.has('sizes'), false, 'Product should not include legacy sizes');

const productSlugField = product.fields.find((field) => field.name === 'slug');
const teamSlugField = schemasByName.get('team').fields.find((field) => field.name === 'slug');
const leagueSlugField = schemasByName.get('league').fields.find((field) => field.name === 'slug');
const imagesField = product.fields.find((field) => field.name === 'images');
const imageAltField = imagesField.of[0].fields.find((field) => field.name === 'alt');
const variantsField = product.fields.find((field) => field.name === 'variants');
const variantFields = new Set(variantsField.of[0].fields.map((field) => field.name));
const categoryField = product.fields.find((field) => field.name === 'category');
const editorialTagsField = product.fields.find((field) => field.name === 'editorialTags');
const siteSettings = schemasByName.get('siteSettings');
const whatsappMessageField = siteSettings.fields.find((field) => field.name === 'whatsappMessage');

for (const slugField of [productSlugField, teamSlugField, leagueSlugField]) {
  assert.equal(typeof slugField.options?.isUnique, 'function', `${slugField.name} should define isUnique`);
}

assert.equal(typeof imageAltField.validation, 'function', 'Product image alt should be required');
assert.ok(variantFields.has('size'), 'Variant should include size');
assert.ok(variantFields.has('stock'), 'Variant should include stock');
assert.equal(typeof variantsField.validation, 'function', 'Variants should validate duplicates and minimum stock rows');
assert.deepEqual(
  categoryField.options.list.map(({ value }) => value),
  ['shirt', 'jacket', 'shorts', 'set']
);
assert.deepEqual(
  editorialTagsField.options.list.map(({ value }) => value),
  ['club', 'selection', 'retro']
);
assert.equal(editorialTagsField.type, 'array');
assert.equal(editorialTagsField.of[0].type, 'string');
const editorialTagsValidation = [];
const editorialTagsRule = {
  unique() {
    editorialTagsValidation.push((editorialTags) =>
      !Array.isArray(editorialTags) || new Set(editorialTags).size === editorialTags.length
        ? true
        : 'Editorial tags should be unique'
    );
    return this;
  },
  custom(validation) {
    editorialTagsValidation.push(validation);
    return this;
  }
};
const validateEditorialTags = (editorialTags) =>
  editorialTagsValidation.map((validation) => validation(editorialTags)).find((result) => result !== true) ?? true;

editorialTagsField.validation(editorialTagsRule);

assert.equal(validateEditorialTags(undefined), true, 'Editorial tags should remain optional');
assert.equal(validateEditorialTags(['club', 'selection', 'retro']), true);
assert.match(validateEditorialTags(['club', 'club']), /unique/);
assert.match(
  validateEditorialTags(['club', 'invalid']),
  /solo pueden ser Clubes, Selecciones o Retro/
);
assert.equal(productFields.has('bundleComponents'), false, 'Products should not include bundle components');
assert.match(whatsappMessageField.description, /\{productTitle\}/);
assert.match(whatsappMessageField.description, /\{category\}/);
assert.match(whatsappMessageField.description, /\{productUrl\}/);

console.log('Sanity schemas validated.');
