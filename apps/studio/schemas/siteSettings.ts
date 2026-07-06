import { defineField, defineType } from 'sanity';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Configuración del sitio',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título del sitio',
      type: 'string',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'text',
      rows: 3
    }),
    defineField({
      name: 'whatsappNumber',
      title: 'Número de WhatsApp',
      type: 'string',
      description: 'Usar formato internacional sin signos. Ejemplo: 5491112345678.',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'whatsappMessage',
      title: 'Mensaje base de WhatsApp',
      type: 'text',
      rows: 2
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Instagram',
      type: 'url'
    })
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'whatsappNumber'
    }
  }
});
