// Comportamiento de la interfaz: navegación, renderizado y eventos.
// Los datos de usuarios siempre se insertan como texto (textContent),
// nunca se interpretan como HTML.

const estado = {
  editoriales: DATOS_INICIALES.editoriales,
  generos: DATOS_INICIALES.generos,
  autores: DATOS_INICIALES.autores,
  libros: [],
  clientes: [],
  ventas: [],
  renglonesEnCurso: []
};

function $(id) {
  return document.getElementById(id);
}

function vaciar(nodo) {
  while (nodo.firstChild) nodo.removeChild(nodo.firstChild);
}

function celda(texto) {
  const td = document.createElement("td");
  td.textContent = texto;
  return td;
}

function mostrarErrores(idContenedor, errores) {
  const contenedor = $(idContenedor);
  vaciar(contenedor);
  if (errores.length === 0) return;
  const lista = document.createElement("ul");
  errores.forEach((error) => {
    const item = document.createElement("li");
    item.textContent = "Error: " + error;
    lista.appendChild(item);
  });
  contenedor.appendChild(lista);
}

function mostrarMensaje(idNodo, texto, tipo) {
  const nodo = $(idNodo);
  nodo.textContent = texto;
  nodo.className = "mensaje" + (tipo ? " " + tipo : "");
}

function limpiarMensaje(idNodo) {
  mostrarMensaje(idNodo, "", "");
}

/* ---------- Navegación entre vistas ---------- */

function activarVista(nombre) {
  document.querySelectorAll(".vista").forEach((seccion) => {
    const esLaSuya = seccion.id === nombre;
    seccion.classList.toggle("activa", esLaSuya);
    seccion.hidden = !esLaSuya;
  });
  document.querySelectorAll(".navegacion a").forEach((enlace) => {
    enlace.classList.toggle("activo", enlace.dataset.vista === nombre);
  });
  if (nombre === "catalogo") renderCatalogo();
  if (nombre === "libros") renderListadoLibros();
  if (nombre === "clientes") renderListadoClientes();
  if (nombre === "ventas") renderSelectsVenta();
  if (nombre === "historial") renderHistorial();
}

function iniciarNavegacion() {
  document.querySelectorAll(".navegacion a").forEach((enlace) => {
    enlace.addEventListener("click", (evento) => {
      evento.preventDefault();
      activarVista(enlace.dataset.vista);
    });
  });
}

/* ---------- Catálogo y filtro por título ---------- */

function renderCatalogo() {
  const contenedor = $("listado-catalogo");
  const mensaje = $("mensaje-catalogo");
  const texto = $("buscar-titulo").value;
  const encontrados = filtrarLibros(estado.libros, texto);

  vaciar(contenedor);

  if (encontrados.length === 0) {
    mostrarMensaje(
      "mensaje-catalogo",
      texto.trim() === ""
        ? "No hay libros en el catálogo."
        : "No se encontraron libros que coincidan con la búsqueda: \"" + texto.trim() + "\".",
      "error"
    );
    return;
  }

  if (texto.trim() === "") {
    mostrarMensaje("mensaje-catalogo", "Catálogo completo: " + encontrados.length + " libro(s).", "");
  } else {
    mostrarMensaje(
      "mensaje-catalogo",
      encontrados.length + " resultado(s) para: \"" + texto.trim() + "\".",
      ""
    );
  }

  encontrados.forEach((libro) => {
    const tarjeta = document.createElement("article");
    tarjeta.className = "tarjeta";

    const titulo = document.createElement("h3");
    titulo.textContent = libro.titulo;
    tarjeta.appendChild(titulo);

    const lista = document.createElement("dl");
    const datos = [
      ["ISBN", libro.isbn],
      ["Editorial", nombreEditorial(estado.editoriales, libro.editorialId)],
      ["Género", nombreGenero(estado.generos, libro.generoId)],
      ["Autores", nombresAutores(estado.autores, libro.autorIds)]
    ];
    datos.forEach(([etiqueta, valor]) => {
      const dt = document.createElement("dt");
      dt.textContent = etiqueta;
      const dd = document.createElement("dd");
      dd.textContent = valor;
      lista.appendChild(dt);
      lista.appendChild(dd);
    });
    tarjeta.appendChild(lista);

    const precio = document.createElement("p");
    precio.className = "precio";
    precio.textContent = "Precio: " + formatearImporte(libro.precio);
    tarjeta.appendChild(precio);

    contenedor.appendChild(tarjeta);
  });
}

function iniciarCatalogo() {
  $("form-busqueda").addEventListener("submit", (evento) => {
    evento.preventDefault();
    renderCatalogo();
  });
  $("buscar-titulo").addEventListener("input", renderCatalogo);
  $("btn-limpiar-busqueda").addEventListener("click", () => {
    $("buscar-titulo").value = "";
    renderCatalogo();
    $("buscar-titulo").focus();
  });
}

/* ---------- Libros ---------- */

function renderListadoLibros() {
  const tbody = $("tbody-libros");
  vaciar(tbody);
  const vacio = $("vacio-libros");
  vacio.hidden = estado.libros.length > 0;

  estado.libros.forEach((libro) => {
    const fila = document.createElement("tr");
    fila.appendChild(celda(String(libro.id)));
    fila.appendChild(celda(libro.titulo));
    fila.appendChild(celda(libro.isbn));
    fila.appendChild(celda(nombreEditorial(estado.editoriales, libro.editorialId)));
    fila.appendChild(celda(nombreGenero(estado.generos, libro.generoId)));
    fila.appendChild(celda(nombresAutores(estado.autores, libro.autorIds)));
    fila.appendChild(celda(formatearImporte(libro.precio)));
    tbody.appendChild(fila);
  });
}

function popularSelectsLibro() {
  const selectEditorial = $("libro-editorial");
  const selectGenero = $("libro-genero");
  const selectAutores = $("libro-autores");
  vaciar(selectEditorial);
  vaciar(selectGenero);
  vaciar(selectAutores);

  const opcionEditorial = document.createElement("option");
  opcionEditorial.value = "";
  opcionEditorial.textContent = "Seleccione una editorial...";
  selectEditorial.appendChild(opcionEditorial);
  estado.editoriales.forEach((editorial) => {
    const opcion = document.createElement("option");
    opcion.value = String(editorial.id);
    opcion.textContent = editorial.nombre;
    selectEditorial.appendChild(opcion);
  });

  const opcionSinGenero = document.createElement("option");
  opcionSinGenero.value = "";
  opcionSinGenero.textContent = "Sin clasificar";
  selectGenero.appendChild(opcionSinGenero);
  estado.generos.forEach((genero) => {
    const opcion = document.createElement("option");
    opcion.value = String(genero.id);
    opcion.textContent = genero.nombre;
    selectGenero.appendChild(opcion);
  });

  estado.autores.forEach((autor) => {
    const opcion = document.createElement("option");
    opcion.value = String(autor.id);
    opcion.textContent = autor.nombre;
    selectAutores.appendChild(opcion);
  });
}

function iniciarFormularioLibro() {
  popularSelectsLibro();

  $("form-libro").addEventListener("submit", (evento) => {
    evento.preventDefault();
    mostrarErrores("errores-libro", []);
    limpiarMensaje("mensaje-libro");

    const autoresSeleccionados = Array.from($("libro-autores").selectedOptions).map(
      (opcion) => Number(opcion.value)
    );
    const datos = {
      titulo: $("libro-titulo").value,
      isbn: $("libro-isbn").value,
      precio: $("libro-precio").value,
      editorialId: $("libro-editorial").value,
      generoId: $("libro-genero").value,
      autorIds: autoresSeleccionados
    };

    const errores = validarLibro(datos, {
      libros: estado.libros,
      editoriales: estado.editoriales,
      generos: estado.generos,
      autores: estado.autores
    });

    if (errores.length > 0) {
      mostrarErrores("errores-libro", errores);
      mostrarMensaje("mensaje-libro", "El libro no se registró: corrija los errores indicados.", "error");
      return;
    }

    const libro = {
      id: siguienteId(estado.libros),
      titulo: datos.titulo.trim(),
      isbn: datos.isbn.trim(),
      precio: Number(datos.precio),
      editorialId: Number(datos.editorialId),
      generoId: datos.generoId === "" ? null : Number(datos.generoId),
      autorIds: autoresSeleccionados
    };
    estado.libros.push(libro);
    guardarEstado(localStorage, estado);

    $("form-libro").reset();
    popularSelectsLibro();
    renderListadoLibros();
    renderCatalogo();
    renderSelectsVenta();
    mostrarMensaje("mensaje-libro", "Libro registrado: \"" + libro.titulo + "\".", "exito");
  });
}

/* ---------- Clientes ---------- */

function renderListadoClientes() {
  const tbody = $("tbody-clientes");
  vaciar(tbody);
  const vacio = $("vacio-clientes");
  vacio.hidden = estado.clientes.length > 0;

  estado.clientes.forEach((cliente) => {
    const fila = document.createElement("tr");
    fila.appendChild(celda(String(cliente.id)));
    fila.appendChild(celda(cliente.nombreCompleto));
    fila.appendChild(celda(cliente.email));
    tbody.appendChild(fila);
  });
}

function iniciarFormularioCliente() {
  $("form-cliente").addEventListener("submit", (evento) => {
    evento.preventDefault();
    mostrarErrores("errores-cliente", []);
    limpiarMensaje("mensaje-cliente");

    const datos = {
      nombreCompleto: $("cliente-nombre").value,
      email: $("cliente-email").value
    };
    const errores = validarCliente(datos, { clientes: estado.clientes });

    if (errores.length > 0) {
      mostrarErrores("errores-cliente", errores);
      mostrarMensaje("mensaje-cliente", "El cliente no se registró: corrija los errores indicados.", "error");
      return;
    }

    const cliente = {
      id: siguienteId(estado.clientes),
      nombreCompleto: datos.nombreCompleto.trim(),
      email: datos.email.trim()
    };
    estado.clientes.push(cliente);
    guardarEstado(localStorage, estado);

    $("form-cliente").reset();
    renderListadoClientes();
    renderSelectsVenta();
    mostrarMensaje("mensaje-cliente", "Cliente registrado: " + cliente.nombreCompleto + ".", "exito");
  });
}

/* ---------- Ventas ---------- */

function renderSelectsVenta() {
  const selectCliente = $("venta-cliente");
  const clienteSeleccionado = selectCliente.value;
  vaciar(selectCliente);

  const opcionCliente = document.createElement("option");
  opcionCliente.value = "";
  opcionCliente.textContent = "Seleccione un cliente...";
  selectCliente.appendChild(opcionCliente);
  estado.clientes.forEach((cliente) => {
    const opcion = document.createElement("option");
    opcion.value = String(cliente.id);
    opcion.textContent = cliente.nombreCompleto + " (" + cliente.email + ")";
    selectCliente.appendChild(opcion);
  });
  if (clienteSeleccionado) selectCliente.value = clienteSeleccionado;

  const selectLibro = $("renglon-libro");
  const libroSeleccionado = selectLibro.value;
  vaciar(selectLibro);

  const opcionLibro = document.createElement("option");
  opcionLibro.value = "";
  opcionLibro.textContent = "Seleccione un libro...";
  selectLibro.appendChild(opcionLibro);
  estado.libros.forEach((libro) => {
    const opcion = document.createElement("option");
    opcion.value = String(libro.id);
    opcion.textContent = libro.titulo + " — " + formatearImporte(libro.precio);
    selectLibro.appendChild(opcion);
  });
  if (libroSeleccionado) selectLibro.value = libroSeleccionado;
}

function renderRenglones() {
  const tbody = $("tbody-renglones");
  vaciar(tbody);
  $("vacio-renglones").hidden = estado.renglonesEnCurso.length > 0;

  estado.renglonesEnCurso.forEach((renglon, indice) => {
    const fila = document.createElement("tr");
    fila.appendChild(celda(renglon.titulo));

    const tdCantidad = document.createElement("td");
    const inputCantidad = document.createElement("input");
    inputCantidad.type = "number";
    inputCantidad.min = "1";
    inputCantidad.step = "1";
    inputCantidad.value = String(renglon.cantidad);
    inputCantidad.setAttribute("aria-label", "Cantidad de " + renglon.titulo);
    inputCantidad.addEventListener("change", () => {
      const cantidad = inputCantidad.value;
      if (!esCantidadValida(cantidad)) {
        mostrarErrores("errores-venta", ["La cantidad de \"" + renglon.titulo + "\" debe ser un entero mayor que cero."]);
        inputCantidad.value = String(renglon.cantidad);
        return;
      }
      mostrarErrores("errores-venta", []);
      estado.renglonesEnCurso[indice] = recalcularRenglon(renglon, cantidad);
      renderRenglones();
    });
    tdCantidad.appendChild(inputCantidad);
    fila.appendChild(tdCantidad);

    fila.appendChild(celda(formatearImporte(renglon.precioUnitario)));
    fila.appendChild(celda(formatearImporte(renglon.subtotal)));

    const tdAccion = document.createElement("td");
    const botonQuitar = document.createElement("button");
    botonQuitar.type = "button";
    botonQuitar.className = "boton boton-mini";
    botonQuitar.textContent = "Quitar renglón";
    botonQuitar.addEventListener("click", () => {
      estado.renglonesEnCurso.splice(indice, 1);
      mostrarErrores("errores-venta", []);
      renderRenglones();
    });
    tdAccion.appendChild(botonQuitar);
    fila.appendChild(tdAccion);

    tbody.appendChild(fila);
  });

  $("venta-total").textContent = formatearImporte(calcularTotal(estado.renglonesEnCurso));
}

function limpiarVenta() {
  estado.renglonesEnCurso = [];
  $("form-renglon").reset();
  $("renglon-cantidad").value = "1";
  $("venta-cliente").value = "";
  mostrarErrores("errores-venta", []);
  renderRenglones();
}

function iniciarVentas() {
  renderSelectsVenta();
  renderRenglones();

  $("form-renglon").addEventListener("submit", (evento) => {
    evento.preventDefault();
    mostrarErrores("errores-venta", []);
    limpiarMensaje("mensaje-venta");

    const libro = buscarPorId(estado.libros, $("renglon-libro").value);
    const resultado = agregarRenglon(estado.renglonesEnCurso, libro, $("renglon-cantidad").value);

    if (!resultado.ok) {
      mostrarErrores("errores-venta", [resultado.error]);
      mostrarMensaje("mensaje-venta", "No se agregó el renglón.", "error");
      return;
    }

    estado.renglonesEnCurso = resultado.renglones;
    $("renglon-cantidad").value = "1";
    renderRenglones();
    mostrarMensaje("mensaje-venta", "Renglón agregado.", "exito");
  });

  $("btn-confirmar-venta").addEventListener("click", () => {
    mostrarErrores("errores-venta", []);
    limpiarMensaje("mensaje-venta");

    const clienteId = $("venta-cliente").value;
    const errores = validarConfirmacionVenta(clienteId, estado.renglonesEnCurso);
    if (errores.length > 0) {
      mostrarErrores("errores-venta", errores);
      mostrarMensaje("mensaje-venta", "La venta no se confirmó: corrija los errores indicados.", "error");
      return;
    }

    const cliente = buscarPorId(estado.clientes, clienteId);
    const venta = confirmarVenta(cliente, estado.renglonesEnCurso, estado.ventas);
    estado.ventas.push(venta);
    guardarEstado(localStorage, estado);

    const total = formatearImporte(venta.total);
    limpiarVenta();
    renderSelectsVenta();
    renderHistorial();
    mostrarMensaje(
      "mensaje-venta",
      "Venta V-" + venta.id + " confirmada. Total: " + total + ". Formulario listo para una nueva venta.",
      "exito"
    );
  });

  $("btn-cancelar-venta").addEventListener("click", () => {
    limpiarVenta();
    renderSelectsVenta();
    mostrarMensaje("mensaje-venta", "Venta cancelada: se limpiaron cliente y renglones.", "");
  });
}

/* ---------- Historial ---------- */

function renderHistorial() {
  const tbody = $("tbody-ventas");
  vaciar(tbody);
  $("vacio-ventas").hidden = estado.ventas.length > 0;
  $("detalle-venta").hidden = true;

  estado.ventas.forEach((venta) => {
    const fila = document.createElement("tr");
    fila.appendChild(celda("V-" + venta.id));
    fila.appendChild(celda(new Date(venta.fecha).toLocaleString("es-AR")));
    fila.appendChild(celda(venta.clienteNombre));
    fila.appendChild(celda(formatearImporte(venta.total)));

    const td = document.createElement("td");
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "boton boton-mini";
    boton.textContent = "Ver detalle";
    boton.addEventListener("click", () => mostrarDetalle(venta));
    td.appendChild(boton);
    fila.appendChild(td);

    tbody.appendChild(fila);
  });
}

function mostrarDetalle(venta) {
  $("detalle-venta").hidden = false;
  $("detalle-titulo").textContent = "Detalle de venta V-" + venta.id;

  const tbody = $("tbody-detalle");
  vaciar(tbody);
  venta.renglones.forEach((renglon) => {
    const fila = document.createElement("tr");
    fila.appendChild(celda(renglon.titulo));
    fila.appendChild(celda(String(renglon.cantidad)));
    fila.appendChild(celda(formatearImporte(renglon.precioUnitario)));
    fila.appendChild(celda(formatearImporte(renglon.subtotal)));
    tbody.appendChild(fila);
  });

  $("detalle-total").textContent = "Total de la venta: " + formatearImporte(venta.total);
  if (typeof $("detalle-venta").scrollIntoView === "function") {
    $("detalle-venta").scrollIntoView({ block: "nearest" });
  }
}

function iniciarHistorial() {
  renderHistorial();
  $("btn-cerrar-detalle").addEventListener("click", () => {
    $("detalle-venta").hidden = true;
    $("btn-cerrar-detalle").blur();
  });
}

/* ---------- Inicio ---------- */

function iniciar() {
  const cargado = cargarEstado(localStorage, DATOS_INICIALES);
  estado.libros = cargado.libros;
  estado.clientes = cargado.clientes;
  estado.ventas = cargado.ventas;

  iniciarNavegacion();
  iniciarCatalogo();
  iniciarFormularioLibro();
  iniciarFormularioCliente();
  iniciarVentas();
  iniciarHistorial();

  const inicial = (location.hash || "#catalogo").slice(1);
  const vistaValida = document.getElementById(inicial) && document.getElementById(inicial).classList.contains("vista");
  activarVista(vistaValida ? inicial : "catalogo");
}

document.addEventListener("DOMContentLoaded", iniciar);
