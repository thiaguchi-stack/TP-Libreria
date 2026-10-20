# Tasks

## 1. Relevamiento y evidencia base

- [ ] 1.1 Leer `js/app.js` §`renderCatalogo()` e `iniciarCatalogo()` completos y volcar en una nota de trabajo cómo se arma cada tarjeta (nodos, campos, helpers usados) y cómo se decide el mensaje; registrar cualquier dato faltante respecto de título, ISBN, editorial, género, autores y precio (RN-CA-01)
- [ ] 1.2 Leer `js/logica.js` §`filtrarLibros()` y §`textoNormalizado()` y anotar la fórmula exacta de normalización y de comparación (trim, toLowerCase, `includes`); registrar cualquier borde no cubierto contra RN-CA-03…RN-CA-06
- [ ] 1.3 Leer `pruebas/test-logica.js` §Caso 1 y anotar qué bordes del filtro ya cubre (mayúsculas, parcial, espacios, vacío); registrar los bordes ausentes como hallazgo previo a las correcciones
- [ ] 1.4 Ejecutar `node pruebas/test-logica.js` sobre el estado actual y registrar el número de aserciones aprobadas/falladas como línea base verificable

## 2. Renderizado del catálogo

- [ ] 2.1 Verificar que `renderCatalogo()` recorre `estado.libros` y crea exactamente una tarjeta por libro, vaciando el contenedor antes de renderizar; corregir `js/app.js` si quedaran tarjetas sobrantes o faltantes
- [ ] 2.2 Verificar que cada tarjeta muestra el título, el ISBN, la editorial, el género, los autores y el precio resolviendo editorial/género/autores desde sus colecciones; corregir `js/app.js` si falta alguno de los seis datos
- [ ] 2.3 Verificar que todo valor de libro se inserta con `textContent` y que no hay `innerHTML` con datos en el render del catálogo; corregir si apareciera una inserción insegura (RN-CA-08)
- [ ] 2.4 Verificar que un libro con `generoId` `null`/`undefined`/`""` o inexistente se muestra como «Sin clasificar» vía `nombreGenero()`; corregir `js/logica.js` o `js/app.js` si el fallback no se aplica (RN-CA-02)

## 3. Filtro por título

- [ ] 3.1 Verificar que `filtrarLibros()` ignora mayúsculas/minúsculas comparando término y título normalizados; corregir `js/logica.js` si la comparación fuera sensible a mayúsculas (RN-CA-03)
- [ ] 3.2 Verificar que la coincidencia es parcial por `includes()` sobre el título (fragmento en cualquier posición, no solo al inicio); corregir `js/logica.js` si el filtro exigiera el título completo (RN-CA-04)
- [ ] 3.3 Verificar que el término de búsqueda recorta los espacios de los extremos y que el resultado coincide con el de buscar sin esos espacios; corregir `js/logica.js` si no se recortaran (RN-CA-05)
- [ ] 3.4 Verificar que una búsqueda vacía o de solo espacios devuelve todos los libros (copia del array, sin descartar ninguno); corregir `js/logica.js` si devolviera menos (RN-CA-06)

## 4. Estados de la UI del buscador

- [ ] 4.1 Verificar que con el buscador vacío el mensaje indica el catálogo completo con la cantidad de libros y que se muestran todas las tarjetas; corregir `js/app.js` si el texto fuera ambiguo o faltara la cantidad
- [ ] 4.2 Verificar que con coincidencias el mensaje indica cuántos resultados hay y que se muestran solo las tarjetas coincidentes; corregir `js/app.js` si el texto no distinguiera este estado del catálogo completo
- [ ] 4.3 Verificar que sin coincidencias el mensaje informa claramente que no se encontraron libros y no se muestra ninguna tarjeta; corregir `js/app.js` si reutilizara el texto del catálogo vacío (RN-CA-07)
- [ ] 4.4 Verificar que con el array de libros vacío el mensaje informa que no hay libros y no se muestra ninguna tarjeta; corregir `js/app.js` si el caso quedara sin mensaje propio
- [ ] 4.5 Verificar que la acción de limpiar vacía el campo, vuelve a mostrar el catálogo completo y devuelve el foco al campo de búsqueda; corregir `js/app.js` si no reseteara el campo o no llamara a `focus()` (RN-PR-08)

## 5. Pruebas y verificación objetiva

- [ ] 5.1 Extender `pruebas/test-logica.js` §Caso 1 con los bordes de filtro ausentes detectados en 1.3 (por ejemplo, término con espacios alrededor, coincidencia en el medio del título, término con distinta capitalización); verificar que las nuevas aserciones fallan antes del arreglo si aún no estaba cubierto y pasan después
- [ ] 5.2 Agregar a `pruebas/test-logica.js` un caso con un título que incluya caracteres especiales (`<`, `>`, `&`) para confirmar que el filtro lo trata como texto; verificar el resultado del `includes` sobre ese título
- [ ] 5.3 Correr `node pruebas/test-logica.js` y verificar que todas las aserciones (las 37 previas más las agregadas en 5.1/5.2) pasan sin fallos; registrar el total final como evidencia
- [ ] 5.4 Abrir `index.html` sobre `file://` y verificar manualmente los cuatro estados del buscador (catálogo completo, N resultados, sin coincidencias, catálogo vacío) confirmando el texto del mensaje y la cantidad de tarjetas en cada uno
- [ ] 5.5 Verificar manualmente con el teclado que el botón «Limpiar búsqueda» se alcanza con Tab, resetea el campo y devuelve el foco al buscador; registrar la secuencia observada como evidencia (RN-PR-08)
- [ ] 5.6 Registrar en el change la evidencia de la auditoría (resultado de `node pruebas/test-logica.js` antes y después, y checklist de los estados manuales) y verificar que el archivo de evidencia referencia las reglas RN-CA-01…RN-CA-08 que cubre
