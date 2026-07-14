import type { SanityImage } from './types';

export function getProductImages(images?: SanityImage[], image?: SanityImage): SanityImage[] {
  const seenAssetRefs = new Set<string>();
  const validImages = (images || []).filter((candidate) => {
    const assetRef = candidate?.asset?._ref;
    if (!assetRef || seenAssetRefs.has(assetRef)) {
      return false;
    }

    seenAssetRefs.add(assetRef);
    return true;
  });

  return validImages.length > 0 ? validImages : (image?.asset?._ref ? [image] : []);
}
