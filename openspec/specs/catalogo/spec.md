# catalogo Specification

## Purpose
Define el comportamiento de exploración del catálogo de la librería: la generación de las tarjetas de libros desde el array de libros con sus datos resueltos, la presentación de «Sin clasificar» cuando falta el género, el filtro por título tolerante a mayúsculas y espacios, y los estados visibles del buscador.

## Requirements

### Requirement: Renderizado del catálogo desde el array de libros

El sistema SHALL generar el catálogo recorriendo el array de libros y crear una tarjeta por libro. Cada tarjeta MUST mostrar el título, el ISBN, la editorial, el género, los autores y el precio del libro, resolviendo editorial, género y autores desde sus colecciones de referencia.

#### Scenario: Tarjeta por cada libro con todos sus datos

- **WHEN** el catálogo se renderiza con el array de libros cargado
- **THEN** aparece una tarjeta por cada libro del array
- **AND** cada tarjeta muestra el título, el ISBN, la editorial, el género, los autores y el precio del libro correspondiente
- **AND** la editorial, el género y los autores se muestran resueltos a partir de sus identificadores

#### Scenario: El catálogo refleja los cambios del array sin recargar

- **WHEN** el array de libros cambia y el catálogo se vuelve a renderizar
- **THEN** las tarjetas generadas corresponden al nuevo contenido del array
- **AND** no queda ninguna tarjeta de un libro que ya no está en el array

### Requirement: Género ausente como «Sin clasificar»

El sistema SHALL presentar como «Sin clasificar» todo libro cuyo género esté ausente (`null`, sin asignar o con identificador inexistente), de modo que ningún libro quede sin la etiqueta de género en su tarjeta.

#### Scenario: Libro sin género asignado

- **WHEN** un libro del catálogo tiene el género ausente (`null` o sin asignar)
- **THEN** su tarjeta muestra el texto «Sin clasificar» en el campo de género
- **AND** el libro se muestra igual que cualquier otro, sin omitir la tarjeta

#### Scenario: Libro con género asignado

- **WHEN** un libro del catálogo tiene un género asignado y existente
- **THEN** su tarjeta muestra el nombre de ese género
- **AND** no muestra el texto «Sin clasificar»

### Requirement: Inserción segura de los datos del libro como texto

El sistema MUST insertar los datos de los libros en el DOM como texto y nunca como HTML, de modo que un título u otro valor con caracteres especiales se muestre literalmente y no se interprete como marcado.

#### Scenario: Título con caracteres especiales

- **WHEN** un libro del catálogo tiene un título que incluye caracteres con significado en HTML (por ejemplo `<`, `>` o `&`)
- **THEN** la tarjeta muestra el título tal cual fue cargado
- **AND** el navegador no interpreta esos caracteres como etiquetas ni crea nodos adicionales

### Requirement: Filtro por título tolerante a mayúsculas y espacios

El filtro por título SHALL ignorar las diferencias entre mayúsculas y minúsculas, buscar por coincidencia parcial (substring) del título y recortar los espacios sobrantes en los extremos del texto de búsqueda. La búsqueda vacía o compuesta solo de espacios SHALL devolver todo el catálogo.

#### Scenario: Coincidencia ignorando mayúsculas y minúsculas

- **WHEN** se filtra por un texto cuya capitalización difiere de la del título del libro
- **THEN** el libro aparece entre los resultados
- **AND** el resultado no depende de si el texto se escribió en mayúsculas o minúsculas

#### Scenario: Coincidencia parcial dentro del título

- **WHEN** se filtra por un fragmento que aparece en el medio del título de un libro
- **THEN** ese libro aparece entre los resultados
- **AND** el filtro no exige que el texto coincida con el título completo

#### Scenario: Espacios sobrantes recortados

- **WHEN** el texto de búsqueda tiene espacios al principio o al final
- **THEN** el filtro los ignora y busca con el término recortado
- **AND** el resultado es el mismo que buscar el término sin esos espacios

#### Scenario: Búsqueda vacía devuelve todo el catálogo

- **WHEN** el texto de búsqueda está vacío o contiene solo espacios
- **THEN** el sistema devuelve todos los libros del catálogo
- **AND** no se descarta ningún libro por el filtro

### Requirement: Estado visible del buscador

El sistema SHALL mostrar en el área de mensajes del catálogo un texto distinto e inequívoco según el estado del buscador: «catálogo completo» cuando la búsqueda está vacía, la cantidad de resultados cuando la búsqueda tiene coincidencias, y un mensaje claro cuando no hay coincidencias. Cuando no hay coincidencias MUST NOT mostrarse ninguna tarjeta.

#### Scenario: Mensaje de catálogo completo

- **WHEN** el buscador está vacío y se muestra todo el catálogo
- **THEN** el mensaje indica que se está viendo el catálogo completo junto con la cantidad de libros
- **AND** se muestran las tarjetas de todos los libros

#### Scenario: Mensaje con la cantidad de resultados

- **WHEN** una búsqueda arroja una o más coincidencias
- **THEN** el mensaje indica cuántos resultados se encontraron
- **AND** se muestran únicamente las tarjetas de los libros que coinciden

#### Scenario: Mensaje sin coincidencias

- **WHEN** una búsqueda no arroja ninguna coincidencia sobre un catálogo con libros
- **THEN** el mensaje informa claramente que no se encontraron libros que coincidan con la búsqueda
- **AND** no se muestra ninguna tarjeta

#### Scenario: Catálogo sin libros

- **WHEN** el array de libros está vacío
- **THEN** el mensaje informa que no hay libros en el catálogo
- **AND** no se muestra ninguna tarjeta

### Requirement: Acción de limpiar la búsqueda

El sistema SHALL ofrecer una acción de limpiar la búsqueda que vacíe el campo de búsqueda, vuelva a mostrar el catálogo completo y devuelva el foco al campo de búsqueda.

#### Scenario: Limpiar restaura el catálogo completo

- **WHEN** hay un texto de búsqueda activo y el usuario activa la acción de limpiar
- **THEN** el campo de búsqueda queda vacío
- **AND** se vuelven a mostrar las tarjetas de todos los libros con el mensaje de catálogo completo

#### Scenario: Limpiar devuelve el foco al campo

- **WHEN** el usuario activa la acción de limpiar la búsqueda
- **THEN** el foco vuelve al campo de búsqueda
- **AND** el campo queda listo para recibir una nueva búsqueda
