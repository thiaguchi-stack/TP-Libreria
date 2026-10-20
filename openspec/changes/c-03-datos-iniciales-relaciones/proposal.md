# Proposal: c-03-datos-iniciales-relaciones

## Why

La consigna del TPI (Ejercicio 3, 15 puntos: 5 por modelo de datos) exige representar libros, editoriales, géneros, autores y clientes con identificadores estables y un conjunto inicial mínimo (al menos seis libros, dos editoriales, dos géneros, tres autores y tres clientes ficticios), donde cada libro se relacione con una editorial existente y uno o más autores existentes, con el género como relación opcional. `js/datos.js` ya contiene un `DATOS_INICIALES`, pero no hay evidencia registrada de que los mínimos se cumplan, de que **todas** las claves foráneas resuelvan contra las entidades de referencia ni de que los identificadores no colisionen con los que genera `siguienteId()` en `js/logica.js`.

Sin esa verificación, los 5 puntos del modelo de datos quedan sin respaldo objetivo y cualquier inconsistencia referencial se propaga a los changes posteriores (catálogo, altas, ventas, persistencia), que consumen este seed como base.

## What Changes

- Auditoría y corrección de `js/datos.js` (`DATOS_INICIALES`) para confirmar los **mínimos** de la consigna: ≥6 libros, 2 editoriales, 2 géneros, 3 autores, 3 clientes y `ventas: []`.
- Verificación de la **integridad referencial** del seed: cada `libro.editorialId` resuelve a una editorial existente; cada `libro.autorIds` tiene al menos un autor existente y todos los ids declarados existen; `libro.generoId` puede ser `null` (⇒ «Sin clasificar») y, si no lo es, resuelve a un género existente.
- Verificación de **identificadores estables y únicos** por colección, y de que el rango de ids del seed no colisione con el primer id que devolvería `siguienteId()` en `js/logica.js`.
- Verificación de la coherencia del seed con `knowledge-base/04_modelo_de_datos.md` §Seed data inicial y con el helper `contexto()` de `pruebas/test-logica.js`.
- Incorporación de un **script de validación de integridad** que recorra el seed y compruebe que todos los FKs resuelven, como evidencia verificable.
- Sin cambios en las reglas de negocio ni en la interfaz: el cambio es de datos y de verificación.

## Capabilities

### New Capabilities
- `datos-locales`: contrato de los datos locales en memoria de la librería — modelo de datos con identificadores estables (libros, editoriales, géneros, autores, clientes), mínimos del conjunto inicial, integridad referencial entre libros y sus entidades de referencia (editorial y autores obligatorios, género opcional), y arranque con el historial de ventas vacío.

### Modified Capabilities
_(ninguna — no hay specs previas en `openspec/specs/`)_

## Impact

- **Archivos afectados**: `js/datos.js` (seed `/` `DATOS_INICIALES`), `pruebas/test-logica.js` (solo si el helper `contexto()` o una aserción de integridad necesitara ajuste). No se toca `index.html` ni `css/`.
- **Sin cambios de comportamiento observable** en navegación, catálogo, altas, ventas ni persistencia más allá de que el seed quede garantizado como válido.
- **Sin dependencias nuevas** (restricción dura: cero librerías, frameworks, CDNs ni backend).
- **Riesgo**: bajo. Governance: BAJO. Si el seed ya está completo, el change se resuelve como auditoría con evidencia.
- **Habilita**: C-04 (`catalogo-y-filtro`), C-06 (`venta-composicion`) y C-09 (`persistencia-localStorage`), que verifican sus comportamientos contra estos datos iniciales.
