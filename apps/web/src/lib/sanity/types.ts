export interface SanityImageAssetRef {
  _ref: string;
  _type: 'reference';
}

export interface SanityImage {
  _type: 'image';
  asset?: SanityImageAssetRef;
  alt?: string;
}

export type ProductCategory = 'shirt' | 'jacket' | 'shorts';

export interface ProductVariant {
  size: string;
  stock: number;
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
  category: ProductCategory;
  brand: string;
  variants?: ProductVariant[];
  season?: string;
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
