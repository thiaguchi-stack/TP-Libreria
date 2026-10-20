# Spec Delta

## Purpose

Conservar libros, clientes y ventas en el navegador para que sobrevivan a la recarga y a la reapertura de `index.html`, sembrando los ejemplos en el primer inicio y recuperándolos sin duplicar en los siguientes.

## ADDED Requirements

### Requirement: Clave y estructura de la persistencia
El sistema SHALL persistir el estado en `localStorage` bajo la clave `tp_libreria_estado`, con un JSON plano de forma `{ libros, clientes, ventas }`. Editoriales, géneros y autores MUST NOT persistirse: se leen siempre de `js/datos.js`.

#### Scenario: Estructura guardada
- **WHEN** el estado se guarda en `localStorage`
- **THEN** la clave `tp_libreria_estado` contiene un JSON con las propiedades `libros`, `clientes` y `ventas`, y no contiene editoriales, géneros ni autores

#### Scenario: Recuperación de la forma esperada
- **WHEN** el estado se carga desde `localStorage`
- **THEN** el resultado expone las tres colecciones `libros`, `clientes` y `ventas` provenientes de lo guardado

### Requirement: Primer inicio siembra los ejemplos
En el primer inicio, cuando la clave no existe, el sistema SHALL cargar los ejemplos de `DATOS_INICIALES` y guardarlos.

#### Scenario: Clave inexistente
- **WHEN** se carga el estado y la clave `tp_libreria_estado` no existe en `localStorage`
- **THEN** el sistema devuelve los libros y clientes de `DATOS_INICIALES`, deja las ventas en cero y guarda ese estado bajo la clave

#### Scenario: Siembra única
- **WHEN** se completa la siembra del primer inicio
- **THEN** la clave `tp_libreria_estado` queda escrita con las tres colecciones y no se vuelve a sembrar en cargas posteriores

### Requirement: Reapertura recupera sin duplicar
Al volver a abrir con la clave existente y JSON válido, el sistema SHALL recuperar los registros guardados y MUST NOT duplicar los datos iniciales.

#### Scenario: Reapertura con datos guardados
- **WHEN** existe la clave con JSON válido y se carga el estado
- **THEN** se devuelven exactamente los registros guardados, sin agregar ni duplicar los ejemplos de `DATOS_INICIALES`

#### Scenario: Estabilidad de la recarga
- **WHEN** se carga el estado dos veces seguidas sobre una misma clave válida
- **THEN** la cantidad de libros, clientes y ventas es la misma en ambas cargas

### Requirement: JSON corrupto o de forma inválida recarga el estado inicial
Si el valor guardado no es JSON parseable, o parsea pero no tiene la forma `{ libros, clientes, ventas }` con las tres colecciones como arrays, el sistema SHALL descartarlo y recargar el estado inicial.

#### Scenario: JSON corrupto
- **WHEN** la clave contiene texto que no es JSON válido
- **THEN** el sistema descarta el valor y devuelve el estado inicial con los ejemplos de `DATOS_INICIALES`

#### Scenario: Forma inválida
- **WHEN** la clave contiene JSON válido pero alguna colección no es un array (por ejemplo, `libros` es un objeto) o falta una propiedad
- **THEN** el sistema descarta el valor y devuelve el estado inicial

### Requirement: Guardado tras cada mutación
El sistema SHALL persistir el estado tras cada mutación del mismo (alta de libro, alta de cliente y confirmación de venta), para que el cambio sobreviva a una recarga.

#### Scenario: Persistencia tras una mutación
- **WHEN** se completa un alta de libro, un alta de cliente o una confirmación de venta y se guarda el estado
- **THEN** al volver a cargar, el registro agregado sigue presente y no se pierde al recargar la página

#### Scenario: Coherencia entre memoria, guardado y recarga
- **WHEN** se guarda el estado tras una mutación y luego se carga
- **THEN** las tres colecciones recuperadas coinciden con el estado en memoria que se guardó
