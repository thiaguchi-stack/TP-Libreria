# Tasks

## 1. Tabla del historial (`js/app.js` · `renderHistorial`)

- [ ] 1.1 Auditar `renderHistorial()` para que, por cada venta en `estado.ventas`, la fila muestre el identificador como `"V-" + venta.id` y verificar que coincida con el formato `V-N` de `04_modelo_de_datos.md` §Venta (RN-HI-01).
- [ ] 1.2 Verificar que la celda de fecha presente `new Date(venta.fecha).toLocaleString("es-AR")` y no la cadena ISO cruda (RN-HI-01).
- [ ] 1.3 Verificar que la fila muestre `venta.clienteNombre` y `formatearImporte(venta.total)` (dos decimales), y que todos los nodos se construyan con `textContent`/`createElement` y nunca `innerHTML` con datos (RN-HI-01, RN-VE-07, RN-CA-08).
- [ ] 1.4 Auditar el estado de lista vacía: con `estado.ventas.length === 0` debe mostrarse `#vacio-ventas` y no debe quedar visibilidad residual del panel de detalle (RN-PR-05).
- [ ] 1.5 Verificar en el navegador que, sin ventas, se ve el mensaje de lista vacía y, con al menos una venta confirmada, la tabla muestra id, fecha, cliente y total.

## 2. Detalle de la venta inmutable (`js/app.js` · `mostrarDetalle`)

- [ ] 2.1 Auditar `mostrarDetalle(venta)` para que recorra `venta.renglones` y muestre por renglón `titulo`, `cantidad`, `formatearImporte(precioUnitario)` y `formatearImporte(subtotal)` sin consultar `estado.libros` ni precios del catálogo (RN-HI-02, RN-VE-10).
- [ ] 2.2 Verificar que el detalle use `venta.renglones` persistidos en la venta como única fuente de valores, y que cambiar el precio del catálogo después de confirmar no altere precio unitario, subtotales ni total (RN-HI-03).
- [ ] 2.3 Verificar que `#detalle-titulo` identifique la venta (`V-N`) y que `#detalle-total` muestre el total de la venta con dos decimales (RN-HI-02, RN-VE-07).
- [ ] 2.4 Verificar que mostrar el detalle no mute `estado.ventas` ni escriba en `localStorage` (el historial es solo lectura).

## 3. Cierre del detalle y acciones prohibidas (`js/app.js`)

- [ ] 3.1 Auditar `iniciarHistorial()` y el wiring de `#btn-cerrar-detalle` para que pulsar «Cerrar detalle» oculte `#detalle-venta` y mantenga visible la tabla del historial.
- [ ] 3.2 Verificar que abrir el detalle de otra venta reemplace el contenido anterior sin acumular renglones (vaciado del `tbody` de detalle antes de renderizar).
- [ ] 3.3 Verificar que no exista ninguna acción de UI para editar ni eliminar ventas confirmadas en el historial ni en el detalle (RN-VE-12).
- [ ] 3.4 Verificar en el navegador el ciclo completo: abrir detalle, revisar renglones, cerrar detalle y volver a la tabla.

## 4. Helpers de lógica (`js/logica.js`)

- [ ] 4.1 Si el historial consume `formatearImporte` en `js/logica.js`, auditar que presente exactamente dos decimales y que sea la única fuente de formato de total, precio unitario y subtotal (RN-VE-07).
- [ ] 4.2 Verificar que el doble contrato de `js/logica.js` (globals en navegador + `module.exports` en Node) siga vigente para los helpers usados por el historial; no introducir funciones nuevas si no son necesarias (ver `10_preguntas_abiertas.md` IN-01).

## 5. Verificación de integración

- [ ] 5.1 Correr `node pruebas/test-logica.js` y confirmar que pasa, en particular §Caso 6 (precio histórico conservado al cambiar el catálogo) y §Caso 7 (persistencia de ventas tras recarga).
- [ ] 5.2 Reproducir el caso manual del Ejercicio 5: confirmar una venta, anotar importes, modificar solo el precio del catálogo guardado en una copia de prueba, recargar y verificar que el detalle conserva precio unitario, subtotales y total originales (RN-HI-03, RN-VE-10).
- [ ] 5.3 Verificar que este change NO confirma ventas, NO persiste y NO edita/elimina ventas, dejando esas responsabilidades a C-07/C-09; registrar el resultado observado de cada caso (la consigna prohíbe dar por aprobada una prueba no ejecutada).
