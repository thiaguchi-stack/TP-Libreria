# Tasks

## 1. Relevamiento y evidencia base

- [ ] 1.1 Leer `js/datos.js` completo y volcar en una nota de trabajo la lista de colecciones presentes, la cantidad de registros de cada una y el rango de `id` usado; verificar por conteo que no hay colecciones faltantes (libros, clientes, ventas, editoriales, generos, autores)
- [ ] 1.2 Leer `js/logica.js` §`siguienteId()` y anotar la fórmula exacta con la que genera el próximo `id` por colección; confirmar que la fórmula depende del máximo `id` existente y no de una constante fija
- [ ] 1.3 Leer `pruebas/test-logica.js` §`contexto()` y anotar qué colecciones y relaciones espera ese helper; registrar cualquier divergencia con el seed actual como hallazgo previo a las correcciones

## 2. Mínimos del conjunto inicial

- [ ] 2.1 Verificar por conteo que `editoriales` tiene al menos 2 registros con `id` y `nombre` no vacíos; corregir `js/datos.js` si falta alguno
- [ ] 2.2 Verificar por conteo que `generos` tiene al menos 2 registros con `id` y `nombre` no vacíos; corregir `js/datos.js` si falta alguno
- [ ] 2.3 Verificar por conteo que `autores` tiene al menos 3 registros con `id` y `nombre` no vacíos; corregir `js/datos.js` si falta alguno
- [ ] 2.4 Verificar por conteo que `libros` tiene al menos 6 registros y que cada uno declara `titulo`, `isbn`, `precio`, `editorialId`, `generoId` y `autorIds`; corregir `js/datos.js` si falta alguno
- [ ] 2.5 Verificar por conteo que `clientes` tiene al menos 3 registros con `nombreCompleto` no vacío y `email` único (comparado sin espacios exteriores y sin distinguir mayúsculas); corregir `js/datos.js` si hay duplicados o faltantes
- [ ] 2.6 Verificar que `ventas` es un array vacío y que no se crea ninguna venta de ejemplo; quitar cualquier venta del seed si existiera

## 3. Integridad referencial e identificadores

- [ ] 3.1 Verificar que cada `libro.editorialId` coincide con el `id` de una editorial existente y que ningún libro queda sin editorial resoluble; corregir `js/datos.js` si alguna FK queda huérfana
- [ ] 3.2 Verificar que cada `libro.autorIds` tiene al menos un elemento y que todos los `id` declarados existen en `autores`; corregir `js/datos.js` para que ningún libro quede sin autores
- [ ] 3.3 Verificar que cada `libro.generoId` es `null` o coincide con un género existente; dejar al menos un libro con `generoId: null` para ejercitar «Sin clasificar» (D-04, D-06)
- [ ] 3.4 Verificar que al menos un libro declara dos o más autores en `autorIds` para cubrir el caso N:N de SU-04; agregar el caso si el seed queda con un único autor por libro
- [ ] 3.5 Verificar que los `id` son enteros, únicos dentro de cada colección y estables (no se recalculan al leer); corregir duplicados si los hubiera
- [ ] 3.6 Comparar, por colección, el máximo `id` del seed contra el primer valor que devolvería `siguienteId()` y confirmar que el generado es estrictamente mayor; ajustar el seed o documentar la garantía si hubiera riesgo de colisión (D-02)

## 4. Script de validación de integridad

- [ ] 4.1 Crear el script de validación de integridad del seed (en `pruebas/`, cargando `js/datos.js` con `require`, sin dependencias) que recorra las colecciones y reporte conteos por colección; verificar que corre con Node y devuelve salida legible
- [ ] 4.2 Agregar al script la comprobación de los mínimos (≥6 libros, 2 editoriales, 2 géneros, 3 autores, 3 clientes, `ventas` vacío) y verificar que pasa contra el seed corregido
- [ ] 4.3 Agregar al script la comprobación de integridad referencial (todos los `editorialId`, `autorIds` y `generoId` no nulos resuelven) y verificar que falla si se inyecta una FK inválida de prueba
- [ ] 4.4 Agregar al script la comprobación de unicidad de `id` por colección y de no colisión con `siguienteId()`; verificar que pasa contra el seed corregido
- [ ] 4.5 Documentar en el propio script, como comentario de cabecera, qué verifica y cómo se corre; verificar que las instrucciones del comentario reproducen el resultado al ejecutarlas tal cual

## 5. Coherencia documental y prueba manual

- [ ] 5.1 Cotejar el seed corregido con `knowledge-base/04_modelo_de_datos.md` §Entidades y §Seed data inicial: nombres de campos, tipos y opcionalidad de `generoId`; corregir la divergencia que aparezca del lado del código
- [ ] 5.2 Ajustar `pruebas/test-logica.js` §`contexto()` si quedó desalineado con el seed y correr la suite existente; verificar que las 37 aserciones siguen pasando sin fallos
- [ ] 5.3 Abrir `index.html` sobre `file://` con `localStorage` limpio y verificar manualmente que el catálogo lista los 6 libros con editorial y autores resueltos y que el libro sin género se muestra como «Sin clasificar» (RN-CA-01, RN-CA-02)
- [ ] 5.4 Registrar en el change la evidencia de la auditoría (resultado del script de validación antes y después de las correcciones) y verificar que el archivo de evidencia referencia los criterios del Ejercicio 3 que cubre
