# TP frontend de librería — Programación III

**Materia:** Programación III — Tecnicatura Universitaria en Programación a Distancia
**Unidad:** HTML, CSS y JavaScript — Repaso para el parcial 1
**Revisor de la unidad:** Prof. Matías Torres
**Fecha de esta entrega:** 20/10/2026

## Integrantes

- **Apellido, Nombre: Oviedo, Thiago** — Legajo: [54137]
- **Apellido, Nombre: Chacon, Facundo**  — Legajo: [53919]
- **Apellido, Nombre: Monardez, Maximo**  — Legajo: [53907]
- **Apellido, Nombre: Guillot, Tiago**  — Legajo: [53859]
- **Apellido, Nombre: Mendez, Joaquin**  — Legajo: [54089]
- **Apellido, Nombre: Ruiz, Matias**  — Legajo: [53956]

## Cómo abrir el proyecto (sin npm)

1. Copiar esta carpeta a cualquier ubicación (por ejemplo, el Escritorio).
2. Abrir `index.html` con doble clic: se abre directamente en el navegador predeterminado.
3. No hay dependencias instaladas, `node_modules`, bundlers ni pasos de compilación. Solo se necesita un navegador moderno.

## Navegación entre vistas

`index.html` contiene las cinco vistas como secciones semánticas (`<section>`) con navegación por el menú superior (`<nav>`):

| Vista | Contenido |
|---|---|
| Catálogo | Título de la librería, buscador por título y tarjetas de libros (título, ISBN, editorial, género, autores, precio). Sin género muestra «Sin clasificar». |
| Libros | Formulario de alta y tabla de libros registrados. |
| Clientes | Formulario de alta y tabla de clientes registrados. |
| Ventas | Selección de cliente, alta de renglones, tabla editable de renglones, total y confirmación/cancelación. |
| Historial | Tabla de ventas confirmadas con detalle de renglones. |

Las vistas se muestran/ocultan con JavaScript; el menú marca la vista activa y actualiza los listados al entrar.

## Funcionalidades implementadas

- **Ejercicio 1 — HTML:** encabezado, navegación y contenido con etiquetas semánticas; etiqueta asociada a cada campo; botones con texto que describe la acción; tablas con `caption` y encabezados; mensajes de listas vacías, búsquedas sin resultados y operaciones correctas o rechazadas.
- **Ejercicio 2 — CSS:** identidad visual propia (colores, tipografía, tarjetas, formularios y botones) en `css/estilos.css`, con clases reutilizables; Flexbox (navegación, formularios, resumen) y Grid (catálogo); diseño comprobado a 320 px y 1280 px; tablas con desplazamiento interno propio; foco visible; errores expresados en texto (no solo color).
- **Ejercicio 3 — Datos y catálogo:** arrays con identificadores estables (6 libros, 2 editoriales, 2 géneros, 3 autores, 3 clientes ficticios); catálogo generado desde el array de libros; filtro por título sin distinguir mayúsculas, con coincidencia parcial y espacios recortados; eventos y funciones con responsabilidades reconocibles; datos de usuarios insertados como texto (`textContent`).
- **Ejercicio 4 — Altas:** alta de libros con selectores generados desde los datos locales (editorial, género con «Sin clasificar», autores en selector múltiple) y validaciones (título/ISBN no vacíos, ISBN único comparado sin espacios ni guiones, precio numérico > 0, editorial/género/autores existentes, al menos un autor); alta de clientes (nombre y email no vacíos, formato de email válido, email único comparado sin espacios exteriores ni mayúsculas); `preventDefault`, errores cerca del formulario, listados y opciones que se actualizan sin recargar.
- **Ejercicio 5 — Ventas:** cliente existente, renglones con cantidad entera > 0, libros repetidos rechazados con mensaje, cantidades editables y renglones quitables antes de confirmar; subtotales y total con dos decimales; confirmación bloqueada sin cliente, sin renglones o con cantidades inválidas; al confirmar se guardan identificador, fecha, cliente, renglones y total, **copiando el precio unitario al renglón como valor histórico**; historial con detalle; la confirmación limpia el formulario y muestra mensaje de resultado; las ventas no se editan ni eliminan.
- **Ejercicio 6 — Persistencia:** `localStorage` con la clave `tp_libreria_estado` para libros, clientes y ventas; primer inicio con ejemplos y recuperación sin duplicar; README con funcionamiento, límites y resultados de las pruebas.

## Funcionalidades pendientes

Dentro del alcance del TPI **no quedan pendientes**. Quedan fuera de alcance (no exigido por la consigna):

- Editar o eliminar libros, clientes y ventas.
- Altas/bajas/modificaciones de editoriales, géneros y autores.
- Inicio de sesión real, API, base de datos, servidor o conexión con el backend.
- Gestión de stock, cobros, facturación fiscal ni envío de emails (el email solo se valida con expresión regular).

## Ubicación de los datos iniciales

- **`js/datos.js`** — constante `DATOS_INICIALES` con editoriales, géneros, autores, libros y clientes ficticios. Todo se relaciona por `id` (`editorialId`, `generoId`, `autorIds`, `editorialId`/`clienteId` en ventas).
- Editoriales, géneros y autores **no se persisten**: siempre se leen de `js/datos.js`. Solo se guardan en `localStorage` libros, clientes y ventas.

## Funcionamiento y límites de `localStorage`

- **Clave:** `tp_libreria_estado`; **estructura guardada:** `{ "libros": [...], "clientes": [...], "ventas": [...] }` (JSON plano). Ubicación para la comprobación guiada: herramientas del navegador → Almacenamiento → LocalStorage → `file:///.../TP-Libreria/index.html`.
- **Primer inicio:** si la clave no existe, se siembran los ejemplos de `js/datos.js` y se guardan. **Al reabrir:** si la clave existe, se recuperan los registros guardados sin duplicar los datos iniciales. Si el JSON está corrupto, se vuelve a cargar el estado inicial.
- **Límites (como exige la consigna):** el almacenamiento depende del navegador, del perfil de usuario y de la ubicación desde la que se abre el archivo; no comparte información entre usuarios ni entre dispositivos; borrar los datos del navegador elimina libros, clientes y ventas; no ofrece seguridad ni integridad garantizada por un servidor.
- Las ventas confirmadas nunca se reescriben: el precio unitario vive dentro del renglón de la venta, no se lee del catálogo al consultar el historial.

## Resultados de los casos manuales

Ejecutados el **20/10/2026**. Método: (a) `pruebas/test-logica.js` en Node sin dependencias; (b) simulación completa de la interfaz con DOM real (jsdom) incluyendo recargas y una copia de prueba con el precio de catálogo modificado; (c) Edge headless para mediciones de layout a 320/1280 px y recorrido real por teclado (Tab/Shift+Tab) vía protocolo DevTools. No se realizó una pasada manual humana en navegador de escritorio: todo lo siguiente se observó mediante esas ejecuciones automáticas.

| Caso | Resultado esperado | Resultado observado |
|---|---|---|
| Búsqueda con parte del título en mayúsculas; luego vacía y texto inexistente | Coincidencias sin distinguir mayúsculas; catálogo completo; mensaje sin resultados | **Pasa.** «CIEN AÑOS» y « cien » listan 1 libro; vacía lista los 6 (mensaje «Catálogo completo: 6»); «zzzz» no lista tarjetas y muestra «No se encontraron libros que coincidan con la búsqueda». |
| Alta de libro con ISBN existente y luego con ISBN nuevo | El duplicado se rechaza; el válido aparece en catálogo y selección de venta | **Pasa.** ISBN existente escrito con espacios («978 84 376 0421 8») → error «Ya existe un libro con ese ISBN» y el listado queda en 6; ISBN nuevo → alta correcta, listado en 7, catálogo en 7 y el selector de libros de Ventas pasa a 7 opciones + placeholder, todo sin recargar. |
| Alta de cliente con email inválido, email existente en mayúsculas y email nuevo | Se rechazan los dos primeros; el nuevo aparece en listado y selección | **Pasa.** «no-es-un-email» → error de formato; « LUCIA.FERNANDEZ@EXAMPLE.COM » → error de email duplicado; ambos con listado en 3. «ana.perez@example.com» → alta correcta, listado en 4 y aparece en la selección de cliente. |
| Venta sin cliente, cantidad cero, negativa o decimal; libro repetido | No se confirma; el duplicado no crea otro renglón | **Pasa.** Confirmar sin cliente y sin renglones muestra 2 errores y no registra; cantidades 0, −2 y 1.5 no agregan renglones; repetir el mismo libro informa con texto «Ese libro ya forma parte de la venta…» y la tabla queda igual. |
| Venta válida: dos unidades a 1500 y una a 2000 | Subtotales 3000 y 2000; total 5000; detalle conservado en el historial | **Pasa.** Subtotales «$ 3.000,00» y «$ 2.000,00», total «$ 5.000,00»; la confirmación registra V-1, limpia el formulario y el historial muestra el detalle con esos importes. |
| Venta confirmada y cambio exclusivo del precio del catálogo guardado (copia de prueba) | Tras recargar, el detalle conserva los valores confirmados | **Pasa.** Se modificó solo `libros[0].precio` de 1500 a 99999 en el `localStorage` de una copia (ventas sin tocar); al recargar, el detalle de V-1 muestra precio unitario «$ 1.500,00», subtotales y total «$ 5.000,00» originales. |
| Recarga después de altas y venta | Se recuperan datos sin duplicar ejemplos ni ventas | **Pasa.** Tras guardar 7 libros, 4 clientes y 1 venta, nuevas aperturas consecutivas mantienen 7/4/1 (los ejemplos iniciales no se vuelven a insertar). |
| Navegación por teclado y anchos de 320 px y 1280 px | Foco visible, controles utilizables y tabla con desplazamiento propio si lo necesita | **Pasa.** Tab: 5 enlaces de menú → buscador → Buscar → Limpiar (8/8 con `outline` sólido de 3 px); Shift+Tab retrocede; al salir del último control el foco vuelve al inicio. A 320 px y 1280 px ninguna vista produce desplazamiento horizontal del documento ni textos cortados; a 320 px las 4 tablas se desplazan dentro de su contenedor (p. ej. 565 px de contenido en 266 px de contenedor) y a 1280 px caben sin scroll. |

Si una funcionalidad queda pendiente en el futuro, debe registrarse aquí con su comportamiento real; ninguna prueba se da por aprobada sin ejecutarla.

## Imágenes

No se utilizan imágenes en el proyecto, por lo que no hay procedencia de imágenes ajenas que acreditar.

## Estructura del proyecto

```
TP-Libreria/
├── index.html            ← entrada, cinco vistas semánticas
├── css/
│   └── estilos.css       ← identidad visual, Flexbox/Grid, responsive
├── js/
│   ├── datos.js          ← datos iniciales ficticios
│   ├── logica.js         ← validaciones, catálogo, ventas y persistencia (sin DOM)
│   └── app.js            ← renderizado, eventos y navegación
├── pruebas/
│   └── test-logica.js    ← pruebas automáticas de lógica (Node, sin dependencias)
└── README.md
```

## Cómo ejecutar las pruebas incluidas

```
node pruebas/test-logica.js
```

Resultado de la última ejecución: **37 aserciones pasadas, 0 falladas** (filtro, validaciones de libros y clientes, cantidades inválidas, libro repetido, subtotales/total 3000/2000/5000, precio histórico, persistencia sin duplicar y JSON corrupto). Las pruebas de interfaz y de teclado se ejecutaron con jsdom y Edge headless desde un entorno externo, por lo que no se incluyen (la consigna no permite dependencias instaladas en la entrega).
