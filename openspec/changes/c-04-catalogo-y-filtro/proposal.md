# Proposal: c-04-catalogo-y-filtro

## Why

La consigna del TPI (Ejercicio 3) exige que JavaScript genere el catálogo a partir del array de libros, mostrando en cada tarjeta título, ISBN, editorial, género, autores y precio, y que el filtro por título ignore mayúsculas, busque coincidencias parciales y recorte los espacios sobrantes. `js/app.js` ya tiene `renderCatalogo()` y `js/logica.js` ya tiene `filtrarLibros()`, pero no hay evidencia registrada de que cubran **todos** los bordes (género ausente, búsqueda vacía, sin coincidencias, inserción segura como texto) ni de que los estados del buscador sean correctos.

Sin esa verificación, los 5 puntos de renderizado y los 5 de filtro/estados quedan sin respaldo objetivo, y cualquier hueco se propaga a los changes posteriores (altas de libros, ventas) que reutilizan el mismo catálogo y los mismos helpers.

## What Changes

- Auditoría y corrección de `renderCatalogo()` en `js/app.js`: la tarjeta de cada libro se genera recorriendo el array de libros y muestra **título, ISBN, editorial, género, autores y precio**, insertando todos los valores con `textContent` (nunca `innerHTML` con datos).
- Verificación de que un libro **sin género** se presenta como «Sin clasificar» a través de `nombreGenero()` de `js/logica.js`.
- Auditoría y corrección de `filtrarLibros()` en `js/logica.js`: el filtro **ignora mayúsculas/minúsculas**, busca por **coincidencia parcial** (substring) del título y **recorta espacios** en los extremos; búsqueda vacía ⇒ devuelve **todo** el catálogo; sin coincidencias ⇒ no devuelve tarjetas.
- Verificación de los **estados de UI del buscador** en `#mensaje-catalogo`: texto distinto e inequívoco para «catálogo completo», «N resultados» y «sin coincidencias», y un botón «Limpiar búsqueda» que resetea el campo y devuelve el foco a la búsqueda.
- Extensión de `pruebas/test-logica.js` §Caso 1 solo si falta algún borde del filtro (título con caracteres especiales insertado como texto).
- Sin cambios en reglas de negocio: el cambio es de verificación/completado del comportamiento ya especificado.

## Capabilities

### New Capabilities
- `catalogo`: comportamiento de exploración del catálogo — renderizado de una tarjeta por libro desde el array de libros con sus datos resueltos (título, ISBN, editorial, género, autores y precio), presentación de «Sin clasificar» cuando el género está ausente, filtro por título tolerante a mayúsculas/espacios con coincidencia parcial, e inserción del texto de los datos de forma segura; junto con los estados de UI del buscador (catálogo completo, N resultados, sin coincidencias) y la acción de limpiar la búsqueda.

### Modified Capabilities
_(ninguna — no hay specs previas en `openspec/specs/`)_

## Impact

- **Archivos afectados**: `js/app.js` (`renderCatalogo()` y `iniciarCatalogo()`), `js/logica.js` (`filtrarLibros()` y helpers de resolución de nombres si hiciera falta), `pruebas/test-logica.js` (solo si falta una aserción de borde del filtro). No se toca `index.html` ni `css/`.
- **Sin cambios de comportamiento observable** en navegación, altas, ventas ni persistencia más allá de que el catálogo y su filtro queden garantizados contra los bordes especificados.
- **Sin dependencias nuevas** (restricción dura: cero librerías, frameworks, CDNs ni backend).
- **Riesgo**: bajo. Governance: BAJO. Si el catálogo ya está completo, el change se resuelve como auditoría con evidencia.
- **Depende de**: C-03 (`datos-iniciales-relaciones`), que garantiza el array de libros y sus relaciones resueltas.
- **Habilita**: C-05 (`altas-libros-clientes`), que re-renderiza el catálogo tras dar de alta un libro.
