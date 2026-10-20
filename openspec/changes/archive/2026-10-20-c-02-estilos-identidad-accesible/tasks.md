# Tasks: c-02-estilos-identidad-accesible

## 1. Auditoría de identidad visual

- [ ] 1.1 Verificar que `css/estilos.css` esté enlazado desde `index.html` con `<link rel="stylesheet">` local (sin CDN) y anotar el resultado observado
- [ ] 1.2 Verificar que existe un bloque `:root` con variables de color, tipografía y espaciado y que las reglas las consumen (no valores literales repetidos); listar las variables halladas
- [ ] 1.3 Verificar que existen y se reutilizan las clases comunes `.tarjeta`, `.formulario`, `.boton` y `.campo` en los elementos equivalentes; registrar dónde se aplica cada una

## 2. Layout con Flexbox/Grid

- [ ] 2.1 Verificar que el contenedor de la rejilla del catálogo (`.rejilla`) usa `display: grid` con `repeat(auto-fill, minmax(...))` y anotar la definición exacta
- [ ] 2.2 Verificar que `nav` y las filas de los formularios usan `display: flex` para su alineación
- [ ] 2.3 Corregir lo que falte en `css/estilos.css` para cumplir 2.1/2.2 y confirmar el cambio releyendo el archivo

## 3. Adaptación responsive y tablas

- [ ] 3.1 Verificar que existe `box-sizing: border-box` global y que no hay anchos fijos que superen 320 px; listar cualquier ancho problemático
- [ ] 3.2 Verificar que cada tabla está dentro de un `.tabla-contenedor` con `overflow-x: auto` (RN-PR-07)
- [ ] 3.3 Medir a 320 px de ancho que `document.scrollWidth <= viewport` (sin scroll horizontal del documento) y registrar el resultado
- [ ] 3.4 Medir a 1280 px de ancho que `document.scrollWidth <= viewport` y que textos/controles resultan legibles; registrar el resultado
- [ ] 3.5 Corregir lo que falte en `css/estilos.css` para cumplir 3.1–3.4 y repetir las mediciones hasta que ambas den sin scroll horizontal

## 4. Foco visible, errores con texto y cero dependencias

- [ ] 4.1 Verificar que `input`, `select`, `button` y `a` tienen un `:focus-visible` perceptible y registrar la regla observada
- [ ] 4.2 Recorrer la página con Tab y Shift+Tab y confirmar que todos los controles interactivos son alcanzables en orden coherente; registrar el recorrido
- [ ] 4.3 Verificar que `.errores` / `.mensaje.error` incluyen texto legible y no dependen solo del color (RN-PR-09); registrar un ejemplo observado
- [ ] 4.4 Verificar en `css/estilos.css` y en `index.html` que no hay `@import` externo, CDN ni referencia a framework (RN-PR-10)

## 5. Verificación final e integración

- [ ] 5.1 Ejecutar `node pruebas/test-logica.js` y registrar el resultado (esperado: 37/37) para confirmar que los estilos no afectaron la lógica
- [ ] 5.2 Abrir `index.html` y recorrer las cinco vistas a 320 px y 1280 px confirmando que ninguna quedó rota por los ajustes
- [ ] 5.3 Commit + push del hito verificado
