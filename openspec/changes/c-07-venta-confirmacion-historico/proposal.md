# Proposal

## Why

El Ejercicio 5 exige cerrar la venta simulada: hoy se puede armar una venta en curso (C-06) pero no confirmarla ni dejar registro histórico. Sin la confirmación validada y sin el snapshot de valores al momento de vender, el historial dependería del precio actual del catálogo y se rompería la inmutabilidad exigida (RN-VE-08…RN-VE-12, RN-HI-03).

## What Changes

- **Confirmación validada**: `validarConfirmacionVenta(clienteId, renglones)` impide confirmar sin cliente, sin renglones o con cantidades inválidas/repetidas (RN-VE-08).
- **Registro de la venta**: `confirmarVenta(cliente, renglones, ventas, fecha)` construye `{ id, fecha (ISO), clienteId, clienteNombre, renglones[], total }` (RN-VE-09).
- **Snapshot histórico (copy-on-confirm)**: cada renglón confirma una **copia** de `precioUnitario` y `titulo`; la venta copia `clienteNombre`. Al confirmar **no se relee el catálogo** (RN-VE-10, DD-04).
- **Cierre de la operación**: se persiste el estado, se **limpia el formulario** para una nueva venta y se muestra un **mensaje de resultado** (RN-VE-11).
- **Inmutabilidad desde la UI**: las ventas confirmadas no se editan ni se eliminan desde la interfaz (RN-VE-12).
- **Auditoría y corrección** de `js/logica.js` (`validarConfirmacionVenta`, `confirmarVenta`) y `js/app.js` (handler de confirmar, limpieza del formulario, mensaje de resultado).
- **Doble contrato** de `js/logica.js` confirmado (globals en navegador + `module.exports` en Node) para las funciones de este change (IN-01).

Este change **no** implementa la vista de historial ni el detalle (C-08): solo produce y persiste la venta con sus valores históricos.

## Capabilities

### New Capabilities
- `ventas`: confirmación de una venta en curso y registro histórico inmutable — validación final, snapshot de precio/título/cliente al confirmar, persistencia, limpieza del formulario y mensaje de resultado.

### Modified Capabilities
<!-- Sin specs canónicas en openspec/specs/: la capability `ventas` declarada por C-06 aún no fue archivada, por lo que este delta la trata como NUEVA. -->

## Impact

- **Código**: `js/logica.js` (`validarConfirmacionVenta`, `confirmarVenta`), `js/app.js` (handler del botón/`submit` de confirmar, limpieza del formulario de venta, mensaje de resultado, re-render del historial).
- **HTML/CSS**: reutiliza los nodos ya definidos (botón «Confirmar venta», formulario de venta, contenedor de mensajes, sección Historial). Este change no introduce cambios de estructura.
- **Datos**: se agrega la venta al array `ventas` del estado persistido en `localStorage` (`tp_libreria_estado`).
- **Dependencias**: ninguna (restricción dura: HTML/CSS/JS nativo + `localStorage`, sin frameworks ni backend).
- **Specs**: `openspec/specs/ventas/spec.md` no existe todavía; el delta `ADDED Requirements` lo introduce.
- **Dependencia de change**: requiere C-06 (venta en curso con renglones y total) para contar con cliente seleccionado y renglones válidos.
