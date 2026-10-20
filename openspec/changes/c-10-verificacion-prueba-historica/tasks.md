# Tasks

## 1. Corrida y registro de la suite de lógica

- [ ] 1.1 Ejecutar `node pruebas/test-logica.js` desde la raíz del proyecto y registrar el resultado real (aserciones pasadas y falladas); verificación: nota con la salida observada, contrastada con el baseline de 37 pasadas y 0 falladas
- [ ] 1.2 Confirmar que la suite no requiere navegador ni dependencias y que corre sin pasos de compilación; verificación: la corrida finaliza solo con Node y el proyecto no tiene `node_modules`
- [ ] 1.3 Si el número difiere del baseline por cambios en C-04/C-05, registrar el número real y anotar la diferencia en lugar de forzar el esperado; verificación: la nota de resultado coincide con la salida observada del comando

## 2. Prueba guiada del precio histórico en una copia de prueba

- [ ] 2.1 Copiar el proyecto a un directorio de prueba y abrir esa copia con `index.html`; verificación: la copia abre con `file://` y no se toca `js/`, `css/` ni `index.html` del original
- [ ] 2.2 Confirmar una venta en la copia y anotar sus importes (precio unitario, subtotales y total); verificación: la venta aparece en el historial con los importes anotados
- [ ] 2.3 Editar en `localStorage` solo el precio del libro dentro del catálogo guardado (`tp_libreria_estado.libros`), sin modificar ni borrar el arreglo `ventas`; verificación: el JSON guardado sigue siendo válido y el arreglo `ventas` conserva los mismos registros
- [ ] 2.4 Recargar la página y consultar el detalle de la venta anterior; verificación: el detalle conserva precio unitario, subtotales y total originales, sin reflejar el nuevo precio del catálogo (RN-VE-10, RN-HI-03)
- [ ] 2.5 Registrar el resultado observado de la prueba del precio histórico y documentar la ubicación y estructura del catálogo guardado; verificación: la nota indica clave `tp_libreria_estado`, ruta del arreglo `libros` y resultado observado

## 3. Verificación de los 8 casos manuales de la consigna

- [ ] 3.1 Caso 1 — Búsqueda: parte del título en mayúsculas, búsqueda vacía y texto inexistente; verificación: coincidencias sin distinguir mayúsculas, catálogo completo y mensaje de sin resultados (RN-CA-03…RN-CA-07)
- [ ] 3.2 Caso 2 — Alta de libro con ISBN existente y luego con ISBN nuevo; verificación: el duplicado se rechaza y el válido aparece en catálogo y selección de venta (RN-LI-03, RN-LI-10)
- [ ] 3.3 Caso 3 — Alta de cliente con email inválido, email existente en mayúsculas y email nuevo; verificación: los dos primeros se rechazan y el nuevo aparece en listado y selección (RN-CL-03, RN-CL-04, RN-CL-05)
- [ ] 3.4 Caso 4 — Venta sin cliente, cantidad cero/negativa/decimal y libro repetido; verificación: la venta inválida no se confirma y el repetido no crea otro renglón (RN-VE-02, RN-VE-03, RN-VE-08)
- [ ] 3.5 Caso 5 — Venta válida: dos unidades a 1500 y una a 2000; verificación: subtotales 3000 y 2000, total 5000, importes con dos decimales y detalle conservado (RN-VE-05…RN-VE-09)
- [ ] 3.6 Caso 6 — Precio histórico en copia de prueba; verificación: resultado observado coincidente con el de la sección 2
- [ ] 3.7 Caso 7 — Recarga después de altas y venta; verificación: los datos se recuperan sin duplicar los ejemplos iniciales ni las ventas (RN-PE-02, RN-PE-03)
- [ ] 3.8 Caso 8 — Navegación por teclado y anchos de 320 px y 1280 px; verificación: foco visible, controles utilizables, sin desplazamiento horizontal y tabla con desplazamiento propio (RN-PR-06, RN-PR-07, RN-PR-08)
- [ ] 3.9 Registrar cada caso con su método, resultado observado y estado (pasa/falla); verificación: los 8 casos quedan registrados y ningún caso se marca aprobado sin haberse ejecutado

## 4. Verificación de integración y cierre

- [ ] 4.1 Confirmar que el change no modificó `js/`, `css/` ni `index.html` del proyecto original; verificación: revisión del diff limitada a los artefactos del change y a la copia de prueba
- [ ] 4.2 Confirmar que no se agregaron librerías, frameworks ni dependencias; verificación: no hay `node_modules` ni archivos de manifiesto de dependencias nuevos
- [ ] 4.3 Confirmar que la evidencia quedará disponible para C-11 (`readme-entrega`): resultados de la suite, de los 8 casos y método de la prueba histórica; verificación: el registro de resultados cubre la corrida de la suite, los 8 casos manuales y el procedimiento del precio histórico
