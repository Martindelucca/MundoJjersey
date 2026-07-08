# Configuración De Sanity

## Proyecto y dataset

1. Entrar a Sanity Manage.
2. Crear o abrir el proyecto de Mundo JJersey.
3. Confirmar que exista el dataset `production`.
4. Copiar el `projectId`.

## Variables necesarias

En `.env.local` y en Vercel:

```env
SANITY_PROJECT_ID=tu_project_id
SANITY_DATASET=production
SANITY_API_VERSION=2025-01-01
SANITY_USE_CDN=false
SANITY_READ_TOKEN=

SANITY_STUDIO_PROJECT_ID=tu_project_id
SANITY_STUDIO_DATASET=production
```

Si el dataset es privado, completar `SANITY_READ_TOKEN` con un token de lectura.

## CORS

Agregar orígenes permitidos:

```txt
http://localhost:4321
https://tu-dominio-final.com
```

Si el Studio queda deployado en otro dominio, agregarlo también.

## Usuarios

Para carga de productos, usar rol `Editor`. Evitar `Administrator` salvo para quien maneje configuración del proyecto.

## Documento de configuración del sitio

En Sanity Studio:

1. Abrir `Configuración del sitio`.
2. Completar título y descripción.
3. Completar `Número de WhatsApp` en formato internacional, por ejemplo `5491112345678`.
4. Opcional: completar Instagram.
5. Publicar.

El campo `Mensaje base de WhatsApp` acepta:

```txt
{productTitle}
{category}
{productUrl}
```

Si queda vacío, la web usa un mensaje automático.
