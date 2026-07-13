import assert from 'node:assert/strict';
import { validateContentReadiness } from './check-content-readiness.mjs';

const baseProduct = {
  _id: 'shirt-1',
  title: 'Camiseta de prueba',
  slug: 'camiseta-de-prueba',
  price: 100,
  category: 'shirt',
  brand: 'Marca',
  images: [{ alt: 'Camiseta de prueba', asset: {} }],
  variants: [{ size: 'M', stock: 1 }],
  team: { _id: 'team-1', name: 'Equipo' }
};

function validate(products, { siteSettings = { whatsappNumber: '5491100000000' }, fallbackWhatsappNumber = '' } = {}) {
  return validateContentReadiness({
    products,
    siteSettings,
    fallbackWhatsappNumber
  });
}

const validProducts = [
  { ...baseProduct, editorialTags: ['club', 'retro'] },
  { ...baseProduct, _id: 'shirt-2', title: 'Selección', slug: 'seleccion', editorialTags: ['selection'] }
];

assert.deepEqual(validate(validProducts).failures, []);

const cases = [
  {
    name: 'warns when the product catalog is empty without collection failures',
    products: [],
    warning: 'No products found. The site will build, but catalog pages will be empty.',
    noFailures: true
  },
  {
    name: 'requires a title',
    products: [{ ...validProducts[0], title: '' }, validProducts[1]],
    failure: 'shirt-1: missing title.'
  },
  {
    name: 'requires a slug',
    products: [{ ...validProducts[0], slug: '' }, validProducts[1]],
    failure: 'Camiseta de prueba: missing slug.'
  },
  {
    name: 'requires a numeric price',
    products: [{ ...validProducts[0], price: '100' }, validProducts[1]],
    failure: 'Camiseta de prueba: missing numeric price.'
  },
  {
    name: 'rejects invalid categories',
    products: [{ ...validProducts[0], category: 'invalid' }, validProducts[1]],
    failure: 'Camiseta de prueba: invalid category.'
  },
  {
    name: 'requires a brand',
    products: [{ ...validProducts[0], brand: '' }, validProducts[1]],
    failure: 'Camiseta de prueba: missing brand.'
  },
  {
    name: 'requires a product image',
    products: [{ ...validProducts[0], images: [] }, validProducts[1]],
    failure: 'Camiseta de prueba: missing product image.'
  },
  {
    name: 'rejects duplicated sizes',
    products: [{ ...validProducts[0], variants: [{ size: 'M', stock: 1 }, { size: 'M', stock: 1 }] }, validProducts[1]],
    failure: 'Camiseta de prueba: duplicated size M.'
  },
  {
    name: 'warns when total stock is zero',
    products: [{ ...validProducts[0], variants: [{ size: 'M', stock: 0 }] }, validProducts[1]],
    warning: 'Camiseta de prueba: total stock is 0, product will appear unavailable.',
    noFailures: true
  },
  {
    name: 'requires a club or selection tag for shirts',
    products: [{ ...validProducts[0], editorialTags: ['retro'] }, validProducts[1]],
    failure: 'Camiseta de prueba: shirts require a club or selection editorial tag.'
  },
  {
    name: 'rejects duplicated editorial tags',
    products: [{ ...validProducts[0], editorialTags: ['club', 'club'] }, validProducts[1]],
    failure: 'Camiseta de prueba: duplicated editorial tag club.'
  },
  {
    name: 'rejects invalid editorial tags',
    products: [{ ...validProducts[0], editorialTags: ['club', 'invalid'] }, validProducts[1]],
    failure: 'Camiseta de prueba: editorialTags contains an invalid tag.'
  },
  {
    name: 'requires editorial tags to be an array',
    products: [
      ...validProducts,
      { ...baseProduct, _id: 'jacket-1', title: 'Campera', slug: 'campera', category: 'jacket', editorialTags: 'club' }
    ],
    failure: 'Campera: editorialTags must be an array.'
  },
  {
    name: 'requires the club public collection to have products',
    products: [{ ...validProducts[0], editorialTags: ['selection', 'retro'] }, validProducts[1]],
    failure: 'Public shirt collection club has no products.'
  },
  {
    name: 'requires the selection public collection to have products',
    products: [{ ...validProducts[0], editorialTags: ['club', 'retro'] }, { ...validProducts[1], editorialTags: ['club'] }],
    failure: 'Public shirt collection selection has no products.'
  },
  {
    name: 'requires the retro public collection to have products',
    products: [{ ...validProducts[0], editorialTags: ['club'] }, validProducts[1]],
    failure: 'Public shirt collection retro has no products.'
  },
  {
    name: 'requires alt text for every image',
    products: [{ ...validProducts[0], images: [{ alt: '', asset: {} }] }, validProducts[1]],
    failure: 'Camiseta de prueba: every image needs alt text.'
  },
  {
    name: 'requires variants',
    products: [{ ...validProducts[0], variants: [] }, validProducts[1]],
    failure: 'Camiseta de prueba: missing variants for size and stock.'
  },
  {
    name: 'requires complete variants',
    products: [{ ...validProducts[0], variants: [{ size: '', stock: '1' }] }, validProducts[1]],
    failure: 'Camiseta de prueba: every variant needs size and numeric stock.'
  },
  {
    name: 'requires a team reference',
    products: [{ ...validProducts[0], team: null }, validProducts[1]],
    failure: 'Camiseta de prueba: missing team reference.'
  },
  {
    name: 'requires WhatsApp',
    products: validProducts,
    options: { siteSettings: {}, fallbackWhatsappNumber: '' },
    failure: 'Missing WhatsApp number in siteSettings and PUBLIC_WHATSAPP_NUMBER.'
  }
];

for (const { name, products, options, failure, warning, noFailures } of cases) {
  const result = validate(products, options);

  if (failure) assert.ok(result.failures.includes(failure), name);
  if (warning) assert.ok(result.warnings.includes(warning), name);
  if (noFailures) assert.deepEqual(result.failures, [], name);
}

console.log('Content readiness validation validated.');
