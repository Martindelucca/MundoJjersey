import assert from 'node:assert/strict';
import { buildWhatsAppUrl, normalizeWhatsAppNumber } from '../src/lib/whatsapp.ts';

assert.equal(normalizeWhatsAppNumber('+54 9 11 1234-5678'), '5491112345678');
assert.equal(normalizeWhatsAppNumber(''), '');

const url = buildWhatsAppUrl({
  phoneNumber: '+54 9 11 1234-5678',
  productTitle: 'Camiseta Boca Juniors 1998',
  productUrl: 'https://mundojjersey.com/catalogo/boca-1998'
});

assert.equal(
  url,
  'https://wa.me/5491112345678?text=Hola%2C%20quiero%20consultar%20por%20la%20camiseta%3A%20Camiseta%20Boca%20Juniors%201998.%20%C2%BFSigue%20disponible%3F%0Ahttps%3A%2F%2Fmundojjersey.com%2Fcatalogo%2Fboca-1998'
);

assert.equal(
  buildWhatsAppUrl({ phoneNumber: '', productTitle: 'Camiseta River Plate 1996' }),
  ''
);

console.log('WhatsApp helpers validated.');
