export interface SiteOrigin {
  origin: string;
  isLocal: boolean;
}

export function parseSiteUrl(value?: string | URL): URL | undefined {
  if (!value) return undefined;

  const rawValue = value instanceof URL ? value.toString() : value;

  try {
    return new URL(rawValue);
  } catch {
    // URL requires IPv6 literals in an authority to be bracketed. Accept the
    // common unbracketed loopback spelling before letting URL normalize it.
    const bracketedLoopback = rawValue.replace(/^(https?:\/\/)(::1)(?=[:/?#]|$)/i, '$1[$2]');
    try {
      return new URL(bracketedLoopback);
    } catch {
      return undefined;
    }
  }
}

function getIpv4MappedAddress(hostname: string): number | undefined {
  const normalized = hostname.toLowerCase();
  if (!normalized.includes(':')) return undefined;

  const [head, ipv4Tail] = normalized.includes('.') ? normalized.split(/:(?=[^:]+$)/) : [normalized];
  const ipv4Octets = ipv4Tail?.split('.').map(Number);
  const ipv4Words = ipv4Octets && ipv4Octets.length === 4 && ipv4Octets.every((octet) => Number.isInteger(octet) && octet >= 0 && octet <= 255)
    ? [(ipv4Octets[0] << 8) | ipv4Octets[1], (ipv4Octets[2] << 8) | ipv4Octets[3]]
    : [];
  const halves = head.split('::');

  if (halves.length > 2) return undefined;

  const explicitWordStrings = halves.flatMap((half) => half ? half.split(':') : []);
  if (explicitWordStrings.some((word) => !/^[0-9a-f]{1,4}$/.test(word))) return undefined;
  const explicitWords = explicitWordStrings.map((word) => Number.parseInt(word, 16));

  const wordCount = explicitWords.length + ipv4Words.length;
  const words = halves.length === 2
    ? [...explicitWords.slice(0, halves[0] ? halves[0].split(':').length : 0), ...Array(8 - wordCount).fill(0), ...explicitWords.slice(halves[0] ? halves[0].split(':').length : 0), ...ipv4Words]
    : [...explicitWords, ...ipv4Words];

  if (words.length !== 8 || !words.slice(0, 5).every((word) => word === 0) || words[5] !== 0xffff) return undefined;
  return (words[6] << 16) | words[7];
}

export function isLocalHostname(hostname: string): boolean {
  const normalized = hostname.toLowerCase().replace(/^\[|\]$/g, '').replace(/\.+$/, '');
  const octets = normalized.split('.').map(Number);
  const mappedAddress = getIpv4MappedAddress(normalized);

  return normalized === 'localhost'
    || normalized.endsWith('.localhost')
    || normalized === '::1'
    || normalized === '0.0.0.0'
    || mappedAddress === 0
    || (mappedAddress !== undefined && (mappedAddress >>> 24) === 127)
    || (octets.length === 4 && octets.every((octet) => Number.isInteger(octet) && octet >= 0 && octet <= 255) && octets[0] === 127);
}

export function parseSiteOrigin(value?: string | URL): SiteOrigin | undefined {
  const url = parseSiteUrl(value);
  if (!url) return undefined;

  return {
    origin: url.origin,
    isLocal: isLocalHostname(url.hostname)
  };
}

export function isSafeExternalUrl(value?: string | URL): boolean {
  const url = parseSiteUrl(value);
  return Boolean(url
    && (url.protocol === 'http:' || url.protocol === 'https:')
    && !url.username
    && !url.password
    && !isLocalHostname(url.hostname));
}
