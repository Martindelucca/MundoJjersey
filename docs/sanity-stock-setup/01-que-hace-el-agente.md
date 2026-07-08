# Qué Hace El Agente

Estas tareas quedan del lado del repo y las puede ejecutar el agente.

## Ya implementado

- Schema de producto con `variants` como fuente única de stock.
- Validación para evitar talles duplicados dentro de un producto.
- Preview de producto en Studio con stock total.
- Mensaje base de WhatsApp documentado con placeholders.
- Script `sanity:check` para validar conexión con Sanity.
- Script `content:check` para validar que el contenido esté listo para producción.
- Scripts `ready` para correr validaciones técnicas y de contenido.
- Documentación paso a paso para configuración y carga de stock.

## Comandos útiles

Desde la raíz del repo:

```bash
npm run check
npm test
npm run build:web
npm --workspace @mundo-jjersey/web run sanity:check
npm --workspace @mundo-jjersey/web run content:check
```

Cuando ya existan variables reales de Sanity, también podés correr:

```bash
npm run ready
```

## Qué puede revisar el agente después

- Si la web está leyendo productos reales.
- Si hay productos publicados con errores de carga.
- Si los links de WhatsApp incluyen producto y URL.
- Si el build está listo para producción.
- Si la documentación necesita ajustes según el dominio final.
