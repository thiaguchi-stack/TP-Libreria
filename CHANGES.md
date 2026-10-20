# CHANGES — Secuencia de Implementación

> Índice canónico de todos los changes del proyecto **TP-Libreria (Librería El Coso)**.
> Cada change es atómico: un agente puede implementarlo en una sesión (~4-6 horas).
> **Leer este archivo antes de ejecutar cualquier `/opsx:propose`.**
>
> **Nota de contexto**: el proyecto **ya tiene implementación** (`index.html`, `css/estilos.css`, `js/datos.js`, `js/logica.js`, `js/app.js`, `pruebas/test-logica.js`, `README.md`). Por eso cada change es de **verificar / completar / endurecer** lo existente contra la KB, no de partir de cero. La KB (`knowledge-base/`) y la consigna (`docs/consigna-tp-libreria.md`) son la fuente de verdad del alcance; el código actual es el punto de partida a auditar.

---

## Cómo usar este documento

1. Identificar el change a implementar (verificar que sus dependencias están en `openspec/changes/archive/`).
2. Leer los docs de la knowledge-base indicados en "Leer antes".
3. Ejecutar `/opsx:propose <nombre-del-change>` (ej.: `/opsx:propose C-01-base-semantica-html`).
4. Al terminar el change, archivarlo con `/opsx:archive <nombre-del-change>`.
5. Marcar el checkbox `[x]` en este archivo.

> En cada change, "verificar" significa **reproducir el criterio de aceptación con estado real del código** y registrar el resultado; no se marca `[x]` sin evidencia (RN de la consigna: «No se indica una prueba como aprobada sin ejecutarla»).

---

## Árbol de dependencias

```
C-01 base-semantica-html            ← cimientos de estructura/vistas (base de toda la UI)
  └── C-02 estilos-identidad-accesible
        └── C-03 datos-iniciales-relaciones
              │
              ├── C-04 catalogo-y-filtro
              │     └── C-05 altas-libros-clientes
              │
              ├── C-06 venta-composicion           ← paralelo con C-04
              │     └── C-07 venta-confirmacion-historico
              │           └── C-08 historial-inmutable
              │
              ├── C-09 persistencia-localStorage   ← paralelo con C-04/C-06
              │
              └── C-10 verificacion-prueba-historica  ← tras C-07 + C-08 + C-09
                    └── C-11 readme-entrega
```

### Paralelismo por fase

> Cada "gate" es un punto de sincronización. Los changes dentro de un grupo pueden ejecutarse en paralelo.

```
GATE 0: ninguna
  → C-01 base-semantica-html            (solo)

GATE 1: C-01 ✓
  → C-02 estilos-identidad-accesible    (solo)

GATE 2: C-02 ✓
  → C-03 datos-iniciales-relaciones     (solo)

GATE 3: C-03 ✓                          ← PRIMER FORK (3 paralelos)
  → C-04 catalogo-y-filtro              [Agente A]
  → C-06 venta-composicion              [Agente B]
  → C-09 persistencia-localStorage      [Agente C]

GATE 4: C-04 ✓
  → C-05 altas-libros-clientes          [Agente A]

GATE 5: C-06 ✓
  → C-07 venta-confirmacion-historico   [Agente B]

GATE 6: C-07 ✓ + C-09 ✓
  → C-08 historial-inmutable            [Agente C — si C-07 ✓ y C-09 ✓]

GATE 7: C-05 ✓ + C-08 ✓ + C-09 ✓
  → C-10 verificacion-prueba-historica  [Agente A o C]

GATE 8: C-10 ✓
  → C-11 readme-entrega                 [Agente C]
```

### Camino crítico (9 changes — mínimo irreducible)

```
C-01 → C-02 → C-03 → C-04 → C-05 → C-10 → C-11   (rama producto: altas → verificación → entrega)
C-01 → C-02 → C-03 → C-06 → C-07 → C-08 → C-10 → C-11   (rama ventas: 9 changes)
```

> Ambos caminos comparten C-01, C-02, C-03, C-10 y C-11. La rama más larga (la de ventas) define el camino crítico real: **9 changes**. La rama de altas es de **7 changes** y no es cuello de botella.

### Plan óptimo con 3 agentes

```
Paso │ Agente A (Estructura/Datos)    │ Agente B (Ventas/Historial)      │ Agente C (Persistencia/Docs)
─────┼─────────────────────────────────┼──────────────────────────────────┼──────────────────────────────
  1  │ C-01 base-semantica-html        │             —                    │             —
  2  │ C-02 estilos-identidad-accesible│             —                    │             —
  3  │ C-03 datos-iniciales-relaciones │             —                    │             —
  4  │ C-04 catalogo-y-filtro          │ C-06 venta-composicion           │ C-09 persistencia-localStorage
  5  │ C-05 altas-libros-clientes      │ C-07 venta-confirmacion-historico│             —
  6  │             —                   │ C-08 historial-inmutable         │             —
  7  │ C-10 verificacion-prueba-historica│            —                   │             —
  8  │             —                   │             —                    │ C-11 readme-entrega
```

---

## FASE 0 — Cimientos de estructura, estilos y datos

> Un solo agente al principio: C-01 → C-02 → C-03 es una cadena lineal. Son la base que todo lo demás verifica.

### [C-01] `base-semantica-html`
- **Estado**: `[ ]` pendiente
- **Scope**: Verificar/completar `index.html` contra Ejercicio 1 de la consigna (20 pts)
  - Auditoría de las 5 vistas como `<section>` con `id`/`aria-labelledby`: `#catalogo`, `#libros`, `#clientes`, `#ventas`, `#historial` (ya existen: confirmar y corregir huecos)
  - `<header>`, `<nav>`, `<main>`, `<footer>` semánticos; `id="titulo-catalogo"` y demás anclas de menú (`data-vista`) consistentes con `app.js`
  - Verificar `label` ↔ control en **todos** los campos (`for`/`id`), incluido el input de cantidad por renglón (hoy usa `aria-label` dinámico: validar contra RN-PR-02)
  - Botones con texto que describe la acción (RN-PR-03); tablas con `<caption>` y `<th scope>` (RN-PR-04)
  - Nodos de mensaje para listas vacías, sin resultados, éxito y error (`#mensaje-*`, `#vacio-*`, `#errores-*`) — verificar que exista un estado visible para cada caso (RN-PR-05)
  - No usar `innerHTML` con datos de usuario: confirmar que todo el render pasa por `textContent` (RN-CA-08)
  - Tests/evidencia: checklist de los 8 campos-faltantes en cada formulario; inspección de nodos de mensaje por vista
- **Dependencias**: ninguna
- **Governance**: BAJO
- **Leer antes**:
  - `knowledge-base/06_funcionalidades.md` §Épica 1 (US-001)
  - `knowledge-base/05_reglas_de_negocio.md` §Presentación y accesibilidad (RN-PR-01…RN-PR-05)
  - `knowledge-base/02_descripcion_general.md` §Arquitectura general
  - `knowledge-base/03_actores_y_roles.md` §Rutas públicas
  - `docs/consigna-tp-libreria.md` §Ejercicio 1

---

### [C-02] `estilos-identidad-accesible`
- **Estado**: `[ ]` pendiente
- **Scope**: Verificar/completar `css/estilos.css` contra Ejercicio 2 (20 pts: coherencia 8, adaptación 8, accesibilidad 4)
  - Identidad visual propia: confirmar variables de color/tipografía/espaciado en `:root` y clases reutilizables (`.tarjeta`, `.formulario`, `.boton`, `.campo`)
  - Flexbox/Grid: `nav` y formularios con Flexbox; `.rejilla` del catálogo con Grid (`repeat(auto-fill, minmax(...))`) — verificar y documentar dónde
  - Responsive a **320 px y 1280 px**: comprobar **ausencia de scroll horizontal del documento**; `.tabla-contenedor { overflow-x: auto }` para que cada tabla scrollee dentro de su contenedor (RN-PR-06, RN-PR-07)
  - Foco visible real: `:focus-visible` en `input/select/button/a`; recorrido completo por **Tab/Shift+Tab** (RN-PR-08)
  - Errores expresados **con texto** y no solo con color: verificar que `.errores`/`.mensaje.error` incluyan texto legible (RN-PR-09)
  - Reafirmar **cero dependencias** (sin CDN, sin framework, sin `@import` externo) (RN-PR-10)
  - Tests/evidencia: medición a 320/1280 px (ancho de scroll vs viewport) y recorrido de foco registrado
- **Dependencias**: C-01
- **Governance**: BAJO
- **Leer antes**:
  - `knowledge-base/05_reglas_de_negocio.md` §Presentación y accesibilidad (RN-PR-06…RN-PR-10)
  - `knowledge-base/08_arquitectura_propuesta.md` §Patrones, §Estructura de directorios
  - `knowledge-base/01_vision_y_objetivos.md` §Métricas de éxito
  - `docs/consigna-tp-libreria.md` §Ejercicio 2

---

### [C-03] `datos-iniciales-relaciones`
- **Estado**: `[ ]` pendiente
- **Scope**: Verificar/completar `js/datos.js` (Ejercicio 3, 15 pts: modelo 5)
  - `DATOS_INICIALES` con: **2 editoriales**, **2 géneros**, **3 autores**, **≥6 libros**, **3 clientes**, `ventas: []` — confirmar mínimos de la consigna
  - Integridad referencial: cada libro con `editorialId` existente y `autorIds` con **al menos uno** existente; `generoId` puede ser `null` (libro sin género ⇒ «Sin clasificar»)
  - Identificadores estables y únicos por colección; que `siguienteId()` en `logica.js` no colisione con el seed
  - Coherencia con `04_modelo_de_datos.md` §Seed data inicial y con el `contexto()` de `pruebas/test-logica.js`
  - Tests/evidencia: script de validación de integridad (todos los FKs resuelven) sobre el seed
- **Dependencias**: C-02
- **Governance**: BAJO
- **Leer antes**:
  - `knowledge-base/04_modelo_de_datos.md` §Entidades, §Seed data inicial, §ERD
  - `knowledge-base/05_reglas_de_negocio.md` §Catálogo (RN-CA-01, RN-CA-02)
  - `knowledge-base/09_decisiones_y_supuestos.md` §SU-04
  - `docs/consigna-tp-libreria.md` §Ejercicio 3

---

## FASE 1A — Catálogo y altas

> C-04 y C-05 en la rama de producto; paralelo con C-06 (ventas) y C-09 (persistencia).

### [C-04] `catalogo-y-filtro`
- **Estado**: `[ ]` pendiente
- **Scope**: Verificar/completar catálogo + filtro (Ejercicio 3, renderizado 5 + filtro y estados 5)
  - `renderCatalogo()` en `app.js`: tarjeta por libro con **título, ISBN, editorial, género, autores y precio** usando `textContent` (nunca `innerHTML`) — US-002 / RN-CA-01, RN-CA-08
  - Género ausente ⇒ «Sin clasificar» vía `nombreGenero()` (RN-CA-02)
  - `filtrarLibros()` en `logica.js`: **ignora mayúsculas**, **coincidencia parcial** (substring), **recorta espacios**; búsqueda vacía ⇒ todo el catálogo; sin resultados ⇒ mensaje claro (US-003 / RN-CA-03…RN-CA-07)
  - Estados de UI: `#mensaje-catalogo` con texto distinto para «catálogo completo», «N resultados» y «sin coincidencias»; botón «Limpiar búsqueda» que resetea y devuelve el foco al campo
  - Tests: extender `pruebas/test-logica.js` §Caso 1 si falta algún borde (título con caracteres especiales insertado como texto)
- **Dependencias**: C-03
- **Governance**: BAJO
- **Leer antes**:
  - `knowledge-base/06_funcionalidades.md` §Épica 2 (US-002, US-003)
  - `knowledge-base/07_flujos_principales.md` §Flujo 2 (Búsqueda en el catálogo)
  - `knowledge-base/05_reglas_de_negocio.md` §Catálogo y filtro (RN-CA-01…RN-CA-08)
  - `knowledge-base/08_arquitectura_propuesta.md` §Patrones (Renderizado desde datos, Inserción segura)
  - `docs/consigna-tp-libreria.md` §Ejercicio 3

---

### [C-05] `altas-libros-clientes`
- **Estado**: `[ ]` pendiente
- **Scope**: Verificar/completar altas de libros y clientes (Ejercicio 4, 15 pts)
  - **Libros** (US-004 / RN-LI-01…RN-LI-10): selectores de editorial/género/autores generados desde datos locales vía `popularSelectsLibro()`; género con opción «Sin clasificar» (`generoId = null`); validaciones: título/ISBN no vacíos, **ISBN único normalizado** (sin espacios ni guiones), precio numérico **> 0**, editorial/autores existentes, **al menos un autor**, género opcional existente; `preventDefault` + errores en `#errores-libro`; post-alta re-render de listado, catálogo y selectores de venta **sin recargar**
  - **Clientes** (US-005 / RN-CL-01…RN-CL-05): nombre y email no vacíos, **formato de email** válido (`formatoEmailValido`), **email único** comparado sin espacios exteriores ni mayúsculas; errores en `#errores-cliente`; post-alta re-render de listado y selector de cliente
  - Confirmar mapeo de «Sin clasificar» a `null` (ver `10_preguntas_abiertas.md` IN-02) y que `validarLibro` no guarde un `generoId` inexistente
  - Tests: `pruebas/test-logica.js` §Casos 2 y 3 cubren duplicados/formatos; agregar el borde de ISBN duplicado con otro separador si falta
- **Dependencias**: C-04
- **Governance**: MEDIO
- **Leer antes**:
  - `knowledge-base/06_funcionalidades.md` §Épica 3 y §Épica 4 (US-004, US-005)
  - `knowledge-base/05_reglas_de_negocio.md` §Alta de libros (RN-LI-01…RN-LI-10) y §Alta de clientes (RN-CL-01…RN-CL-05)
  - `knowledge-base/07_flujos_principales.md` §Flujo 3 y §Flujo 4
  - `knowledge-base/04_modelo_de_datos.md` §Entidades (Libro, Cliente)
  - `knowledge-base/10_preguntas_abiertas.md` §IN-02

---

## FASE 1B — Ventas e historial

> Rama de ventas: C-06 → C-07 → C-08. Es el camino crítico más largo; C-06 arranca en paralelo con C-04 y C-09.

### [C-06] `venta-composicion`
- **Estado**: `[ ]` pendiente
- **Scope**: Verificar/completar composición de la venta (Ejercicio 5, composición y validaciones 8 + cálculos 5)
  - Selección de **cliente existente** vía `#venta-cliente` (US-006 / RN-VE-01)
  - `agregarRenglon()` en `logica.js`: cantidad **entera > 0**; **libro repetido rechazado** con mensaje («Ese libro ya forma parte de la venta…»); el renglón guarda `libroId`, `titulo`, `cantidad`, `precioUnitario`, `subtotal` (RN-VE-02, RN-VE-03)
  - Cantidades **editables** (`recalcularRenglon`) y renglones **quitables** antes de confirmar (RN-VE-04)
  - Cálculos: `subtotal = cantidad × precioUnitario` y `total = suma(subtotales)`; `formatearImporte()` con **dos decimales** (RN-VE-05…RN-VE-07)
  - `renderRenglones()`: tabla con libro, cantidad (input `aria-label`), precio unitario y subtotal; `#venta-total` actualizado
  - Tests: `pruebas/test-logica.js` §Caso 4 y §Caso 5 (2×1500 + 1×2000 = 3000/2000/5000 y formato)
- **Dependencias**: C-03
- **Governance**: MEDIO
- **Leer antes**:
  - `knowledge-base/06_funcionalidades.md` §Épica 5 (US-006)
  - `knowledge-base/07_flujos_principales.md` §Flujo 5 (Composición de una venta)
  - `knowledge-base/05_reglas_de_negocio.md` §Ventas (RN-VE-01…RN-VE-07)
  - `knowledge-base/04_modelo_de_datos.md` §Renglón en curso
  - `docs/consigna-tp-libreria.md` §Ejercicio 5

---

### [C-07] `venta-confirmacion-historico`
- **Estado**: `[ ]` pendiente
- **Scope**: Verificar/completar confirmación con snapshot histórico (Ejercicio 5, confirmación e historial inmutable 7)
  - `validarConfirmacionVenta()`: impide confirmar **sin cliente**, **sin renglones** o **con cantidades inválidas/repetidas** (RN-VE-08)
  - `confirmarVenta()`: registra `id`, `fecha` (ISO), `clienteId`, `clienteNombre`, `renglones[]` y `total`; **copia precio unitario, título y nombre del cliente** como valores históricos — no se relee el catálogo (RN-VE-09, RN-VE-10)
  - Tipos de renglón histórico: `{ libroId, titulo, cantidad, precioUnitario, subtotal }`
  - Al confirmar: persistir estado, **limpiar el formulario** para una nueva venta y mostrar **mensaje de resultado** (RN-VE-11); ventas **inmutables** desde la UI (RN-VE-12)
  - Confirmar el doble contrato de `logica.js` (globals en navegador + `module.exports` en Node) — ver `10_preguntas_abiertas.md` IN-01
  - Tests: `pruebas/test-logica.js` §Caso 6 (precio histórico conservado al cambiar el catálogo)
- **Dependencias**: C-06
- **Governance**: CRITICO
- **Leer antes**:
  - `knowledge-base/05_reglas_de_negocio.md` §Ventas (RN-VE-08…RN-VE-12)
  - `knowledge-base/07_flujos_principales.md` §Flujo 6 (Confirmación de venta)
  - `knowledge-base/09_decisiones_y_supuestos.md` §DD-04 (snapshot histórico)
  - `knowledge-base/04_modelo_de_datos.md` §Venta, §Renglón
  - `docs/consigna-tp-libreria.md` §Ejercicio 5

---

### [C-08] `historial-inmutable`
- **Estado**: `[ ]` pendiente
- **Scope**: Verificar/completar historial y detalle (Ejercicio 5, historial)
  - `renderHistorial()`: tabla con **id** (`V-N`), **fecha** (`toLocaleString("es-AR")`), **cliente** y **total** (US-008 / RN-HI-01)
  - Botón «Ver detalle» ⇒ `mostrarDetalle()` lee **los renglones guardados en la venta**, no el catálogo actual (RN-HI-02, RN-HI-03)
  - Estado de lista vacía (`#vacio-ventas`) y cierre de detalle (`#btn-cerrar-detalle`)
  - **No** ofrecer UI de editar/eliminar ventas (RN-VE-12)
  - Requiere C-07 (estructura de venta) y C-09 (la venta debe sobrevivir la recarga para el detalle)
  - Tests: cubierto indirectamente por §Caso 6 y §Caso 7 de `pruebas/test-logica.js`
- **Dependencias**: C-07, C-09
- **Governance**: MEDIO
- **Leer antes**:
  - `knowledge-base/06_funcionalidades.md` §Épica 6 (US-008)
  - `knowledge-base/07_flujos_principales.md` §Flujo 7 (Consulta del historial y detalle inmutable)
  - `knowledge-base/05_reglas_de_negocio.md` §Historial (RN-HI-01…RN-HI-03)
  - `knowledge-base/04_modelo_de_datos.md` §Venta, §Renglón
  - `docs/consigna-tp-libreria.md` §Ejercicio 5

---

## FASE 2 — Persistencia y verificación

> C-09 corre en paralelo con las fases 1A/1B. C-10 y C-11 cierran el proyecto y son secuenciales.

### [C-09] `persistencia-localStorage`
- **Estado**: `[ ]` pendiente
- **Scope**: Verificar/completar persistencia (Ejercicio 6, persistencia 4)
  - `cargarEstado()` / `guardarEstado()` en `logica.js` sobre `localStorage` con clave **`tp_libreria_estado`** y estructura `{ libros, clientes, ventas }` (US-009 / RN-PE-01)
  - Primer inicio (clave inexistente) ⇒ siembra `DATOS_INICIALES` y guarda; reapertura ⇒ recupera **sin duplicar** ejemplos (RN-PE-02, RN-PE-03)
  - **JSON corrupto o con forma inválida ⇒ recarga estado inicial** (validar `Array.isArray` de las 3 colecciones; RN-PE-04)
  - Editoriales/géneros/autores **no** se persisten (RN-PE-05, `09_decisiones_y_supuestos.md` DD-05)
  - `guardarEstado` se invoca tras cada mutación (alta de libro/cliente, confirmación de venta) con el `estado` de `app.js`
  - Tests: `pruebas/test-logica.js` §Caso 7 (primer inicio, recarga sin duplicar, JSON corrupto)
- **Dependencias**: C-03
- **Governance**: CRITICO
- **Leer antes**:
  - `knowledge-base/05_reglas_de_negocio.md` §Persistencia (RN-PE-01…RN-PE-05)
  - `knowledge-base/04_modelo_de_datos.md` §Persistencia
  - `knowledge-base/07_flujos_principales.md` §Flujo 1 (Arranque y carga de estado)
  - `knowledge-base/09_decisiones_y_supuestos.md` §DD-05, §DD-06
  - `docs/consigna-tp-libreria.md` §Ejercicio 6

---

### [C-10] `verificacion-prueba-historica`
- **Estado**: `[ ]` pendiente
- **Scope**: Cierre de verificación objetiva (Ejercicio 6, pruebas manuales registradas 3)
  - Ejecutar y registrar `node pruebas/test-logica.js` ⇒ **37 aserciones, 0 falladas** (o actualizar el número real si se agregan aserciones en C-04/C-05)
  - **Prueba guiada del precio histórico**: confirmar una venta, anotar importes, modificar **solo el precio del libro** en el `localStorage` del catálogo guardado (sin tocar ventas) en una **copia de prueba**, recargar y verificar que el detalle conserva precio unitario, subtotales y total originales (RN-VE-10, RN-HI-03, RN-PE-02)
  - Verificar los **8 casos manuales** de la consigna con resultado observado (búsqueda, ISBN dup/nuevo, email inválido/dup/nuevo, venta inválida/dup, venta válida 3000/2000/5000, precio histórico, recarga sin duplicar, teclado + 320/1280 px)
  - Documentar el **método** de verificación (Node, y cualquier medición de layout/teclado) sin dar por aprobado nada no ejecutado
  - Tests: la propia corrida de la suite + la prueba manual reproducida queda como evidencia
- **Dependencias**: C-05, C-08, C-09
- **Governance**: MEDIO
- **Leer antes**:
  - `knowledge-base/06_funcionalidades.md` §Épica 7 (US-010)
  - `knowledge-base/01_vision_y_objetivos.md` §Métricas de éxito
  - `knowledge-base/05_reglas_de_negocio.md` §Historial (RN-HI-03), §Persistencia (RN-PE-02…RN-PE-04)
  - `knowledge-base/08_arquitectura_propuesta.md` §Consideraciones de despliegue
  - `docs/consigna-tp-libreria.md` §Ejercicio 6 (tabla de casos manuales)

---

### [C-11] `readme-entrega`
- **Estado**: `[ ]` pendiente
- **Scope**: Verificar/completar `README.md` (Ejercicio 6, documentación y entrega 3)
  - Integrantes (nombre y legajo), **pasos para abrir `index.html` sin npm**, navegación entre vistas
  - Funcionalidades **implementadas y pendientes** (dentro del alcance no quedan pendientes; lo fuera de alcance queda declarado)
  - Ubicación de los datos iniciales (`js/datos.js`, `DATOS_INICIALES`) y relaciones por `id`
  - **Funcionamiento y límites de `localStorage`**: clave, estructura JSON, ubicación para la comprobación guiada (Almacenamiento → LocalStorage), dependencia de navegador/perfil/ubicación, borrado de datos, ausencia de seguridad (RN-EX-01…RN-EX-04)
  - **Resultados de los casos manuales** (los 8 con resultado observado) y **procedencia de imágenes** (no hay)
  - Comando de pruebas (`node pruebas/test-logica.js`) y resultado
  - Tests/evidencia: README revisado contra la lista de contenidos exigida por la consigna
- **Dependencias**: C-10
- **Governance**: BAJO
- **Leer antes**:
  - `knowledge-base/06_funcionalidades.md` §US-009, §US-010
  - `knowledge-base/08_arquitectura_propuesta.md` §Estructura de directorios, §Consideraciones de despliegue
  - `knowledge-base/05_reglas_de_negocio.md` §Excepciones globales (RN-EX-01…RN-EX-04)
  - `knowledge-base/02_descripcion_general.md` §Stack tecnológico
  - `docs/consigna-tp-libreria.md` §Formato de entrega

---

## Resumen

| # | Change | Fase | Depende de | Governance |
|---|--------|------|-----------|------------|
| C-01 | `base-semantica-html` | 0 — Cimientos | — | BAJO |
| C-02 | `estilos-identidad-accesible` | 0 — Cimientos | C-01 | BAJO |
| C-03 | `datos-iniciales-relaciones` | 0 — Cimientos | C-02 | BAJO |
| C-04 | `catalogo-y-filtro` | 1A — Catálogo y altas | C-03 | BAJO |
| C-05 | `altas-libros-clientes` | 1A — Catálogo y altas | C-04 | MEDIO |
| C-06 | `venta-composicion` | 1B — Ventas e historial | C-03 | MEDIO |
| C-07 | `venta-confirmacion-historico` | 1B — Ventas e historial | C-06 | CRITICO |
| C-08 | `historial-inmutable` | 1B — Ventas e historial | C-07, C-09 | MEDIO |
| C-09 | `persistencia-localStorage` | 2 — Persistencia y verificación | C-03 | CRITICO |
| C-10 | `verificacion-prueba-historica` | 2 — Persistencia y verificación | C-05, C-08, C-09 | MEDIO |
| C-11 | `readme-entrega` | 2 — Persistencia y verificación | C-10 | BAJO |

- **Total**: 11 changes en 4 fases (0, 1A, 1B, 2).
- **Camino crítico**: 9 changes (`C-01 → C-02 → C-03 → C-06 → C-07 → C-08 → C-10 → C-11`).
- **Gates de paralelismo**: 9 (GATE 0 a GATE 8), con primer fork en GATE 3 (C-04 ‖ C-06 ‖ C-09).
- **Primer change recomendado**: `C-01` (`base-semantica-html`).

Para arrancar: `/opsx:propose C-01-base-semantica-html`
