# estilos-visuales Specification

## Purpose
Define la identidad visual propia y la presentación adaptable del sistema de librería: coherencia estética, organización con Flexbox/Grid, adaptación sin desplazamiento horizontal del documento, foco visible por teclado y errores expresados con texto.

## Requirements

### Requirement: Identidad visual propia y coherente
El sistema SHALL definir una identidad visual propia y coherente —colores, tipografía, espaciado, tarjetas, formularios y botones— mediante variables reutilizables y clases comunes, con los estilos en un archivo CSS externo.

#### Scenario: Variables de identidad definidas
- **WHEN** se inspecciona `css/estilos.css`
- **THEN** existe un bloque `:root` con variables de color, tipografía y espaciado que el resto de las reglas reutiliza

#### Scenario: Clases reutilizadas en elementos equivalentes
- **WHEN** se comparan elementos equivalentes (tarjetas, formularios, botones, campos)
- **THEN** comparten las mismas clases reutilizables en lugar de repetir estilos por elemento

### Requirement: Organización del contenido con Flexbox o Grid
El sistema SHALL organizar el contenido con Flexbox o Grid, usando Grid para la rejilla del catálogo y Flexbox para la navegación y las filas de formularios.

#### Scenario: Rejilla del catálogo con Grid
- **WHEN** se inspecciona el contenedor de la rejilla del catálogo
- **THEN** usa `display: grid` con una definición de columnas repetible (por ejemplo, `repeat(auto-fill, minmax(...))`)

#### Scenario: Navegación y formularios con Flexbox
- **WHEN** se inspecciona la barra de navegación y las filas de los formularios
- **THEN** usan `display: flex` para alinear sus elementos

### Requirement: Adaptación a 320 px y 1280 px sin scroll horizontal
El sistema SHALL presentar textos y controles legibles a 320 px y a 1280 px de ancho, sin provocar desplazamiento horizontal de todo el documento.

#### Scenario: Ancho mínimo de 320 px
- **WHEN** la ventana se ajusta a 320 px de ancho
- **THEN** el contenido se reacomoda y el ancho de scroll del documento no supera el ancho del viewport

#### Scenario: Ancho de 1280 px
- **WHEN** la ventana se ajusta a 1280 px de ancho
- **THEN** textos y controles resultan legibles y no aparece desplazamiento horizontal del documento

### Requirement: Tablas con desplazamiento interno
Cuando una tabla necesite más espacio del disponible, el sistema SHALL desplazarla dentro de su propio contenedor, sin desplazar el documento completo.

#### Scenario: Tabla ancha en viewport angosto
- **WHEN** una tabla es más ancha que su contenedor
- **THEN** la tabla se desplaza horizontalmente dentro de su contenedor y el documento no se desplaza

### Requirement: Foco visible y recorrido por teclado
Los controles SHALL conservar un foco visible y SHALL poder recorrerse completamente con el teclado.

#### Scenario: Foco visible con teclado
- **WHEN** se navega con Tab entre `input`, `select`, `button` y `a`
- **THEN** el control enfocado muestra un indicador de foco perceptible

#### Scenario: Recorrido completo con Tab
- **WHEN** se recorre la página con Tab y Shift+Tab
- **THEN** todos los controles interactivos son alcanzables en un orden coherente

### Requirement: Errores expresados con texto
Los mensajes de error SHALL expresarse con texto legible y SHALL no depender únicamente del color para comunicar el error.

#### Scenario: Error con texto además del color
- **WHEN** una operación es rechazada por las validaciones
- **THEN** se muestra un mensaje con texto que describe el error, más allá del cambio de color

### Requirement: Ausencia de dependencias externas
El sistema SHALL usar únicamente HTML, CSS y JavaScript nativos, sin librerías, frameworks ni CDNs, y sin `@import` de hojas de estilo externas.

#### Scenario: Sin recursos externos
- **WHEN** se inspecciona `css/estilos.css` y los documentos enlazados
- **THEN** no hay referencias a CDNs, frameworks ni `@import` externos
