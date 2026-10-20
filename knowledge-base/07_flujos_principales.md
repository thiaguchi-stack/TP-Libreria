# Flujos Principales

Cada flujo se documenta extremo a extremo, mostrando interacciones entre componentes.

## Flujo 1: Arranque y carga de estado

**Disparador**: el usuario abre `index.html`
**Actor**: cualquier actor

**Pasos**:
1. El navegador carga `index.html` y sus tres scripts en orden: `datos.js` → `logica.js` → `app.js`.
2. `app.js` invoca `cargarEstado(localStorage, DATOS_INICIALES)`.
3. `logica.js` lee la clave `tp_libreria_estado`:
   - **No existe** → siembra los ejemplos de `DATOS_INICIALES` y los guarda (primer inicio).
   - **Existe y es JSON válido** → devuelve `{ libros, clientes, ventas }` guardados.
   - **Existe pero está corrupto** → vuelve a cargar el estado inicial.
4. `app.js` renderiza las 5 vistas con el estado cargado y muestra Catálogo por defecto.

**Diagrama de secuencia**:
```
Navegador → index.html → app.js → logica.cargarEstado → localStorage
                                                          ← {libros,clientes,ventas}
                            app.js ← render inicial
```

**Casos de error**:
- JSON corrupto en `localStorage` → se descarta y se recarga el estado inicial (RN-PE-04).

## Flujo 2: Búsqueda en el catálogo

**Disparador**: el usuario envía el buscador
**Actor**: visitante

**Pasos**:
1. `app.js` captura el `submit` del formulario `#form-busqueda` y aplica `preventDefault`.
2. Toma el valor del campo, lo pasa a `filtrarLibros(libros, texto)`.
3. `logica.js` recorta espacios, pasa a minúsculas y filtra por coincidencia parcial del título.
4. `app.js` vacía `#listado-catalogo` y crea tarjetas para cada coincidencia usando `textContent`.
5. Si no hay coincidencias, muestra «No se encontraron libros que coincidan con la búsqueda».

**Casos de error**:
- Búsqueda vacía → se muestran todos los libros (RN-CA-06).
- Sin coincidencias → mensaje claro, sin tarjetas (RN-CA-07).
- Título con caracteres especiales → se inserta como texto, sin interpretarse como HTML (RN-CA-08).

## Flujo 3: Alta de libro

**Disparador**: el usuario envía el formulario de libro
**Actor**: bibliotecario

**Pasos**:
1. `app.js` captura el `submit` de `#form-libro` y aplica `preventDefault`.
2. Arma `{ titulo, isbn, precio, editorialId, generoId, autorIds }` desde el formulario.
3. Llama a `validarLibro(datos, contexto)` con editoriales, géneros, autores y libros actuales.
4. `logica.js` devuelve la lista de errores (vacía si todo está bien).
5. Si hay errores: `app.js` los muestra en `#errores-libro` y no agrega nada.
6. Si no hay errores: se asigna un `id` (`siguienteId`), se agrega al array de libros, se guarda el estado y se re-renderizan listado, catálogo y selectores de venta.

**Casos de error**:
- Título o ISBN vacíos (RN-LI-01, RN-LI-02).
- ISBN duplicado comparado sin espacios ni guiones (RN-LI-03).
- Precio vacío, no numérico o ≤ 0 (RN-LI-05).
- Editorial o autores inexistentes; sin autores seleccionados (RN-LI-06, RN-LI-07).
- Género inexistente (RN-LI-08).

## Flujo 4: Alta de cliente

**Disparador**: el usuario envía el formulario de cliente
**Actor**: bibliotecario

**Pasos**:
1. `app.js` captura el `submit` de `#form-cliente` y aplica `preventDefault`.
2. Arma `{ nombreCompleto, email }` y llama a `validarCliente(datos, contexto)`.
3. `logica.js` valida no-vacío, formato de email y unicidad (sin espacios exteriores ni mayúsculas).
4. Si hay errores: se muestran en `#errores-cliente`.
5. Si no hay errores: se agrega el cliente, se guarda el estado y se actualizan listado y selector de cliente.

**Casos de error**:
- Nombre o email vacíos (RN-CL-01, RN-CL-02).
- Email con formato inválido (RN-CL-03).
- Email duplicado ignorando mayúsculas y espacios exteriores (RN-CL-04).

## Flujo 5: Composición de una venta

**Disparador**: el usuario agrega un renglón
**Actor**: bibliotecario

**Pasos**:
1. `app.js` captura el `submit` de `#form-renglon` y aplica `preventDefault`.
2. Toma el libro seleccionado y la cantidad; llama a `agregarRenglon(renglones, libro, cantidad)`.
3. `logica.js` valida cantidad entera > 0 y rechaza libros repetidos; devuelve el nuevo array o un error.
4. `app.js` re-renderiza la tabla de renglones, habilita el campo de cantidad editable y recalcula el total (`calcularTotal`).
5. El usuario puede cambiar la cantidad (→ `recalcularRenglon`) o quitar un renglón.

**Casos de error**:
- Cantidad 0, negativa, decimal o no numérica → no se agrega (RN-VE-02).
- Libro repetido → mensaje «Ese libro ya forma parte de la venta…» (RN-VE-03).

## Flujo 6: Confirmación de venta y registro histórico

**Disparador**: el usuario presiona «Confirmar venta»
**Actor**: bibliotecario

**Pasos**:
1. `app.js` llama a `validarConfirmacionVenta(clienteId, renglones)`.
2. `logica.js` verifica cliente, presencia de renglones, cantidades válidas y ausencia de repetidos.
3. Si hay errores: se muestran y **no se confirma** (RN-VE-08).
4. Si todo está bien: `confirmarVenta(cliente, renglones, ventas, fecha)` construye la venta copiando **precio unitario, título y nombre del cliente** como valores históricos (RN-VE-10).
5. Se agrega la venta al array, se guarda el estado, se limpia el formulario y se muestra un mensaje de resultado.
6. El historial queda actualizado con la nueva venta.

**Diagrama de secuencia**:
```
Usuario → app.js → logica.validarConfirmacionVenta
                 ← [] (sin errores)
         app.js → logica.confirmarVenta  (copia precio histórico)
                 ← venta {id,fecha,cliente,renglones,total}
         app.js → logica.guardarEstado → localStorage
         app.js ← limpia form + mensaje + re-render historial
```

**Casos de error**:
- Sin cliente y/o sin renglones → 2 errores, no se registra (RN-VE-08).
- Cantidades inválidas en renglones → no se confirma (RN-VE-08).

## Flujo 7: Consulta del historial y detalle inmutable

**Disparador**: el usuario entra a Historial o pulsa «Ver detalle»
**Actor**: bibliotecario

**Pasos**:
1. `app.js` renderiza la tabla de ventas confirmadas (id, fecha, cliente, total).
2. Al pedir el detalle, se leen los renglones **desde la venta guardada**, no desde el catálogo actual.
3. Se muestran precio unitario, subtotales y total **tal como se confirmaron**.

**Casos de error**:
- Precio del catálogo modificado tras confirmar → el detalle conserva los valores originales (RN-HI-03, RN-VE-10).
- No hay ventas → mensaje de lista vacía (RN-PR-05).

## Flujo 8: Navegación entre vistas

**Disparador**: el usuario pulsa un enlace del menú
**Actor**: cualquier actor

**Pasos**:
1. `app.js` captura el clic del enlace y aplica `preventDefault`.
2. Oculta todas las secciones, muestra la elegida y marca el enlace activo.
3. Actualiza los listados de la vista destino (catálogo, libros, clientes, ventas o historial).

**Casos de error**:
- Vista sin datos → se muestra el mensaje de lista vacía correspondiente.
