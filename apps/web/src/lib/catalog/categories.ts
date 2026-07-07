import type { ProductCategory } from '../sanity/types';

export interface CatalogCategory {
  value: ProductCategory;
  slug: string;
  singular: string;
  plural: string;
  title: string;
  description: string;
}

export const catalogCategories: CatalogCategory[] = [
  {
    value: 'shirt',
    slug: 'camisetas',
    singular: 'Camiseta',
    plural: 'Camisetas',
    title: 'Camisetas de fútbol',
    description: 'Camisetas nuevas de clubes y selecciones seleccionadas por identidad, diseño y uso real.'
  },
  {
    value: 'jacket',
    slug: 'camperas',
    singular: 'Campera',
    plural: 'Camperas',
    title: 'Camperas de fútbol',
    description: 'Camperas de fútbol nuevas para sumar abrigo, equipo y estética streetwear.'
  },
  {
    value: 'shorts',
    slug: 'shorts',
    singular: 'Short',
    plural: 'Shorts',
    title: 'Shorts de fútbol',
    description: 'Shorts de fútbol nuevos para completar conjuntos o usar fútbol todos los días.'
  }
];

export function getCatalogCategoryBySlug(slug: string): CatalogCategory | undefined {
  return catalogCategories.find((category) => category.slug === slug);
}

export function getCatalogCategoryByValue(value: ProductCategory): CatalogCategory | undefined {
  return catalogCategories.find((category) => category.value === value);
}

export function getProductCategoryLabel(value: ProductCategory): string {
  return getCatalogCategoryByValue(value)?.singular || 'Producto';
}
