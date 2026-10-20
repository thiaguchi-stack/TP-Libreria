# Design

## Context

Ver `proposal.md` — Why para la motivación. Estado actual relevante:

- La arquitectura es **HTML/CSS/JS nativo sin dependencias** (`knowledge-base/08_arquitectura_propuesta.md`); el DOM y los eventos viven en `js/app.js` y las funciones puras en `js/logica.js`.
- `js/app.js` ya expone `renderHistorial()` (arma la tabla `#tbody-ventas`, gestiona `#vacio-ventas` y oculta `#detalle-venta`), `mostrarDetalle(venta)` (llena `#tbody-detalle`, `#detalle-titulo` y `#detalle-total`) e `iniciarHistorial()` (wiring de `#btn-cerrar-detalle`). El change **audita y completa** esas funciones contra la KB, no parte de cero.
- El modelo de Venta (`04_modelo_de_datos.md` §Venta) guarda `id`, `fecha`, `clienteId`, `clienteNombre`, `renglones[]` y `total`; cada Renglón histórico guarda `libroId`, `titulo`, `cantidad`, `precioUnitario` y `subtotal` como **copias históricas**.
- Dependencias: C-07 produce la venta confirmada con ese snapshot; C-09 garantiza que `estado.ventas` sobreviva la recarga, condición necesaria para que el detalle inmutable sea verificable tras recargar.
- El historial es **solo lectura**: no muta `estado.ventas` ni el `localStorage` (los cambios persistidos pertenecen a C-07/C-09).

## Goals / Non-Goals

**Goals:**

- Verificar y completar `renderHistorial`, `mostrarDetalle` e `iniciarHistorial` en `js/app.js` para cumplir RN-HI-01…RN-HI-03 y RN-VE-12 de punta a punta.
- Garantizar que el detalle se lea **siempre** desde `venta.renglones` (valores históricos) y nunca desde el catálogo actual.
- Asegurar los estados de UI requeridos: lista vacía (`#vacio-ventas`) y cierre de detalle (`#btn-cerrar-detalle`).
- Mantener el render seguro (solo `textContent`, nunca `innerHTML` con datos) según RN-CA-08.

**Non-Goals:**

- Confirmar la venta, generar el snapshot histórico o limpiar el formulario (C-07).
- Persistencia en `localStorage` (C-09).
- Edición o borrado de ventas: explícitamente **fuera de alcance** por RN-VE-12.
- Cambios de estructura HTML o de estilos CSS: se reutilizan los nodos existentes.
- Referencias a nombres de función en la spec: el design las menciona como ayuda de implementación; la spec describe solo comportamiento observable.

## Decisions

**1. El detalle lee exclusivamente de la venta guardada.**
`mostrarDetalle(venta)` recorre `venta.renglones` y usa `renglon.titulo`, `renglon.cantidad`, `renglon.precioUnitario`, `renglon.subtotal` y `venta.total`; no busca el libro en `estado.libros` ni consulta precios del catálogo.

- Alternativas: (a) resolver el precio actual por `renglon.libroId` contra `estado.libros` — descartado, rompe RN-HI-03 y RN-VE-10 y haría el historial dependiente de cambios posteriores del catálogo; (b) guardar solo `libroId` y resolver todo al mostrar — descartado, pierde los datos descriptivos históricos (título, cliente) que la consigna exige conservar.

**2. El identificador se presenta como `V-N` derivado de `venta.id`.**
El historial muestra `"V-" + venta.id`, coincidiendo con `04_modelo_de_datos.md` §Venta (identificador estable V-1, V-2, …) sin almacenar un segundo campo de texto.

- Alternativas: guardar el rótulo `V-N` en la venta — descartado, duplica información derivable y arriesga desincronización; usar solo el número — descartado, no coincide con el formato de la KB.

**3. Formato de fecha localizado con `toLocaleString("es-AR")`.**
La fecha ISO guardada se presenta con `toLocaleString("es-AR")` para lectura local, cumpliendo RN-HI-01 sin alterar el valor persistido.

- Alternativas: mostrar la cadena ISO cruda — descartado, ilegible para el usuario; formatear a mano — descartado, reinventa la localización que el runtime ya provee.

**4. Formato de importes centralizado en `formatearImporte`.**
Total, precio unitario y subtotal se presentan vía `formatearImporte` (dos decimales, RN-VE-07), reutilizando el helper ya usado por la composición de venta (C-06).

- Alternativas: formatear en cada punto del render — descartado, duplica la regla de dos decimales y facilita inconsistencias.

**5. Render seguro basado en `textContent`.**
Cada celda y cada nodo de detalle se construye con `textContent`/`createElement`, nunca `innerHTML` con datos del usuario (RN-CA-08).

- Alternativas: `innerHTML` con plantillas — descartado, abre riesgo de inyección con datos ingresados por el usuario (título de libro, nombre de cliente).

**6. Inmutabilidad por ausencia de acciones.**
No se agregan botones de editar ni eliminar; el historial solo ofrece «Ver detalle». La inmutabilidad se sostiene sobre la UI (RN-VE-12) y no requiere guardas adicionales en la lógica.

- Alternativas: agregar acciones deshabilitadas de editar/borrar — descartado, la consigna pide que no existan desde la interfaz; agregar borrado con confirmación — descartado, fuera de alcance del TP.

## Risks / Trade-offs

- **[Regresión al releer el catálogo]** Un refactor futuro podría "optimizar" el detalle resolviendo precio por `libroId` → mantener el detalle leyendo solo `venta.renglones` y cubrirlo con el Escenario «Cambiar el precio del catálogo tras confirmar» y `pruebas/test-logica.js` §Caso 6.
- **[Venta sin snapshot completo]** Si C-07 no copió `titulo`/`precioUnitario`/`subtotal`, el detalle mostraría vacíos o `NaN` → verificar la forma del renglón histórico (`04_modelo_de_datos.md` §Renglón) antes de renderizar; es un defecto de C-07, no se parchea aquí.
- **[Fecha inválida]** Una `fecha` no parseable haría `new Date(...)` mostrar «Invalid Date» → asumir el contrato ISO de C-07 y no introducir manejo defensivo extra en este change.
- **[Estado tras recarga]** Si C-09 no restaura `estado.ventas`, el historial aparecería vacío tras recargar → la verificación de este change depende de C-09; registrar el resultado real si la dependencia no está cerrada.
- **[Alcance difuso con C-07]** Tocar la confirmación o el snapshot aquí duplicaría trabajo y rompería la frontera de governance → el historial es estrictamente lectura; confirmar/persistir queda fuera de alcance.

## Migration Plan

1. Auditar `renderHistorial()` en `js/app.js` contra RN-HI-01: fila con `V-N`, fecha `toLocaleString("es-AR")`, cliente y total con dos decimales, más `#vacio-ventas` para lista vacía.
2. Auditar `mostrarDetalle(venta)` contra RN-HI-02 y RN-HI-03: recorrer `venta.renglones` (valores históricos), mostrar libro, cantidad, precio unitario y subtotal, y el total; sin consultar el catálogo.
3. Auditar `iniciarHistorial()` y el wiring de `#btn-cerrar-detalle`: ocultar el panel de detalle y devolver el foco de forma razonable; confirmar que no existe ninguna acción de editar/eliminar (RN-VE-12).
4. Verificar con `node pruebas/test-logica.js` (§Caso 6 y §Caso 7) y con los casos manuales del Ejercicio 5 en el navegador.
5. Sin migración de datos: el historial no escribe estado. Rollback = revertir los cambios en `js/app.js` (y `js/logica.js` si se tocó `formatearImporte`).

## Open Questions

- Ninguna que afecte specs, enfoque o desglose de tareas. La restauración de ventas tras recarga y la confirmación con snapshot histórico se difieren explícitamente a C-09 y C-07.
