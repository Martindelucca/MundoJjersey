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
  'saleMode',
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
const saleModeField = product.fields.find((field) => field.name === 'saleMode');
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
assert.deepEqual(saleModeField.options.list.map(({ value }) => value), ['stock', 'onRequest']);
assert.equal(saleModeField.initialValue, 'stock');
assert.equal(saleModeField.hidden, undefined, 'Sale mode must remain visible for every product category.');
assert.equal(variantsField.hidden({ document: { category: 'shirt', saleMode: 'onRequest' } }), true);
assert.equal(variantsField.hidden({ document: { category: 'jacket', saleMode: 'onRequest' } }), true);
assert.equal(variantsField.hidden({ document: { category: 'shirt', saleMode: 'stock' } }), false);
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
assert.deepEqual(
  product.groups.map(({ name, title, default: isDefault }) => ({ name, title, default: isDefault })),
  [
    { name: 'producto', title: 'Producto', default: true },
    { name: 'fotos', title: 'Fotos', default: undefined },
    { name: 'precioStock', title: 'Precio y stock', default: undefined },
    { name: 'coleccionesPublicacion', title: 'Colecciones y publicación', default: undefined }
  ]
);
assert.deepEqual(
  product.fields.map(({ name, group }) => ({ name, group })),
  [
    { name: 'title', group: 'producto' },
    { name: 'slug', group: 'producto' },
    { name: 'category', group: 'producto' },
    { name: 'brand', group: 'producto' },
    { name: 'team', group: 'producto' },
    { name: 'league', group: 'producto' },
    { name: 'season', group: 'producto' },
    { name: 'images', group: 'fotos' },
    { name: 'price', group: 'precioStock' },
    { name: 'saleMode', group: 'precioStock' },
    { name: 'variants', group: 'precioStock' },
    { name: 'editorialTags', group: 'coleccionesPublicacion' },
    { name: 'description', group: 'coleccionesPublicacion' },
    { name: 'isFeatured', group: 'coleccionesPublicacion' }
  ]
);
assert.match(imagesField.description, /4:5/);
assert.match(imagesField.description, /foto original\/de origen/);
assert.match(imagesField.description, /1600 px de alto/);
assert.match(imageAltField.description, /Camiseta Argentina titular 2026, frente completo/);
assert.match(product.fields.find((field) => field.name === 'league').description, /Opcional/);
assert.match(product.fields.find((field) => field.name === 'isFeatured').description, /No significa que sea el producto más nuevo/);
assert.match(editorialTagsField.description, /Selecciones \+ Retro/);
const saleModeValidations = [];
saleModeField.validation({
  custom(validation) {
    saleModeValidations.push(validation);
    return this;
  }
});
const validateSaleMode = (saleMode, category) =>
  saleModeValidations
    .map((validation) => validation(saleMode, { document: { category } }))
    .find((result) => result !== true) ?? true;

assert.equal(validateSaleMode(undefined, 'shirt'), true, 'Legacy shirts default to stock.');
assert.equal(validateSaleMode('stock', 'shirt'), true);
assert.equal(validateSaleMode('onRequest', 'shirt'), true);
assert.equal(validateSaleMode('onRequest', 'jacket'), true);
assert.equal(validateSaleMode('onRequest', 'shorts'), true);
assert.equal(validateSaleMode('onRequest', 'set'), true);
assert.match(validateSaleMode('invalid', 'shirt'), /En stock o A pedido/);

const variantValidations = [];
variantsField.validation({
  custom(validation) {
    variantValidations.push(validation);
    return this;
  }
});
const validateVariants = (variants, category, saleMode) =>
  variantValidations
    .map((validation) => validation(variants, { document: { category, saleMode } }))
    .find((result) => result !== true) ?? true;

assert.match(validateVariants([], 'shirt', 'stock'), /al menos un talle/);
assert.match(validateVariants(undefined, 'jacket', undefined), /al menos un talle/);
assert.equal(validateVariants([], 'shirt', 'onRequest'), true);
assert.equal(validateVariants([], 'jacket', 'onRequest'), true);
assert.match(validateVariants([{ size: 'M' }, { size: 'M' }], 'shirt', 'stock'), /duplicado/);
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
const validateEditorialTags = (editorialTags, category) =>
  editorialTagsValidation
    .map((validation) => validation(editorialTags, { document: { category } }))
    .find((result) => result !== true) ?? true;

editorialTagsField.validation(editorialTagsRule);

assert.equal(validateEditorialTags(['club'], 'shirt'), true, 'A shirt can use Clubes as its primary tag');
assert.equal(validateEditorialTags(['selection', 'retro'], 'shirt'), true, 'A shirt can use Selecciones + Retro');
assert.match(validateEditorialTags(['retro'], 'shirt'), /Clubes o Selecciones/);
assert.match(validateEditorialTags(undefined, 'shirt'), /Clubes o Selecciones/);
assert.equal(validateEditorialTags(undefined, 'jacket'), true, 'Editorial tags should remain optional for non-shirts');
assert.match(validateEditorialTags(['club', 'club'], 'shirt'), /unique/);
assert.match(
  validateEditorialTags(['club', 'invalid'], 'shirt'),
  /solo pueden ser Clubes, Selecciones o Retro/
);
assert.deepEqual(
  product.preview.prepare({
    title: 'Camiseta Argentina 2026',
    category: 'shirt',
    team: 'Argentina',
    season: '2026',
    variants: [{ stock: 2 }, { stock: 1 }]
  }),
  { title: 'Camiseta Argentina 2026', subtitle: 'Camiseta · Argentina · 2026 · 3 en stock', media: undefined }
);
assert.equal(
  product.preview.prepare({
    category: 'shirt',
    saleMode: 'onRequest',
    variants: []
  }).subtitle,
  'Camiseta · A pedido'
);
assert.equal(
  product.preview.prepare({ category: 'jacket', variants: [{ stock: -1 }] }).subtitle,
  'Campera · 0 en stock',
  'Preview should safely omit optional team and season.'
);
assert.equal(productFields.has('bundleComponents'), false, 'Products should not include bundle components');
assert.match(whatsappMessageField.description, /\{productTitle\}/);
assert.match(whatsappMessageField.description, /\{category\}/);
assert.match(whatsappMessageField.description, /\{productUrl\}/);

console.log('Sanity schemas validated.');
