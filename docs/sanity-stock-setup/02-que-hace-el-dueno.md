# Qué Hace El Dueño

Estas tareas requieren acceso a Sanity, Vercel o cuentas externas.

## 1. Sanity

1. Crear o confirmar el proyecto de Sanity.
2. Crear o confirmar el dataset `production`.
3. Copiar el `projectId`.
4. Decidir si el dataset será público o privado.
5. Si el dataset es privado, crear un token de lectura.
6. Configurar CORS para localhost y el dominio final.
7. Invitar a quien cargue productos con rol `Editor`.

## 2. Variables de entorno

1. Crear `.env.local` en la raíz del repo para desarrollo local.
2. Completar los valores reales de Sanity.
3. Completar WhatsApp e Instagram.
4. Repetir esas variables en Vercel para producción.

## 3. Contenido inicial

1. Entrar a Sanity Studio.
2. Crear `Configuración interna del sitio`.
3. Cargar WhatsApp.
4. Cargar equipos.
5. Cargar productos.
6. Publicar cada documento.

## 4. Deploy automático

1. Crear proyecto en Vercel.
2. Crear Deploy Hook en Vercel.
3. Crear webhook en Sanity apuntando al Deploy Hook.
4. Probar publicando un cambio chico en Sanity.

## 5. Operación diaria

Cuando entra una camiseta:

1. Cargar producto en Sanity.
2. Cargar talle y stock en `variants`.
3. Publicar.
4. Esperar rebuild del sitio.

Cuando se separa o vende una camiseta:

1. Entrar al producto.
2. Ir a `Talles y stock`.
3. Bajar el stock del talle correspondiente.
4. Publicar.
5. Esperar rebuild del sitio.
