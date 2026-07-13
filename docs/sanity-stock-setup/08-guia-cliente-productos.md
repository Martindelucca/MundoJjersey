# Guía para cargar productos

## Qué podés editar

Podés crear, editar y publicar `Productos`, `Equipos` y, si hace falta, `Ligas`. No edites la `Configuración interna del sitio` salvo que el equipo te lo indique: no forma parte de la carga habitual de productos.

## Acceso

El owner del proyecto debe invitarte desde **Sanity Manage > project Members** con el rol **Editor**. Luego ingresá con tu cuenta de Sanity en la URL del Studio alojado:

`[URL DEL STUDIO]`

Si todavía no existe una URL alojada, el owner debe desplegar el Studio o crear su hostname antes de que puedas acceder. Esto no se resuelve desde la carga de productos.

## Antes de subir fotos

- Usá la foto original/de origen; no una captura de pantalla ni una imagen reenviada y comprimida por WhatsApp.
- Preferí formato vertical 4:5, camiseta o producto completo y buena luz.
- Recomendado: al menos 1600 px de alto.
- Escribí un texto alternativo concreto por foto. Ejemplo: `Camiseta Argentina titular 2026, frente completo`.

No existe mejora automática de calidad: la calidad empieza con el archivo original que subís.

## Crear y publicar un producto

1. Entrá a `Productos` y elegí crear un documento nuevo.
2. En `Producto`, cargá título, slug, categoría, marca, equipo, liga si corresponde y temporada si se conoce. La liga es opcional y no se requiere para el catálogo público.
3. En `Fotos`, subí una o más fotos y completá el texto alternativo de cada una.
4. En `Precio y stock`, cargá el precio y agregá una fila por talle con su stock real. No dupliques talles.
5. En `Colecciones y publicación`, elegí las etiquetas editoriales y, si corresponde, descripción y destacado.
6. Revisá los campos cargados en el documento.
7. Elegí **Publicar**. El producto se publica directamente; no requiere aprobación interna en Studio.
8. Esperá a que termine el rebuild del sitio.
9. En el sitio público, verificá el producto, su categoría y el botón de WhatsApp.

### Etiquetas editoriales

Para camisetas, elegí siempre una clasificación principal:

- **Clubes**: camiseta de Boca, River, Barcelona, etc.
- **Selecciones**: camiseta de Argentina, Brasil, Francia, etc.
- **Retro**: puede sumarse a Clubes o Selecciones, por ejemplo `Clubes + Retro` para una camiseta retro de Liverpool.

`Retro` por sí sola no alcanza para una camiseta. En camperas, shorts y conjuntos las etiquetas son opcionales.

## Actualizar stock

1. Abrí el producto existente.
2. Entrá en la pestaña `Precio y stock`.
3. Cambiá el número de la fila del talle vendido, reservado o repuesto.
4. Elegí **Publicar**.

La publicación directa activa el rebuild habitual del sitio. Esperá a que termine antes de verificar el cambio público.

## Verificar después de publicar

1. Abrí el catálogo y la ficha del producto en el sitio: verificá fotos, precio, talles, stock y colección.
2. Probá el botón de WhatsApp: debe abrir una consulta con el producto correcto.
3. Si hay un error, corregilo en Studio y publicá de nuevo.

## Errores comunes y cómo recuperarlos

- **No deja publicar una camiseta:** agregá `Clubes` o `Selecciones`; podés sumar `Retro`, pero no usarlo solo.
- **El talle figura dos veces:** dejá una sola fila y ajustá su stock total.
- **La foto se ve mal:** reemplazala por el archivo original con buena luz; Studio no mejora fotos automáticamente.
- **El producto no aparece primero:** `Destacado` lo muestra antes que otros productos, pero no significa “más nuevo”. Revisá esa casilla y publicá otra vez.
- **El sitio todavía no refleja el cambio:** esperá el rebuild y actualizá la página; si persiste, avisá al equipo.
