import imageUrlBuilder from '@sanity/image-url';
import { sanityClient } from './client';
import type { SanityImage } from './types';

const builder = imageUrlBuilder(sanityClient);

export function getImageUrl(image: SanityImage | undefined, width = 800): string {
  if (!image?.asset?._ref) {
    return '';
  }

  return builder.image(image).width(width).auto('format').fit('max').url();
}
