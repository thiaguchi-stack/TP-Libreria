# Tasks

## 1. Auditoría del README contra la consigna

- [ ] 1.1 Listar los ítems exigidos por `docs/consigna-tp-libreria.md` §Formato de entrega (integrantes, apertura sin npm, navegación, implementadas y pendientes, datos iniciales, `localStorage`, casos manuales, procedencia de imágenes) y contrastarlos con las secciones del `README.md` actual; verificación: nota de auditoría con la sección presente/faltante de cada ítem
- [ ] 1.2 Buscar en el `README.md` placeholders sin completar (legajos entre corchetes, textos `TODO` o similares); verificación: no queda ningún patrón pendiente en la sección de integrantes
- [ ] 1.3 Contrastar la estructura de directorios declarada en el README con la real (`index.html`, `css/estilos.css`, `js/datos.js`, `js/logica.js`, `js/app.js`, `pruebas/test-logica.js`); verificación: el árbol del README coincide con los archivos existentes

## 2. Integrantes y apertura sin npm

- [ ] 2.1 Completar la sección de integrantes con nombre y legajo de cada persona, sin corchetes ni valores pendientes; verificación: cada integrante figura con nombre y legajo completos
- [ ] 2.2 Redactar los pasos para abrir `index.html` en el navegador sin `npm`; verificación: seguir los pasos abre `index.html` por `file://` sin ejecutar `npm` ni build
- [ ] 2.3 Declarar la ausencia de dependencias (`node_modules`, bundlers, compilación) y el único requisito (navegador moderno); verificación: el README lo afirma explícitamente en la sección de apertura

## 3. Navegación, funcionalidades y datos iniciales

- [ ] 3.1 Describir las cinco vistas (Catálogo, Libros, Clientes, Ventas, Historial) y el mecanismo de navegación por el menú superior sin recargar; verificación: la sección enumera las 5 vistas y explica la conmutación y la vista activa
- [ ] 3.2 Listar las funcionalidades implementadas por ejercicio (1 a 6) según el estado real del código; verificación: cada ejercicio figura con sus funcionalidades y coincide con `index.html`, `css/` y `js/`
- [ ] 3.3 Declarar funcionalidades pendientes y fuera de alcance; verificación: el README indica que no quedan pendientes dentro del alcance y enumera lo fuera de alcance (editar/eliminar, ABM de editoriales/géneros/autores, login, API, backend, stock, cobros, facturación)
- [ ] 3.4 Documentar la ubicación de los datos iniciales (`js/datos.js`, `DATOS_INICIALES`) y las relaciones por `id` (`editorialId`, `generoId`, `autorIds`, `clienteId`), aclarando que editoriales/géneros/autores no se persisten; verificación: la sección nombra el archivo, la constante y las claves de relación

## 4. Funcionamiento y límites de localStorage

- [ ] 4.1 Documentar clave (`tp_libreria_estado`), estructura JSON (`{ libros, clientes, ventas }`) y ubicación para la comprobación guiada (herramientas del navegador → Almacenamiento → LocalStorage → URL `file://`); verificación: los tres datos figuran y la clave coincide con `js/logica.js`
- [ ] 4.2 Declarar los cuatro límites: dependencia de navegador/perfil/ubicación, no comparte entre usuarios ni dispositivos, borrado de datos del navegador elimina los registros, y ausencia de seguridad/integridad garantizada (RN-EX-01…RN-EX-04); verificación: los cuatro límites están presentes de forma explícita
- [ ] 4.3 Explicar el comportamiento de primer inicio, reapertura sin duplicar y recarga ante JSON corrupto; verificación: la explicación coincide con RN-PE-02, RN-PE-03 y RN-PE-04

## 5. Casos manuales, imágenes y pruebas

- [ ] 5.1 Registrar los 8 casos manuales en una tabla con resultado esperado y resultado observado, contrastados con la evidencia de C-10; verificación: los 8 casos figuran con resultado observado y sin aprobaciones sin ejecutar
- [ ] 5.2 Declarar el método de verificación usado y la advertencia de que ninguna prueba se da por aprobada sin ejecutarla; verificación: la nota de método está presente junto a la tabla
- [ ] 5.3 Declarar la procedencia de imágenes: no se usan imágenes, por lo que no hay procedencia ajena que acreditar; verificación: la sección de imágenes lo afirma expresamente
- [ ] 5.4 Registrar el comando `node pruebas/test-logica.js` con el resultado vigente y aclarar que es de desarrollo y no forma parte de la entrega ejecutable; verificación: el comando y el número de aserciones figuran y coinciden con la corrida de C-10

## 6. Verificación de integración

- [ ] 6.1 Recorrer el README contra la lista de contenidos exigida por la consigna, ítem por ítem; verificación: cada ítem del §Formato de entrega tiene su sección con contenido no vacío
- [ ] 6.2 Confirmar que el README no declara nada que el código no haga (funcionalidades, clave de `localStorage`, estructura de datos); verificación: contraste con `js/logica.js`, `js/datos.js` e `index.html`
- [ ] 6.3 Confirmar que el change no modificó `index.html`, `css/`, `js/` ni `pruebas/test-logica.js`; verificación: el diff del change se limita a `README.md`
- [ ] 6.4 Confirmar que no se agregaron dependencias ni recursos externos; verificación: revisión del README y del proyecto sin `node_modules`, CDNs ni `@import` externos
