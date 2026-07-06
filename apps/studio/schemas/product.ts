import { defineField, defineType } from 'sanity';

export const product = defineType({
  name: 'product',
  title: 'Producto',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'images',
      title: 'Imágenes',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'Texto alternativo',
              type: 'string'
            })
          ]
        }
      ],
      validation: (Rule) => Rule.required().min(1)
    }),
    defineField({
      name: 'price',
      title: 'Precio',
      type: 'number',
      validation: (Rule) => Rule.required().min(0)
    }),
    defineField({
      name: 'team',
      title: 'Equipo',
      type: 'reference',
      to: [{ type: 'team' }],
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'league',
      title: 'Liga',
      type: 'reference',
      to: [{ type: 'league' }]
    }),
    defineField({
      name: 'season',
      title: 'Temporada',
      type: 'string',
      description: 'Ejemplo: 1998/99, 2006 o 2024/25.'
    }),
    defineField({
      name: 'stock',
      title: 'Stock',
      type: 'number',
      initialValue: 1,
      validation: (Rule) => Rule.required().integer().min(0)
    }),
    defineField({
      name: 'sizes',
      title: 'Talles',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'S', value: 'S' },
          { title: 'M', value: 'M' },
          { title: 'L', value: 'L' },
          { title: 'XL', value: 'XL' },
          { title: 'XXL', value: 'XXL' }
        ]
      }
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'text',
      rows: 3
    }),
    defineField({
      name: 'isFeatured',
      title: 'Destacado',
      type: 'boolean',
      initialValue: false
    })
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'season',
      media: 'images.0'
    }
  }
});
