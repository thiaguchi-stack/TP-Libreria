# Proposal

## Why

El TP exige (Ejercicio 5) que el historial muestre las ventas confirmadas y permita consultar su detalle, conservando los valores del momento de la confirmación aunque el precio del catálogo cambie después. C-07 registra la venta con su snapshot histórico, pero sin una vista de historial y detalle ese snapshot queda inaccesible y no se puede auditar lo vendido (US-008).

## What Changes

- **Tabla de historial**: muestra por cada venta confirmada su **identificador** (`V-N`), **fecha** (`toLocaleString("es-AR")`), **cliente** y **total** (RN-HI-01).
- **Consulta de detalle**: botón «Ver detalle» que abre el detalle con los **renglones guardados en la venta** — libro, cantidad, precio unitario y subtotal (RN-HI-02).
- **Inmutabilidad del detalle**: el detalle lee los valores históricos copiados en la venta, **nunca** el precio actual del catálogo; si el precio del libro cambia después de confirmar, el detalle conserva precio unitario, subtotales y total originales (RN-HI-03, RN-VE-10).
- **Estado de lista vacía**: cuando no hay ventas confirmadas se muestra un mensaje de lista vacía (`#vacio-ventas`) (RN-PR-05).
- **Cierre del detalle**: botón «Cerrar detalle» (`#btn-cerrar-detalle`) que oculta el panel de detalle.
- **Sin edición ni borrado**: no se ofrece ninguna acción de UI para **editar o eliminar** ventas confirmadas (RN-VE-12).
- **Auditoría y corrección** de `js/app.js` (`renderHistorial`, `mostrarDetalle`, `iniciarHistorial`/cierre de detalle) y, si corresponde, de los helpers de `js/logica.js` que consuma el historial (formato de importes).

Este change **no modifica** el modelo de la venta ni la confirmación: consumen lo que C-07 ya persiste.

## Capabilities

### New Capabilities
- `historial`: consulta de las ventas confirmadas y su detalle inmutable — tabla con identificador, fecha, cliente y total; detalle de renglones leído desde la venta guardada; estado de lista vacía; ausencia de acciones de edición o borrado.

### Modified Capabilities
<!-- Sin capabilities existentes: openspec/specs/ está vacío. -->

## Impact

- **Código**: `js/app.js` (`renderHistorial`, `mostrarDetalle`, `iniciarHistorial` y wiring de `#btn-cerrar-detalle`); `js/logica.js` solo si el historial consume helpers puros (por ejemplo `formatearImporte`).
- **HTML/CSS**: reutiliza los nodos ya definidos (`#tbody-ventas`, `#vacio-ventas`, `#detalle-venta`, `#detalle-titulo`, `#tbody-detalle`, `#detalle-total`, `#btn-cerrar-detalle`). Este change no introduce cambios de estructura ni de estilo.
- **Datos**: no cambia el modelo ni el seed; el historial es **solo lectura** sobre `estado.ventas`.
- **Dependencias**: requiere C-07 (estructura de la venta confirmada con snapshot histórico) y C-09 (la venta debe sobrevivir la recarga para poder consultar el detalle). Restricción dura vigente: HTML/CSS/JS nativo + `localStorage`, sin frameworks ni backend.
- **Specs**: `openspec/specs/historial/spec.md` no existe todavía; el delta `ADDED Requirements` lo introduce.
