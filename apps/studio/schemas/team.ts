import { defineField, defineType } from 'sanity';

export const team = defineType({
  name: 'team',
  title: 'Equipo',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre',
      type: 'string',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        isUnique: (slug, context) => context.defaultIsUnique(slug, context)
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'country',
      title: 'País',
      type: 'string'
    }),
    defineField({
      name: 'badge',
      title: 'Escudo',
      type: 'image',
      options: { hotspot: true }
    })
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'country',
      media: 'badge'
    }
  }
});
