# Reglas de Negocio

Cada regla tiene un código único `RN-{DOMINIO}-{NN}` para trazabilidad con las funcionalidades (`06_funcionalidades.md`) y las pruebas (`pruebas/test-logica.js`).

## Dominio: Catálogo y filtro (RN-CA)

- **RN-CA-01**: El catálogo se genera desde el array de libros; cada tarjeta muestra título, ISBN, editorial, género, autores y precio.
- **RN-CA-02**: Un libro sin género asignado se muestra como **«Sin clasificar»**.
- **RN-CA-03**: El filtro por título ignora diferencias entre mayúsculas y minúsculas.
- **RN-CA-04**: El filtro busca **coincidencias parciales** (substring) dentro del título.
- **RN-CA-05**: El filtro elimina (recorta) espacios sobrantes en los extremos de la búsqueda.
- **RN-CA-06**: Una búsqueda vacía muestra **todo** el catálogo.
- **RN-CA-07**: Una búsqueda sin coincidencias muestra un **mensaje claro** en lugar de tarjetas.
- **RN-CA-08**: Los datos escritos por usuarios se insertan en el DOM como **texto** (`textContent`), nunca como HTML.

## Dominio: Alta de libros (RN-LI)

- **RN-LI-01**: El título no puede quedar vacío (se recortan espacios).
- **RN-LI-02**: El ISBN no puede quedar vacío.
- **RN-LI-03**: El ISBN se compara **sin espacios ni guiones**; no se admite un ISBN ya existente en el conjunto local.
- **RN-LI-04**: No se implementa la validación del dígito de control del ISBN (fuera de alcance).
- **RN-LI-05**: El precio debe ser un valor **numérico mayor que cero**.
- **RN-LI-06**: La editorial seleccionada debe existir en los datos locales.
- **RN-LI-07**: Debe seleccionarse **al menos un autor**, y todos los autores seleccionados deben existir en los datos locales.
- **RN-LI-08**: El género es **opcional**; si se asigna, debe existir en los datos locales. La opción «Sin clasificar» representa su ausencia.
- **RN-LI-09**: El envío del formulario se controla con `preventDefault`; el registro solo se agrega si **todas** las comprobaciones pasan; los errores se muestran **cerca del formulario**.
- **RN-LI-10**: Tras un alta correcta, el listado y las opciones relacionadas (selectores de venta) se actualizan **sin recargar** la página.

## Dominio: Alta de clientes (RN-CL)

- **RN-CL-01**: El nombre completo no puede quedar vacío. No hay campo de apellido separado.
- **RN-CL-02**: El email no puede quedar vacío.
- **RN-CL-03**: El email debe tener un **formato válido** (validado con expresión regular).
- **RN-CL-04**: No se admite otro cliente con el mismo email, comparado **sin espacios exteriores y sin distinguir mayúsculas**.
- **RN-CL-05**: El registro solo se agrega si todas las comprobaciones pasan; tras un alta correcta, el listado y la selección de cliente se actualizan sin recargar.

## Dominio: Ventas (RN-VE)

- **RN-VE-01**: Debe seleccionarse un **cliente existente**.
- **RN-VE-02**: Cada renglón requiere un **libro existente** y una **cantidad entera mayor que cero**.
- **RN-VE-03**: No se admiten **libros repetidos** dentro de la misma venta: se modifica la cantidad del renglón existente o se informa el duplicado.
- **RN-VE-04**: Antes de confirmar, se permite **cambiar cantidades** y **quitar renglones**.
- **RN-VE-05**: El **subtotal** de un renglón es `cantidad × precio unitario`.
- **RN-VE-06**: El **total** de la venta es la **suma de los subtotales**.
- **RN-VE-07**: Los importes se presentan con **dos decimales**.
- **RN-VE-08**: Se impide confirmar una venta **sin cliente**, **sin renglones** o **con cantidades inválidas**.
- **RN-VE-09**: Al confirmar se registra **id, fecha, cliente, renglones y total**.
- **RN-VE-10**: El **precio unitario se copia al renglón como valor histórico**, de modo que el historial no vuelve a leer el precio actual del catálogo. Se conservan también los datos descriptivos (título, nombre del cliente).
- **RN-VE-11**: La confirmación **limpia el formulario** para una nueva venta y muestra un **mensaje de resultado**.
- **RN-VE-12**: Las ventas confirmadas **no se editan ni se eliminan** desde la interfaz.

## Dominio: Historial (RN-HI)

- **RN-HI-01**: El historial muestra **identificador, fecha, cliente y total** de cada venta.
- **RN-HI-02**: Se puede **consultar el detalle** (renglones) de cada venta.
- **RN-HI-03**: El detalle conserva los valores confirmados aunque el precio del catálogo cambie después.

## Dominio: Persistencia (RN-PE)

- **RN-PE-01**: Se usa `localStorage` con la clave `tp_libreria_estado` para conservar **libros, clientes y ventas**.
- **RN-PE-02**: En el **primer inicio** (clave inexistente) se cargan los ejemplos iniciales y se guardan.
- **RN-PE-03**: Al **volver a abrir** (clave existente) se recuperan los registros guardados **sin duplicar** los datos iniciales.
- **RN-PE-04**: Si el JSON guardado está **corrupto**, se vuelve a cargar el estado inicial.
- **RN-PE-05**: Editoriales, géneros y autores **no se persisten**.

## Dominio: Presentación y accesibilidad (RN-PR)

- **RN-PR-01**: Se usan etiquetas semánticas (`header`, `nav`, `main`, `section`, `footer`).
- **RN-PR-02**: Cada campo tiene una **etiqueta asociada** (`label` ↔ control).
- **RN-PR-03**: Los botones tienen **textos que describen su acción**.
- **RN-PR-04**: Las tablas incluyen **encabezados** (`th` con `scope`) y `caption`.
- **RN-PR-05**: Se incorporan **mensajes** para listas vacías, búsquedas sin resultados y operaciones correctas o rechazadas.
- **RN-PR-06**: Flexbox o Grid organizan el contenido; el diseño se comprueba a **320 px y 1280 px** sin desplazamiento horizontal del documento.
- **RN-PR-07**: Si una tabla necesita más espacio, se desplaza **dentro de su propio contenedor**.
- **RN-PR-08**: Los controles conservan un **foco visible** y se recorren con el **teclado**.
- **RN-PR-09**: Los mensajes de error se expresan con **texto** y no dependen únicamente de un color.
- **RN-PR-10**: No se usan librerías, frameworks ni CDNs de CSS/JavaScript.

## Dominio: Excepciones globales

- **RN-EX-01**: El sistema funciona **abriendo `index.html` directamente** (`file://`), sin servidor ni pasos de compilación.
- **RN-EX-02**: El almacenamiento depende del navegador, del perfil del usuario y de la ubicación desde la que se abre el archivo; no comparte información entre usuarios ni entre dispositivos.
- **RN-EX-03**: Borrar los datos del navegador elimina libros, clientes y ventas.
- **RN-EX-04**: Las validaciones y el almacenamiento del navegador sirven para la práctica; **no representan seguridad ni integridad** garantizada por un servidor.
