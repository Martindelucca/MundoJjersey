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
- El cliente publica directamente Productos, Equipos y, si corresponde, Ligas; la configuración del sitio permanece interna.
- Las camisetas exigen en Studio una etiqueta editorial principal `club` o `selection`; `retro` puede acompañar pero no basta sola.
- La invitación como miembro Editor y la URL alojada del Studio siguen siendo acciones externas pendientes del owner.

## Archivos relevantes

- `apps/web/src/pages/index.astro`
- `apps/web/src/components/SiteHeader.astro`
- `apps/web/src/styles/global.css`
- `apps/web/scripts/validate-design.mjs`
- `apps/web/public/brand-mark.svg`
- `apps/web/fotos/HERODESKTOP.svg`
- `apps/web/fotos/ArgentinaTitular2026.jpg`
- `apps/web/fotos/actual.jpg`
- `apps/web/fotos/clubes2.jpg`
- `apps/web/fotos/retro.jpg`
- `apps/web/fotos/selecciones.jpg`
- `apps/web/fotos/nosotros.JPEG` (foto 4:3 de los amigos/fundadores de chicos para About)
- `apps/web/src/lib/seo.ts` (URLs canónicas, sitemap/robots y builders JSON-LD seguros)
- `apps/web/scripts/test-release.mjs` y `docs/release-qa.md` (validación post-build y procedimiento manual)

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
- Las tarjetas de producto son compactas y compartidas por catálogo y Home de 360–780px: dos columnas, imagen 4:5 y ticket redundante oculto; una línea compacta conserva equipo · temporada, junto con título/enlaces, precio, stock y vista previa de talles. El body mobile usa padding asimétrico `0.9rem 0.7rem 0.7rem` para separar esa primera línea de la imagen, también en relacionados; entre 320–359px el grid es de una columna.
- Con el inventario actual de 6 productos publicados no se pagina. Revisar paginación real server/static al superar 16 productos publicados; no implementar scroll infinito, productos ocultos pre-renderizados ni “load more” en cliente.
- Phase 3: `ProductCard` usa `h2` por defecto en catálogo; Home arrivals y relacionados de ficha pasan explícitamente `headingLevel="h3"`, con estilos visuales idénticos para ambos niveles, incluso en mobile compacto.
- Phase 3: relacionados excluyen el producto actual y se ordenan determinísticamente con los datos ya proyectados: mismo `team.slug` (100), misma categoría (10), cualquier `editorialTag` compartido (1); empates y candidatos sin coincidencia conservan el orden de `productsQuery` (`isFeatured desc, _createdAt desc`) y se devuelven como máximo tres.
- Phase 3: el menú mobile nativo `<details>` permanece utilizable sin JS; con JS se cierra al seguir un link y Escape cierra cualquier menú abierto desde el documento, aunque el foco esté fuera, devolviéndolo al resumen correspondiente. La imagen de ficha usa `object-fit: contain`; las imágenes de ProductCard conservan `cover`.
- Phase 3.1: la ficha no repite facts: categoría permanece en kicker y la metadata compacta solo reúne marca · equipo · temporada cuando existen. Tras talles va el CTA WhatsApp de una línea, dorado y de ancho completo con marca `↗`, seguido de la única frase de confianza y luego la descripción opcional. No hay CTA sticky/fijo.
- Phase 4: conservar solo la grilla sutil de `body::before` como textura global de escritorio (opacidad 0.08) y ocultarla en `<=780px`; no reintroducir grano global. La línea basal decorativa del header y los gradientes navy siguen siendo motivos de marca deliberados. Las superficies con borde fino (cards, ficha y CTA de catálogo) no llevan sombras amplias; la CTA final conserva el gradiente fuerte. Movimiento: botones hasta `-1px`, tarjetas hasta `-2px`, zoom de categorías `1.02`, sin skew, y descendientes transformados inmóviles con reduced motion. Home mobile usa secciones de mínimo `3.3rem` (arrivals `2.8rem`).

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
  - conserva texto sobre navy y `HERODESKTOP.svg` como franja horizontal inferior 16:9.
  - foto sin card pesada: sin radio, sin sombra, con `border-block`.
- Desktop y mobile usan `HERODESKTOP.svg` como única fuente visual: desktop es full-bleed y mobile cambia únicamente el layout.
- La revisión visual en runtime del hero unificado sigue pendiente.
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

## Phase 5 — SEO, performance and release QA

- `/sitemap.xml` y `/robots.txt` son endpoints estáticos sin dependencia de sitemap; toman el origen normalizado de `PUBLIC_SITE_URL`/Astro `site`, con fallback local solo si falta configuración. Si Sanity no está configurado o falla, sitemap mantiene rutas públicas y omite productos.
- BaseLayout publica WebSite y Organization JSON-LD con nombre, URL, logo e Instagram solo si está configurado. La serialización JSON-LD reemplaza `<` por `\\u003c`. Product JSON-LD solo se emite con URL canónica pública no local, usando precio ARS y disponibilidad derivada de stock.
- Hero usa Astro `<Image>` eager/high priority; tiles locales usan metadata lazy; cards y ficha usan `srcset`/`sizes` de Sanity. La ficha sigue `contain`; tarjetas siguen `cover`.
- `public/og.png` se generó desde `og.svg` con Sharp ya presente y se validó como PNG 1200×630; OG/Twitter lo referencian.
- `npm run ready` valida primero que `PUBLIC_SITE_URL` sea un origen público puro no local (sin credenciales, ruta, query ni hash) y después ejecuta `test:release` tras `build:web`; los consumidores runtime normalizan el origen defensivamente y exige al menos una página de producto generada desde el sitemap. `npm run build:web` local sigue soportado. La QA visual/Lighthouse/Rich Results/social sigue siendo manual en preview según `docs/release-qa.md`; no hay métricas ni resultados de navegador reclamados.
- Validado en Phase 5: `npm run check` (0 errores/advertencias/hints), web `test`, `test:content`, `test:catalog`, `test:design`, `test:seo`, live `content:check` (6 productos), `npm run build:web`, `test:release` (6 rutas de producto) y `git diff --check`. El build mantiene el warning preexistente de Vite sobre imports no usados de `@astrojs/internal-helpers/remote`.
