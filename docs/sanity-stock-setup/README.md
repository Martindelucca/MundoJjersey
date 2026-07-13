# Sanity Stock Setup

Guía operativa para dejar Mundo JJersey funcionando con productos y stock cargados desde Sanity.

## Orden recomendado

1. Leer `01-que-hace-el-agente.md` para saber qué queda cubierto por código y validaciones.
2. Seguir `02-que-hace-el-dueno.md` para configurar Sanity, Vercel y credenciales.
3. Configurar Sanity con `03-configuracion-sanity.md`.
4. Configurar Vercel con `04-configuracion-vercel.md`.
5. Cargar productos siguiendo `05-como-cargar-productos.md`.
6. Para acceso y carga de productos por parte del cliente, seguir `08-guia-cliente-productos.md`.
7. Antes de publicar o compartir el sitio, pasar `06-checklist-produccion.md`.
8. Si algo falla, revisar `07-solucion-problemas.md`.

## Fuente única de stock

El stock público sale de `product.variants` en Sanity:

```txt
variants[]
  size: XS | S | M | L | XL | XXL
  stock: número entero mayor o igual a 0
```

No usar campos viejos como `stock` o `sizes`. El frontend calcula disponibilidad únicamente desde `variants`.
