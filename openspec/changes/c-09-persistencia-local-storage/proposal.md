# Proposal

## Why

El sistema ya registra libros, clientes y ventas en memoria, pero al recargar o reabrir `index.html` esos datos se pierden y el catálogo vuelve a los ejemplos iniciales. La consigna (Ejercicio 6) exige conservar libros, clientes y ventas con `localStorage`: en el primer inicio se cargan los ejemplos, al volver a abrir se recuperan los registros guardados sin duplicar los iniciales, y ante un JSON corrupto se recarga el estado inicial. Sin esta persistencia no se puede verificar el historial ni la prueba del precio histórico, que dependen de que la venta sobreviva a la recarga (C-10).

## What Changes

- Auditar y completar `cargarEstado()` y `guardarEstado()` en `js/logica.js` para operar sobre `localStorage` con la clave `tp_libreria_estado` y la estructura `{ libros, clientes, ventas }`.
- Primer inicio (clave inexistente): sembrar los ejemplos de `DATOS_INICIALES` y guardarlos.
- Reapertura (clave existente con JSON válido): recuperar los registros guardados **sin duplicar** los ejemplos iniciales.
- JSON corrupto o con forma inválida: descartarlo y recargar el estado inicial, validando que las tres colecciones sean arrays.
- Editoriales, géneros y autores **no** se persisten: se leen siempre de `js/datos.js`.
- Asegurar en `js/app.js` que `guardarEstado(estado)` se invoque tras cada mutación (alta de libro, alta de cliente, confirmación de venta).
- Cubrir los tres escenarios (primer inicio, recarga sin duplicar, JSON corrupto) en `pruebas/test-logica.js` §Caso 7.

No es un cambio **BREAKING**: agrega comportamiento de persistencia sobre una estructura de estado ya existente, sin alterar la firma pública del estado ni el contrato de las funciones puras.

## Capabilities

### New Capabilities
- `persistencia`: conserva libros, clientes y ventas en `localStorage` bajo la clave `tp_libreria_estado`, siembra los ejemplos en el primer inicio, recupera sin duplicar al reabrir y recarga el estado inicial ante datos corruptos o de forma inválida.

### Modified Capabilities
<!-- Ninguna: el proyecto aún no tenía specs registradas; la capacidad de persistencia se introduce como nueva. -->

## Impact

- **Código afectado**: `js/logica.js` (`cargarEstado`, `guardarEstado`), `js/app.js` (invocaciones tras cada mutación) y `pruebas/test-logica.js` (Caso 7).
- **Datos**: nuevas entradas en `localStorage` bajo `file:///.../TP-Libreria/index.html`.
- **Dependencias**: ninguna. Se usa solo la API nativa `localStorage` y `JSON` del navegador; se mantiene la restricción de frontend puro sin librerías, frameworks ni backend.
- **Sistemas**: la persistencia depende del navegador, del perfil del usuario y de la ubicación de apertura; no comparte información entre usuarios ni dispositivos (RN-EX-02, RN-EX-03).
- **Habilitá**: C-10 (verificación de la prueba histórica) requiere que la venta sobreviva a la recarga.
