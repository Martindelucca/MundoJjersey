const productProjection = `
  _id,
  title,
  "slug": slug.current,
  price,
  category,
  saleMode,
  editorialTags,
  brand,
  variants[]{size, stock},
  season,
  "image": images[0],
  team->{name, "slug": slug.current, country, badge},
  league->{name, "slug": slug.current, country, logo}
`;

export const productsQuery = `*[_type == "product" && !(_id in path("drafts.**")) && defined(slug.current)] | order(isFeatured desc, _createdAt desc) {${productProjection}}`;

export const productsByCategoryQuery = `*[_type == "product" && !(_id in path("drafts.**")) && defined(slug.current) && category == $category] | order(isFeatured desc, _createdAt desc) {${productProjection}}`;

export const productsByCategoryAndEditorialTagQuery = `*[_type == "product" && !(_id in path("drafts.**")) && defined(slug.current) && category == $category && $editorialTag in editorialTags] | order(isFeatured desc, _createdAt desc) {${productProjection}}`;

export const productSlugsQuery = `*[_type == "product" && !(_id in path("drafts.**")) && defined(slug.current)] {
  "slug": slug.current
}`;

export const productBySlugQuery = `*[_type == "product" && !(_id in path("drafts.**")) && slug.current == $slug][0] {
  ${productProjection},
  description,
  images
}`;

export const siteSettingsQuery = `*[_type == "siteSettings"][0] {
  title,
  description,
  whatsappNumber,
  whatsappMessage,
  instagramUrl
}`;
