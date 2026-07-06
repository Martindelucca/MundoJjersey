export interface SanityImageAssetRef {
  _ref: string;
  _type: 'reference';
}

export interface SanityImage {
  _type: 'image';
  asset?: SanityImageAssetRef;
  alt?: string;
}

export interface TeamSummary {
  name?: string;
  slug?: string;
  country?: string;
  badge?: SanityImage;
}

export interface LeagueSummary {
  name?: string;
  slug?: string;
  country?: string;
  logo?: SanityImage;
}

export interface ProductSummary {
  _id: string;
  title: string;
  slug: string;
  price: number;
  stock: number;
  season?: string;
  sizes?: string[];
  image?: SanityImage;
  team?: TeamSummary;
  league?: LeagueSummary;
}

export interface ProductDetail extends ProductSummary {
  description?: string;
  images?: SanityImage[];
}

export interface SiteSettings {
  title?: string;
  description?: string;
  whatsappNumber?: string;
  whatsappMessage?: string;
  instagramUrl?: string;
}
