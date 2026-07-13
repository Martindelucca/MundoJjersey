import assert from 'node:assert/strict';
import { isSafeExternalUrl } from '../src/lib/site-origin.ts';

const urlFieldNames = new Set(['@id', 'url', 'logo', 'sameas', 'image']);

function assertSafeExternalUrl(value, context) {
  assert.ok(isSafeExternalUrl(value), `${context} must be an http(s) URL without a local host or credentials: ${value}`);
}

export function assertWhatsAppLinksAreSafe(html, context) {
  const hrefs = [...html.matchAll(/<a\b[^>]*\bhref\s*=\s*(["'])(.*?)\1/gi)].map((match) => match[2].replaceAll('&amp;', '&'));

  for (const href of hrefs) {
    let url;
    try {
      url = new URL(href);
    } catch {
      continue;
    }
    if (url.hostname.replace(/\.+$/, '').toLowerCase() !== 'wa.me') continue;

    const message = url.searchParams.get('text');
    if (!message) continue;
    for (const embeddedUrl of message.match(/https?:\/\/[^\s<>"']+/gi) || []) {
      assertSafeExternalUrl(embeddedUrl, `${context} WhatsApp message`);
    }
  }
}

function assertJsonLdValueIsSafe(value, key, context) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertJsonLdValueIsSafe(item, key, `${context}[${index}]`));
    return;
  }
  if (typeof value === 'string' && /^[a-z][a-z\d+.-]*:/i.test(value)) {
    assertSafeExternalUrl(value, `${context} ${key}`);
  }
}

function validateJsonLdUrls(value, context) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => validateJsonLdUrls(item, `${context}[${index}]`));
    return;
  }
  if (!value || typeof value !== 'object') return;

  for (const [key, child] of Object.entries(value)) {
    if (urlFieldNames.has(key.toLowerCase())) assertJsonLdValueIsSafe(child, key, context);
    validateJsonLdUrls(child, `${context}.${key}`);
  }
}

export function assertJsonLdScriptsAreSafe(html, context) {
  const scripts = [...html.matchAll(/<script\b[^>]*\btype\s*=\s*(["'])application\/ld\+json\1[^>]*>([\s\S]*?)<\/script>/gi)];
  for (const [index, script] of scripts.entries()) {
    let json;
    try {
      json = JSON.parse(script[2]);
    } catch (error) {
      assert.fail(`${context} JSON-LD script ${index + 1} is invalid: ${error.message}`);
    }
    validateJsonLdUrls(json, `${context} JSON-LD script ${index + 1}`);
  }
}
