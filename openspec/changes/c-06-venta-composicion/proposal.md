# Proposal

## Why

El TP exige simular una venta completa (Ejercicio 5). Hoy no existe forma de armar una venta: falta seleccionar cliente, agregar renglones con libro y cantidad, rechazar duplicados, editar cantidades y quitar renglones, y calcular subtotales y total. Sin esta composición el registro histórico (C-07) y el historial (C-08) no tienen datos que consumir.

## What Changes

- Selección de un **cliente existente** desde el formulario de venta (`#venta-cliente`).
- Alta de **renglones** con libro existente y **cantidad entera mayor que cero**.
- **Rechazo de libros repetidos** dentro de la misma venta, con mensaje visible, sin agregar el renglón.
- **Edición de cantidades** y **eliminación de renglones** mientras la venta no está confirmada.
- Cálculo de `subtotal = cantidad × precioUnitario` y `total = suma(subtotales)`.
- Presentación de todos los importes con **dos decimales**.
- Render de la tabla de renglones con libro, cantidad (editable), precio unitario y subtotal, y actualización de `#venta-total`.
- Validación y corrección de `js/app.js` (`renderRenglones`) y `js/logica.js` (`agregarRenglon`, `recalcularRenglon`, `calcularTotal`, `formatearImporte`).

Este change **no confirma la venta**: la validación final, el snapshot histórico, la persistencia y el historial pertenecen a C-07 y C-08.

## Capabilities

### New Capabilities
- `ventas`: composición de una venta en curso — selección de cliente, alta/edición/eliminación de renglones, reglas de cantidad entera y no repetición de libros, y cálculo de subtotales, total y formato de importes antes de confirmar.

### Modified Capabilities
<!-- Sin capabilities existentes: openspec/specs/ está vacío. -->

## Impact

- **Código**: `js/logica.js` (`agregarRenglon`, `recalcularRenglon`, `calcularTotal`, `formatearImporte`), `js/app.js` (`renderRenglones` y manejo de eventos de `#form-renglon`).
- **HTML/CSS**: reutiliza los nodos ya definidos (`#venta-cliente`, `#form-renglon`, tabla de renglones, `#venta-total`). Este change no introduce cambios de estructura.
- **Dependencias**: ninguna (restricción dura: HTML/CSS/JS nativo + `localStorage`, sin frameworks ni backend).
- **Specs**: `openspec/specs/ventas/spec.md` no existe todavía; el delta `ADDED Requirements` lo introduce.
- **Dependencia de change**: requiere C-03 (datos iniciales y relaciones) para contar con clientes y libros existentes.
