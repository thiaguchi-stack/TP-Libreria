# Proposal: c-01-base-semantica-html

## Why

La consigna del TPI (Ejercicio 1, 20 puntos) exige cinco vistas navegables con HTML semántico, etiquetas asociadas a cada campo, botones que describen su acción, tablas con encabezados y mensajes para listas vacías, búsquedas sin resultados y operaciones correctas o rechazadas.

`index.html` ya existe y cubre buena parte de esto, pero no hay evidencia registrada de que **cada** campo tenga etiqueta asociada, que cada vista tenga todos sus nodos de estado y que el render use siempre `textContent`. Sin esta auditoría, los 10 puntos de semántica/estados quedan sin verificar objetivamente.

## What Changes

- Auditoría y corrección de las cinco vistas (`#catalogo`, `#libros`, `#clientes`, `#ventas`, `#historial`) como `<section>` con `id` y `aria-labelledby`.
- Verificación de la estructura semántica: `<header>`, `<nav>`, `<main>`, `<footer>`, y consistencia entre las anclas del menú (`data-vista`) y `js/app.js`.
- Verificación de `label` ↔ control (`for`/`id`) en **todos** los campos; en particular el input de cantidad por renglón, que hoy se rotula dinámicamente con `aria-label`.
- Verificación de que todo botón tenga texto que describa su acción y que toda tabla tenga `<caption>` y `<th scope>`.
- Verificación de que exista un nodo de estado visible por caso: lista vacía, sin resultados, éxito y error, en cada vista.
- Confirmación de que ningún dato de usuario se inserta con `innerHTML` (todo pasa por `textContent`).
- Registro del checklist de evidencia en el propio change.

## Capabilities

### New Capabilities
- `html-semantico`: contrato de estructura y accesibilidad básica de las vistas — navegación entre vistas, etiquetado de campos, semántica de tablas y mensajes de estado.

### Modified Capabilities
_(ninguna — no hay specs previas en `openspec/specs/`)_

## Impact

- **Archivos afectados**: `index.html` (estructura/etiquetas/nodos de estado), `js/app.js` (solo si algún render necesitara ajuste de accesibilidad).
- **Sin cambios de comportamiento observable** en las operaciones de negocio; es una capa de estructura y accesibilidad.
- **Sin dependencias nuevas** (restricción dura: cero librerías/frameworks/CDNs).
- **Riesgo**: bajo. Governance: BAJO.
- **Habilita**: C-02 (`estilos-identidad-accesible`) y todo el resto de la UI, que verifica contra esta base.
