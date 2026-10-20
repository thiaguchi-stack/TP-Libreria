# Design

## Context

Ver `proposal.md — Why`. El proyecto es frontend puro que se abre con `file://`, sin backend, sin build y sin dependencias; `js/logica.js` concentra la lógica pura con doble contrato globals/`module.exports` para poder probarla con Node sin navegador (DD-01, DD-03). El estado vive en `localStorage` bajo la clave `tp_libreria_estado` con la forma `{ libros, clientes, ventas }` (RN-PE-01), y el historial conserva el precio unitario copiado al confirmar la venta (RN-VE-10, RN-HI-03). Este change no agrega funcionalidad: cierra el TPI verificando el comportamiento ya implementado. La restricción dura es no tocar `js/`, `css/` ni `index.html`, y no tocar los datos del proyecto original: por eso la prueba del precio histórico corre sobre una **copia** y editando solo el catálogo guardado.

## Goals / Non-Goals

**Goals:**
- Definir un método reproducible para ejecutar y registrar la suite de lógica (`node pruebas/test-logica.js`) con su resultado real.
- Definir el procedimiento exacto de la prueba guiada del precio histórico sobre una copia de prueba, editando únicamente `tp_libreria_estado.libros`.
- Definir el conjunto de los 8 casos manuales de la consigna con método, resultado esperado y resultado observado.
- Fijar la regla: nada se marca aprobado sin haberse ejecutado; un caso que falla se registra con su comportamiento real.

**Non-Goals:**
- No modificar `js/`, `css/` ni `index.html` ni el contrato de las funciones puras.
- No agregar casos manuales nuevos fuera de los 8 de la consigna ni cambiar la suite de aserciones.
- No agregar librerías, frameworks, dependencias ni automatización de navegador.
- No volcar los resultados al README (eso es C-11 `readme-entrega`).

## Decisions

**1. Dos mecanismos de verificación complementarios: suite de Node + casos manuales.**
La suite cubre la lógica pura (validaciones, cálculos, persistencia) y los casos manuales cubren lo que la lógica no ve (DOM, navegación, responsive, foco). Cada caso manual de la consigna es una comprobación de interfaz, no de función.
- *Alternativas*: (a) solo la suite automática; (b) solo los casos manuales; (c) automatizar con Puppeteer/Playwright.
- *Por qué*: la restricción dura prohíbe dependencias, así que (c) queda descartado; (a) no ejerce DOM, teclado ni layout; (b) no da una corrida repetible de la lógica. La combinación es la que exige la consigna.
- *Costo aceptado*: los 8 casos manuales dependen de un navegador y de la ubicación de apertura, y no son automatizables dentro de la restricción.

**2. La prueba del precio histórico se ejecuta en una copia del proyecto.**
Se copia el proyecto a un directorio de prueba y se abre esa copia en el navegador. Se confirma una venta, se anotan importes, se edita solo el precio del libro en el catálogo guardado, se recarga y se consulta el detalle.
- *Alternativas*: (a) editar el `localStorage` de la instalación original; (b) agregar una pantalla de edición de precios.
- *Por qué*: (a) contaminaría los datos del proyecto original y la consigna pide una copia de prueba; (b) está fuera de alcance (no se exige pantalla para editar precios) y tocaría `js/`.
- *Costo aceptado*: la prueba es manual y depende de las herramientas de almacenamiento del navegador.

**3. Editar únicamente `tp_libreria_estado.libros`, nunca `ventas`.**
Dentro del JSON guardado se modifica solo el precio del libro en el arreglo `libros`; el arreglo `ventas` queda intacto. Así la comprobación aísla si el historial relee el catálogo o si conserva su copia.
- *Alternativas*: (a) editar `libros` y `ventas` a la vez; (b) borrar la clave y volver a sembrar.
- *Por qué*: (a) no probaría la inmutabilidad, porque el historial ya tendría los valores cambiados; (b) eliminaría la venta y no habría nada que verificar.
- *Costo aceptado*: hay que editar el JSON a mano con cuidado de no romper su forma (si se corrompe, la persistencia recarga el estado inicial, RN-PE-04).

**4. Los casos manuales se agrupan en 8 registros mapeados 1:1 con la consigna.**
Cada fila de la tabla del Ejercicio 6 se reproduce tal cual (búsqueda; ISBN dup/nuevo; email inválido/existente/nuevo; venta inválida/dup; venta válida 2×1500 + 1×2000; precio histórico; recarga sin duplicar; teclado + 320/1280 px).
- *Alternativas*: (a) descomponer cada fila en subcasos sueltos; (b) fusionar todo en una sola prueba exploratoria.
- *Por qué*: mantener 1:1 facilita que C-11 copie «los 8 casos» al README y que el docente coteje contra la consigna sin ambigüedad.
- *Costo aceptado*: un mismo registro puede cubrir varias aserciones de interfaz; se documenta cada resultado parcial dentro del propio registro.

## Risks / Trade-offs

- **[Resultado registrado sin haberse ejecutado]** → Mitigación: la tarea 1.1/2.x/3.x exige correr el comando o reproducir el caso antes de escribir «pasa»; la regla del spec «Ninguna prueba se aprueba sin ejecutarla» y el escenario «Caso fallido o pendiente declarado» lo cubren.
- **[Corromper el JSON al editar el precio a mano]** → Mitigación: editar solo el número del precio dentro de `libros`, validar que el JSON siga completo y, si se corrompe, sembrar de nuevo y repetir el caso; además se trabaja sobre una copia, nunca sobre el original.
- **[La suite podría no dar 37/37 si cambió la lógica en C-04/C-05]** → Mitigación: registrar el número real observado y, si difiere del baseline de 37, anotar la diferencia; no forzar el número esperado.
- **[Layout y teclado dependen del navegador]** → Mitigación: documentar el navegador y los anchos usados (320 px y 1280 px) al registrar el caso 8; el criterio objetivo es ausencia de desplazamiento horizontal y foco visible.
- **[Datos de la prueba contaminan el proyecto original]** → Mitigación: todo el caso 6 se hace sobre una copia de prueba; el proyecto original no se modifica y no se toca `js/`, `css/` ni `index.html`.

## Migration Plan

1. Copiar el proyecto a un directorio de prueba para el caso 6 (precio histórico).
2. Ejecutar `node pruebas/test-logica.js` y registrar el resultado real (baseline: 37 pasadas, 0 falladas).
3. Reproducir la prueba del precio histórico en la copia: confirmar venta, anotar importes, editar solo `tp_libreria_estado.libros`, recargar y verificar el detalle.
4. Recorrer y registrar los 8 casos manuales restantes con su resultado observado.
5. *Rollback*: no hay migración de datos ni cambio de código. Borrar el directorio de la copia de prueba y, si se hubiera editado la clave en el navegador de trabajo, borrar `tp_libreria_estado` restaura el primer inicio. El proyecto original queda intacto.

## Open Questions

- ¿Conviene versionar los resultados de la verificación (por ejemplo, una fecha por corrida) para futuras re-verificaciones, o alcanza con el registro puntual que volcará C-11 al README? Se puede decidir después sin cambiar las specs ni el enfoque.
- ¿Debería la suite incorporar en el futuro un modo que imprima cada aserción individual (no solo el total) para la evidencia del docente? Queda fuera del alcance de este change y no altera los escenarios definidos.
