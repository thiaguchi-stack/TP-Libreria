# Tasks

## 1. Auditoría de la lógica de renglones (`js/logica.js`)

- [ ] 1.1 Auditar `agregarRenglon(renglones, libro, cantidad)` contra RN-VE-02 (libro existente y cantidad entera > 0) y verificar que rechace cantidad 0, negativa, decimal o no numérica sin mutar el array de entrada.
- [ ] 1.2 Verificar el rechazo de libro repetido por `libroId` en `agregarRenglon`, con mensaje «Ese libro ya forma parte de la venta…» y sin modificar la cantidad del renglón existente (RN-VE-03).
- [ ] 1.3 Verificar que el renglón agregado guarde `libroId`, `titulo`, `cantidad`, `precioUnitario` y `subtotal`, y que exija cliente existente seleccionado (RN-VE-01).
- [ ] 1.4 Auditar `recalcularRenglon` para que aplique la misma validación de cantidad entera > 0 y recalcule el `subtotal` del renglón afectado (RN-VE-04, RN-VE-05).
- [ ] 1.5 Verificar el doble contrato de `js/logica.js` (globals en navegador + `module.exports` en Node) para las cuatro funciones del change.

## 2. Cálculos y formato de importes (`js/logica.js`)

- [ ] 2.1 Auditar `calcularTotal(renglones)` para que devuelva la suma de los subtotales vigentes (RN-VE-06).
- [ ] 2.2 Auditar `formatearImporte(n)` para que presente exactamente dos decimales y sea la única fuente de formato de precio unitario, subtotal y total (RN-VE-07).
- [ ] 2.3 Correr `pruebas/test-logica.js` §Caso 4 (2×1500 + 1×2000 = subtotales 3000/2000 y total 5000) y confirmar que pasa.
- [ ] 2.4 Correr `pruebas/test-logica.js` §Caso 5 (formato de importes con dos decimales) y confirmar que pasa.

## 3. Render y eventos de composición (`js/app.js`)

- [ ] 3.1 Auditar `renderRenglones(renglones)` para que la tabla muestre libro, cantidad en input editable (con `aria-label`), precio unitario y subtotal por renglón, y actualice `#venta-total` con el total vigente.
- [ ] 3.2 Auditar el wiring del `submit` de `#form-renglon` (captura, `preventDefault`, llamada a `agregarRenglon` y re-render) verificando que un renglón válido aparezca en la tabla.
- [ ] 3.3 Verificar que un libro repetido muestre el mensaje de duplicado y no agregue un segundo renglón.
- [ ] 3.4 Verificar que cambiar la cantidad dispare `recalcularRenglon`, actualice el subtotal del renglón y el total, y que quitar un renglón lo elimine de la tabla y recalcule el total.
- [ ] 3.5 Verificar que la selección de cliente en `#venta-cliente` tome un cliente existente y quede disponible para la venta en curso.

## 4. Verificación de integración

- [ ] 4.1 Verificar en el navegador los casos manuales del Ejercicio 5 (composición y validaciones 8 + cálculos 5): alta válida, cantidad inválida rechazada, duplicado rechazado, edición y eliminación de renglones, subtotales y total con dos decimales.
- [ ] 4.2 Verificar que este change NO confirma la venta ni persiste en `localStorage`, dejando esa responsabilidad a C-07/C-09.
