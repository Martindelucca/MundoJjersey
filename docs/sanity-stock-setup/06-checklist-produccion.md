# Checklist De Producción

## Configuración

- [ ] `SANITY_PROJECT_ID` configurado.
- [ ] `SANITY_DATASET` configurado.
- [ ] `SANITY_STUDIO_PROJECT_ID` configurado.
- [ ] `SANITY_STUDIO_DATASET` configurado.
- [ ] `PUBLIC_SITE_URL` configurado con dominio real.
- [ ] WhatsApp configurado en Sanity o `PUBLIC_WHATSAPP_NUMBER`.
- [ ] CORS configurado en Sanity.
- [ ] Deploy Hook de Vercel creado.
- [ ] Webhook de Sanity apuntando al Deploy Hook.

## Contenido

- [ ] Existe `siteSettings` publicado.
- [ ] Existen equipos publicados.
- [ ] Hay productos publicados.
- [ ] Cada producto tiene slug.
- [ ] Cada producto tiene imagen.
- [ ] Cada imagen tiene alt text.
- [ ] Cada producto tiene precio.
- [ ] Cada producto tiene equipo.
- [ ] Cada producto tiene variants.
- [ ] No hay talles duplicados.
- [ ] El stock total refleja la tanda real.

## Validación local

```bash
npm run check
npm test
npm run build:web
npm --workspace @mundo-jjersey/web run sanity:check
npm --workspace @mundo-jjersey/web run content:check
```

## Validación visual

- [ ] `/catalogo` muestra productos reales.
- [ ] `/catalogo/camisetas` filtra camisetas.
- [ ] `/producto/[slug]` abre una ficha real.
- [ ] El botón de WhatsApp abre mensaje con la camiseta cargada.
- [ ] Si un producto no tiene stock, aparece como no disponible.
- [ ] Mobile no tiene scroll horizontal.
