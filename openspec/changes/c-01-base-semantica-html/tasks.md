# Tasks: c-01-base-semantica-html

## 1. Auditoría de estructura y navegación

- [ ] 1.1 Verificar que `index.html` tenga `<header>`, `<nav aria-label>`, `<main>` y `<footer>` con contenido y comprobar el resultado en el archivo real
- [ ] 1.2 Verificar que las cinco vistas sean `<section>` con `id` (`catalogo`, `libros`, `clientes`, `ventas`, `historial`) y `aria-labelledby` apuntando al `id` de su encabezado
- [ ] 1.3 Verificar que las anclas del menú (`href="#vista"` + `data-vista`) coinciden exactamente con los `id` de las secciones y con los valores que usa `js/app.js`

## 2. Etiquetado y textos de acción

- [ ] 2.1 Recorrer los tres formularios (libro, cliente, búsqueda) y confirmar que cada input/select tiene `label for` igual a su `id`
- [ ] 2.2 Verificar el formulario de venta (cliente, libro, cantidad) campo por campo
- [ ] 2.3 Confirmar que el input de cantidad dinámico de cada renglón expone un nombre accesible (decisión D-02 del design) y anotar la excepción
- [ ] 2.4 Verificar que todos los botones tienen texto que describe su acción; registrar la lista observada

## 3. Tablas y mensajes de estado

- [ ] 3.1 Verificar `caption` y `th scope="col"` en las cinco tablas (libros, clientes, renglones, ventas, detalle)
- [ ] 3.2 Verificar que cada vista tenga sus nodos de estado: lista vacía, sin resultados (catálogo) y errores near-form
- [ ] 3.3 Comprobar que los nodos de mensaje están asociados a `role`/`aria-live` adecuados

## 4. Inserción segura y verificación final

- [ ] 4.1 Auditar `js/app.js` y confirmar que no hay `innerHTML` con datos de usuario (todo por `textContent`)
- [ ] 4.2 Ejecutar `node pruebas/test-logica.js` y registrar el resultado (esperado: 37/37)
- [ ] 4.3 Abrir `index.html` y recorrer las cinco vistas confirmando que ninguna quedó rota por los ajustes
- [ ] 4.4 Commit + push del hito verificado
