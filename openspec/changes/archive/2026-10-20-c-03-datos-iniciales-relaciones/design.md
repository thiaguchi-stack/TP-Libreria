# Design: c-03-datos-iniciales-relaciones

## Context

Ver `proposal.md` §Why para la motivación.

Estado actual y restricciones que condicionan el enfoque:

- **Restricción dura**: frontend puro sobre `file://`, sin backend, sin bundler, sin librerías ni CDNs (RN-EX-01, RN-PR-10, DD-01). Los scripts se cargan en orden global en `index.html`; no hay módulos ES.
- `js/datos.js` ya expone un `DATOS_INICIALES` con las colecciones `libros`, `clientes`, `ventas` y las entidades de referencia editoriales, géneros y autores.
- `js/logica.js` concentra la lógica pura (DD-03) y usa una función `siguienteId()` para generar identificadores de nuevos registros. Si el seed y esa función no acuerdan el rango, puede haber colisión de `id`.
- `pruebas/test-logica.js` corre con Node y construye su propio `contexto()` de datos. Debe seguir siendo coherente con el seed corregido (SU-05).
- Las entidades de referencia **no se persisten** (DD-05, RN-PE-05): se leen siempre de `js/datos.js`, por lo que son la única fuente de verdad de editoriales, géneros y autores.
- `knowledge-base/04_modelo_de_datos.md` §Seed data inicial y §ERD definen el contrato de relaciones; `knowledge-base/09_decisiones_y_supuestos.md` §SU-04 fija que los datos ficticios deben alcanzar para cubrir los casos, incluido el N:N de autores.

## Goals / Non-Goals

**Goals:**

- Dejar `js/datos.js` verificado contra los cinco criterios del Ejercicio 3: mínimos cuantitativos, integridad referencial, identificadores estables, coherencia con la documentación y arranque sin ventas.
- Producir evidencia reproducible: un script de validación de integridad que recorra el seed y falle si algún FK no resuelve.
- Garantizar que el rango de `id` del seed no colisione con `siguienteId()`.

**Non-Goals:**

- No se implementa validación de datos en tiempo de ejecución para los registros que ingrese el usuario (eso pertenece a C-05/C-06).
- No se agrega ABM de editoriales, géneros ni autores (la consigna lo excluye explícitamente).
- No se cambia el esquema de persistencia `tp_libreria_estado` (pertenece a C-09).
- No se modifica `index.html` ni el CSS.
- No se introduce Node como dependencia de la entrega: el script de validación es una herramienta de desarrollo, igual que `pruebas/test-logica.js`.

## Decisions

### D-01 — Mantener el seed como constante en `js/datos.js`

**Decisión**: `DATOS_INICIALES` sigue siendo una constante literal en `js/datos.js`, con las entidades de referencia (`editoriales`, `generos`, `autores`) siempre presentes y los datos mutables (`libros`, `clientes`, `ventas`) como punto de partida.

**Rationale**: es lo que la consigna pide («se representan mediante arrays y objetos con identificadores estables») y no agrega mecanismos nuevos.

**Alternativas consideradas**:
- (a) Generar el seed por código a partir de una plantilla compacta: agrega complejidad de lectura sin beneficio evaluable.
- (b) Un archivo JSON separado cargado con `fetch`: viola RN-EX-01 (no funciona sobre `file://`).

### D-02 — Identificadores del seed en un rango reservado, verificado contra `siguienteId()`

**Decisión**: los `id` del conjunto inicial serán enteros consecutivos desde 1 por colección, tal como están hoy, y `siguienteId()` debe devolver un valor estrictamente mayor al máximo `id` presente en la colección correspondiente. La verificación se hace explícita en el script de integridad, no solo por inspección.

**Rationale**: es la forma más simple de garantizar unicidad y estabilidad sin introducir un contador persistido.

**Alternativas consideradas**:
- (a) `id` con prefijo string (`L-1`, `V-1`): la KB modela `Venta.id` con prefijo solo como convención de presentación; usar strings en todas las colecciones rompería `siguienteId()` y las comparaciones numéricas.
- (b) Contador en `localStorage`: agrega estado persistido extra y un modo de falla nuevo (contador desincronizado del seed).

### D-03 — Integridad referencial por resolución de claves, no por campos denormalizados

**Decisión**: los libros guardan solo `editorialId`, `generoId` y `autorIds`; el nombre de editorial, género y autor se resuelve al mostrar vía helpers de `js/logica.js`. La validación comprueba que **cada** FK resuelva contra la colección de referencia.

**Rationale**: es el modelo del §ERD y evita que un cambio de nombre en una entidad de referencia quede inconsistente en los libros.

**Alternativas consideradas**:
- (a) Copiar el nombre de la editorial dentro del libro: duplicación innecesaria en datos que no son históricos (a diferencia del renglón de venta, donde la copia sí es requisito, DD-04).
- (b) Un `editorialId` opcional con valor por defecto: contradice §ERD («cada libro tiene una editorial existente»).

### D-04 — `generoId: null` como representación de «Sin clasificar»

**Decisión**: la ausencia de género se representa con `null` (o campo ausente), y la cadena «Sin clasificar» se produce únicamente en la capa de presentación.

**Rationale**: mantiene el dato limpio (RN-CA-02 se cumple al renderizar) y permite que el seed tenga casos con y sin género, necesarios para ejercitar la rama de RN-CA-02.

**Alternativas consideradas**:
- (a) Un género centinela con `id: 0` llamado «Sin clasificar»: contamina las opciones del selector de alta y obliga a filtrarlo en cada lista.
- (b) Cadena vacía `""`: ambigua frente a un género mal cargado.

### D-05 — Evidencia de integridad como script dedicado

**Decisión**: agregar un script de validación que recorra `DATOS_INICIALES` y verifique mínimos, unicidad de `id` y resolución de todos los FKs, en la línea de `pruebas/test-logica.js`.

**Rationale**: convierte la auditoría en un resultado observable y repetible, que es el tipo de evidencia que la consigna pide registrar.

**Alternativas consideradas**:
- (a) Verificación manual por inspección del archivo: no es evidencia reproducible.
- (b) Meter las aserciones dentro de `pruebas/test-logica.js`: acopla la validación del seed a las pruebas de lógica; se prefiere poder correrlas por separado.

### D-06 — Cobertura de casos en el seed

**Decisión**: el seed incluirá al menos un libro con `generoId` en `null` (para RN-CA-02) y al menos un libro con dos o más autores en `autorIds` (para el caso N:N de SU-04), además de los mínimos cuantitativos.

**Rationale**: SU-04 advierte que un seed demasiado plano dejaría casos de relación sin cubrir.

**Alternativas consideradas**:
- (a) Un autor por libro en todos los casos: cumple el mínimo pero no demuestra el N:N exigido por el modelo.

## Risks / Trade-offs

- **Colisión de `id` entre seed y `siguienteId()`** → verificación explícita en el script de integridad comparando el máximo `id` del seed con el primer id generado por colección.
- **Seed incompleto respecto de los mínimos** → el script cuenta cada colección y falla si no alcanza 6/2/2/3/3, con ventas vacías.
- **FK huérfana no detectada por inspección visual** → la validación resuelve cada `editorialId`, cada elemento de `autorIds` y cada `generoId` no nulo contra su colección de referencia.
- **Divergencia entre el seed y `contexto()` de `pruebas/test-logica.js`** → al ajustar el seed se revisa el helper y se documenta el cambio; SU-05 aclara que Node es solo de desarrollo.
- **Denormalización tentadora para simplificar el render** → se rechaza explícitamente (D-03); el renglón de venta es el único lugar donde la copia es requisito.
- **Trade-off aceptado**: ampliar el seed para cubrir casos de borde hace más largo el archivo `js/datos.js`, a cambio de que la verificación sea genuina y no un mínimo nominal.

## Migration Plan

No hay migración de datos: el seed es la carga inicial y solo aplica cuando la clave `tp_libreria_estado` no existe. Pasos:

1. Ajustar `js/datos.js` si la auditoría detecta faltantes (mínimos o FKs).
2. Correr el script de validación de integridad; debe fallar antes de la corrección y pasar después, lo que da la evidencia del cambio.
3. Revisar `pruebas/test-logica.js` §`contexto()` para confirmar coherencia; ajustar solo si quedó desalineado.
4. Verificación manual complementaria: abrir `index.html` sobre `file://`, con `localStorage` limpio, y confirmar que el catálogo muestra los 6 libros y que un libro sin género aparece como «Sin clasificar».
5. **Rollback**: revertir el archivo `js/datos.js` al estado previo. Los datos ya sembrados en un navegador quedan intactos porque no se re-siembra si la clave existe (RN-PE-03); para forzar la resiembra hay que borrar la clave desde el navegador.
6. **Sin despliegue**: no hay build, ni servidor, ni pipeline.

## Open Questions

- ¿El evaluador borrará el `localStorage` antes de la corrección? Si no lo hace, un seed modificado no se verá reflejado en su navegador; se documenta el procedimiento de resiembra en el README (fuera del alcance de este change). No afecta las specs ni el desglose de tareas.
- ¿Conviene sumar el script de integridad a la sección de pruebas del README? Decisión de documentación posterior a C-11; no cambia el comportamiento especificado.
