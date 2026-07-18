import { defineField, defineType } from 'sanity';

export const product = defineType({
  name: 'product',
  title: 'Producto',
  type: 'document',
  groups: [
    { name: 'producto', title: 'Producto', default: true },
    { name: 'fotos', title: 'Fotos' },
    { name: 'precioStock', title: 'Precio y stock' },
    { name: 'coleccionesPublicacion', title: 'Colecciones y publicación' }
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      group: 'producto',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'producto',
      options: {
        source: 'title',
        isUnique: (slug, context) => context.defaultIsUnique(slug, context)
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'category',
      title: 'Categoría',
      type: 'string',
      group: 'producto',
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
      name: 'brand',
      title: 'Marca',
      type: 'string',
      group: 'producto',
      description: 'Ejemplo: Adidas, Nike, Puma, Umbro.',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'team',
      title: 'Equipo',
      type: 'reference',
      group: 'producto',
      to: [{ type: 'team' }],
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'league',
      title: 'Liga',
      type: 'reference',
      group: 'producto',
      description: 'Opcional. No es necesaria para que el producto se publique en el catálogo público.',
      to: [{ type: 'league' }]
    }),
    defineField({
      name: 'season',
      title: 'Temporada',
      type: 'string',
      group: 'producto',
      description: 'Ejemplo: 1998/99, 2006 o 2024/25.'
    }),
    defineField({
      name: 'images',
      title: 'Fotos',
      type: 'array',
      group: 'fotos',
      description: 'Preferí formato vertical 4:5, producto completo y buena luz. Usá la foto original/de origen, no una captura ni una imagen comprimida por WhatsApp. Recomendado: al menos 1600 px de alto.',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'Texto alternativo',
              type: 'string',
              description: 'Describí producto, equipo, temporada y vista. Ejemplo: “Camiseta Argentina titular 2026, frente completo”.',
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
      group: 'precioStock',
      description: 'Precio final visible en el catálogo, en pesos argentinos.',
      validation: (Rule) => Rule.required().min(0)
    }),
    defineField({
      name: 'saleMode',
      title: 'Modalidad de venta',
      type: 'string',
      group: 'precioStock',
      description: 'Elegí si el producto tiene stock inmediato o se consigue a pedido.',
      initialValue: 'stock',
      options: {
        list: [
          { title: 'En stock', value: 'stock' },
          { title: 'A pedido', value: 'onRequest' }
        ],
        layout: 'radio'
      },
      validation: (Rule) =>
        Rule.custom((saleMode) => {
          if (saleMode !== undefined && !['stock', 'onRequest'].includes(saleMode)) {
            return 'La modalidad de venta debe ser En stock o A pedido.';
          }

          return true;
        })
    }),
    defineField({
      name: 'variants',
      title: 'Talles y stock',
      type: 'array',
      group: 'precioStock',
      hidden: ({ document }) => document?.saleMode === 'onRequest',
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
        Rule.custom((variants, context) => {
          if (context.document?.saleMode === 'onRequest') {
            return true;
          }

          if (!Array.isArray(variants) || variants.length === 0) {
            return 'Agregá al menos un talle con stock.';
          }

          const sizes = variants.map((variant) => variant?.size).filter(Boolean);
          const duplicatedSize = sizes.find((size, index) => sizes.indexOf(size) !== index);

          return duplicatedSize ? `El talle ${duplicatedSize} está duplicado. Usá un solo registro por talle.` : true;
        })
    }),
    defineField({
      name: 'editorialTags',
      title: 'Colecciones editoriales',
      type: 'array',
      group: 'coleccionesPublicacion',
      description: 'Para camisetas elegí Clubes o Selecciones como clasificación principal; Retro puede acompañar a cualquiera de ellas. Ejemplos: Clubes, Selecciones + Retro. En otros productos es opcional.',
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
        Rule.unique().custom((editorialTags, context) => {
          if (editorialTags && !editorialTags.every((tag) => ['club', 'selection', 'retro'].includes(tag))) {
            return 'Las colecciones editoriales solo pueden ser Clubes, Selecciones o Retro.';
          }

          if (context.document?.category === 'shirt' && !editorialTags?.some((tag) => tag === 'club' || tag === 'selection')) {
            return 'Para una camiseta seleccioná Clubes o Selecciones. Retro puede acompañar, pero no clasifica por sí solo.';
          }

          return true;
        })
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'text',
      group: 'coleccionesPublicacion',
      rows: 3
    }),
    defineField({
      name: 'isFeatured',
      title: 'Destacado',
      type: 'boolean',
      group: 'coleccionesPublicacion',
      description: 'Aparece antes que otros productos en el catálogo y en Inicio. No significa que sea el producto más nuevo.',
      initialValue: false
    })
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
      team: 'team.name',
      season: 'season',
      media: 'images.0',
      saleMode: 'saleMode',
      variants: 'variants'
    },
    prepare: ({ title, category, team, season, media, saleMode, variants = [] }) => {
      const totalStock = Array.isArray(variants)
        ? variants.reduce((total, variant) => total + Math.max(0, variant?.stock || 0), 0)
        : 0;
      const categoryTitle = {
        shirt: 'Camiseta',
        jacket: 'Campera',
        shorts: 'Short',
        set: 'Conjunto completo'
      }[category] || 'Producto';

      return {
        title,
        subtitle: [
          categoryTitle,
          team,
          season,
          saleMode === 'onRequest' ? 'A pedido' : `${totalStock} en stock`
        ].filter(Boolean).join(' · '),
        media
      };
    }
  }
});
