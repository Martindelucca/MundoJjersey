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
      options: {
        source: 'title',
        isUnique: (slug, context) => context.defaultIsUnique(slug, context)
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'images',
      title: 'Imágenes',
      type: 'array',
      description: 'Subí al menos una foto clara del producto. Ideal: formato vertical 4:5, buena luz y camiseta completa.',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'Texto alternativo',
              type: 'string',
              validation: (Rule) => Rule.required()
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
      description: 'Precio final visible en el catálogo, en pesos argentinos.',
      validation: (Rule) => Rule.required().min(0)
    }),
    defineField({
      name: 'category',
      title: 'Categoría',
      type: 'string',
      options: {
        list: [
          { title: 'Camiseta', value: 'shirt' },
          { title: 'Campera', value: 'jacket' },
          { title: 'Short', value: 'shorts' },
          { title: 'Conjunto completo', value: 'set' }
        ],
        layout: 'radio'
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'editorialTags',
      title: 'Colecciones editoriales',
      type: 'array',
      description: 'Podés seleccionar más de una colección para mostrar este producto en sus rutas editoriales.',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Clubes', value: 'club' },
          { title: 'Selecciones', value: 'selection' },
          { title: 'Retro', value: 'retro' }
        ],
        layout: 'grid'
      },
      validation: (Rule) =>
        Rule.unique().custom((editorialTags) => {
          if (!editorialTags) {
            return true;
          }

          return editorialTags.every((tag) => ['club', 'selection', 'retro'].includes(tag))
            ? true
            : 'Las colecciones editoriales solo pueden ser Clubes, Selecciones o Retro.';
        })
    }),
    defineField({
      name: 'brand',
      title: 'Marca',
      type: 'string',
      description: 'Ejemplo: Adidas, Nike, Puma, Umbro.',
      validation: (Rule) => Rule.required()
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
      name: 'variants',
      title: 'Talles y stock',
      type: 'array',
      description: 'Fuente única de stock por talle para cada producto, incluidos los conjuntos completos.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'size',
              title: 'Talle',
              type: 'string',
              options: {
                list: [
                  { title: 'XS', value: 'XS' },
                  { title: 'S', value: 'S' },
                  { title: 'M', value: 'M' },
                  { title: 'L', value: 'L' },
                  { title: 'XL', value: 'XL' },
                  { title: 'XXL', value: 'XXL' }
                ]
              },
              validation: (Rule) => Rule.required()
            }),
            defineField({
              name: 'stock',
              title: 'Stock',
              type: 'number',
              initialValue: 1,
              validation: (Rule) => Rule.required().integer().min(0)
            })
          ],
          preview: {
            select: { size: 'size', stock: 'stock' },
            prepare: ({ size, stock }) => ({
              title: `${size || 'Talle'} · ${stock ?? 0} disponible${stock === 1 ? '' : 's'}`
            })
          }
        }
      ],
      validation: (Rule) =>
        Rule.required().min(1).custom((variants) => {
          if (!Array.isArray(variants)) {
            return true;
          }

          const sizes = variants.map((variant) => variant?.size).filter(Boolean);
          const duplicatedSize = sizes.find((size, index) => sizes.indexOf(size) !== index);

          return duplicatedSize ? `El talle ${duplicatedSize} está duplicado. Usá un solo registro por talle.` : true;
        })
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
      subtitle: 'category',
      media: 'images.0',
      variants: 'variants'
    },
    prepare: ({ title, subtitle, media, variants = [] }) => {
      const totalStock = Array.isArray(variants)
        ? variants.reduce((total, variant) => total + Math.max(0, variant?.stock || 0), 0)
        : 0;

      return {
        title,
        subtitle: `${subtitle || 'Producto'} · ${totalStock} en stock`,
        media
      };
    }
  }
});
