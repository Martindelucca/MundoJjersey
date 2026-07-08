# Configuración De Vercel

## Variables de entorno

Configurar en el proyecto web de Vercel:

```env
SANITY_PROJECT_ID=tu_project_id
SANITY_DATASET=production
SANITY_API_VERSION=2025-01-01
SANITY_USE_CDN=false
SANITY_READ_TOKEN=tu_token_si_hace_falta

PUBLIC_SITE_URL=https://tu-dominio-final.com
PUBLIC_WHATSAPP_NUMBER=549...
PUBLIC_INSTAGRAM_URL=https://instagram.com/...
PUBLIC_GA_MEASUREMENT_ID=

SANITY_STUDIO_PROJECT_ID=tu_project_id
SANITY_STUDIO_DATASET=production
```

`PUBLIC_SITE_URL` es importante porque permite que el mensaje de WhatsApp incluya el link real del producto.

## Deploy Hook

1. Entrar al proyecto en Vercel.
2. Ir a Settings.
3. Ir a Git o Deploy Hooks.
4. Crear un Deploy Hook para la rama de producción.
5. Copiar la URL generada.

## Webhook en Sanity

1. Entrar a Sanity Manage.
2. Ir a API / Webhooks.
3. Crear webhook nuevo.
4. URL: Deploy Hook de Vercel.
5. Dataset: `production`.
6. Eventos: create, update, delete.
7. Filtro recomendado:

```groq
_type in ["product", "team", "league", "siteSettings"]
```

8. Guardar.
9. Probar publicando un cambio chico en Sanity.

## Validación

Después de configurar Vercel y Sanity:

```bash
npm --workspace @mundo-jjersey/web run sanity:check
npm --workspace @mundo-jjersey/web run content:check
```
