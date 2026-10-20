# Design: c-01-base-semantica-html

## Context

Ver `proposal.md` — Why. Punto de partida: `index.html` ya existe con las cinco vistas como `section`, cabecera, navegación, `main` y pie. `js/app.js` ya renderiza los listados y maneja la navegación. No hay specs previas en `openspec/specs/`, así que esta capability (`html-semantico`) nace acá.

Restricción dura del proyecto: solo HTML/CSS/JS nativos, sin librerías, frameworks ni CDNs, y el proyecto debe abrirse con doble clic en `index.html`.

## Goals / Non-Goals

**Goals**
- Auditar y completar la estructura semántica de las cinco vistas contra el Ejercicio 1.
- Garantizar etiqueta asociada en todos los campos, textos de acción en los botones, `caption` + `th scope` en las tablas y nodos de estado en cada vista.
- Dejar evidencia verificable (checklist) de cada criterio de aceptación.

**Non-Goals**
- No se toca la lógica de negocio (validaciones, cálculos, persistencia) — viven en `js/logica.js` y son alcance de otros changes.
- No se rediseña la estética (eso es C-02).
- No se agregan dependencias ni pasos de build.

## Decisions

### D-01 — Una sola página con cinco `section`
**Decisión**: mantener la SPA de un solo `index.html` con las cinco vistas como `section`.
**Motivo**: el estado en memoria debe compartirse entre vistas (una alta de libro debe refrescar los selectores de venta sin recargar), y la consigna permite explícitamente secciones de una misma página.
**Alternativas**: cinco archivos HTML — descartado por duplicar estado y romper la actualización sin recarga.

### D-02 — Etiquetado del input de cantidad dinámico
**Decisión**: en la tabla de renglones, el input de cantidad de cada fila expone un nombre accesible que identifica el libro (se mantiene `aria-label` construido con el título, ya que la fila es generada dinámicamente y no puede tener un `label` estático con `for` único).
**Motivo**: un `label` con `for` requiere `id` estable; los renglones se recrean al editar/quitar. El `aria-label` describe el propósito sin colisionar ids.
**Alternativas**: generar `id="cantidad-{libroId}"` y un `label` por fila — más markup y riesgo de ids duplicados al re-renderizar; descartado.

### D-03 — Nodos de estado por vista
**Decisión**: mantener nodos dedicados (`#mensaje-*`, `#vacio-*`, `#errores-*`) con `role="status"` / `role="alert"` y `aria-live`, y asegurar que exista uno por cada caso exigido.
**Motivo**: la consigna pide mensajes explícitos y la accesibilidad básica pide que se anuncien.
**Alternativas**: un único nodo genérico de mensajes — descartado por perder contexto entre vistas.

### D-04 — `textContent` en todo el render
**Decisión**: confirmar y mantener que ningún dato de usuario se inserta con `innerHTML`; el armado de tarjetas/filas usa `createElement` + `textContent`.
**Motivo**: RN-CA-08 (inserción segura) y evita interpretación de HTML en títulos/comentarios.

## Risks / Trade-offs

- [Un `aria-label` no equivale a `label` visible] → se documenta la excepción en el checklist y se verifica que el nombre accesible exista; el resto de los campos usa `label` con `for`.
- [Auditoría "de papel" sin ejecutar] → cada criterio se marca con evidencia observada; nada se da por aprobado sin inspeccionarlo en el archivo real.
- [Tocar `index.html` podría romper `app.js`] → los cambios se limitan a estructura/atributos; se re-ejecuta `node pruebas/test-logica.js` (37/37) y se abre la página para confirmar que las cinco vistas siguen funcionando.

## Migration Plan

1. Auditar `index.html` sección por sección y anotar huecos.
2. Corregir etiquetas, capciones, `scope` y nodos de estado faltantes.
3. Verificar que `js/app.js` sigue resolviendo los selectores/elementos usados.
4. Re-ejecutar las pruebas de lógica y la apertura manual de la página.
5. Commit + push del hito.

**Rollback**: `git revert` del commit del change; no hay migración de datos.

## Open Questions

- ¿El profesor espera un lector de pantalla real o alcanza el recorrido por Tab/Shift+Tab? (ver `knowledge-base/10_preguntas_abiertas.md`). No bloquea este change.
