export const productsQuery = `*[_type == "product"] | order(isFeatured desc, _createdAt desc) {
  _id,
  title,
  "slug": slug.current,
  price,
  stock,
  season,
  sizes,
  "image": images[0],
  team->{name, "slug": slug.current, country, badge},
  league->{name, "slug": slug.current, country, logo}
}`;

export const productSlugsQuery = `*[_type == "product" && defined(slug.current)] {
  "slug": slug.current
}`;

export const productBySlugQuery = `*[_type == "product" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  price,
  stock,
  season,
  sizes,
  description,
  images,
  "image": images[0],
  team->{name, "slug": slug.current, country, badge},
  league->{name, "slug": slug.current, country, logo}
}`;

export const siteSettingsQuery = `*[_type == "siteSettings"][0] {
  title,
  description,
  whatsappNumber,
  whatsappMessage,
  instagramUrl
}`;
