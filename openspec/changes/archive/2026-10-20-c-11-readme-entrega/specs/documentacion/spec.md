# Spec Delta

## Purpose

Definir el contrato de contenido del README de entrega del TPI: qué secciones debe contener, qué información debe declarar cada una y la regla de registrar el comportamiento real, para que la entrega pueda auditarse contra la consigna.

## ADDED Requirements

### Requirement: Identificación de los integrantes

El README SHALL identificar a quienes realizan el trabajo con nombre y legajo, sin placeholders ni valores sin completar.

#### Scenario: Integrantes declarados

- **WHEN** se revisa la sección de integrantes del README
- **THEN** cada integrante figura con nombre y legajo completos, sin corchetes ni textos pendientes como `[legajo]`

#### Scenario: Ausencia de placeholders

- **WHEN** se busca en el README un patrón de placeholder sin completar (por ejemplo, un legajo entre corchetes o un texto `TODO`)
- **THEN** no se encuentra ninguno en la sección de integrantes

### Requirement: Pasos para abrir el proyecto sin npm

El README SHALL describir los pasos para abrir `index.html` en el navegador sin `npm`, sin `node_modules`, sin bundlers ni pasos de compilación.

#### Scenario: Apertura directa

- **WHEN** se siguen los pasos de apertura indicados en el README
- **THEN** `index.html` se abre en el navegador directamente por el protocolo `file://`, sin ejecutar `npm` ni ningún paso de compilación

#### Scenario: Sin dependencias declaradas

- **WHEN** el README describe los requisitos del entorno de ejecución
- **THEN** aclara que no hay dependencias instaladas y que solo se necesita un navegador moderno

### Requirement: Navegación entre vistas

El README SHALL describir las cinco vistas del sistema (Catálogo, Libros, Clientes, Ventas e Historial) y cómo se navega entre ellas desde `index.html`.

#### Scenario: Vistas enumeradas

- **WHEN** se revisa la sección de navegación del README
- **THEN** las cinco vistas están enumeradas con una descripción del contenido de cada una

#### Scenario: Mecanismo de navegación

- **WHEN** el README explica cómo se pasa de una vista a otra
- **THEN** indica que el menú superior conmuta las secciones y marca la vista activa sin recargar la página

### Requirement: Funcionalidades implementadas y pendientes

El README SHALL declarar las funcionalidades implementadas y las pendientes, distinguiendo lo fuera de alcance declarado de lo no terminado dentro del alcance.

#### Scenario: Implementadas por ejercicio

- **WHEN** se revisa la sección de funcionalidades implementadas
- **THEN** cada uno de los seis ejercicios de la consigna figura con las funcionalidades correspondientes

#### Scenario: Pendientes declaradas

- **WHEN** se revisa la sección de funcionalidades pendientes
- **THEN** se indica que no quedan pendientes dentro del alcance y se enumera lo que queda fuera de alcance (editar/eliminar registros, ABM de editoriales/géneros/autores, login, API, backend, stock, cobros y facturación)

### Requirement: Ubicación de los datos iniciales

El README SHALL indicar dónde viven los datos iniciales y cómo se relacionan sus entidades.

#### Scenario: Archivo y constante

- **WHEN** se revisa la sección de datos iniciales
- **THEN** indica que los ejemplos están en `js/datos.js`, en la constante `DATOS_INICIALES`, y qué colecciones contiene

#### Scenario: Relaciones por id

- **WHEN** se describen las relaciones entre entidades
- **THEN** el README explica que se vinculan por `id` (`editorialId`, `generoId`, `autorIds` y `clienteId`) y que editoriales, géneros y autores no se persisten

### Requirement: Funcionamiento y límites de localStorage

El README SHALL documentar el funcionamiento y los límites del almacenamiento: clave, estructura JSON guardada, ubicación para la comprobación guiada, dependencia del navegador/perfil/ubicación de apertura, borrado de datos y ausencia de seguridad.

#### Scenario: Clave, estructura y ubicación

- **WHEN** se revisa la documentación del almacenamiento
- **THEN** indica la clave `tp_libreria_estado`, la estructura `{ libros, clientes, ventas }` y la ruta de las herramientas del navegador (Almacenamiento → LocalStorage) para inspeccionarla

#### Scenario: Límites declarados

- **WHEN** se revisa la sección de límites
- **THEN** declara que el almacenamiento depende del navegador, del perfil y de la ubicación de apertura, que no se comparte entre usuarios ni dispositivos, que borrar los datos del navegador elimina los registros y que no ofrece seguridad ni integridad garantizada por un servidor (RN-EX-01…RN-EX-04)

### Requirement: Resultados de los casos manuales

El README SHALL registrar los resultados de los 8 casos manuales de la consigna con el resultado observado, sin dar por aprobado ningún caso no ejecutado y declarando el método de verificación.

#### Scenario: Ocho casos registrados

- **WHEN** se revisa la tabla de casos manuales del README
- **THEN** figuran los 8 casos de la consigna (búsqueda, alta de libro, alta de cliente, venta inválida, venta válida, precio histórico, recarga y teclado/anchos) con su resultado esperado y su resultado observado

#### Scenario: Método y ausencia de aprobaciones sin ejecutar

- **WHEN** se revisa la forma en que se declaran los resultados
- **THEN** el README describe el método de verificación usado y no declara como aprobado ningún caso que no se haya ejecutado

### Requirement: Procedencia de imágenes y comando de pruebas

El README SHALL declarar la procedencia de las imágenes ajenas si existen, y registrar el comando de pruebas de lógica con su resultado.

#### Scenario: Procedencia de imágenes

- **WHEN** se revisa la sección de imágenes
- **THEN** se aclara si hay imágenes ajenas y, en su caso, su procedencia; si no hay imágenes, se declara expresamente que no se utilizan

#### Scenario: Comando de pruebas

- **WHEN** se revisa la sección de pruebas
- **THEN** figura el comando `node pruebas/test-logica.js` con el resultado de la última ejecución y la aclaración de que las pruebas son de desarrollo y no forman parte de la entrega ejecutable
