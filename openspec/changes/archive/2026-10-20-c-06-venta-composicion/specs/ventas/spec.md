# Spec Delta

## Purpose

Permite armar una venta en curso a partir de un cliente existente y uno o más renglones con libro y cantidad, aplicando las reglas de cantidad válida y no repetición, y manteniendo subtotales, total e importes formateados antes de confirmar.

## ADDED Requirements

### Requirement: Cliente existente obligatorio en la composición
La venta en curso MUST asociarse a un cliente existente elegido por el bibliotecario; el sistema SHALL ofrecer únicamente clientes ya registrados y SHALL exponer el cliente seleccionado como parte del estado de la venta en curso.

#### Scenario: Seleccionar un cliente existente
- **WHEN** el bibliotecario abre el formulario de venta
- **THEN** el selector muestra la lista de clientes registrados
- **AND** al elegir uno, ese cliente queda asociado a la venta en curso
- **AND** la composición de renglones queda habilitada para ese cliente

### Requirement: Alta de renglón con libro existente y cantidad entera positiva
Al agregar un renglón, el sistema MUST exigir un libro existente del catálogo y una cantidad que sea un número entero mayor que cero; si alguno de los datos no cumple, SHALL rechazar el alta, SHALL mostrar un mensaje y MUST NOT modificar la venta en curso.

#### Scenario: Agregar un renglón válido
- **WHEN** el bibliotecario elige un libro y una cantidad entera mayor que cero y agrega el renglón
- **THEN** el renglón se incorpora a la venta en curso con libro, cantidad y precio unitario
- **AND** la lista de renglones se re-renderiza incluyendo el nuevo renglón

#### Scenario: Rechazar cantidad inválida
- **WHEN** el bibliotecario intenta agregar un renglón con cantidad cero, negativa, decimal o no numérica
- **THEN** el sistema rechaza el alta y muestra un mensaje
- **AND** la venta en curso queda sin cambios

### Requirement: Rechazo de libros repetidos
Dentro de una misma venta en curso el sistema MUST NOT admitir dos renglones con el mismo libro; ante un duplicado SHALL rechazar el alta y SHALL informar que el libro ya forma parte de la venta.

#### Scenario: Intentar agregar un libro ya presente
- **WHEN** el bibliotecario agrega un libro que ya tiene un renglón en la venta en curso
- **THEN** el sistema rechaza el alta y muestra el mensaje «Ese libro ya forma parte de la venta…»
- **AND** la cantidad del renglón existente no se modifica automáticamente

### Requirement: Edición de cantidades y eliminación de renglones
Mientras la venta no esté confirmada, el sistema SHALL permitir cambiar la cantidad de un renglón y quitar renglones; cada cambio MUST revalidar la cantidad entera positiva y SHALL recalcular el subtotal afectado.

#### Scenario: Editar la cantidad de un renglón
- **WHEN** el bibliotecario cambia la cantidad de un renglón a un valor entero mayor que cero
- **THEN** el subtotal del renglón se recalcula con la nueva cantidad
- **AND** el total de la venta se recalcula y se refleja en la vista

#### Scenario: Quitar un renglón
- **WHEN** el bibliotecario quita un renglón de la venta en curso
- **THEN** el renglón desaparece de la lista
- **AND** el total de la venta se recalcula sobre los renglones restantes

### Requirement: Cálculo de subtotal y total
El sistema MUST calcular el subtotal de cada renglón como cantidad por precio unitario y el total de la venta como la suma de los subtotales de todos los renglones.

#### Scenario: Calcular subtotales y total
- **WHEN** la venta en curso tiene un renglón de 2 unidades a 1500,00 y otro de 1 unidad a 2000,00
- **THEN** los subtotales son 3000,00 y 2000,00 respectivamente
- **AND** el total mostrado es 5000,00

### Requirement: Presentación de importes con dos decimales
Todos los importes mostrados —precio unitario, subtotal y total— MUST presentarse con exactamente dos decimales.

#### Scenario: Formatear importes
- **WHEN** el sistema muestra el precio unitario, el subtotal o el total de una venta en curso
- **THEN** cada importe se exhibe con dos decimales

### Requirement: Vista de renglones con datos completos
La tabla de renglones SHALL mostrar, por cada renglón, el libro, la cantidad editable, el precio unitario y el subtotal, y SHALL mantener el total de la venta actualizado tras cada cambio.

#### Scenario: Ver la tabla de renglones
- **WHEN** la venta en curso contiene al menos un renglón
- **THEN** la tabla muestra para cada renglón el libro, la cantidad editable, el precio unitario y el subtotal
- **AND** el total de la venta refleja la suma de los subtotales vigentes
