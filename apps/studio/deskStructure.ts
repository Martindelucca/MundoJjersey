import type { StructureResolver } from 'sanity/structure';

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Contenido')
    .items([
      S.documentTypeListItem('product').title('Productos'),
      S.documentTypeListItem('team').title('Equipos'),
      S.documentTypeListItem('league').title('Ligas'),
      S.divider(),
      S.listItem()
        .title('Configuración del sitio')
        .schemaType('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings'))
    ]);
