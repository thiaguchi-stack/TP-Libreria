# Proposal: c-02-estilos-identidad-accesible

## Why

La consigna del TPI (Ejercicio 2, 20 puntos: coherencia 8, adaptación 8, accesibilidad 4) exige una identidad visual propia y coherente, layout con Flexbox/Grid, adaptación a 320 px y 1280 px sin desplazamiento horizontal del documento, foco visible y errores expresados con texto. `css/estilos.css` ya existe, pero no hay evidencia registrada de que cumpla **todos** los criterios con el estado actual del código.

Sin esta auditoría, los 20 puntos de presentación quedan sin verificar objetivamente y RN-PR-06…RN-PR-10 no tienen trazabilidad con una capability propia.

## What Changes

- Auditoría y corrección de `css/estilos.css` para consolidar la identidad visual propia: variables de color, tipografía y espaciado en `:root`, y clases reutilizables (`.tarjeta`, `.formulario`, `.boton`, `.campo`).
- Verificación del uso de **Flexbox/Grid**: `nav` y formularios con Flexbox; rejilla del catálogo con Grid (`repeat(auto-fill, minmax(...))`).
- Verificación de la adaptación a **320 px y 1280 px**: ausencia de scroll horizontal del documento y `.tabla-contenedor { overflow-x: auto }` para que cada tabla scrollee dentro de su contenedor.
- Verificación del **foco visible** real: `:focus-visible` en `input`, `select`, `button` y `a`, con recorrido completo por Tab/Shift+Tab.
- Verificación de que los **errores se expresen con texto** y no dependan solo del color.
- Reafirmación de **cero dependencias**: sin CDN, sin framework, sin `@import` externo.
- Registro de evidencia (medición 320/1280 px y recorrido de foco) en el propio change.

## Capabilities

### New Capabilities
- `estilos-visuales`: contrato de identidad visual y presentación adaptable del sistema — coherencia estética, layout con Flexbox/Grid, comportamiento responsive sin scroll horizontal del documento, foco visible por teclado, errores expresados con texto y ausencia de dependencias externas.

### Modified Capabilities
_(ninguna — la capability `html-semantico` de C-01 cubre estructura y semántica, no presentación; no cambian sus requirements)_

## Impact

- **Archivos afectados**: `css/estilos.css` (identidad visual, layout, responsive, foco y estados de error). No se toca `js/` ni `index.html` salvo lo estrictamente necesario para hooks de estilo; el change es de documentación/specs y auditoría, no de reescritura.
- **Sin cambios de comportamiento observable** en las operaciones de negocio; es una capa de presentación.
- **Sin dependencias nuevas** (restricción dura RN-PR-10: cero librerías/frameworks/CDNs).
- **Riesgo**: bajo. Governance: BAJO.
- **Depende de**: C-01 (`base-semantica-html`) — la estructura y las etiquetas sobre las que se aplican los estilos.
- **Habilita**: C-03 y el resto de la UI, que verifica contra esta base visual.
