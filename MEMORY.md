# MEMORY.md

Contexto persistente para continuar el proyecto Mundo JJersey entre sesiones.

## Proyecto

Mundo JJersey es un catálogo web de camisetas de fútbol retro y actuales. No es un e-commerce completo: no hay carrito, checkout ni pagos online.

El flujo principal es:

1. Descubrir productos.
2. Ver stock real por talle desde Sanity.
3. Consultar o separar por WhatsApp desde cada ficha.

## Stack y arquitectura

- Stack: Astro + Sanity + CSS nativo.
- Monorepo:
  - `apps/web`: frontend Astro.
  - `apps/studio`: Sanity Studio.
  - `docs`: documentación de setup Sanity/Vercel.
- Sanity es la fuente real de productos, equipos, talles y stock.
- Proyecto Sanity: `ap00rp60`.
- Dataset: `production`.
- Vercel está configurado y deploya automáticamente vía webhook Sanity → Vercel.
- WhatsApp es el canal de conversión principal.

## Archivos relevantes

- `apps/web/src/pages/index.astro`
- `apps/web/src/components/SiteHeader.astro`
- `apps/web/src/styles/global.css`
- `apps/web/scripts/validate-design.mjs`
- `apps/web/public/brand-mark.svg`
- `apps/web/fotos/HERO1.jpg`
- `apps/web/fotos/ArgentinaTitular2026.jpg`
- `apps/web/fotos/actual.jpg`
- `apps/web/fotos/clubes2.jpg`
- `apps/web/fotos/retro.jpg`
- `apps/web/fotos/selecciones.jpg`
- `apps/web/fotos/nosotros.JPEG` (foto 4:3 de los amigos/fundadores de chicos para About)

## Decisiones de producto

- No agregar carrito, checkout ni pagos online salvo que se pida explícitamente.
- La conversión principal ocurre por WhatsApp.
- El CTA principal de home debe empujar al catálogo, no a una compra directa.
- En mobile la experiencia debe ser limpia, rápida y menos cargada que desktop.
- El CTA directo del header mobile se ocultó; mobile usa menú compacto.
- El hero mobile usa texto + foto horizontal inferior, no foto de fondo recortada ni camiseta lateral.
- Se eliminó el paso a paso “1. Ves la ficha / 2. Tocás WhatsApp / 3. Separás”.
- Se reemplazó “Consultar tanda” en hero por un único CTA: “Ver catálogo”.
- Todos los catálogos usan superficies compactas de exploración; no mostrar CTA genérica ni datos antes de grids. Los estados vacíos conservan recuperación por WhatsApp.
- Las colecciones de camisetas se separan de las categorías con divisor horizontal de ancho completo, nunca con franja lateral.
- Todos los catálogos, incluido `/catalogo`, usan antes del grid una cabecera compacta con título, descripción breve y navegación; no hay CTA/facts/stamp genéricos antes del grid. Los estados vacíos conservan CTA de WhatsApp.
- En mobile (`<=780px`) cada nivel de filtros es una sola fila horizontal desplazable al tacto con links de 44px; no se ocultan categorías ni se usa JS.
- En Home, `garment-routes` pasa a `<=780px` a una franja de navegación ligera con divisor, etiqueta corta y una única fila interna desplazable; los links no envuelven y miden al menos 44px. Desktop conserva su tarjeta actual.
- Las tarjetas de producto son compactas y compartidas por catálogo y Home de 360–780px: dos columnas, imagen 4:5 y ticket redundante oculto; una línea compacta conserva equipo · temporada, junto con título/enlaces, precio, stock y vista previa de talles. Entre 320–359px el grid es de una columna.
- Con el inventario actual de 6 productos publicados no se pagina. Revisar paginación real server/static al superar 16 productos publicados; no implementar scroll infinito, productos ocultos pre-renderizados ni “load more” en cliente.

## Estado visual actual

### Header/navbar

- `brand-mark.svg` reemplaza el PNG grande del logo en navbar.
- Desktop muestra:
  - Logo + “Mundo JJersey” / “Camisetas seleccionadas”
  - “Nuevos ingresos”
  - “Contacto”
  - “Ver catálogo”
- Mobile muestra:
  - Logo + “Mundo JJersey”
  - botón “Menú”
- Mobile usa `<details class="site-header__menu">`.
- El menú contiene:
  - Ver catálogo
  - Nuevos ingresos
  - Contacto
  - Sobre nosotros
- Se agregó `id="sobre-nosotros"` a la sección about.
- El botón Menú fue reducido y centrado visualmente.
- About usa `nosotros.JPEG` como evidencia de marca, no como hero; conserva la imagen completa en proporción 4:3, con carga diferida y dimensiones intrínsecas de Astro.
- No agregar un bloque de confianza separado: las objeciones se resuelven únicamente en el FAQ. Mantener el concepto `líneas Premium` en About.
- About debe conservar exactamente tres párrafos aprobados sobre amistad y selección actual/retro de colección, modelos en stock y pedidos, y `líneas Premium` con revisión de cada camiseta antes de sumarla al catálogo.

### Hero home

- H1 actual: “Fútbol para vestir todos los días.”
- Subcopy actual: “Camisetas seleccionadas por club, selección y temporada. Stock real por talle y consulta directa desde cada ficha.”
- CTA único: “Ver catálogo”.
- Mobile:
  - no usa `HERO1.jpg` como fondo.
  - usa `HERO1.jpg` como franja horizontal inferior.
  - foto sin card pesada: sin radio, sin sombra, con `border-block`.
- Desktop mantiene `HERO1.jpg` full-bleed como fondo.
- Se eliminó `buying-flow`.

## Criterios de diseño

- Público: joven, futbolero, compra por Instagram/WhatsApp.
- Marca: streetwear futbolero argentino, catálogo curado, no marketplace.
- Lectura visual actual: consumer catalog landing para compradores jóvenes de fútbol, con lenguaje de drop/streetwear, CSS nativo, paleta oscura, imágenes reales y navegación táctil compacta.

Preferir:

- Producto visible.
- Navy + dorado.
- Tipografía bold/condensada.
- Imágenes reales.
- Navegación mobile limpia.
- CTA contextual en ficha/producto.
- Hero con H1 fuerte y subcopy breve.

Evitar:

- Estética SaaS.
- Glassmorphism genérico.
- WooCommerce/marketplace.
- Pelotas, césped o escudos falsos.
- CTAs duplicadas o invasivas.
- Exceso de explicación.
- Cards innecesarias.
- “Tanda” como copy principal si suena forzado.

## Criterios de código

- Cambios quirúrgicos.
- CSS nativo, sin Tailwind/React/JS pesado.
- No agregar librerías salvo pedido explícito.
- Mantener accesibilidad:
  - foco visible.
  - tap targets razonables.
  - contraste.
  - `prefers-reduced-motion`.
- Validar siempre antes de dar por cerrado:
  - `npm run check`
  - `npm --workspace @mundo-jjersey/web run test:design`
  - `npm run build:web`

## No commitear

- `.env.local`
- `apps/web/.env.local`
- `apps/studio/.env.local`
- `.impeccable/`

## Últimas validaciones conocidas OK

- `npm run check`
- `npm --workspace @mundo-jjersey/web run test:design`
- `npm run build:web`

## Commits ya hechos y pusheados

- `2b5652b feat: add Sanity stock workflow`
- `af7f6d3 chore: refresh storefront visuals`
- `5e4f9a2 chore: refine storefront navigation`

## Skills/guidance aplicada

- `impeccable`
- `design-taste-frontend`
- `high-end-visual-design`
