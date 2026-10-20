# Decisiones y Supuestos

## Decisiones documentadas

### DD-01 — Frontend puro sobre `file://`, sin backend
**Decisión**: implementar todo el sistema como HTML/CSS/JS estático, ejecutable abriendo `index.html`.
**Contexto**: la consigna desarrolla exclusivamente el frontend tomando como contexto el TP backend de otro docente.
**Alternativas consideradas**: (a) app con servidor local y API simulada; (b) SPA con bundler (Vite) y módulos ES.
**Justificación**: la consigna prohíbe librerías, frameworks, CDNs y dependencias instaladas, y no exige API ni servidor.
**Trade-offs aceptados**: sin módulos ES ni bundler, los scripts se cargan en orden global; sin backend, la persistencia queda limitada al navegador.

### DD-02 — Una sola página con 5 secciones y navegación por JavaScript
**Decisión**: usar `index.html` con secciones `<section>` conmutadas por JS en lugar de varias páginas HTML.
**Contexto**: la consigna permite varias páginas o secciones de una misma página.
**Alternativas consideradas**: (a) cinco archivos HTML separados; (b) secciones con anclas y `:target` en CSS.
**Justificación**: una sola página evita duplicar el estado y permite que las altas actualicen los selectores de venta sin recargar, que es un requisito explícito.
**Trade-offs aceptados**: sin rutas propias por vista; el estado en memoria debe mantenerse coherente al conmutar.

### DD-03 — Lógica pura separada del DOM en `js/logica.js`
**Decisión**: concentrar validaciones, filtro, cálculos y persistencia en funciones puras sin acceso al DOM.
**Contexto**: hace falta poder verificar el comportamiento de forma objetiva, y la consigna exige registrar resultados observados.
**Alternativas consideradas**: (a) toda la lógica dentro de `app.js` junto a los eventos; (b) clases con estado interno.
**Justificación**: permitió escribir `pruebas/test-logica.js` y correr 37 aserciones con Node sin navegador ni dependencias.
**Trade-offs aceptados**: `logica.js` usa globals en el navegador y `module.exports` en Node (doble contrato al final del archivo).

### DD-04 — Copiar el precio unitario al renglón (snapshot histórico)
**Decisión**: al confirmar, el renglón guarda `precioUnitario`, `titulo` y el nombre del cliente copiados desde el estado del momento.
**Contexto**: la consigna exige que el historial no vuelva a leer el precio actual del catálogo.
**Alternativas consideradas**: (a) guardar solo `libroId` y resolver el precio al mostrar el detalle; (b) guardar el precio con referencia viva.
**Justificación**: es requisito explícito y sostiene la inmutabilidad de las ventas confirmadas (RN-VE-10, RN-HI-03).
**Trade-offs aceptados**: duplicación de datos descriptivos dentro de cada venta; si un título cambia, el historial conserva el viejo (deseado).

### DD-05 — Persistir solo libros, clientes y ventas
**Decisión**: guardar en `localStorage` únicamente libros, clientes y ventas; editoriales, géneros y autores se leen siempre de `js/datos.js`.
**Contexto**: la consigna pide persistir libros, clientes y ventas, y no pide ABM de las entidades de referencia.
**Alternativas consideradas**: (a) persistir todo, incluidas editoriales/géneros/autores; (b) no persistir nada.
**Justificación**: mantener las entidades de referencia como constantes evita inconsistencias y no agrega alcance.
**Trade-offs aceptados**: si en el futuro se quiere alta de editoriales, habrá que incorporarlas a la persistencia.

### DD-06 — Clave única `tp_libreria_estado` con objeto plano
**Decisión**: guardar un único JSON `{ libros, clientes, ventas }` bajo la clave `tp_libreria_estado`.
**Contexto**: la consigna pide persistencia con una estructura identificable en el README.
**Alternativas consideradas**: (a) una clave por colección (`tp_libros`, `tp_clientes`, `tp_ventas`); (b) `IndexedDB`.
**Justificación**: una sola clave simplifica la carga atómica y la comprobación guiada del precio histórico.
**Trade-offs aceptados**: cualquier escritura serializa el objeto completo.

### DD-07 — Sin autenticación ni roles
**Decisión**: no implementar login; todas las vistas son públicas.
**Contexto**: la consigna dice explícitamente que no se requiere inicio de sesión real.
**Alternativas consideradas**: (a) login simulado en `localStorage`; (b) roles ficticios.
**Justificación**: agregar un login simulado sería alcance no pedido y podría desviar puntos de la rúbrica.
**Trade-offs aceptados**: no hay separación de permisos entre visitante y bibliotecario.

## Supuestos inferidos

### SU-01 — Uso individual en un único dispositivo/navegador
**Supuesto**: el sistema se usa desde un mismo navegador y perfil, sin sincronización.
**Origen**: la consigna describe `localStorage` como almacenamiento dependiente del navegador y de la ubicación.
**Riesgo si es falso**: usuarios que cambian de dispositivo verían catálogos distintos.
**Cómo validar**: el README documenta explícitamente este límite.

### SU-02 — Volumen de datos reducido
**Supuesto**: pocos libros, clientes y ventas; no hace falta paginado ni búsquedas indexadas.
**Origen**: los ejemplos iniciales son 6 libros, 3 clientes y 0 ventas.
**Riesgo si es falso**: listados muy largos degradarían la interacción; el filtro lineal dejaría de ser suficiente.
**Cómo validar**: si crece el volumen, medir tiempo de render y evaluar paginado (fuera de alcance).

### SU-03 — Navegador moderno con soporte de `localStorage`, Flexbox y Grid
**Supuesto**: el evaluador abre el proyecto en un navegador de escritorio actualizado.
**Origen**: la consigna pide comprobar a 320 px y 1280 px y usar `localStorage`.
**Riesgo si es falso**: en navegadores antiguos podrían fallar el layout o la persistencia.
**Cómo validar**: se usó Edge headless para medir layout y recorrido por teclado.

### SU-04 — Los datos ficticios son suficientes para las pruebas
**Supuesto**: los 6 libros, 3 clientes y 2 editoriales/géneros/3 autores alcanzan para demostrar todos los casos.
**Origen**: consigna («al menos seis libros, dos editoriales, dos géneros, tres autores y tres clientes»).
**Riesgo si es falso**: algún caso de relación N:N con más autores no quedaría cubierto.
**Cómo validar**: las pruebas y los casos manuales ejercitan varios autores por libro.

### SU-05 — Ejecución de pruebas con Node es aceptable en desarrollo
**Supuesto**: usar Node para correr `pruebas/test-logica.js` no viola el alcance (que prohíbe dependencias en la entrega).
**Origen**: la consigna prohíbe dependencias instaladas en la entrega; el script usa solo APIs de Node, sin `npm install`.
**Riesgo si es falso**: el evaluador podría considerar Node fuera de alcance.
**Cómo validar**: el README aclara que las pruebas son de desarrollo y que la entrega se abre sin npm.
