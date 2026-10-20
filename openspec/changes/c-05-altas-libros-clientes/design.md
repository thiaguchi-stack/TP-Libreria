# Design: c-05-altas-libros-clientes

## Context

Ver `proposal.md §Why`. El proyecto es frontend puro (HTML/CSS/JS nativo, sin frameworks, sin backend, sin dependencias) que corre abriendo `index.html` bajo `file://` (RN-EX-01). La lógica pura vive en `js/logica.js` (validaciones + helpers, con doble contrato `global` + `module.exports` para poder probarla con Node — IN-01); el acceso al DOM vive en `js/app.js`.

Estado actual relevante:
- `js/app.js` ya define `popularSelectsLibro()`, `iniciarFormularioLibro()` y `iniciarFormularioCliente()`, con `preventDefault` y re-render post-alta (`renderListadoLibros`, `renderCatalogo`, `renderSelectsVenta`, `renderListadoClientes`).
- `js/logica.js` ya define `normalizarISBN()`, `textoNormalizado()`, `formatoEmailValido()`, `validarLibro()` y `validarCliente()`.
- El estado de `app.js` (`estado`) contiene `libros`, `clientes`, `ventas`, y las colecciones de lectura `editoriales`, `generos`, `autores` provenientes de `DATOS_INICIALES`.

El change es de **auditar, completar y endurecer** lo existente contra RN-LI-01…RN-LI-10 y RN-CL-01…RN-CL-05, no de reescribir.

## Goals / Non-Goals

**Goals:**
- Garantizar que las altas de libro y de cliente cumplan **todos** los bordes de las reglas, con evidencia objetiva (suite Node + reproducción manual).
- Confirmar el mapeo de «Sin clasificar» a `generoId = null` (IN-02) y que `validarLibro` nunca persista un `generoId` inexistente.
- Mantener el patrón existente: validación pura en `logica.js`, orquestación y DOM en `app.js`, inserción de texto con `textContent`.

**Non-Goals:**
- Edición o eliminación de libros/clientes (la consigna no lo exige y RN-VE-12 lo excluye para ventas).
- Validación del dígito de control del ISBN (RN-LI-04, fuera de alcance).
- Nuevas reglas de negocio, dependencias o cambios en `index.html` / `css/`.
- Persistencia (es C-09) más allá de invocar `guardarEstado` como ya lo hace `app.js`.

## Decisions

### D1 — La validación permanece pura en `logica.js`
`validarLibro(datos, contexto)` y `validarCliente(datos, contexto)` reciben datos + contexto y devuelven un array de errores, sin tocar el DOM. `app.js` sólo arma los datos, llama a la función y renderiza los errores.
- **Alternativas**: (a) validar dentro de los handlers de `app.js` — descartada, rompe el doble contrato y las pruebas Node; (b) usar validación nativa HTML5 (`required`, `type="email"`) como única fuente — descartada como fuente de verdad porque el mensaje/orden de errores debe ser controlable y testeable en Node; se conserva sólo como refuerzo del navegador.

### D2 — Normalización del ISBN sin espacios ni guiones
Reusar `normalizarISBN(isbn)` = `String(isbn).replace(/[\s-]/g, "").toUpperCase()` para comparar el ISBN nuevo contra los existentes (RN-LI-03). Se guarda el ISBN tal como lo escribió el usuario (recortado), pero la unicidad se evalúa sobre la forma normalizada.
- **Alternativas**: (a) guardar ya normalizado — descartada, cambia lo mostrado respecto de lo ingresado; (b) comparar con `===` sin normalizar — descartada, viola RN-LI-03 (`978-3-16` vs `978316` serían distintos).

### D3 — «Sin clasificar» se mapea a `null` en el borde de `app.js`
El `<option>` de género usa `value=""`; en `app.js` se convierte a `null` antes de agregar el libro (`datos.generoId === "" ? null : Number(datos.generoId)`). `validarLibro` trata `null`/`undefined`/`""` como ausencia y sólo valida existencia cuando hay id (RN-LI-08, IN-02).
- **Alternativas**: (a) usar un id centinela (p. ej. `0` o `-1`) para «Sin clasificar» — descartada, guardaría un `generoId` inválido y rompería la relación N:1; (b) no incluir la opción y dejar el género vacío — descartada, la consigna exige la opción explícita.

### D4 — Errores junto al formulario, en nodos dedicados
Los errores se escriben en `#errores-libro` / `#errores-cliente` (listas con texto, RN-PR-09) y el resultado se informa en `#mensaje-libro` / `#mensaje-cliente`. Se limpian al inicio de cada `submit`.
- **Alternativas**: (a) `alert()` — descartado, no es «cerca del formulario» ni accesible; (b) mezclar errores y éxito en un mismo nodo — descartada, dificulta la lectura y los tests manuales.

### D5 — Unicidad de email sin espacios exteriores ni mayúsculas
`validarCliente` compara `String(cliente.email).trim().toLowerCase()` contra `email.trim().toLowerCase()`. El email se guarda recortado (RN-CL-04, RN-CL-05).
- **Alternativas**: comparación exacta — descartada, viola RN-CL-04 (`  Ana@Mail.com ` vs `ana@mail.com`).

### D6 — Re-render sin recargar
Tras un alta válida, `app.js` re-renderiza las vistas afectadas: libro ⇒ `renderListadoLibros` + `renderCatalogo` + `renderSelectsVenta`; cliente ⇒ `renderListadoClientes` + `renderSelectsVenta`; y llama a `popularSelectsLibro()` para refrescar selectores (RN-LI-10, RN-CL-05).
- **Alternativas**: recargar la página — descartada, viola la regla y pierde el estado en memoria.

## Risks / Trade-offs

- **[La suite Node no cubre el DOM (handlers, `preventDefault`, re-render)] → Mitigación**: la lógica se prueba en Node (§Casos 2 y 3) y el comportamiento de UI se verifica con los casos manuales reproducidos de la consigna (queda registrado en C-10).
- **[Doble contrato `global` + `module.exports` (IN-01) puede derivar en divergencias] → Mitigación**: mantener el patrón y documentarlo como intencional; no introducir módulos ES en este change.
- **[Bordes de ISBN/email con separadores o espacios inusuales] → Mitigación**: agregar en `pruebas/test-logica.js` el caso de ISBN duplicado con otro separador si falta, y el de email duplicado con distinta capitalización/espacios.
- **[Persistir un `generoId` inexistente por error de mapeo (IN-02)] → Mitigación**: `validarLibro` rechaza ids de género inexistentes y `app.js` mapea el `<option>` vacío a `null`; se verifica explícitamente.
- **[Alcance de auditoría: si el código ya está completo, el valor está en la evidencia] → Trade-off**: el change puede resolverse casi sin cambios de código; se documenta la verificación en lugar de forzar modificaciones innecesarias.

## Migration Plan

1. Auditar `validarLibro` y `validarCliente` contra RN-LI/RN-CL; corregir sólo los huecos.
2. Auditar los handlers y `popularSelectsLibro` en `app.js`; corregir mapeo «Sin clasificar», orden de errores y re-render.
3. Extender `pruebas/test-logica.js` §Casos 2 y 3 si falta algún borde.
4. Ejecutar `node pruebas/test-logica.js` sin fallos y reproducir los casos manuales de alta.
5. **Rollback**: revertir los archivos tocados (`js/app.js`, `js/logica.js`, `pruebas/test-logica.js`); al ser estático no hay despliegue ni migración de datos.

## Open Questions

- ¿La validación de ISBN debe tolerar prefijos tipo «978-»/«979-» o cualquier formato sin espacios/guiones? (ver `10_preguntas_abiertas.md`; no cambia el diseño actual, que normaliza y compara sin espacios ni guiones).
