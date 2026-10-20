# verificacion Specification

## Purpose
Definir cómo se verifica objetivamente el comportamiento de Librería El Coso antes de darlo por aprobado: mediante la suite automática de lógica y los 8 casos manuales de la consigna, dejando registrado el resultado observado de cada uno.

## Requirements

### Requirement: Verificación mediante la suite automática de lógica
El sistema SHALL contar con una suite automática de lógica ejecutable con `node pruebas/test-logica.js` que no requiera navegador ni dependencias. La suite MUST reportar la cantidad de aserciones pasadas y falladas, y la verificación SHALL registrar el resultado real de la corrida. La suite MUST dejar 0 aserciones falladas para considerarse aprobada.

#### Scenario: Corrida de la suite en verde
- **WHEN** se ejecuta `node pruebas/test-logica.js` sobre el proyecto actual
- **THEN** la salida muestra 37 aserciones pasadas y 0 falladas, y ese resultado queda registrado como evidencia del caso

#### Scenario: Ninguna prueba se aprueba sin ejecutarla
- **WHEN** se registra el resultado de la suite o de un caso manual
- **THEN** el resultado corresponde a una ejecución efectivamente realizada (comando corrido o caso reproducido), y no a un resultado supuesto ni copiado de otro caso

### Requirement: Prueba guiada del precio histórico en una copia de prueba
El sistema SHALL permitir verificar que el detalle de una venta confirmada conserva sus importes originales aunque cambie el precio del catálogo, mediante una prueba guiada en una **copia de prueba** del proyecto. La prueba MUST modificar únicamente el precio del libro dentro del catálogo guardado en `localStorage` (clave `tp_libreria_estado`, arreglo `libros`) y MUST NOT modificar ni borrar las ventas guardadas.

#### Scenario: Importes originales tras cambiar el precio del catálogo
- **WHEN** se confirma una venta y se anotan sus importes, se cambia solo el precio del libro en el catálogo guardado (`tp_libreria_estado.libros`) sin tocar las ventas, y se recarga la página
- **THEN** el detalle de esa venta en el historial conserva el precio unitario, los subtotales y el total originales confirmados, sin reflejar el nuevo precio del catálogo (RN-HI-03, RN-VE-10)

#### Scenario: Las ventas guardadas permanecen intactas
- **WHEN** se edita el precio del catálogo en el `localStorage` durante la prueba
- **THEN** el arreglo `ventas` guardado conserva exactamente los mismos registros que antes de la edición, y la venta sigue consultable en el historial

### Requirement: Verificación de los 8 casos manuales de la consigna
El sistema SHALL verificar y registrar el resultado observado de los 8 casos manuales de la consigna (Ejercicio 6): (1) búsqueda con parte del título en mayúsculas, vacía y texto inexistente; (2) alta de libro con ISBN existente y con ISBN nuevo; (3) alta de cliente con email inválido, email existente en mayúsculas y email nuevo; (4) venta sin cliente, cantidad cero, negativa o decimal, y libro repetido; (5) venta válida de dos unidades a 1500 y una a 2000; (6) venta confirmada y cambio exclusivo del precio de catálogo guardado en una copia de prueba; (7) recarga después de altas y venta; (8) navegación por teclado y anchos de 320 px y 1280 px. Cada caso MUST registrar su resultado observado.

#### Scenario: Búsqueda con coincidencias, vacía y sin resultados
- **WHEN** se busca una parte del título en mayúsculas, luego se deja la búsqueda vacía y por último se escribe un texto inexistente
- **THEN** el primer caso muestra coincidencias sin distinguir mayúsculas, el segundo el catálogo completo y el tercero un mensaje claro de sin resultados (RN-CA-03…RN-CA-07)

#### Scenario: Alta de libro con ISBN duplicado y con ISBN nuevo
- **WHEN** se intenta dar de alta un libro con un ISBN ya existente y luego con un ISBN nuevo
- **THEN** el duplicado se rechaza con mensaje y el válido aparece en el catálogo y en la selección de venta (RN-LI-03, RN-LI-10)

#### Scenario: Alta de cliente con email inválido, existente en mayúsculas y nuevo
- **WHEN** se intenta dar de alta un cliente con email inválido, con un email ya existente escrito en mayúsculas y luego con un email nuevo
- **THEN** los dos primeros se rechazan con mensaje y el nuevo aparece en el listado y en la selección de cliente (RN-CL-03, RN-CL-04, RN-CL-05)

#### Scenario: Venta inválida y libro repetido
- **WHEN** se intenta confirmar una venta sin cliente, o con una cantidad cero, negativa o decimal, o se agrega dos veces el mismo libro
- **THEN** la venta sin cliente o con cantidad inválida no se confirma, y el libro repetido no crea un renglón nuevo (RN-VE-02, RN-VE-03, RN-VE-08)

#### Scenario: Venta válida con total calculado
- **WHEN** se confirma una venta con dos unidades a 1500 y una unidad a 2000
- **THEN** los subtotales son 3000 y 2000, el total es 5000, los importes se muestran con dos decimales y el detalle queda conservado en el historial (RN-VE-05, RN-VE-06, RN-VE-07, RN-VE-09)

#### Scenario: Recarga después de altas y venta sin duplicar
- **WHEN** se recarga la página después de dar de alta libros y clientes y de confirmar una venta
- **THEN** esos registros se recuperan sin duplicar los ejemplos iniciales ni las ventas (RN-PE-02, RN-PE-03)

#### Scenario: Navegación por teclado y anchos de 320 px y 1280 px
- **WHEN** se recorre la interfaz con el teclado y se comprueban los anchos de 320 px y 1280 px
- **THEN** los controles conservan foco visible y son utilizables, no hay desplazamiento horizontal del documento y la tabla con más ancho se desplaza dentro de su propio contenedor (RN-PR-06, RN-PR-07, RN-PR-08)

### Requirement: Registro del método y el resultado observado
Cada caso verificado SHALL quedar registrado con su método de reproducción (comando de la suite o pasos manuales), su resultado observado y su estado (pasa o falla). Si un caso falla o una funcionalidad queda pendiente, el registro MUST conservar el comportamiento real observado en lugar de declararlo aprobado.

#### Scenario: Registro de un caso ejecutado
- **WHEN** se completa la ejecución de un caso (automático o manual)
- **THEN** queda registrado el método usado, el resultado observado y el estado del caso, consistente con lo que se observó al ejecutarlo

#### Scenario: Caso fallido o pendiente declarado
- **WHEN** un caso falla o una funcionalidad no está implementada
- **THEN** el registro de ese caso declara el comportamiento real observado y no lo marca como aprobado
