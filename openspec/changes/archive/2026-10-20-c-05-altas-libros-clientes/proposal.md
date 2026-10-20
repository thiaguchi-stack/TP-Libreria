# Proposal: c-05-altas-libros-clientes

## Why

La consigna del TPI (Ejercicio 4, 15 pts) exige que el bibliotecario pueda registrar libros con sus relaciones (editorial, género, autores) y clientes, con validaciones explícitas y sin recargar la página. `js/app.js` ya tiene `popularSelectsLibro()` y los handlers de `#form-libro` / `#form-cliente`, y `js/logica.js` ya tiene `validarLibro()` y `validarCliente()`, pero no hay evidencia registrada de que cubran **todos** los bordes de RN-LI-01…RN-LI-10 y RN-CL-01…RN-CL-05 (género «Sin clasificar» mapeado a `null`, ISBN normalizado sin espacios ni guiones, precio numérico > 0, al menos un autor, email único sin espacios exteriores ni mayúsculas, re-render sin recargar).

Sin esa verificación, los 15 puntos del Ejercicio 4 quedan sin respaldo objetivo y los huecos se propagan a los changes posteriores que reutilizan los listados y selectores de venta.

## What Changes

- Auditoría y corrección de `popularSelectsLibro()` en `js/app.js`: los selectores de **editorial**, **género** y **autores** se generan desde los datos locales (`estado.editoriales`, `estado.generos`, `estado.autores`); el selector de género incluye la opción **«Sin clasificar»** que se mapea a `generoId = null` (no a un id inexistente).
- Auditoría y corrección del handler de `#form-libro`: `preventDefault`, armado de `{ titulo, isbn, precio, editorialId, generoId, autorIds }`, llamada a `validarLibro(datos, contexto)` y presentación de errores en `#errores-libro` **cerca del formulario**. Alta exitosa ⇒ asignar `id`, agregar al array, guardar estado y re-renderizar listado, catálogo y selectores de venta **sin recargar**.
- Verificación de `validarLibro()` en `js/logica.js`: **título** no vacío (recortando espacios), **ISBN** no vacío y **único normalizado sin espacios ni guiones** (`normalizarISBN`), **precio numérico > 0**, **editorial existente**, **al menos un autor** y todos existentes, **género opcional** validado solo cuando hay id (acepta `null`/`""` como ausencia — IN-02).
- Auditoría y corrección del handler de `#form-cliente`: `preventDefault`, armado de `{ nombreCompleto, email }`, llamada a `validarCliente(datos, contexto)` y errores en `#errores-cliente`. Alta exitosa ⇒ agregar, guardar y actualizar listado y selector de cliente **sin recargar**.
- Verificación de `validarCliente()` en `js/logica.js`: **nombre** y **email** no vacíos, **formato de email** válido (`formatoEmailValido`), **email único** comparado **sin espacios exteriores ni mayúsculas**.
- Extensión de `pruebas/test-logica.js` §Casos 2 y 3 solo si falta algún borde (p. ej. ISBN duplicado escrito con otro separador: `978-3-16` vs `978316`).
- Sin cambios en reglas de negocio: el change es de verificación/completado del comportamiento ya especificado.

## Capabilities

### New Capabilities
- `altas`: comportamiento de registro de libros y clientes — generación de los selectores de relación (editorial, género con «Sin clasificar», autores) desde los datos locales, validación de los datos de libro (título, ISBN único normalizado, precio numérico > 0, relaciones existentes, al menos un autor, género opcional mapeado a `null`) y de los datos de cliente (nombre y email no vacíos, formato de email válido, email único sin espacios exteriores ni mayúsculas), control del envío con `preventDefault`, presentación de errores junto al formulario y actualización de listados y opciones relacionadas sin recargar la página.

### Modified Capabilities
_(ninguna — no hay specs previas en `openspec/specs/`)_

## Impact

- **Archivos afectados**: `js/app.js` (`popularSelectsLibro()`, `iniciarFormularioLibro()`, `iniciarFormularioCliente()`), `js/logica.js` (`validarLibro()`, `validarCliente()` y `normalizarISBN`/`formatoEmailValido` si hiciera falta), `pruebas/test-logica.js` (solo si falta una aserción de borde en §Casos 2 y 3). No se toca `index.html` ni `css/`.
- **Sin cambios de comportamiento observable** fuera de garantizar que las altas de libros y clientes queden cubiertas contra los bordes especificados.
- **Sin dependencias nuevas** (restricción dura: cero librerías, frameworks, CDNs ni backend).
- **Riesgo**: bajo/medio. Governance: MEDIO. Si las altas ya están completas, el change se resuelve como auditoría con evidencia.
- **Depende de**: C-04 (`catalogo-y-filtro`), que deja el catálogo y sus helpers verificados para el re-render post-alta.
- **Habilita**: C-10 (`verificacion-prueba-historica`), que reproduce los casos manuales de alta (ISBN dup/nuevo, email inválido/dup/nuevo).
