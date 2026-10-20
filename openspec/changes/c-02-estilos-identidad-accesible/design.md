# Design: c-02-estilos-identidad-accesible

## Context

Ver `proposal.md` — Why. Punto de partida: `css/estilos.css` ya existe y aplica una identidad visual sobre la estructura de las cinco vistas definida en C-01. `index.html` referencia la hoja con `<link rel="stylesheet">` y no carga recursos externos. No hay specs previas en `openspec/specs/`, así que esta capability (`estilos-visuales`) nace acá.

Restricción dura del proyecto (RN-PR-10): solo HTML/CSS/JS nativos, sin librerías, frameworks ni CDNs, y el proyecto debe abrirse con doble clic en `index.html` (`file://`, sin build).

## Goals / Non-Goals

**Goals**
- Auditar y completar `css/estilos.css` contra el Ejercicio 2: identidad visual propia, Flexbox/Grid, responsive a 320/1280 px, foco visible y errores con texto.
- Dejar evidencia verificable de cada criterio: medición de ancho a 320/1280 px, recorrido de foco y confirmación de cero dependencias.
- Mantener la separación estructura (`index.html`) / estilos (`css/`) / comportamiento (`js/`).

**Non-Goals**
- No se toca la lógica de negocio ni el render (`js/logica.js`, `js/app.js`) — son alcance de otros changes.
- No se rediseña la estructura semántica (eso es C-01).
- No se agregan dependencias, preprocesadores ni pasos de build.
- No se introducen imágenes decorativas nuevas ni assets externos.

## Decisions

### D-01 — Identidad visual dirigida por variables en `:root`
**Decisión**: concentrar colores, tipografía y espaciado en variables CSS dentro de `:root` y consumirlas desde reglas y clases reutilizables (`.tarjeta`, `.formulario`, `.boton`, `.campo`).
**Motivo**: la consigna premia la «coherencia» (8 pts) y la reutilización de clases para elementos equivalentes; las variables evitan valores mágicos dispersos.
**Alternativas**: valores literales por regla — descartado por incoherencia y difícil mantenimiento.

### D-02 — Grid para la rejilla del catálogo, Flexbox para lo demás
**Decisión**: `.rejilla` del catálogo con `display: grid` y `repeat(auto-fill, minmax(...))`; `nav` y filas de formulario con `display: flex`.
**Motivo**: la rejilla de tarjetas se adapta sola al ancho del contenedor sin media queries; Flexbox resuelve alineación de barras y campos en una dimensión.
**Alternativas**: Flexbox con `flex-wrap` para el catálogo — válido pero requiere más cálculos de ancho y rompe la simetría de las tarjetas; descartado.

### D-03 — Adaptación sin scroll horizontal del documento
**Decisión**: trabajar con anchos fluidos (`max-width`, `width: 100%`), `box-sizing: border-box` global y evitar anchos fijos que excedan 320 px; las tablas anchas van dentro de `.tabla-contenedor { overflow-x: auto }`.
**Motivo**: RN-PR-06 y RN-PR-07 — el documento no debe scrollear horizontalmente, pero una tabla sí puede hacerlo dentro de su propio contenedor.
**Alternativas**: forzar `overflow-x: hidden` en `body` — descartado porque oculta el desborde en lugar de resolverlo.

### D-04 — Foco visible con `:focus-visible`
**Decisión**: definir un contorno de foco perceptible con `:focus-visible` en `input`, `select`, `button` y `a`, preservando el foco del navegador para el teclado.
**Motivo**: RN-PR-08 y criterio de accesibilidad (4 pts); `:focus-visible` evita contornos molestos en clics de mouse sin perderlo en teclado.
**Alternativas**: `outline: none` global — descartado por romper el recorrido por teclado; `:focus` sin matiz — válido pero más ruidoso en interacción con mouse.

### D-05 — Errores con texto, no solo color
**Decisión**: asegurar que los nodos de error (`.errores`, `.mensaje.error`) incluyan texto legible además del tratamiento de color.
**Motivo**: RN-PR-09 — el color es refuerzo, no el único portador del significado.
**Alternativas**: solo color rojo — descartado por exclusión de usuarios con daltonismo y por incumplir la consigna.

### D-06 — Cero dependencias
**Decisión**: mantener todo el CSS en archivos locales sin `@import` externo ni CDNs.
**Motivo**: RN-PR-10 y el requisito de apertura directa con `file://`.
**Alternativas**: usar una fuente o reset desde CDN — descartado; rompe la restricción dura.

## Risks / Trade-offs

- [Auditoría «de papel» sin ejecutar] → cada criterio se marca con evidencia observada (medición de ancho de scroll y recorrido de foco); nada se da por aprobado sin comprobarlo.
- [Fuentes del sistema distintas entre equipos] → se usa una pila de fuentes del sistema con alternativas (`font-family` con fallbacks), sin descargar tipografías externas.
- [`:focus-visible` no soportado en navegadores viejos] → se documenta que el foco base sigue visible; no bloquea la entrega en navegadores actuales.
- [Reacomodar estilos podría afectar tablas o formularios] → los cambios se limitan a CSS; se re-ejecuta `node pruebas/test-logica.js` (37/37) y se abre la página para confirmar que las cinco vistas siguen funcionando a 320/1280 px.

## Migration Plan

1. Auditar `css/estilos.css` bloque por bloque y anotar huecos contra RN-PR-06…RN-PR-10.
2. Consolidar variables de identidad, clases reutilizables y layout (Grid/Flexbox).
3. Ajustar responsive: anchos fluidos y `.tabla-contenedor` con scroll interno.
4. Verificar foco visible y errores con texto.
5. Medir a 320/1280 px y registrar el recorrido de foco; confirmar cero dependencias.
6. Re-ejecutar las pruebas de lógica y la apertura manual. Commit + push del hito.

**Rollback**: `git revert` del commit del change; no hay migración de datos ni cambios de estado.

## Open Questions

- ¿El profesor espera un contraste medido formalmente (WCAG AA) o alcanza con foco visible, errores en texto y layout adaptable? (ver `knowledge-base/10_preguntas_abiertas.md`). No bloquea este change.
