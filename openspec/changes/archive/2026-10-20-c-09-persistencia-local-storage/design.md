# Design

## Context

Ver `proposal.md — Why`. El proyecto es frontend puro que se abre con `file://`, sin backend ni dependencias, con tres scripts cargados en orden global (`datos.js` → `logica.js` → `app.js`). Ya existe un `estado` en memoria (`{ libros, clientes, ventas }`) y `js/logica.js` concentra la lógica pura (validaciones, filtro, cálculos, persistencia) sin tocar el DOM, con doble contrato globals/`module.exports` para poder probar con Node (DD-01, DD-03). La consigna (Ejercicio 6) y la KB (RN-PE-01…RN-PE-05, DD-05, DD-06, Flujo 1) fijan la clave, la estructura y los tres comportamientos clave. El change es de verificar/completar lo existente, no de partir de cero.

## Goals / Non-Goals

**Goals:**
- Dejar `cargarEstado` y `guardarEstado` en `js/logica.js` como funciones puras respecto del almacenamiento recibido por parámetro (inyección de `localStorage` para poder testear).
- Garantizar los tres comportamientos normativos: primer inicio siembra; reapertura recupera sin duplicar; JSON corrupto o de forma inválida recarga el estado inicial.
- Asegurar que `js/app.js` invoque `guardarEstado` tras cada mutación.
- Cubrir los tres escenarios en `pruebas/test-logica.js` §Caso 7.

**Non-Goals:**
- No persistir editoriales, géneros ni autores (DD-05, RN-PE-05).
- No migrar a `IndexedDB` ni a una clave por colección (DD-06).
- No implementar sincronización, backend, autenticación ni cifrado de los datos.
- No agregar librerías, frameworks ni dependencias.

## Decisions

**1. Una sola clave `tp_libreria_estado` con objeto plano.**
Se serializa todo el estado en una única entrada (`RN-PE-01`, DD-06).
- *Alternativas*: (a) una clave por colección (`tp_libros`, `tp_clientes`, `tp_ventas`); (b) `IndexedDB`.
- *Por qué*: una sola clave da carga atómica y una comprobación guiada simple; una clave por colección exigiría manejar estados parciales e inconsistentes, e `IndexedDB` es asíncrono y desproporcionado para este alcance.
- *Costo aceptado*: cada escritura serializa el objeto completo (DD-06).

**2. Validación de forma con `Array.isArray` sobre las tres colecciones.**
Tras `JSON.parse`, se comprueba que el resultado sea un objeto con `libros`, `clientes` y `ventas` y que los tres sean arrays (`Array.isArray`). Si falta la propiedad, alguna no es array, o `JSON.parse` lanza, se descarta y se recarga el estado inicial (`RN-PE-04`).
- *Alternativas*: (a) confiar solo en que `JSON.parse` no lance; (b) validar campo por campo cada entidad.
- *Por qué*: `JSON.parse` acepta valores como `"5"`, `null` o `{"libros":{}}` sin lanzar; `Array.isArray` es el chequeo mínimo y nativo que evita que las vistas reciban colecciones no iterables. Validar cada entidad sería alcance no pedido.
- *Costo aceptado*: un JSON válido pero con entidades malformadas internamente se acepta como está; la integridad se limita a la forma de las colecciones.

**3. Inyección del almacenamiento como parámetro.**
`cargarEstado(almacenamiento, datosIniciales)` y `guardarEstado(almacenamiento, estado)` reciben el `localStorage` (o un doble en las pruebas) en lugar de referenciarlo global.
- *Alternativas*: (a) acceder directo a `localStorage` dentro de las funciones; (b) un wrapper global.
- *Por qué*: mantiene las funciones puras y testeables con Node sin navegador (DD-03), y deja los tres escenarios verificables con un almacenamiento falso en memoria.

**4. Siembra solo cuando la clave falta; nunca "merge" de ejemplos.**
Si la clave no existe, se siembra `DATOS_INICIALES` y se guarda. Si existe y es válida, se devuelve tal cual, sin volver a insertar ejemplos (`RN-PE-02`, `RN-PE-03`).
- *Alternativas*: (a) fusionar siempre los ejemplos con lo guardado; (b) sembrar y además reconciliar.
- *Por qué*: fusionar duplicaría los datos iniciales en cada reapertura, que es justamente lo que la consigna prohíbe.

## Risks / Trade-offs

- **[Volumen creciente de estado serializado]** → Mitigación: el alcance es de pocos registros (SU-02); si creciera, se evaluaría paginado o una clave por colección (fuera de alcance).
- **[Un JSON de forma válida pero con entidades insuficientes internas]** → Mitigación: se acepta por diseño; la integridad se limita a `Array.isArray` de las colecciones, consistente con la validación pedida.
- **[Dependencia del navegador, el perfil y la ubicación de apertura]** → Mitigación: se documenta el límite en el README (RN-EX-02, SU-01); el cambio no promete sincronización ni durabilidad entre dispositivos.
- **[Guardado no invocado tras una mutación nueva]** → Mitigación: tareas de auditoría de `js/app.js` que verifican `guardarEstado` tras cada alta y confirmación, más el escenario "persistencia tras una mutación" en las pruebas.
- **[Datos previos con formato viejo]** → Mitigación: al no existir versionado todavía, un JSON que no cumpla la forma cae por la rama de recarga inicial; ver Open Questions.

## Migration Plan

1. Auditar `cargarEstado`/`guardarEstado` en `js/logica.js` contra la KB y corregir si falta la validación de forma o la siembra condicional.
2. Verificar en `js/app.js` que `guardarEstado` se llame tras alta de libro, alta de cliente y confirmación de venta.
3. Agregar/ajustar los tres escenarios en `pruebas/test-logica.js` §Caso 7 y correr `node pruebas/test-logica.js`.
4. *Rollback*: si algo falla, se revierte a las funciones previas de `logica.js`; como no hay migración de datos destructiva, borrar la clave `tp_libreria_estado` del navegador restaura el primer inicio. Ningún dato existente se transforma en el lugar.

## Open Questions

- ¿Conviene un campo `version` en el JSON guardado para diferenciar esquemas futuros? Se puede decidir después sin cambiar las specs ni el enfoque: la validación de forma actual seguiría aceptando el objeto y, ante una versión desconocida, cabría la rama de recarga inicial.
- ¿Debería `guardarEstado` capturar y reportar el fallo de escritura (por ejemplo, cuota superada)? Queda fuera del alcance actual y no altera los escenarios definidos.
