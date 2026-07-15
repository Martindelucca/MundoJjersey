import { createClient, type QueryParams } from '@sanity/client';

const projectId = import.meta.env.SANITY_PROJECT_ID;
const dataset = import.meta.env.SANITY_DATASET || 'production';
const apiVersion = import.meta.env.SANITY_API_VERSION || '2025-01-01';
const useCdn = import.meta.env.SANITY_USE_CDN !== 'false';
const readToken = import.meta.env.SANITY_READ_TOKEN;

export const hasSanityConfig = Boolean(projectId && dataset);

export const sanityClient = createClient({
  projectId: projectId || 'missing-project-id',
  dataset,
  apiVersion,
  useCdn: readToken ? false : useCdn,
  token: readToken || undefined
});

export async function fetchPublic<T>(query: string, fallback: T, params?: QueryParams): Promise<T> {
  if (!hasSanityConfig) {
    return fallback;
  }

  try {
    return params
      ? await sanityClient.fetch<T>(query, params)
      : await sanityClient.fetch<T>(query);
  } catch {
    return fallback;
  }
}
