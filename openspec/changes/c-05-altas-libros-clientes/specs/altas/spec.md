# Spec Delta

## Purpose

Permite registrar libros con sus relaciones (editorial, género, autores) y clientes nuevos, validando los datos contra los datos locales y actualizando la interfaz sin recargar la página.

## ADDED Requirements

### Requirement: Selectores de relación del libro
El sistema SHALL generar las opciones de editorial, género y autores del formulario de libro a partir de los datos locales, y MUST incluir en el selector de género la opción «Sin clasificar» que representa la ausencia de género.

#### Scenario: Opciones pobladas desde los datos locales
- **WHEN** el bibliotecario abre la vista de libros
- **THEN** los selectores de editorial, género y autores muestran las opciones de los datos locales de editoriales, géneros y autores

#### Scenario: Género sin clasificar disponible
- **WHEN** el bibliotecario observa el selector de género
- **THEN** encuentra la opción «Sin clasificar» además de los géneros existentes

### Requirement: Validación de los datos del libro
El sistema SHALL validar que el título no esté vacío, que el ISBN no esté vacío y sea único comparado normalizado sin espacios ni guiones, que el precio sea numérico y mayor que cero, que la editorial exista, que se seleccione al menos un autor y que todos existan, y que el género, si se asigna, exista. Un registro sólo MUST agregarse si todas las comprobaciones pasan.

#### Scenario: Título o ISBN vacíos
- **WHEN** el bibliotecario envía el formulario con el título o el ISBN vacíos
- **THEN** el sistema rechaza el alta y muestra el error correspondiente cerca del formulario

#### Scenario: ISBN duplicado con otro separador
- **WHEN** el bibliotecario envía un ISBN que, sin espacios ni guiones, coincide con el de un libro existente
- **THEN** el sistema rechaza el alta e informa el ISBN duplicado

#### Scenario: Precio no numérico o no mayor que cero
- **WHEN** el bibliotecario envía un precio vacío, no numérico o menor o igual a cero
- **THEN** el sistema rechaza el alta e informa que el precio debe ser un número mayor que cero

#### Scenario: Relaciones inválidas o sin autores
- **WHEN** el bibliotecario envía una editorial o un género inexistente, o ningún autor seleccionado
- **THEN** el sistema rechaza el alta e informa el error de relación correspondiente

### Requirement: Registro de libro sin recargar
El sistema SHALL controlar el envío del formulario de libro con `preventDefault`. Si todas las comprobaciones pasan, MUST asignar un identificador, agregar el libro al conjunto local, conservar «Sin clasificar» como género ausente (`null`) y actualizar el listado, el catálogo y los selectores de venta sin recargar la página.

#### Scenario: Alta correcta de un libro
- **WHEN** el bibliotecario envía datos de libro válidos con un género y al menos un autor
- **THEN** el libro se agrega con un nuevo identificador y aparece en el listado y en el catálogo sin recargar la página

#### Scenario: Alta de un libro sin género
- **WHEN** el bibliotecario registra un libro eligiendo «Sin clasificar»
- **THEN** el libro se guarda con género ausente y se muestra como «Sin clasificar»

#### Scenario: Envío con errores no agrega el registro
- **WHEN** el bibliotecario envía datos inválidos
- **THEN** no se agrega ningún libro y los errores se muestran cerca del formulario, sin recargar la página

### Requirement: Validación de los datos del cliente
El sistema SHALL validar que el nombre completo no esté vacío, que el email no esté vacío, que tenga formato válido y que no exista otro cliente con el mismo email comparado sin espacios exteriores ni mayúsculas. Un registro sólo MUST agregarse si todas las comprobaciones pasan.

#### Scenario: Nombre o email vacíos
- **WHEN** el bibliotecario envía el formulario con el nombre o el email vacíos
- **THEN** el sistema rechaza el alta y muestra el error correspondiente cerca del formulario

#### Scenario: Email con formato inválido
- **WHEN** el bibliotecario envía un email que no cumple el formato válido
- **THEN** el sistema rechaza el alta e informa el formato inválido

#### Scenario: Email duplicado ignorando mayúsculas y espacios exteriores
- **WHEN** el bibliotecario envía un email que, sin espacios exteriores y sin distinguir mayúsculas, coincide con el de un cliente existente
- **THEN** el sistema rechaza el alta e informa el email duplicado

### Requirement: Registro de cliente sin recargar
El sistema SHALL controlar el envío del formulario de cliente con `preventDefault`. Si todas las comprobaciones pasan, MUST asignar un identificador, agregar el cliente al conjunto local y actualizar el listado y el selector de cliente sin recargar la página.

#### Scenario: Alta correcta de un cliente
- **WHEN** el bibliotecario envía un nombre y un email válidos y no duplicados
- **THEN** el cliente se agrega con un nuevo identificador y aparece en el listado y en el selector de cliente sin recargar la página

#### Scenario: Envío con errores no agrega el registro
- **WHEN** el bibliotecario envía datos de cliente inválidos
- **THEN** no se agrega ningún cliente y los errores se muestran cerca del formulario, sin recargar la página
