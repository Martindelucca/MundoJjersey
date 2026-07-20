import type { ProductAvailabilityStatus } from './sanity/types';

interface BuildWhatsAppUrlInput {
  phoneNumber: string;
  productTitle: string;
  productCategory?: string;
  productUrl?: string;
  messageTemplate?: string;
  availabilityStatus: ProductAvailabilityStatus;
}

interface BuildGeneralWhatsAppUrlInput {
  phoneNumber: string;
  message?: string;
}

export function normalizeWhatsAppNumber(phoneNumber: string): string {
  return phoneNumber.replace(/\D/g, '');
}

export function buildGeneralWhatsAppUrl({
  phoneNumber,
  message = 'Hola, quiero consultar por el catálogo de Mundo JJersey. ¿Qué camisetas tienen disponibles?'
}: BuildGeneralWhatsAppUrlInput): string {
  const normalizedPhoneNumber = normalizeWhatsAppNumber(phoneNumber);

  if (!normalizedPhoneNumber) {
    return '';
  }

  return `https://wa.me/${normalizedPhoneNumber}?text=${encodeURIComponent(message)}`;
}

export function buildWhatsAppUrl({
  phoneNumber,
  productTitle,
  productCategory = 'camiseta',
  productUrl,
  messageTemplate,
  availabilityStatus
}: BuildWhatsAppUrlInput): string {
  const normalizedPhoneNumber = normalizeWhatsAppNumber(phoneNumber);

  if (!normalizedPhoneNumber) {
    return '';
  }

  const fallbackTemplate = availabilityStatus === 'inStock'
    ? 'Hola, quiero reservar {productTitle}. Quiero coordinar talle y envío.'
    : 'Hola, quiero consultar por {productTitle}. Categoría: {category}. ¿Sigue disponible para separar?';
  const template = availabilityStatus === 'onRequest'
    ? 'Hola, quiero pedir {productTitle}. Quiero consultar talle, demora y forma de reserva'
    : messageTemplate || fallbackTemplate;
  const message = template
    .replaceAll('{productTitle}', productTitle)
    .replaceAll('{category}', productCategory)
    .replaceAll('{productUrl}', productUrl || '');

  const messageLines = [message];

  if (productUrl && !template.includes('{productUrl}')) {
    messageLines.push(productUrl);
  }

  return `https://wa.me/${normalizedPhoneNumber}?text=${encodeURIComponent(messageLines.join('\n'))}`;
}
