/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare module '*.JPEG' {
  const image: ImageMetadata;
  export default image;
}
