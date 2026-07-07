interface BuildWhatsAppUrlInput {
  phoneNumber: string;
  productTitle: string;
  productCategory?: string;
  productUrl?: string;
  messageTemplate?: string;
}

export function normalizeWhatsAppNumber(phoneNumber: string): string {
  return phoneNumber.replace(/\D/g, '');
}

export function buildWhatsAppUrl({
  phoneNumber,
  productTitle,
  productCategory = 'camiseta',
  productUrl,
  messageTemplate
}: BuildWhatsAppUrlInput): string {
  const normalizedPhoneNumber = normalizeWhatsAppNumber(phoneNumber);

  if (!normalizedPhoneNumber) {
    return '';
  }

  const fallbackTemplate = 'Hola, quiero consultar por la {category}: {productTitle}. ¿Sigue disponible?';
  const template = messageTemplate || fallbackTemplate;
  const message = template
    .replaceAll('{productTitle}', productTitle)
    .replaceAll('{category}', productCategory)
    .replaceAll('{productUrl}', productUrl || '');

  const messageLines = [message];

  if (productUrl && !messageTemplate?.includes('{productUrl}')) {
    messageLines.push(productUrl);
  }

  return `https://wa.me/${normalizedPhoneNumber}?text=${encodeURIComponent(messageLines.join('\n'))}`;
}
