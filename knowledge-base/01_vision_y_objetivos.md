# Visión y Objetivos

## Propósito del sistema

**Librería El Coso** es una aplicación web de frontend puro que presenta el catálogo de una librería y registra libros, clientes y ventas de forma simulada **enteramente en el navegador**.

El sistema existe para servir como trabajo práctico integrador de la unidad *HTML, CSS y JavaScript — Repaso para el parcial 1* de Programación III. No hay backend, API, base de datos ni servidor: los datos viven en `localStorage` y todas las operaciones (altas, ventas, cálculos) se resuelven con JavaScript nativo. El objetivo pedagógico es demostrar el dominio de HTML semántico, CSS propio (Flexbox/Grid, responsive, accesibilidad básica), manipulación del DOM, manejo de eventos, validación de entradas y persistencia local.

## Objetivos por actor

| Actor | Objetivo principal | Objetivos secundarios |
|---|---|---|
| Visitante/Cliente | Explorar el catálogo y encontrar libros por título | Ver detalle de cada libro (título, ISBN, editorial, género, autores, precio) |
| Bibliotecario/Operador | Registrar libros y clientes con datos válidos | Evitar duplicados (ISBN, email); que las opciones de los formularios se generen desde los datos locales |
| Bibliotecario/Operador | Componer una venta y confirmarla | Agregar/quitar renglones, ajustar cantidades, ver totales con dos decimales |
| Bibliotecario/Operador | Consultar el historial de ventas | Acceder al detalle de cada venta con valores históricos inmutables |
| Docente/Evaluador | Verificar el cumplimiento de la consigna | Reproducir los casos manuales y comprobar persistencia y precio histórico |
| Alumno/Desarrollador | Implementar y mantener el TPI | Separar estructura (HTML), estilos (CSS) y comportamiento (JS) |

## Alcance v1.0

- **Navegación entre 5 vistas** en una única página (`index.html`): Catálogo, Libros, Clientes, Ventas, Historial.
- **Catálogo**: título de la librería, buscador por título y tarjetas de libros generadas desde el array de libros.
- **Filtro por título**: ignora mayúsculas/minúsculas, coincidencia parcial, recorta espacios; búsqueda vacía muestra todo; sin coincidencias muestra mensaje claro.
- **Alta de libros**: título, ISBN, precio, editorial, género (opcional, con «Sin clasificar») y autores (selector múltiple), con validaciones completas.
- **Alta de clientes**: nombre completo y email, con validación de formato y unicidad.
- **Venta simulada**: selección de cliente, composición de renglones, cantidades editables, quitado de renglones, subtotales y total.
- **Confirmación de venta**: registra id, fecha, cliente, renglones y total, copiando el **precio unitario como valor histórico**.
- **Historial**: listado de ventas confirmadas con acceso al detalle de renglones.
- **Persistencia** con `localStorage` (clave `tp_libreria_estado`) para libros, clientes y ventas.
- **Datos iniciales ficticios**: 6 libros, 2 editoriales, 2 géneros, 3 autores, 3 clientes.
- **Identidad visual propia** con CSS externo, Flexbox/Grid, responsive verificado a 320 px y 1280 px, foco visible y errores expresados con texto.

## Fuera de alcance

- Editar o eliminar libros, clientes y ventas desde la interfaz.
- Altas, bajas o modificaciones de editoriales, géneros y autores (solo se leen de `js/datos.js`).
- Inicio de sesión real, autenticación o autorización.
- API, base de datos, servidor o conexión con el backend.
- Gestión de stock, cobros, facturación fiscal ni envío de emails (el email solo se valida con expresión regular).
- Uso de librerías, frameworks, bundlers, dependencias instaladas o CDNs de CSS/JavaScript.
- Comprobación del dígito de control del ISBN (solo se compara sin espacios ni guiones).

## Métricas de éxito

| Métrica | Criterio |
|---|---|
| Cumplimiento de la consigna | 100 puntos distribuidos según la rúbrica (HTML 20, CSS 20, Datos/catálogo 15, Altas 15, Ventas 20, Cierre 10) |
| Pruebas de lógica | `node pruebas/test-logica.js` → 37 aserciones pasadas, 0 falladas |
| Casos manuales | 8 casos de la consigna registrados como «Pasa» con evidencia observada |
| Adaptabilidad | Sin desplazamiento horizontal del documento a 320 px y 1280 px |
| Accesibilidad básica | Foco visible, navegación por teclado, errores en texto |
| Persistencia | Recuperación de datos sin duplicar los ejemplos iniciales al recargar |
