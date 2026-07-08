import { createClient } from '@sanity/client';
import { getSanityEnv } from './env.mjs';

const { projectId, dataset, apiVersion, useCdn, token } = getSanityEnv();

if (!projectId || projectId === 'replace-me') {
  console.error('Missing SANITY_PROJECT_ID or SANITY_STUDIO_PROJECT_ID.');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: token ? false : useCdn,
  token: token || undefined
});

try {
  const [productCount, teamCount, siteSettings] = await Promise.all([
    client.fetch('count(*[_type == "product"])'),
    client.fetch('count(*[_type == "team"])'),
    client.fetch('*[_type == "siteSettings"][0]{title, whatsappNumber, instagramUrl}')
  ]);

  console.log('Sanity connection OK.');
  console.log(`Project: ${projectId}`);
  console.log(`Dataset: ${dataset}`);
  console.log(`Products: ${productCount}`);
  console.log(`Teams: ${teamCount}`);
  console.log(`Site settings: ${siteSettings ? 'found' : 'missing'}`);

  if (!siteSettings?.whatsappNumber && !process.env.PUBLIC_WHATSAPP_NUMBER) {
    console.warn('Warning: no whatsappNumber in siteSettings and no PUBLIC_WHATSAPP_NUMBER fallback.');
  }
} catch (error) {
  console.error('Sanity connection failed.');
  console.error(error.message || error);
  process.exit(1);
}
