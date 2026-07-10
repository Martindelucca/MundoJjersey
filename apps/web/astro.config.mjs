import { defineConfig } from 'astro/config';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv } from 'vite';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, rootDir, '');

  return {
    site: env.PUBLIC_SITE_URL || 'http://localhost:4321',
    vite: {
      envDir: rootDir
    }
  };
});
