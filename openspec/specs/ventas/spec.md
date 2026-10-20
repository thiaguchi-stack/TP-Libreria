# ventas Specification

## Purpose
Permite armar una venta en curso a partir de un cliente existente y uno o más renglones con libro y cantidad, aplicando las reglas de cantidad válida y no repetición, y manteniendo subtotales, total e importes formateados antes de confirmar.

## Requirements

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

### Requirement: Impedir la confirmación sin cliente, sin renglones o con cantidades inválidas
Al intentar confirmar, el sistema MUST rechazar la operación si no hay cliente seleccionado, si no hay renglones o si algún renglón tiene cantidad no entera o no mayor que cero. Ante cualquier incumplimiento SHALL mostrar los errores y MUST NOT registrar la venta.

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
