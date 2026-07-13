import type { EditorialTag } from '../sanity/types';

export interface EditorialCollection {
  slug: 'clubes' | 'selecciones' | 'retro';
  editorialTag: EditorialTag;
  navigationLabel: string;
  title: string;
  description: string;
}

export const editorialCollections: EditorialCollection[] = [
  {
    slug: 'clubes',
    editorialTag: 'club',
    navigationLabel: 'Clubes',
    title: 'Camisetas de clubes',
    description: 'Camisetas de clubes seleccionadas por identidad, diseño y uso real.'
  },
  {
    slug: 'selecciones',
    editorialTag: 'selection',
    navigationLabel: 'Selecciones',
    title: 'Camisetas de selecciones',
    description: 'Camisetas de selecciones para llevar fútbol reconocible dentro y fuera de la cancha.'
  },
  {
    slug: 'retro',
    editorialTag: 'retro',
    navigationLabel: 'Retro',
    title: 'Camisetas retro',
    description: 'Camisetas retro con temporadas y diseños que siguen teniendo historia.'
  }
];

export function getEditorialCollectionBySlug(slug: string): EditorialCollection | undefined {
  return editorialCollections.find((collection) => collection.slug === slug);
}
