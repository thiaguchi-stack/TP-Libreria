# Tasks

## 1. Auditoría de validaciones de libro (`js/logica.js`)

- [ ] 1.1 Auditar `validarLibro(datos, contexto)` contra RN-LI-01…RN-LI-08 y anotar qué bordes ya cubre y cuáles faltan; verificación: checklist de las 8 reglas con el resultado observado (cita de la línea y mensaje de error).
- [ ] 1.2 Corregir el caso de título vacío recortando espacios (RN-LI-01) si falta; verificación: `validarLibro({ titulo: "   " }, contexto)` devuelve el error de título.
- [ ] 1.3 Corregir el caso de ISBN vacío (RN-LI-02) si falta; verificación: `validarLibro` con `isbn: ""` devuelve el error de ISBN.
- [ ] 1.4 Verificar que la unicidad de ISBN use `normalizarISBN` sin espacios ni guiones (RN-LI-03) y rechace `978-3-16` frente a un `978316` existente; verificación: aserción en `pruebas/test-logica.js` §Caso 2 si falta.
- [ ] 1.5 Verificar que el precio deba ser numérico y mayor que cero (RN-LI-05) cubriendo vacío, no numérico y ≤ 0; verificación: tres aserciones de borde con el mensaje esperado.
- [ ] 1.6 Verificar que la editorial deba existir (RN-LI-06); verificación: `validarLibro` con `editorialId` inexistente devuelve el error de editorial.
- [ ] 1.7 Verificar que exija al menos un autor y que todos existan (RN-LI-07); verificación: aserciones con `autorIds: []` y con un id inexistente.
- [ ] 1.8 Verificar que el género sea opcional y sólo se valide su existencia cuando hay id, aceptando `null`/`""`/`undefined` como ausencia (RN-LI-08, IN-02); verificación: `validarLibro` no devuelve error con `generoId: null` y sí lo devuelve con un id inexistente.

## 2. Auditoría de validaciones de cliente (`js/logica.js`)

- [ ] 2.1 Auditar `validarCliente(datos, contexto)` contra RN-CL-01…RN-CL-04 y anotar bordes faltantes; verificación: checklist de las 4 reglas con el resultado observado.
- [ ] 2.2 Corregir el caso de nombre vacío recortando espacios (RN-CL-01) si falta; verificación: `validarCliente({ nombreCompleto: "  " }, contexto)` devuelve el error de nombre.
- [ ] 2.3 Verificar el caso de email vacío (RN-CL-02); verificación: aserción con `email: ""` devuelve el error de email.
- [ ] 2.4 Verificar el formato de email vía `formatoEmailValido` (RN-CL-03) con casos válidos e inválidos; verificación: aserciones de formato en `pruebas/test-logica.js` §Caso 3.
- [ ] 2.5 Verificar la unicidad de email comparada sin espacios exteriores ni mayúsculas (RN-CL-04); verificación: aserción con `"  Ana@Mail.com "` frente a un `ana@mail.com` existente en §Caso 3 si falta.

## 3. Auditoría de handlers y selectores (`js/app.js`)

- [ ] 3.1 Auditar `popularSelectsLibro()` contra el requisito de selectores desde datos locales y el mapeo «Sin clasificar» (IN-02); verificación: el `<option>` de género vacío tiene `value=""` y `app.js` lo mapea a `null` al construir el libro.
- [ ] 3.2 Verificar el handler de `#form-libro`: `preventDefault`, armado de `{ titulo, isbn, precio, editorialId, generoId, autorIds }` y llamada a `validarLibro` con editoriales, géneros, autores y libros del estado; verificación: lectura del handler confirmando el contexto pasado.
- [ ] 3.3 Verificar el mapeo `generoId === "" ? null : Number(generoId)` al agregar el libro, para no persistir un `generoId` inexistente; verificación: alta manual con «Sin clasificar» y comprobación del objeto guardado.
- [ ] 3.4 Verificar que los errores se muestren en `#errores-libro` cerca del formulario y que se limpien al inicio de cada `submit` (RN-LI-09); verificación: envío inválido muestra los errores y reenvío sin datos los limpia.
- [ ] 3.5 Verificar el re-render post-alta de libro: `renderListadoLibros`, `renderCatalogo` y `renderSelectsVenta` sin recargar (RN-LI-10); verificación: tras un alta válida el libro aparece en listado, catálogo y selectores de venta.
- [ ] 3.6 Verificar el handler de `#form-cliente`: `preventDefault`, armado de `{ nombreCompleto, email }` y llamada a `validarCliente` con `{ clientes }` del estado; verificación: lectura del handler y envío inválido mostrando errores en `#errores-cliente`.
- [ ] 3.7 Verificar el re-render post-alta de cliente: `renderListadoClientes` y `renderSelectsVenta` sin recargar (RN-CL-05); verificación: tras un alta válida el cliente aparece en listado y selector de cliente.

## 4. Pruebas y verificación

- [ ] 4.1 Extender `pruebas/test-logica.js` §Casos 2 y 3 sólo si falta algún borde (ISBN duplicado con otro separador, email duplicado con espacios/mayúsculas); verificación: las aserciones agregadas fallan si se rompe la validación y pasan con el código actual.
- [ ] 4.2 Ejecutar `node pruebas/test-logica.js` y registrar el total de aserciones y falladas; verificación: 0 falladas (o el número real observado) sin modificar el resultado para maquillarlo.
- [ ] 4.3 Reproducir los casos manuales de alta de la consigna (ISBN duplicado, ISBN nuevo, email inválido, email duplicado, email nuevo) y registrar el resultado observado; verificación: resultado anotado por caso para C-10.
