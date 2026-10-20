# Spec Delta: datos-locales

## Purpose

Define el modelo de datos en memoria de la librería: las colecciones de libros, editoriales, géneros, autores y clientes con identificadores estables, los mínimos del conjunto inicial y la integridad referencial entre libros y sus entidades de referencia, con el historial de ventas arrancando vacío.

## ADDED Requirements

### Requirement: Colecciones en memoria con identificadores estables

El sistema SHALL representar editoriales, géneros, autores, libros y clientes como arrays de objetos en memoria, donde cada registro MUST tener un `id` numérico entero, único dentro de su colección y estable durante toda la sesión.

#### Scenario: Identificadores únicos dentro de cada colección

- **WHEN** se recorre cualquiera de las colecciones cargadas (libros, editoriales, géneros, autores, clientes)
- **THEN** no existen dos registros con el mismo `id` en esa colección
- **AND** cada `id` es un número entero
- **AND** los `id` se reutilizan sin cambios cada vez que se lee la colección

#### Scenario: Colecciones disponibles al iniciar

- **WHEN** el sistema arranca por primera vez con el conjunto inicial
- **THEN** están disponibles las colecciones de libros, editoriales, géneros, autores y clientes
- **AND** cada colección es un array (puede estar vacío solo la de ventas)

### Requirement: Mínimos del conjunto inicial

El sistema SHALL cargar un conjunto de datos ficticios inicial que cumpla, como mínimo, seis libros, dos editoriales, dos géneros, tres autores y tres clientes, y cuyo historial de ventas MUST arrancar vacío.

#### Scenario: Cantidades mínimas del seed

- **WHEN** se cuentan los registros del conjunto inicial
- **THEN** hay al menos 6 libros, 2 editoriales, 2 géneros, 3 autores y 3 clientes
- **AND** cada cliente tiene un email único
- **AND** ninguna colección requerida queda vacía

#### Scenario: Historial de ventas vacío al inicio

- **WHEN** el sistema arranca por primera vez
- **THEN** la colección de ventas es un array vacío
- **AND** no se crea ninguna venta de ejemplo

### Requirement: Integridad referencial de libros

Cada libro del conjunto SHALL relacionarse con una editorial existente y con al menos un autor existente; el género MUST ser opcional y, cuando esté ausente (`null` o sin asignar), el sistema SHALL presentarlo como «Sin clasificar».

#### Scenario: Editorial de cada libro existe

- **WHEN** se recorre cada libro del conjunto inicial
- **THEN** su `editorialId` coincide con el `id` de una editorial existente
- **AND** ningún libro queda sin editorial resoluble

#### Scenario: Cada libro tiene al menos un autor existente

- **WHEN** se recorre cada libro del conjunto inicial
- **THEN** su `autorIds` contiene al menos un elemento
- **AND** todos los `id` declarados en `autorIds` coinciden con autores existentes
- **AND** ningún libro queda sin autores resolubles

#### Scenario: Género opcional sin clasificar

- **WHEN** un libro del conjunto inicial tiene `generoId` en `null` o sin asignar
- **THEN** el sistema lo considera válido
- **AND** lo presenta como «Sin clasificar»
- **AND** los libros con `generoId` asignado tienen un `id` de género existente
