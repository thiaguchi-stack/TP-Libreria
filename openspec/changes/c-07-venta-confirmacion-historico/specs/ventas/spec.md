# Spec Delta

## Purpose

Confirma una venta en curso registrándola como operación inmutable: valida cliente y renglones, copia los valores del momento (precio unitario, título y nombre del cliente) para que el historial no dependa del catálogo actual, y cierra la operación limpiando el formulario con un mensaje de resultado.

## ADDED Requirements

### Requirement: Impedir la confirmación sin cliente, sin renglones o con cantidades inválidas
Al intentar confirmar, el sistema MUST rechazar la operación si no hay cliente seleccionado, si no hay renglones o si algún renglón tiene cantidad no entera o no mayor que cero; ante cualquier incumplimiento SHALL mostrar los errores y MUST NOT registrar la venta.

#### Scenario: Confirmar sin cliente ni renglones
- **WHEN** el bibliotecario intenta confirmar una venta sin cliente seleccionado y sin renglones
- **THEN** el sistema muestra los errores correspondientes
- **AND** no registra ninguna venta
- **AND** la venta en curso no se modifica
- **AND** el historial permanece sin cambios

#### Scenario: Confirmar con una cantidad inválida
- **WHEN** el bibliotecario intenta confirmar una venta con un renglón cuya cantidad es cero, negativa, decimal o no numérica
- **THEN** el sistema rechaza la confirmación y muestra el error de cantidad
- **AND** no registra la venta
- **AND** el formulario de venta conserva los datos para corregirlos
- **AND** el historial permanece sin cambios

### Requirement: Registrar identificador, fecha, cliente, renglones y total
Al confirmar una venta válida, el sistema MUST crear un registro con identificador único y estable, fecha ISO de confirmación, `clienteId`, `clienteNombre`, `renglones[]` y `total`; SHALL asignar el identificador siguiente al último registrado y MUST NOT duplicarlo.

#### Scenario: Confirmar una venta válida
- **WHEN** el bibliotecario confirma una venta con un cliente seleccionado y al menos un renglón de cantidad entera positiva
- **THEN** el sistema crea la venta con un identificador nuevo y estable
- **AND** la venta registra la fecha de confirmación en formato ISO
- **AND** la venta registra `clienteId`, `clienteNombre`, `renglones[]` y `total`
- **AND** el identificador asignado no coincide con el de ninguna venta existente

### Requirement: Copiar los valores históricos al confirmar
Al confirmar, el sistema MUST copiar el precio unitario y el título de cada renglón y el nombre del cliente como valores históricos dentro de la venta, y MUST NOT releer el catálogo ni el registro de clientes para resolverlos.

#### Scenario: El snapshot conserva los valores originales ante un cambio de catálogo
- **WHEN** se confirma una venta y luego cambia el precio o el título del libro en el catálogo
- **THEN** el precio unitario y el título guardados en los renglones de esa venta no cambian
- **AND** el nombre del cliente guardado en la venta no cambia si el cliente se modifica después
- **AND** el total de la venta sigue calculado sobre los precios copiados al confirmar
- **AND** el detalle del renglón puede leerse sin consultar el precio actual del catálogo

### Requirement: Limpiar el formulario y mostrar un mensaje de resultado
Tras confirmar una venta válida, el sistema SHALL limpiar el formulario de venta para una nueva operación y SHALL mostrar un mensaje de resultado que indique que la venta se registró correctamente.

#### Scenario: Cierre de la confirmación exitosa
- **WHEN** una venta se confirma correctamente
- **THEN** el sistema limpia el cliente seleccionado y los renglones del formulario
- **AND** muestra un mensaje de resultado indicando el éxito de la operación
- **AND** deja el formulario listo para una nueva venta

### Requirement: Inmutabilidad de las ventas confirmadas
Una vez confirmada, una venta MUST ser inmutable: el sistema MUST NOT ofrecer ni ejecutar acciones de edición o eliminación de ventas desde la interfaz, y SHALL conservar sus renglones y totales tal como se confirmaron.

#### Scenario: No hay acciones de edición ni eliminación
- **WHEN** el usuario consulta una venta confirmada
- **THEN** la interfaz no ofrece controles para editar ni eliminar esa venta
- **AND** los renglones y el total se muestran tal como quedaron al confirmar
- **AND** no existe operación de interfaz que altere una venta ya confirmada
