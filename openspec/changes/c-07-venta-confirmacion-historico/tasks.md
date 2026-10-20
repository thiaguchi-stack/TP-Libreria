# Tasks

## 1. Auditoría de la validación de confirmación (`js/logica.js`)

- [ ] 1.1 Auditar `validarConfirmacionVenta(clienteId, renglones)` contra RN-VE-08: debe devolver error cuando no hay cliente, cuando el array de renglones está vacío y cuando algún renglón tiene cantidad no entera o no mayor que cero; verificar que no muta la entrada.
- [ ] 1.2 Verificar que `validarConfirmacionVenta` acumule **todos** los errores aplicables (sin cliente y sin renglones ⇒ al menos 2) y devuelva un array vacío cuando la venta es válida.
- [ ] 1.3 Verificar que la función sea pura: misma entrada ⇒ mismo resultado, sin leer `localStorage` ni el DOM, y confirmar que respeta el doble contrato (global en navegador + `module.exports` en Node) según IN-01.

## 2. Construcción del registro histórico (`js/logica.js`)

- [ ] 2.1 Auditar `confirmarVenta(cliente, renglones, ventas, fecha)` contra RN-VE-09: la venta devuelta contiene `id`, `fecha` (ISO), `clienteId`, `clienteNombre`, `renglones[]` y `total`.
- [ ] 2.2 Verificar el snapshot histórico (RN-VE-10, DD-04): cada renglón copia `precioUnitario` y `titulo`, y la venta copia `clienteNombre`, sin releer el catálogo ni el registro de clientes para resolverlos.
- [ ] 2.3 Verificar la forma del renglón histórico `{ libroId, titulo, cantidad, precioUnitario, subtotal }` y que `total` sea la suma de los subtotales copiados.
- [ ] 2.4 Verificar la asignación del identificador `V-N` a partir del último id existente, sin reutilizar ids ya presentes en `ventas`.
- [ ] 2.5 Correr `pruebas/test-logica.js` §Caso 6 (precio histórico conservado al cambiar el catálogo) y confirmar que pasa.

## 3. Confirmación desde la interfaz (`js/app.js`)

- [ ] 3.1 Auditar el handler de confirmar (clic en «Confirmar venta») para que aplique `preventDefault` cuando corresponda, arme `cliente` y `renglones` desde el estado de la venta en curso y llame a `validarConfirmacionVenta`.
- [ ] 3.2 Verificar que ante errores se muestren los mensajes cerca del formulario y **no** se registre ninguna venta (RN-VE-08), dejando intacta la venta en curso.
- [ ] 3.3 Verificar que ante una venta válida se llame a `confirmarVenta`, se agregue el registro al array `ventas`, se ejecute `guardarEstado` y el historial re-renderizado incluya la nueva venta (RN-VE-09).
- [ ] 3.4 Verificar la limpieza del formulario (cliente y renglones) y el render de un mensaje de resultado tras confirmar (RN-VE-11).
- [ ] 3.5 Verificar que la UI no ofrezca acciones de edición ni eliminación de ventas confirmadas y que los renglones/totales se muestren tal como se confirmaron (RN-VE-12).

## 4. Verificación de integración

- [ ] 4.1 Verificar en el navegador los casos manuales del Ejercicio 5: confirmar sin cliente y sin renglones no registra; cantidad inválida no confirma; venta válida registra, limpia y muestra mensaje.
- [ ] 4.2 Comprobar el snapshot extremo a extremo: confirmar una venta, cambiar el precio del libro en el catálogo y verificar que el detalle de la venta conserva el `precioUnitario` original sin releer el catálogo.
- [ ] 4.3 Verificar que la venta confirmada sobrevive a la recarga (lee desde `localStorage`, clave `tp_libreria_estado`) y que este change no implementa la vista de detalle del historial, dejando esa responsabilidad a C-08.
