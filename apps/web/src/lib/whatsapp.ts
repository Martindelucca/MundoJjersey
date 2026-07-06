interface BuildWhatsAppUrlInput {
  phoneNumber: string;
  productTitle: string;
  productUrl?: string;
}

export function normalizeWhatsAppNumber(phoneNumber: string): string {
  return phoneNumber.replace(/\D/g, '');
}

export function buildWhatsAppUrl({
  phoneNumber,
  productTitle,
  productUrl
}: BuildWhatsAppUrlInput): string {
  const normalizedPhoneNumber = normalizeWhatsAppNumber(phoneNumber);

  if (!normalizedPhoneNumber) {
    return '';
  }

  const messageLines = [
    `Hola, quiero consultar por la camiseta: ${productTitle}. ¿Sigue disponible?`
  ];

  if (productUrl) {
    messageLines.push(productUrl);
  }

  return `https://wa.me/${normalizedPhoneNumber}?text=${encodeURIComponent(messageLines.join('\n'))}`;
}
