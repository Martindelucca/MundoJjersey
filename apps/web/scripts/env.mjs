import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const rootDir = resolve(import.meta.dirname, '../../..');

function applyEnvFile(path) {
  if (!existsSync(path)) {
    return;
  }

  const lines = readFileSync(path, 'utf8').split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) {
      continue;
    }

    const separatorIndex = trimmed.indexOf('=');
    const key = trimmed.slice(0, separatorIndex).trim();
    const rawValue = trimmed.slice(separatorIndex + 1).trim();
    const value = rawValue.replace(/^['"]|['"]$/g, '');

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

export function loadLocalEnv() {
  applyEnvFile(resolve(rootDir, '.env.local'));
  applyEnvFile(resolve(rootDir, '.env'));
}

export function getSanityEnv() {
  loadLocalEnv();

  return {
    projectId: process.env.SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID || '',
    dataset: process.env.SANITY_DATASET || process.env.SANITY_STUDIO_DATASET || 'production',
    apiVersion: process.env.SANITY_API_VERSION || '2025-01-01',
    useCdn: process.env.SANITY_USE_CDN !== 'false',
    token: process.env.SANITY_READ_TOKEN || ''
  };
}
