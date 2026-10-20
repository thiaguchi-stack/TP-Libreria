// Lógica pura del TP: validaciones, catálogo, ventas y persistencia.
// No depende del DOM: recibe datos y devuelve resultados, lo que permite
// verificarla también con Node.js fuera del navegador.

const CLAVE_STORAGE = "tp_libreria_estado";

function normalizarISBN(isbn) {
  return String(isbn || "").replace(/[\s-]/g, "").toUpperCase();
}

function textoNormalizado(texto) {
  return String(texto || "").trim().toLowerCase();
}

function filtrarLibros(libros, textoBusqueda) {
  const termino = textoNormalizado(textoBusqueda);
  if (termino === "") return libros.slice();
  return libros.filter((libro) => textoNormalizado(libro.titulo).includes(termino));
}

function formatoEmailValido(email) {
  const valor = String(email || "").trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor);
}

function esCantidadValida(cantidad) {
  const numero = Number(cantidad);
  return Number.isInteger(numero) && numero > 0;
}

function siguienteId(coleccion) {
  if (!coleccion || coleccion.length === 0) return 1;
  return Math.max(...coleccion.map((item) => item.id)) + 1;
}

function buscarPorId(coleccion, id) {
  return coleccion.find((item) => item.id === Number(id));
}

function nombreEditorial(editoriales, id) {
  const editorial = buscarPorId(editoriales, id);
  return editorial ? editorial.nombre : "Editorial desconocida";
}

function nombreGenero(generos, id) {
  if (id === null || id === undefined || id === "") return "Sin clasificar";
  const genero = buscarPorId(generos, id);
  return genero ? genero.nombre : "Sin clasificar";
}

function nombresAutores(autores, ids) {
  return (ids || [])
    .map((id) => buscarPorId(autores, id))
    .filter(Boolean)
    .map((autor) => autor.nombre)
    .join(", ");
}

function validarLibro(datos, contexto) {
  const errores = [];
  const titulo = String(datos.titulo || "").trim();
  const isbn = String(datos.isbn || "").trim();

  if (titulo === "") errores.push("El título no puede quedar vacío.");
  if (isbn === "") {
    errores.push("El ISBN no puede quedar vacío.");
  } else {
    const normalizado = normalizarISBN(isbn);
    const duplicado = contexto.libros.some(
      (libro) => normalizarISBN(libro.isbn) === normalizado
    );
    if (duplicado) errores.push("Ya existe un libro con ese ISBN (se comparan sin espacios ni guiones).");
  }

  const precio = Number(datos.precio);
  if (datos.precio === "" || datos.precio === null || datos.precio === undefined || Number.isNaN(precio)) {
    errores.push("El precio debe ser un valor numérico.");
  } else if (precio <= 0) {
    errores.push("El precio debe ser mayor que cero.");
  }

  const editorial = buscarPorId(contexto.editoriales, datos.editorialId);
  if (!editorial) errores.push("La editorial seleccionada no existe en los datos locales.");

  const autorIds = datos.autorIds || [];
  if (autorIds.length === 0) {
    errores.push("Debe seleccionar al menos un autor.");
  } else {
    const todosExisten = autorIds.every((id) => buscarPorId(contexto.autores, id));
    if (!todosExisten) errores.push("Uno o más autores seleccionados no existen en los datos locales.");
  }

  const generoId = datos.generoId;
  const tieneGenero = generoId !== null && generoId !== undefined && generoId !== "";
  if (tieneGenero && !buscarPorId(contexto.generos, generoId)) {
    errores.push("El género seleccionado no existe en los datos locales.");
  }

  return errores;
}

function validarCliente(datos, contexto) {
  const errores = [];
  const nombre = String(datos.nombreCompleto || "").trim();
  const email = String(datos.email || "").trim();

  if (nombre === "") errores.push("El nombre completo no puede quedar vacío.");

  if (email === "") {
    errores.push("El email no puede quedar vacío.");
  } else if (!formatoEmailValido(email)) {
    errores.push("El email no tiene un formato válido (ejemplo: nombre@dominio.com).");
  } else {
    const duplicado = contexto.clientes.some(
      (cliente) => String(cliente.email).trim().toLowerCase() === email.toLowerCase()
    );
    if (duplicado) errores.push("Ya existe un cliente con ese email (se compara sin distinguir mayúsculas).");
  }

  return errores;
}

function agregarRenglon(renglones, libro, cantidad) {
  if (!libro) return { ok: false, renglones, error: "Debe seleccionar un libro existente." };
  if (!esCantidadValida(cantidad)) {
    return { ok: false, renglones, error: "La cantidad debe ser un número entero mayor que cero." };
  }
  const existente = renglones.find((renglon) => renglon.libroId === libro.id);
  if (existente) {
    return {
      ok: false,
      renglones,
      error: "Ese libro ya forma parte de la venta: modifique la cantidad del renglón existente o quítelo."
    };
  }
  const cantidadNum = Number(cantidad);
  const nuevo = {
    libroId: libro.id,
    titulo: libro.titulo,
    cantidad: cantidadNum,
    precioUnitario: libro.precio,
    subtotal: cantidadNum * libro.precio
  };
  return { ok: true, renglones: renglones.concat([nuevo]), error: null };
}

function recalcularRenglon(renglon, cantidad) {
  const cantidadNum = Number(cantidad);
  return Object.assign({}, renglon, {
    cantidad: cantidadNum,
    subtotal: cantidadNum * renglon.precioUnitario
  });
}

function calcularTotal(renglones) {
  return renglones.reduce((total, renglon) => total + renglon.subtotal, 0);
}

function formatearImporte(valor) {
  const partes = Number(valor).toFixed(2).split(".");
  const entero = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return "$ " + entero + "," + partes[1];
}

function validarConfirmacionVenta(clienteId, renglones) {
  const errores = [];
  if (clienteId === null || clienteId === undefined || clienteId === "") {
    errores.push("Debe seleccionar un cliente.");
  }
  if (!renglones || renglones.length === 0) {
    errores.push("La venta debe tener al menos un renglón.");
  } else {
    const invalidos = renglones.filter((renglon) => !esCantidadValida(renglon.cantidad));
    if (invalidos.length > 0) {
      errores.push("Hay renglones con cantidades inválidas: deben ser enteros mayores que cero.");
    }
    const ids = renglones.map((renglon) => renglon.libroId);
    if (new Set(ids).size !== ids.length) {
      errores.push("Hay libros repetidos dentro de la venta.");
    }
  }
  return errores;
}

// Registra la venta copiando precio unitario y datos descriptivos al renglón
// (valor histórico): luego no se vuelve a leer el precio del catálogo.
function confirmarVenta(cliente, renglones, ventas, fecha) {
  const id = siguienteId(ventas);
  const venta = {
    id: id,
    fecha: (fecha || new Date()).toISOString(),
    clienteId: cliente.id,
    clienteNombre: cliente.nombreCompleto,
    renglones: renglones.map((renglon) => ({
      libroId: renglon.libroId,
      titulo: renglon.titulo,
      cantidad: renglon.cantidad,
      precioUnitario: renglon.precioUnitario,
      subtotal: renglon.subtotal
    })),
    total: calcularTotal(renglones)
  };
  return venta;
}

// Persistencia: primer inicio carga los ejemplos; si ya hay datos guardados
// se recuperan sin duplicar los datos iniciales.
function cargarEstado(storage, datosIniciales) {
  const guardado = storage.getItem(CLAVE_STORAGE);
  if (guardado) {
    try {
      const estado = JSON.parse(guardado);
      if (estado && Array.isArray(estado.libros) && Array.isArray(estado.clientes) && Array.isArray(estado.ventas)) {
        return estado;
      }
    } catch (error) {
      // Si el JSON está corrupto se vuelve a cargar el estado inicial.
    }
  }
  const estadoInicial = {
    libros: datosIniciales.libros.map((libro) => Object.assign({}, libro)),
    clientes: datosIniciales.clientes.map((cliente) => Object.assign({}, cliente)),
    ventas: datosIniciales.ventas.map((venta) => Object.assign({}, venta))
  };
  storage.setItem(CLAVE_STORAGE, JSON.stringify(estadoInicial));
  return estadoInicial;
}

function guardarEstado(storage, estado) {
  storage.setItem(
    CLAVE_STORAGE,
    JSON.stringify({ libros: estado.libros, clientes: estado.clientes, ventas: estado.ventas })
  );
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    CLAVE_STORAGE,
    normalizarISBN,
    textoNormalizado,
    filtrarLibros,
    formatoEmailValido,
    esCantidadValida,
    siguienteId,
    buscarPorId,
    nombreEditorial,
    nombreGenero,
    nombresAutores,
    validarLibro,
    validarCliente,
    agregarRenglon,
    recalcularRenglon,
    calcularTotal,
    formatearImporte,
    validarConfirmacionVenta,
    confirmarVenta,
    cargarEstado,
    guardarEstado
  };
}
