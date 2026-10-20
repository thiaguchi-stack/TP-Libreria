# Funcionalidades

Organizadas por **épica** y luego por **historia de usuario** (formato US-NNN).

## Épica 1: Navegación y estructura

### US-001 — Navegar entre las vistas
**Como** bibliotecario
**Quiero** acceder a Catálogo, Libros, Clientes, Ventas e Historial desde un menú
**Para** llegar a cada operación sin recargar la página.

**Criterios de aceptación**:
- [ ] CA-1: Existen las 5 vistas como secciones semánticas dentro de `index.html`.
- [ ] CA-2: El menú superior permite saltar entre ellas y marca la vista activa.
- [ ] CA-3: Al entrar a una vista se actualizan sus listados.

**Reglas relacionadas**: RN-PR-01, RN-EX-01

## Épica 2: Catálogo

### US-002 — Ver el catálogo
**Como** visitante
**Quiero** ver los libros con todos sus datos
**Para** conocer qué ofrece la librería.

**Criterios de aceptación**:
- [ ] CA-1: El catálogo se genera desde el array de libros.
- [ ] CA-2: Cada tarjeta muestra título, ISBN, editorial, género, autores y precio.
- [ ] CA-3: Un libro sin género muestra «Sin clasificar».

**Reglas relacionadas**: RN-CA-01, RN-CA-02

### US-003 — Buscar libros por título
**Como** visitante
**Quiero** filtrar el catálogo por título
**Para** encontrar un libro rápidamente.

**Criterios de aceptación**:
- [ ] CA-1: El filtro ignora mayúsculas/minúsculas y recorta espacios.
- [ ] CA-2: La coincidencia es parcial.
- [ ] CA-3: Búsqueda vacía muestra todo el catálogo.
- [ ] CA-4: Sin coincidencias se muestra un mensaje claro.

**Reglas relacionadas**: RN-CA-03, RN-CA-04, RN-CA-05, RN-CA-06, RN-CA-07

## Épica 3: Alta de libros

### US-004 — Registrar un libro
**Como** bibliotecario
**Quiero** dar de alta un libro con sus relaciones
**Para** incorporarlo al catálogo y poder venderlo.

**Criterios de aceptación**:
- [ ] CA-1: Los selectores de editorial, género y autores se generan desde los datos locales.
- [ ] CA-2: El selector de género incluye «Sin clasificar».
- [ ] CA-3: Se valida título/ISBN no vacíos, ISBN único (normalizado), precio > 0, editorial/autores existentes y al menos un autor.
- [ ] CA-4: El envío se controla con `preventDefault` y los errores se muestran cerca del formulario.
- [ ] CA-5: Tras un alta correcta, el listado, el catálogo y los selectores de venta se actualizan sin recargar.

**Reglas relacionadas**: RN-LI-01 … RN-LI-10

## Épica 4: Alta de clientes

### US-005 — Registrar un cliente
**Como** bibliotecario
**Quiero** dar de alta un cliente
**Para** poder asociarle ventas.

**Criterios de aceptación**:
- [ ] CA-1: Se validan nombre y email no vacíos y formato de email.
- [ ] CA-2: El email es único, comparado sin espacios exteriores ni mayúsculas.
- [ ] CA-3: Tras un alta correcta, el listado y la selección de cliente se actualizan sin recargar.

**Reglas relacionadas**: RN-CL-01 … RN-CL-05

## Épica 5: Ventas

### US-006 — Componer una venta
**Como** bibliotecario
**Quiero** agregar renglones con libro y cantidad
**Para** armar la venta antes de confirmarla.

**Criterios de aceptación**:
- [ ] CA-1: Se selecciona un cliente existente y se agregan renglones con cantidad entera > 0.
- [ ] CA-2: Los libros repetidos se rechazan con mensaje.
- [ ] CA-3: Antes de confirmar se pueden cambiar cantidades y quitar renglones.
- [ ] CA-4: Cada renglón muestra libro, cantidad, precio unitario y subtotal.
- [ ] CA-5: Subtotales y total se calculan y se muestran con dos decimales.

**Reglas relacionadas**: RN-VE-01 … RN-VE-07

### US-007 — Confirmar una venta
**Como** bibliotecario
**Quiero** confirmar la venta
**Para** registrarla en el historial.

**Criterios de aceptación**:
- [ ] CA-1: Se impide confirmar sin cliente, sin renglones o con cantidades inválidas.
- [ ] CA-2: Se registra id, fecha, cliente, renglones y total.
- [ ] CA-3: El precio unitario se copia como valor histórico.
- [ ] CA-4: La confirmación limpia el formulario y muestra un mensaje de resultado.

**Reglas relacionadas**: RN-VE-08 … RN-VE-12

## Épica 6: Historial

### US-008 — Consultar el historial de ventas
**Como** bibliotecario
**Quiero** ver las ventas confirmadas y su detalle
**Para** auditar lo vendido.

**Criterios de aceptación**:
- [ ] CA-1: El historial muestra id, fecha, cliente y total.
- [ ] CA-2: Se puede consultar el detalle de renglones.
- [ ] CA-3: El detalle conserva los valores confirmados aunque el precio del catálogo cambie.
- [ ] CA-4: Las ventas no se editan ni eliminan desde la interfaz.

**Reglas relacionadas**: RN-HI-01, RN-HI-02, RN-HI-03, RN-VE-11, RN-VE-12

## Épica 7: Persistencia y verificación

### US-009 — Conservar los datos entre sesiones
**Como** bibliotecario
**Quiero** que libros, clientes y ventas se conserven al cerrar y reabrir
**Para** no perder el trabajo.

**Criterios de aceptación**:
- [ ] CA-1: Se usa `localStorage` con la clave `tp_libreria_estado`.
- [ ] CA-2: El primer inicio carga los ejemplos; al reabrir se recuperan sin duplicar.
- [ ] CA-3: Un JSON corrupto recarga el estado inicial.
- [ ] CA-4: El README documenta funcionamiento, límites y ubicación del almacenamiento.

**Reglas relacionadas**: RN-PE-01 … RN-PE-05, RN-EX-02, RN-EX-03

### US-010 — Verificar el comportamiento con casos manuales
**Como** docente
**Quiero** reproducir casos manuales documentados
**Para** comprobar el cumplimiento de la consigna.

**Criterios de aceptación**:
- [ ] CA-1: Los 8 casos de la consigna están registrados en el README con resultado observado.
- [ ] CA-2: Pruebas automáticas de lógica pasan (`node pruebas/test-logica.js`).
- [ ] CA-3: Se verifica el precio histórico modificando solo el catálogo guardado en una copia de prueba.

**Reglas relacionadas**: RN-VE-10, RN-HI-03, RN-PE-02, RN-PE-03
