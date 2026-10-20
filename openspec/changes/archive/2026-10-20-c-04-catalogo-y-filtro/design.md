# Design: c-04-catalogo-y-filtro

## Context

Ver `proposal.md` §Why para la motivación.

Estado actual y restricciones que condicionan el enfoque:

- **Restricción dura**: frontend puro sobre `file://`, sin backend, sin bundler, sin librerías ni CDNs (RN-EX-01, RN-PR-10, DD-01). Los scripts se cargan en orden global en `index.html`: `js/datos.js` → `js/logica.js` → `js/app.js`; no hay módulos ES.
- `js/app.js` §`renderCatalogo()` ya recorre `estado.libros`, llama a `filtrarLibros()` y construye las tarjetas con `document.createElement` + `textContent`; `iniciarCatalogo()` ya engancha `submit` de `#form-busqueda`, el evento `input` del campo y el botón `#btn-limpiar-busqueda`.
- `js/logica.js` §`filtrarLibros(libros, textoBusqueda)` ya delega en `textoNormalizado()` (trim + toLowerCase) y filtra por `includes()`; `nombreGenero()` ya devuelve «Sin clasificar» cuando el `generoId` es `null`/`undefined`/`""` o no resuelve.
- **Separación lógica/DOM** (DD-03, patrón «Lógica pura desacoplada del DOM»): el filtro vive en `js/logica.js` (probable con Node) y el render y los eventos en `js/app.js`. El change MUST respetar esta frontera.
- **Inserción segura** (RN-CA-08, patrón «Inserción segura de texto»): el catálogo nunca usa `innerHTML` con datos; los helpers de resolución (`nombreEditorial`, `nombreGenero`, `nombresAutores`) devuelven texto.
- El seed de `libros` y sus relaciones es responsabilidad de C-03; este change asume el array ya válido (al menos un libro sin género para ejercitar «Sin clasificar»).
- `pruebas/test-logica.js` corre con Node sobre `js/logica.js` y ya cubre el filtro (§Caso 1); la suite es la evidencia objetiva primaria del filtro.

## Goals / Non-Goals

**Goals:**

- Dejar `renderCatalogo()` verificado contra RN-CA-01, RN-CA-02 y RN-CA-08: una tarjeta por libro con los seis datos, género ausente como «Sin clasificar» y toda inserción por `textContent`.
- Dejar `filtrarLibros()` verificado contra RN-CA-03, RN-CA-04, RN-CA-05 y RN-CA-06: mayúsculas ignoradas, coincidencia parcial, espacios recortados y búsqueda vacía ⇒ todo.
- Dejar los **estados de UI del buscador** verificados: mensaje distinto para catálogo completo / N resultados / sin coincidencias (RN-CA-07 y RN-PR-05), y acción de limpiar que resetea y devuelve el foco (RN-PR-08).
- Producir evidencia reproducible: corrida de `node pruebas/test-logica.js` y checklist de bordes del filtro y del render.

**Non-Goals:**

- No se implementa el alta de libros ni la actualización del catálogo tras un alta (pertenece a C-05).
- No se implementa persistencia ni carga de estado (pertenece a C-09).
- No se agrega paginación, ordenamiento ni filtros por otros campos distintos del título (fuera de alcance de la consigna).
- No se modifica `index.html` ni `css/`: los nodos `#listado-catalogo`, `#mensaje-catalogo`, `#buscar-titulo`, `#form-busqueda` y `#btn-limpiar-busqueda` ya existen.
- No se modifica el modelo de datos ni el seed (pertenece a C-03).
- No se introducen dependencias: Node solo se usa como herramienta de desarrollo, igual que en el resto del proyecto.

## Decisions

### D-01 — El filtro permanece en `js/logica.js`, el render y los eventos en `js/app.js`

**Decisión**: `filtrarLibros()` sigue siendo una función pura en `js/logica.js` (sin tocar `document`); `renderCatalogo()` y `iniciarCatalogo()` en `js/app.js` consumen esa función y manipulan el DOM.

**Rationale**: respeta el patrón «Lógica pura desacoplada del DOM» (DD-03), permite probar el filtro con Node sin navegador y mantiene la separación estructura/estilos/comportamiento que la consigna evalúa.

**Alternativas consideradas**:
- (a) Filtrar dentro de `renderCatalogo()` en `app.js`: acopla la regla de negocio al DOM y obliga a simular un navegador para probarla.
- (b) Duplicar la lógica en ambos archivos: fuente de verdad doble y riesgo de divergencia entre el filtro probado y el que corre.

### D-02 — Normalización del término en una única función reutilizada

**Decisión**: el recorte de espacios y la conversión a minúsculas se hacen con el helper `textoNormalizado()` (trim + toLowerCase) sobre el término de búsqueda y sobre el título comparado, de modo que RN-CA-03 y RN-CA-05 se cumplan en un solo lugar.

**Rationale**: concisión y una única definición de «normalizar» evita que un borde (por ejemplo, espacios internos duplicados) se resuelva distinto entre el término y el título.

**Alternativas consideradas**:
- (a) Normalizar inline con `String(x).trim().toLowerCase()` repetido en cada punto: duplica la regla y es fácil de desalinear.
- (b) Usar `localeCompare`/normalización Unicode: agrega complejidad que la consigna no exige (fuera de alcance).

### D-03 — Coincidencia por `includes()` sobre el título normalizado

**Decisión**: la coincidencia parcial (RN-CA-04) se implementa con `textoNormalizado(libro.titulo).includes(termino)`, es decir, substring sobre el título.

**Rationale**: es exactamente lo que pide RN-CA-04 («substring dentro del título») y no requiere índices ni expresiones regulares.

**Alternativas consideradas**:
- (a) `startsWith()`: incumple RN-CA-04 (no encontraría coincidencias en el medio del título).
- (b) Búsqueda por expresión regular construida con el término del usuario: requiere escapar el término y abre la puerta a entradas que rompan el patrón.

### D-04 — Búsqueda vacía devuelve una copia del array completo

**Decisión**: cuando el término normalizado es `""`, `filtrarLibros()` devuelve `libros.slice()` (copia) en lugar del mismo array.

**Rationale**: cumple RN-CA-06 (búsqueda vacía ⇒ todo) y devuelve una colección nueva en todos los casos, evitando que el llamador mute por accidente el array de estado. Es el comportamiento ya presente y verificado.

**Alternativas consideradas**:
- (a) Devolver el array original sin copiar: expone el estado a mutaciones accidentales desde el render.
- (b) Devolver `[]` y tratar el caso vacío en el render: mueve la regla de negocio al DOM y contradice RN-CA-06.

### D-05 — «Sin clasificar» producido en la capa de presentación por `nombreGenero()`

**Decisión**: el dato guarda `generoId: null` para ausencia de género y la etiqueta «Sin clasificar» se genera únicamente al renderizar, vía `nombreGenero()` de `js/logica.js`.

**Rationale**: cumple RN-CA-02 sin contaminar el modelo (coherente con D-04 de C-03) y hace que cualquier género no resoluble —`null`, `undefined`, `""` o id inexistente— caiga en el mismo texto de fallback.

**Alternativas consideradas**:
- (a) Guardar la cadena «Sin clasificar» como género: mezcla presentación con datos.
- (b) Resolver el fallback en `renderCatalogo()` con un `if` propio: duplica la regla que ya existe en `nombreGenero()`.

### D-06 — Render por nodos del DOM y nunca `innerHTML` con datos

**Decisión**: cada tarjeta se arma con `document.createElement` + `textContent` para los valores del libro; los helpers de resolución devuelven texto plano.

**Rationale**: cumple RN-CA-08 y el patrón «Inserción segura de texto», y hace que un título con `<`, `>` o `&` se muestre literalmente.

**Alternativas consideradas**:
- (a) Plantillas con `innerHTML` y concatenación: introduce riesgo de inyección y falla RN-CA-08.
- (b) `<template>` clonado con `innerHTML` inicial: válido en general, pero aquí no aporta sobre `createElement` y agrega marcado en `index.html`, que este change no toca.

### D-07 — Estados del buscador derivados de la cantidad de resultados y del término

**Decisión**: `renderCatalogo()` decide el mensaje a partir de dos señales: si el término está vacío (⇒ «catálogo completo» con la cantidad) o no, y si la cantidad de resultados es cero. «Sin coincidencias» se distingue de «catálogo vacío» por el término.

**Rationale**: cubre RN-CA-07 y RN-PR-05 con un texto distinto e inequívoco por estado, sin introducir un estado adicional en memoria: el mensaje es siempre un reflejo derivado de los datos y del término actual.

**Alternativas consideradas**:
- (a) Guardar un `estadoBusqueda` separado en el objeto de estado: agrega estado duplicable y una fuente de desincronización.
- (b) Reutilizar el mismo texto para «sin coincidencias» y «catálogo vacío»: incumple la exigencia de un mensaje claro y distinto (RN-CA-07).

### D-08 — La acción de limpiar resetea el campo y devuelve el foco

**Decisión**: el botón `#btn-limpiar-busqueda` vacía el valor del campo, invoca el re-render y llama a `focus()` sobre el campo de búsqueda.

**Rationale**: cumple la acción de limpiar de la capability y RN-PR-08 (foco gestionado con teclado), dejando el buscador listo para una nueva consulta.

**Alternativas consideradas**:
- (a) Solo vaciar el campo sin devolver el foco: obliga a reubicar el foco a mano y no cierra el ciclo de teclado.
- (b) Recargar la página: viola RN-EX-01/RN-LI-10 (todo se actualiza sin recargar) y perdería el estado en memoria.

## Risks / Trade-offs

- **Filtro que normaliza solo el término y no el título** → el helper `textoNormalizado()` se aplica a ambos lados (D-02) y la suite §Caso 1 cubre mayúsculas; se agrega el borde si falta.
- **Género no resoluble mostrado en blanco** → `nombreGenero()` centraliza el fallback «Sin clasificar» (D-05); se verifica con un libro sin género del seed de C-03.
- **Inyección de HTML por un título con caracteres especiales** → render por `textContent` (D-06); se agrega un caso de título con `<`/`&` a la suite si no existe.
- **Mensajes de estado ambiguos** → se derivan de la cantidad de resultados y del término (D-07), con un texto propio por estado; se revisan los tres mensajes en la prueba manual.
- **La acción de limpiar deja el foco perdido** → `focus()` explícito tras limpiar (D-08); se verifica el recorrido con Tab/Shift+Tab en la prueba manual.
- **Divergencia con la copia que el docente tenga en `localStorage`** → el catálogo se renderiza desde el estado cargado; si el seed cambió en C-03 hace falta borrar la clave para resembrar (RN-PE-03). No afecta las specs ni las tareas de este change.
- **Trade-off aceptado**: mantener `renderCatalogo()` como una sola función que resuelve render + mensaje es más simple de auditar, a costa de que un cambio futuro de un solo estado obligue a leer la función completa.

## Migration Plan

No hay migración de datos: el catálogo es una vista derivada del estado en memoria y no persiste nada propio. Pasos:

1. Auditar `js/logica.js` §`filtrarLibros()` y `textoNormalizado()` contra RN-CA-03…RN-CA-06; corregir solo si algún borde no se cumple.
2. Auditar `js/app.js` §`renderCatalogo()` contra RN-CA-01, RN-CA-02, RN-CA-07 y RN-CA-08; corregir solo si falta algún dato, el fallback de género o la distinción de mensajes.
3. Correr `node pruebas/test-logica.js`; agregar un borde del filtro solo si falta, y volver a correr hasta que pase sin fallos.
4. Verificación manual sobre `file://`: recorrer los tres estados del buscador y confirmar el mensaje, la cantidad de tarjetas y el foco tras limpiar.
5. **Rollback**: revertir `js/app.js` y, si se tocó, `js/logica.js` al estado previo; no hay datos persistidos por este change, por lo que el rollback es solo de código.
6. **Sin despliegue**: no hay build, ni servidor, ni pipeline.

## Open Questions

- ¿La prueba manual del catálogo conviene registrarla en el README? Es decisión de documentación posterior a C-11; no cambia las specs ni el desglose de tareas.
- ¿Se agregan aserciones de render (no solo de filtro) a la suite de Node? El render depende del DOM y la suite existente no lo simula; se cubre con la prueba manual, y sumar un entorno de DOM sintético implicaría una dependencia, fuera de alcance.
