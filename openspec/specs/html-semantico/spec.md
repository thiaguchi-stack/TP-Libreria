# html-semantico Specification

## Purpose
Define la estructura HTML semántica y la accesibilidad básica de las vistas del sistema de librería: navegación entre vistas, etiquetado de campos, semántica de tablas y mensajes de estado legibles.

## Requirements

### Requirement: Navegación entre las cinco vistas
El sistema SHALL exponer cinco vistas —Catálogo, Libros, Clientes, Ventas e Historial— dentro de `index.html`, y SHALL permitir navegar entre ellas mediante un menú principal, marcando la vista activa.

#### Scenario: Menú con las cinco vistas
- **WHEN** el usuario abre `index.html`
- **THEN** el menú principal muestra los enlaces Catálogo, Libros, Clientes, Ventas e Historial

#### Scenario: Vista activa marcada
- **WHEN** el usuario selecciona una vista del menú
- **THEN** la vista elegida queda visible y su enlace se marca como activo

### Requirement: Estructura semántica de la página
La página SHALL organizar su contenido con etiquetas semánticas: un `header`, un `nav`, un `main` y un `footer`; cada vista SHALL ser una `section` con identificador y `aria-labelledby` apuntando a su título.

#### Scenario: Secciones identificadas
- **WHEN** se inspecciona el documento
- **THEN** cada una de las cinco vistas es una `section` con `id` y `aria-labelledby` que referencia el `id` de su encabezado

### Requirement: Etiqueta asociada a cada campo
Cada control de formulario SHALL tener una etiqueta asociada mediante `label` con `for` igual al `id` del control.

#### Scenario: Campo de texto etiquetado
- **WHEN** se recorre el formulario de alta de libro
- **THEN** cada input y select tiene un `label` cuyo `for` coincide con el `id` del control

#### Scenario: Campo generado dinámicamente etiquetado
- **WHEN** se renderiza la tabla de renglones de la venta
- **THEN** el control de cantidad de cada renglón expone un nombre accesible que lo identifica (por ejemplo, indicando el libro)

### Requirement: Botones que describen su acción
Todo botón SHALL tener un texto visible que describa la operación que realiza.

#### Scenario: Textos de acción
- **WHEN** se listan los botones de la aplicación
- **THEN** cada uno muestra un texto como «Registrar libro», «Agregar renglón», «Confirmar venta» o «Limpiar búsqueda», y ninguno queda sin texto

### Requirement: Tablas con encabezados y título
Cada tabla SHALL incluir un `caption` que la describa y encabezados de columna con `th` y `scope="col"`.

#### Scenario: Tabla de libros
- **WHEN** se inspecciona la tabla de libros registrados
- **THEN** tiene un `caption` y sus encabezados son `th` con `scope="col"`

### Requirement: Mensajes de estado por vista
Cada vista SHALL exponer mensajes legibles para lista vacía, búsqueda sin resultados y resultado de operación (éxito o rechazo).

#### Scenario: Catálogo sin resultados
- **WHEN** una búsqueda no encuentra coincidencias
- **THEN** se muestra un mensaje de texto claro en lugar de tarjetas

#### Scenario: Lista vacía
- **WHEN** una colección no tiene registros
- **THEN** la vista muestra un mensaje que indica que no hay datos

#### Scenario: Operación rechazada
- **WHEN** un formulario no pasa las validaciones
- **THEN** se muestran mensajes de error en texto, cerca del formulario

### Requirement: Inserción segura de datos de usuario
El sistema SHALL insertar los datos escritos por usuarios en el DOM como texto, sin interpretarlos como HTML.

#### Scenario: Título con caracteres especiales
- **WHEN** se registra o busca un texto que contiene `<` o `>`
- **THEN** el texto se muestra literalmente y no se interpreta como marcado HTML
