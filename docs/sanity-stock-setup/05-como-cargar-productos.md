# Cómo Cargar Productos Y Stock

## Antes de cargar productos

Crear primero los equipos en Sanity, porque cada producto requiere un equipo.

## Cargar equipo

1. Ir a `Equipos`.
2. Crear documento nuevo.
3. Completar `Nombre`.
4. Generar `Slug`.
5. Completar país si aplica.
6. Escudo opcional.
7. Publicar.

## Cargar producto

1. Ir a `Productos`.
2. Crear documento nuevo.
3. En la pestaña `Producto`, completar `Título`, generar `Slug`, elegir `Categoría`, completar `Marca`, seleccionar `Equipo`, completar `Liga` si aplica y `Temporada` si se conoce. La liga es opcional.
4. En `Fotos`, subir al menos una foto original clara, vertical 4:5, con el producto completo y buena luz. Evitar capturas y fotos comprimidas por WhatsApp; se recomiendan al menos 1600 px de alto.
5. Completar `Texto alternativo` de cada imagen, por ejemplo: `Camiseta Argentina titular 2026, frente completo`.
6. En `Precio y stock`, completar `Precio` y cargar `Talles y stock` para cada producto, incluidos los conjuntos completos.
7. En `Colecciones y publicación`, para cada camiseta elegir `Clubes` o `Selecciones`; `Retro` puede acompañar a cualquiera de esas opciones. Para otros productos las colecciones son opcionales.
8. Completar la descripción si hace falta.
9. Marcar `Destacado` solo si debe aparecer antes que otros productos en catálogo e Inicio; no indica que sea el más nuevo.
10. Publicar.

## Cargar stock por talle

En `Talles y stock`, crear un registro por talle:

```txt
Talle: M
Stock: 1
```

Reglas:

- No duplicar talles dentro del mismo producto.
- Si hay dos unidades talle M, usar `Stock: 2`.
- Si se vendió o separó la última unidad, dejar `Stock: 0`.
- No borrar el talle si querés mostrar que existió pero está sin stock.

## Actualizar stock

1. Abrir producto.
2. Ir a `Talles y stock`.
3. Cambiar el número de stock.
4. Publicar.
5. Esperar rebuild del sitio.

## Cargar un conjunto

1. Crear el producto de categoría `Conjunto completo`.
2. Usar un título que identifique el equipo y la temporada.
3. Subir una foto donde se vean las dos prendas completas.
4. Cargar el precio del conjunto.
5. Cargar `Talles y stock` propios del conjunto.

El conjunto aparece disponible según su stock propio. Si se vende un conjunto talle M, bajar el stock M del producto conjunto antes de publicar. Las camperas sueltas y los conjuntos se cargan como inventario independiente.

## Link de WhatsApp por producto

Cada ficha de producto tiene un botón de WhatsApp. El mensaje sale con el producto cargado automáticamente.

La ficha de un conjunto usa el mismo mensaje de consulta que los demás productos. La disponibilidad siempre se confirma por WhatsApp antes de separar.

Para que incluya link real del producto, `PUBLIC_SITE_URL` debe estar configurado con el dominio final.
