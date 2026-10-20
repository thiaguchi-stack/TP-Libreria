# Design

## Context

Ver `proposal.md` — Why para la motivación. Estado actual relevante:

- La arquitectura es **HTML/CSS/JS nativo sin dependencias** (`knowledge-base/08_arquitectura_propuesta.md`); toda la lógica vive en `js/logica.js` (funciones puras) y el DOM/eventos en `js/app.js`.
- `js/logica.js` mantiene un **doble contrato**: `window.*` en el navegador y `module.exports` en Node para poder testearse con `pruebas/test-logica.js` (ver `10_preguntas_abiertas.md` §IN-01).
- La venta en curso es estado **en memoria** de la forma `{ clienteId, renglones: [...] }`; el renglón en curso replica el renglón histórico (`libroId`, `titulo`, `cantidad`, `precioUnitario`, `subtotal`) y es mutable hasta confirmar (`04_modelo_de_datos.md` §Renglón en curso).
- Los nodos de UI ya existen en `index.html` (`#venta-cliente`, `#form-renglon`, tabla de renglones, `#venta-total`); este change no agrega ni reestructura HTML.
- Dependencia: C-03 provee clientes y libros existentes.

## Goals / Non-Goals

**Goals:**

- Verificar y completar `agregarRenglon`, `recalcularRenglon`, `calcularTotal` y `formatearImporte` en `js/logica.js` como funciones puras testeables en Node.
- Verificar y completar `renderRenglones` en `js/app.js` y el wiring del `submit` de `#form-renglon`.
- Garantizar que las reglas RN-VE-01…RN-VE-07 se cumplan de punta a punta, con mensajes de error accionables.

**Non-Goals:**

- Confirmar la venta, snapshot histórico, persistencia y limpieza del formulario (C-07).
- Historial y detalle (C-08).
- Persistencia en `localStorage` (C-09).
- Referencias a nombres de función en la spec: el design las menciona como ayuda de implementación; la spec describe solo comportamiento observable.

## Decisions

**1. Mantener la frontera lógica/DOM.**
`js/logica.js` recibe datos planos (renglones, libro, cantidad) y devuelve un resultado puro (nuevo array + error opcional); `js/app.js` es el único que toca el DOM.

- Alternativas: (a) manipular los renglones directamente en `app.js` — descartado, rompe los tests de Node y mezcla responsabilidades; (b) usar una clase `Venta` — descartado, el proyecto no usa clases ni frameworks, y complica el doble contrato navegador/Node.

**2. `agregarRenglon` devuelve un resultado explícito, no lanza excepciones.**
Forma `{ ok: boolean, renglones: [...], error?: string }`, para que `app.js` muestre el mensaje sin try/catch.

- Alternativas: lanzar `Error` — descartado, obliga a try/catch en el wiring y complica los tests; devolver `null` — descartado, pierde el motivo del rechazo (cantidad inválida vs. duplicado).

**3. Validar la cantidad con una sola regla reutilizable.**
`cantidad` válida ⇔ `Number.isInteger(cantidad) && cantidad > 0`. La misma comprobación se usa en alta y en edición (`recalcularRenglon`), cumpliendo RN-VE-02 y RN-VE-04 de forma consistente.

- Alternativas: `parseInt` silencioso — descartado, aceptaría `"2abc"` como 2; validación duplicada en cada función — descartado, riesgo de divergencia.

**4. No repetición por `libroId` con mensaje literal.**
El duplicado se detecta comparando `libroId`; el mensaje es «Ese libro ya forma parte de la venta…» para coincidir con `07_flujos_principales.md` §Flujo 5. No se modifica la cantidad del renglón existente automáticamente (RN-VE-03).

- Alternativas: sumar la cantidad al renglón existente — descartado, el flujo pide informar el duplicado; comparar por título — descartado, dos libros distintos podrían compartir título.

**5. Cálculo derivado, nunca almacenado por separado.**
`subtotal` se recalcula como `cantidad × precioUnitario` en cada cambio y `total` como `reduce` de los subtotales (RN-VE-05, RN-VE-06); evitar guardar un total incremental reduce el riesgo de desincronización.

- Alternativas: acumular el total incrementalmente — descartado, propenso a drift al editar/quitar renglones.

**6. `formatearImporte` centraliza el formato de dos decimales.**
Una única función (`toFixed(2)` y separador acorde) usada por precio unitario, subtotal y total, para cumplir RN-VE-07 en todos los puntos de la vista.

- Alternativas: formatear en cada punto de render — descartado, duplica la regla y facilita inconsistencias.

## Risks / Trade-offs

- **[Validación duplicada navegador/Node]** Si la validación de cantidad vive en dos lugares, puede divergir → una sola función de validación reutilizada por alta y edición, más tests compartidos.
- **[Estado mutable de la venta en curso]** Editar o quitar renglones puede dejar el total desincronizado → derivar siempre el total de los subtotales vigentes y re-renderizar tras cada mutación.
- **[Cantidad como string del input]** El valor del `<input>` llega como string → convertir explícitamente y validar con `Number.isInteger` antes de operar.
- **[Mensajes de error no normalizados]** Textos distintos romperían la verificación de RN-VE-03 → fijar el mensaje literal del flujo y reutilizarlo.
- **[Alcance difuso con C-07]** Tocar confirmación aquí duplicaría trabajo y rompería la frontera de governance → la composición termina en el estado en memoria; confirmar queda fuera de alcance.

## Migration Plan

1. Auditar `agregarRenglon`, `recalcularRenglon`, `calcularTotal` y `formatearImporte` en `js/logica.js` contra RN-VE-02…RN-VE-07; corregir lo que falte sin cambiar sus firmas.
2. Auditar `renderRenglones` y el wiring de `#form-renglon` en `js/app.js` para que muestren libro, cantidad editable, precio unitario y subtotal, y actualicen `#venta-total`.
3. Correr `pruebas/test-logica.js` (§Caso 4 y §Caso 5: 2×1500 + 1×2000 = 3000/2000/5000 y formato) y verificar los casos manuales del Ejercicio 5 en el navegador.
4. Sin migración de datos: la venta en curso es en memoria y no persiste en este change. Rollback = revertir los cambios en `js/logica.js` y `js/app.js`.

## Open Questions

- Ninguna que afecte specs, enfoque o desglose de tareas. El manejo de persistencia y confirmación se difiere explícitamente a C-07/C-09.
