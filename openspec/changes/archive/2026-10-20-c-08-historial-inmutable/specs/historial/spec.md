# Spec Delta

## Purpose

Permite consultar las ventas confirmadas y su detalle leyendo los valores históricos guardados en cada venta, de modo que la auditoría conserve precios, subtotales y total originales aunque el catálogo cambie después.

## ADDED Requirements

### Requirement: Tabla del historial con datos de cada venta
El historial SHALL mostrar, por cada venta confirmada, su identificador con el formato `V-N`, su fecha, el nombre del cliente y el total, presentando el total con dos decimales.

#### Scenario: Ver las ventas confirmadas
- **WHEN** el bibliotecario abre la vista de historial y existen ventas confirmadas
- **THEN** la tabla muestra una fila por venta con identificador `V-N`, fecha, cliente y total
- **AND** el total de cada fila se presenta con dos decimales
- **AND** el orden de las filas corresponde al de las ventas guardadas

### Requirement: Consulta del detalle de renglones
El sistema SHALL permitir consultar el detalle de una venta confirmada y SHALL mostrar, por cada renglón, el libro, la cantidad, el precio unitario y el subtotal, además del total de la venta.

#### Scenario: Abrir el detalle de una venta
- **WHEN** el bibliotecario pulsa «Ver detalle» en una fila del historial
- **THEN** se muestra el detalle de esa venta con cada renglón (libro, cantidad, precio unitario y subtotal)
- **AND** se muestra el total de la venta
- **AND** los importes se presentan con dos decimales

### Requirement: Detalle inmutable ante cambios del catálogo
El detalle de una venta MUST leer los valores históricos almacenados en la propia venta y MUST NOT releer el precio actual del catálogo; por lo tanto los valores confirmados SHALL conservarse aunque el precio del libro cambie después.

#### Scenario: Cambiar el precio del catálogo tras confirmar
- **WHEN** una venta ya confirmada tiene su precio de catálogo modificado después de la confirmación
- **THEN** al consultar el detalle de esa venta el precio unitario de cada renglón mantiene el valor confirmado
- **AND** los subtotales y el total mantienen los valores originales
- **AND** el detalle no refleja el nuevo precio del catálogo

### Requirement: Estado de historial vacío
Cuando no existan ventas confirmadas, el sistema SHALL mostrar un mensaje de lista vacía en lugar de una tabla sin filas.

#### Scenario: Historial sin ventas
- **WHEN** el bibliotecario abre el historial y no hay ventas confirmadas
- **THEN** se muestra un mensaje de lista vacía
- **AND** no se muestra el panel de detalle

### Requirement: Cierre del detalle
El sistema SHALL ofrecer una acción para cerrar el detalle de la venta y volver a la vista del historial.

#### Scenario: Cerrar el detalle abierto
- **WHEN** el bibliotecario pulsa «Cerrar detalle» con el detalle abierto
- **THEN** el panel de detalle se oculta
- **AND** la tabla del historial permanece visible

### Requirement: Ventas sin edición ni borrado desde la interfaz
El historial MUST NOT ofrecer ninguna acción para editar o eliminar ventas confirmadas; las ventas son inmutables desde la interfaz.

#### Scenario: No hay acciones de edición ni borrado
- **WHEN** el bibliotecario consulta el historial y el detalle de una venta
- **THEN** no aparece ninguna acción de editar la venta
- **AND** no aparece ninguna acción de eliminar la venta
