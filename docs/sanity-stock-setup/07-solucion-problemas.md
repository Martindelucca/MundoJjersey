# Solución De Problemas

## No aparecen productos

Revisar:

1. Producto publicado, no solo guardado como draft.
2. `SANITY_PROJECT_ID` correcto.
3. `SANITY_DATASET` correcto.
4. Dataset con permisos públicos o `SANITY_READ_TOKEN` configurado.
5. Rebuild de Vercel ejecutado después del cambio.

Comando:

```bash
npm --workspace @mundo-jjersey/web run sanity:check
```

## El producto aparece sin stock

Revisar:

1. Campo `variants` cargado.
2. Cada variant tiene `size`.
3. Cada variant tiene `stock` mayor que 0.
4. No se está usando un campo viejo como `stock` o `sizes`.

Comando:

```bash
npm --workspace @mundo-jjersey/web run content:check
```

## El conjunto aparece sin disponibilidad

Revisar:

1. El conjunto está publicado.
2. El campo `variants` tiene el talle consultado.
3. Ese talle tiene stock mayor que 0.
4. El stock cargado representa unidades completas de campera y pantalón.

## WhatsApp no abre

Revisar:

1. `siteSettings.whatsappNumber` publicado.
2. O `PUBLIC_WHATSAPP_NUMBER` configurado.
3. Número en formato internacional, solo dígitos recomendado.

## El mensaje de WhatsApp no incluye link del producto

Revisar:

1. `PUBLIC_SITE_URL` configurado en producción.
2. No usar `localhost` como `PUBLIC_SITE_URL` en producción.
3. Si `siteSettings.whatsappMessage` está personalizado, incluir `{productUrl}` o dejar que la web agregue el link al final.

## Cambié stock y la web no actualizó

Revisar:

1. El cambio fue publicado en Sanity.
2. Existe webhook en Sanity.
3. El webhook apunta al Deploy Hook correcto de Vercel.
4. Vercel ejecutó un nuevo deploy.
5. Si `SANITY_USE_CDN=true`, puede haber demora de caché. Para builds, se recomienda `SANITY_USE_CDN=false`.

## Fallan los scripts por variables faltantes

Crear `.env.local` en la raíz del repo y completar los valores reales. Ver `.env.example`.
