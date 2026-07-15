import { fetchPublic } from './sanity/client';
import { siteSettingsQuery } from './sanity/queries';
import type { SiteSettings } from './sanity/types';
import { buildGeneralWhatsAppUrl } from './whatsapp';

export interface SiteContact {
  settings: SiteSettings | null;
  whatsappNumber: string;
  whatsappUrl: string;
  instagramUrl: string;
}

export async function getSiteContact(): Promise<SiteContact> {
  const settings = await fetchPublic<SiteSettings | null>(siteSettingsQuery, null);
  const whatsappNumber = settings?.whatsappNumber || import.meta.env.PUBLIC_WHATSAPP_NUMBER || '';
  const instagramUrl = settings?.instagramUrl || import.meta.env.PUBLIC_INSTAGRAM_URL || '';

  return {
    settings,
    whatsappNumber,
    instagramUrl,
    whatsappUrl: buildGeneralWhatsAppUrl({ phoneNumber: whatsappNumber })
  };
}
