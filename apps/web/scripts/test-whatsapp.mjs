import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { buildGeneralWhatsAppUrl, buildWhatsAppUrl, normalizeWhatsAppNumber } from '../src/lib/whatsapp.ts';

assert.equal(normalizeWhatsAppNumber('+54 9 11 1234-5678'), '5491112345678');
assert.equal(normalizeWhatsAppNumber(''), '');

const url = buildWhatsAppUrl({
  phoneNumber: '+54 9 11 1234-5678',
  productTitle: 'Camiseta Boca Juniors 1998',
  productCategory: 'Camiseta',
  productUrl: 'https://mundojjersey.com/producto/boca-1998',
  messageTemplate: 'Hola, quiero consultar por {productTitle}.',
  availabilityStatus: 'inStock'
});

assert.equal(
  url,
  'https://wa.me/5491112345678?text=Hola%2C%20quiero%20reservar%20Camiseta%20Boca%20Juniors%201998.%20Quiero%20coordinar%20talle%20y%20env%C3%ADo.%0Ahttps%3A%2F%2Fmundojjersey.com%2Fproducto%2Fboca-1998'
);

assert.equal(
  buildWhatsAppUrl({
    phoneNumber: '+54 9 11 1234-5678',
    productTitle: 'Conjunto River 2026',
    productCategory: 'Conjunto completo',
    availabilityStatus: 'outOfStock'
  }),
  'https://wa.me/5491112345678?text=Hola%2C%20quiero%20consultar%20por%20Conjunto%20River%202026.%20Categor%C3%ADa%3A%20Conjunto%20completo.%20%C2%BFSigue%20disponible%20para%20separar%3F'
);

const templatedUrl = buildWhatsAppUrl({
  phoneNumber: '+54 9 11 1234-5678',
  productTitle: 'Campera Argentina 2022',
  productCategory: 'Campera',
  productUrl: 'https://mundojjersey.com/producto/campera-argentina-2022',
  messageTemplate: 'Hola, me interesa esta {category}: {productTitle}. Link: {productUrl}',
  availabilityStatus: 'outOfStock'
});

assert.equal(
  templatedUrl,
  'https://wa.me/5491112345678?text=Hola%2C%20me%20interesa%20esta%20Campera%3A%20Campera%20Argentina%202022.%20Link%3A%20https%3A%2F%2Fmundojjersey.com%2Fproducto%2Fcampera-argentina-2022'
);

assert.equal(
  buildWhatsAppUrl({
    phoneNumber: '',
    productTitle: 'Camiseta River Plate 1996',
    availabilityStatus: 'inStock'
  }),
  ''
);

const onRequestUrl = buildWhatsAppUrl({
  phoneNumber: '+54 9 11 1234-5678',
  productTitle: 'Camiseta Japón 2026',
  productCategory: 'Camiseta',
  productUrl: 'https://mundojjersey.com/producto/japon-2026',
  messageTemplate: 'Esta plantilla no debe usarse',
  availabilityStatus: 'onRequest'
});
assert.equal(
  decodeURIComponent(new URL(onRequestUrl).searchParams.get('text')),
  'Hola, quiero pedir Camiseta Japón 2026. Quiero consultar talle, demora y forma de reserva\nhttps://mundojjersey.com/producto/japon-2026'
);

assert.equal(
  buildGeneralWhatsAppUrl({ phoneNumber: '+54 9 11 1234-5678', message: 'Hola, quiero ver el catálogo.' }),
  'https://wa.me/5491112345678?text=Hola%2C%20quiero%20ver%20el%20cat%C3%A1logo.'
);

assert.equal(buildGeneralWhatsAppUrl({ phoneNumber: '' }), '');

const whatsappButton = await readFile(resolve(import.meta.dirname, '../src/components/WhatsAppButton.astro'), 'utf8');
assert.match(whatsappButton, /productLabel\?: string/);
assert.match(whatsappButton, /status: ProductAvailabilityStatus/);
assert.match(whatsappButton, /Pedir \$\{productLabel\} por WhatsApp/);
assert.match(whatsappButton, /Reservar \$\{productLabel\} por WhatsApp/);
assert.match(whatsappButton, /Consultar disponibilidad de \$\{productLabel\} por WhatsApp/);
assert.match(whatsappButton, /isOnRequest \? 'Pedir por WhatsApp'/);
assert.match(whatsappButton, /available \? 'Reservar por WhatsApp' : 'Consultar disponibilidad'/);
assert.match(whatsappButton, /class="whatsapp-button__mark" aria-hidden="true">↗/);
assert.match(whatsappButton, /\{href \? \(/);
assert.match(whatsappButton, /<p class="contact-unavailable">WhatsApp no está configurado todavía\.<\/p>/);
assert.doesNotMatch(whatsappButton, /whatsapp-button__hint/);

console.log('WhatsApp helpers validated.');
