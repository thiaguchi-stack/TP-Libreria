# Tasks

## 1. Auditoría de la persistencia en `js/logica.js`

- [ ] 1.1 Revisar `cargarEstado` y `guardarEstado` contra RN-PE-01…RN-PE-05 y registrar el estado real (firma, parámetros, clave usada); verificación: nota de auditoría con las diferencias respecto de la KB
- [ ] 1.2 Confirmar que la clave es `tp_libreria_estado` y la estructura es `{ libros, clientes, ventas }`; verificación: el JSON guardado en `localStorage` muestra exactamente esas tres propiedades y ninguna de editoriales/géneros/autores
- [ ] 1.3 Confirmar que las funciones reciben el almacenamiento por parámetro y no referencian `localStorage` global; verificación: inspección de la firma y ausencia de acceso global directo en el cuerpo

## 2. Primer inicio y reapertura sin duplicar

- [ ] 2.1 Asegurar la siembra cuando la clave no existe (`DATOS_INICIALES` + guardado); verificación: con almacenamiento vacío, `cargarEstado` devuelve los ejemplos y deja la clave escrita
- [ ] 2.2 Asegurar que con clave existente y JSON válido se devuelvan los registros guardados sin reinsertar ejemplos; verificación: dos llamadas seguidas devuelven la misma cantidad de libros, clientes y ventas
- [ ] 2.3 Asegurar que las ventas arranquen en cero en el primer inicio; verificación: `ventas.length === 0` tras la siembra
- [ ] 2.4 Confirmar que editoriales, géneros y autores no se persisten (DD-05, RN-PE-05); verificación: la clave no contiene esas colecciones y `js/datos.js` sigue siendo su fuente

## 3. Recarga ante JSON corrupto o de forma inválida

- [ ] 3.1 Manejar el caso de `JSON.parse` que lanza; verificación: con texto no parseable, `cargarEstado` devuelve el estado inicial sin propagar el error
- [ ] 3.2 Validar la forma con `Array.isArray` sobre `libros`, `clientes` y `ventas`; verificación: con `{"libros":{}}`, con una propiedad faltante o con JSON válido que no sea objeto, se devuelve el estado inicial
- [ ] 3.3 Confirmar que el estado inicial recargado vuelve a quedar guardado de forma válida; verificación: tras la recarga, la clave contiene el JSON con las tres colecciones

## 4. Invocaciones de guardado en `js/app.js`

- [ ] 4.1 Auditar que `guardarEstado` se invoque tras el alta de libro; verificación: alta correcta seguida de recarga conserva el libro agregado
- [ ] 4.2 Auditar que `guardarEstado` se invoque tras el alta de cliente; verificación: alta correcta seguida de recarga conserva el cliente agregado
- [ ] 4.3 Auditar que `guardarEstado` se invoque tras la confirmación de venta; verificación: venta confirmada seguida de recarga conserva la venta con sus renglones históricos
- [ ] 4.4 Confirmar que no hay mutaciones del estado sin guardado asociado; verificación: recorrido de los manejadores de `app.js` sin hallar altas o confirmaciones sin `guardarEstado`

## 5. Pruebas de los tres escenarios

- [ ] 5.1 Cubrir el primer inicio en `pruebas/test-logica.js` §Caso 7; verificación: aserción de siembra y guardado en verde
- [ ] 5.2 Cubrir la reapertura sin duplicar; verificación: aserción de estabilidad de cantidades en verde
- [ ] 5.3 Cubrir el JSON corrupto y el de forma inválida; verificación: aserciones de estado inicial en verde
- [ ] 5.4 Correr la suite completa; verificación: `node pruebas/test-logica.js` finaliza con 0 aserciones falladas

## 6. Verificación de integración

- [ ] 6.1 Verificar el Flujo 1 extremo a extremo en el navegador (abrir `index.html`, recargar); verificación: los datos persisten y no se duplican los ejemplos
- [ ] 6.2 Verificar el comportamiento ante datos corruptos en el navegador; verificación: al corromper la clave y recargar, vuelven los ejemplos iniciales
- [ ] 6.3 Confirmar que no se agregaron dependencias ni se tocaron `css/` e `index.html`; verificación: revisión del diff limitada a `js/logica.js`, `js/app.js` y `pruebas/test-logica.js`
