# Design

## Context

Ver `proposal.md` — Why. El estado actual es la venta en curso de C-06: un cliente seleccionado en `#venta-cliente` y un array de renglones en memoria con `libroId`, `titulo`, `cantidad`, `precioUnitario` y `subtotal`, más el total calculado. Falta la validación final, la construcción del registro histórico y su persistencia.

Restricciones duras que condicionan el diseño:
- Frontend puro sobre `file://`, sin backend, sin frameworks ni dependencias (DD-01).
- Una sola página con 5 secciones; la lógica pura vive en `js/logica.js` sin acceso al DOM (DD-02, DD-03).
- Doble contrato de `js/logica.js`: globals en el navegador y `module.exports` en Node para poder testear con `pruebas/test-logica.js` (IN-01).
- Persistencia en una única clave `tp_libreria_estado` con `{ libros, clientes, ventas }` (DD-06).
- Snapshot histórico exigido por la consigna (DD-04, RN-VE-10).

## Goals / Non-Goals

**Goals:**
- Validar la confirmación de forma pura y devolver una lista de errores accionable.
- Construir la venta histórica copiando los valores del momento, sin releer el catálogo ni el registro de clientes.
- Asignar un identificador `V-N` estable y no reutilizado.
- Cerrar la operación: persistir, limpiar el formulario y mostrar un mensaje de resultado.

**Non-Goals:**
- Render del historial y del detalle de venta (pertenece a C-08).
- Edición o eliminación de ventas confirmadas (excluido por RN-VE-12).
- Cualquier cambio de estructura HTML/CSS o de esquema de `localStorage` (ya definidos).
- Actualización de stock, descuentos o impuestos (fuera del alcance del TP).

## Decisions

### D-01 — Separar la validación de la construcción (copy-on-confirm)
`validarConfirmacionVenta(clienteId, renglones)` devuelve un array de errores (vacío si todo está bien) y no muta nada. `confirmarVenta(cliente, renglones, ventas, fecha)` construye y devuelve la venta solo cuando la entrada es válida. Mantener ambas funciones puras permite testearlas con Node y reutiliza el patrón de `validarLibro`/`validarCliente`.

**Alternativas consideradas:** (a) una única función que valide y registre, más simple pero no testeable en aislamiento y que mezcla efectos; (b) validar en `app.js` y solo construir en `logica.js`, que duplicaría reglas en la capa de DOM y rompería DD-03.

### D-02 — Copiar valores históricos en el momento de confirmar (copy-on-confirm)
Al confirmar, cada renglón guarda una **copia** de `precioUnitario` y `titulo`, y la venta una copia de `clienteNombre`. El historial y el detalle leen esos valores, nunca el catálogo vigente.

**Alternativas consideradas:** (a) guardar solo `libroId` y resolver el precio al mostrar el detalle, que haría que el historial refleje precios nuevos y violaría RN-VE-10/RN-HI-03; (b) guardar una referencia viva al libro, mismo problema y además expone mutaciones no deseadas.

**Justificación:** es requisito explícito de la consigna y la decisión DD-04 de la KB; sostiene la inmutabilidad y permite la comprobación guiada (cambiar el precio del catálogo y verificar que el detalle no cambia).

### D-03 — Identificador `V-N` derivado del último id
Se calcula el siguiente id a partir del máximo id numérico existente, con prefijo `V-`. Se evita reutilizar ids y se mantiene un formato legible y estable.

**Alternativas consideradas:** (a) id numérico simple, válido pero ambiguo frente a ids de libros/clientes; (b) uuid/timestamp, innecesario para un volumen reducido y menos legible en el historial. Pregunta abierta sobre el prefijo registrada en `10_preguntas_abiertas.md`; si el docente prefiere numérico, es un cambio localizado en `confirmarVenta`.

### D-04 — Fecha ISO capturada al confirmar
La venta guarda `fecha` como string ISO (por ejemplo `toISOString()`), independiente del formato de presentación. El formato de visualización (p. ej. `toLocaleString("es-AR")`) es responsabilidad del render del historial (C-08), no del registro.

**Alternativas consideradas:** (a) guardar la fecha ya formateada, que ata el dato a un formato y complica reordenar o comparar; (b) guardar `Date`/timestamp, que no serializa de forma limpia en `localStorage` sin conversión extra.

### D-05 — Confirmar desde `app.js` orquestando funciones puras
El handler de confirmar captura el evento (o clic), llama a `validarConfirmacionVenta`, y solo si no hay errores llama a `confirmarVenta`, agrega la venta al estado, `guardarEstado`, limpia el formulario y muestra el mensaje. Los errores se renderizan cerca del formulario sin confirmar.

**Alternativas consideradas:** (a) persistir dentro de `logica.js`, que acoplaría la lógica pura a `localStorage` y a un contrato de efectos difícil de testear; (b) confirmar en un solo paso dentro de `app.js` sin funciones puras, que impide verificar con Node.

## Risks / Trade-offs

- **[Duplicación de datos descriptivos]** El renglón y la venta repiten título y nombre de cliente → es intencional (DD-04); aumenta el tamaño del JSON pero garantiza el snapshot. Mitigación: volumen reducido (SU-02) y una sola clave de persistencia.
- **[Ventas que no impactan stock]** Confirmar no descuenta stock porque el TP no modela inventario → fuera de alcance; documentado como no-goal.
- **[Reutilización de ids si se corrompe el estado]** Si el JSON guardado está corrupto, se recarga el estado inicial (RN-PE-04) y podrían reaparecer ids previos → comportamiento aceptado; el id se deriva del conjunto vigente.
- **[Formato de fecha/ID dependiente de criterio docente]** ISO e id `V-N` podrían no coincidir con lo esperado → registrado como pregunta abierta; ambos son cambios localizados sin impacto en las specs.
- **[Doble contrato en riesgo si se migra a módulos ES]** Mantener globals + `module.exports` es intencional mientras el proyecto sea estático (IN-01) → no se migra en este change.

## Migration Plan

1. Auditar/corregir `validarConfirmacionVenta` y `confirmarVenta` en `js/logica.js`, manteniendo el doble contrato.
2. Auditar/corregir el handler de confirmar en `js/app.js` (validación, construcción, persistencia, limpieza del formulario y mensaje).
3. Correr `pruebas/test-logica.js` §Caso 6 (precio histórico conservado al cambiar el catálogo) y verificarlo en verde.
4. Verificar en el navegador: confirmar sin cliente/sin renglones/cantidad inválida no registra; confirmar válido limpia el formulario, muestra el mensaje y deja la venta en el estado persistido.
5. Comprobar el snapshot: confirmar, cambiar el precio del catálogo y verificar que el detalle conserva el precio original.
6. Rollback: al ser un cambio acotado en dos archivos JS, revertir los hunks de `js/logica.js` y `js/app.js`; el historial de ventas ya confirmadas no se ve afectado porque vive en `localStorage`.

## Open Questions

- ¿El identificador visible debe llevar prefijo `V-` o alcanza un numérico simple? (registrado en `10_preguntas_abiertas.md`; no cambia las specs ni el enfoque).
- ¿Se espera un formato de fecha específico en el historial (dd/mm/aaaa vs. ISO)? El almacenamiento en ISO es estable y el formato de presentación pertenece a C-08.
