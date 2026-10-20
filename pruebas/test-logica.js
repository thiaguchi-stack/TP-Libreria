const path = require("path");
const proyecto = path.join(__dirname, "..", "js");
const datos = require(path.join(proyecto, "datos.js"));
const L = require(path.join(proyecto, "logica.js"));

let pasados = 0;
let fallados = 0;
const fallos = [];

function ok(condicion, nombre) {
  if (condicion) { pasados++; }
  else { fallados++; fallos.push(nombre); }
}

function contexto() {
  return { libros: datos.libros, editoriales: datos.editoriales, generos: datos.generos, autores: datos.autores, clientes: datos.clientes };
}

// --- Caso 1: búsqueda ---
let r = L.filtrarLibros(datos.libros, "CIEN AÑOS");
ok(r.length === 1 && r[0].id === 1, "1a: filtro mayúsculas parciales");
r = L.filtrarLibros(datos.libros, "  cien  ");
ok(r.length === 1, "1b: filtro con espacios sobrantes");
r = L.filtrarLibros(datos.libros, "");
ok(r.length === 6, "1c: búsqueda vacía muestra todo");
r = L.filtrarLibros(datos.libros, "zzzznoexiste");
ok(r.length === 0, "1d: sin coincidencias devuelve vacío");

// --- Caso 2: alta de libros ---
let e = L.validarLibro({ titulo: "Otro libro", isbn: "978-84-376-0421-8", precio: 100, editorialId: 1, generoId: "", autorIds: [1] }, contexto());
ok(e.some((x) => x.includes("ISBN")), "2a: ISBN existente rechazado");
e = L.validarLibro({ titulo: "Otro libro", isbn: "978 84 376 0421 8", precio: 100, editorialId: 1, generoId: "", autorIds: [1] }, contexto());
ok(e.some((x) => x.includes("ISBN")), "2a2: ISBN duplicado sin espacios/guiones rechazado");
e = L.validarLibro({ titulo: "Otro libro", isbn: "978-84-999-0001-1", precio: 100, editorialId: 1, generoId: "", autorIds: [1] }, contexto());
ok(e.length === 0, "2b: ISBN nuevo aceptado");
e = L.validarLibro({ titulo: "", isbn: "", precio: -5, editorialId: 99, generoId: 99, autorIds: [] }, contexto());
ok(e.length >= 6, "2c: campos vacíos, precio negativo, editorial/género inexistentes y sin autor");
e = L.validarLibro({ titulo: "X", isbn: "111", precio: "abc", editorialId: 1, generoId: 1, autorIds: [1] }, contexto());
ok(e.some((x) => x.includes("numérico")), "2d: precio no numérico");
e = L.validarLibro({ titulo: "X", isbn: "111", precio: 0, editorialId: 1, generoId: "", autorIds: [1] }, contexto());
ok(e.some((x) => x.includes("mayor que cero")), "2e: precio cero rechazado");

// --- Caso 3: alta de clientes ---
e = L.validarCliente({ nombreCompleto: "Ana Pérez", email: "no-es-email" }, contexto());
ok(e.some((x) => x.includes("formato")), "3a: email inválido rechazado");
e = L.validarCliente({ nombreCompleto: "Ana Pérez", email: "LUCIA.FERNANDEZ@EXAMPLE.COM" }, contexto());
ok(e.some((x) => x.includes("email")), "3b: email existente en mayúsculas rechazado");
e = L.validarCliente({ nombreCompleto: "Ana Pérez", email: "  ana.perez@example.com  " }, contexto());
ok(e.length === 0, "3c: email nuevo (con espacios) aceptado");
e = L.validarCliente({ nombreCompleto: "   ", email: "" }, contexto());
ok(e.length === 2, "3d: nombre y email vacíos rechazados");

// --- Caso 4: ventas inválidas ---
e = L.validarConfirmacionVenta("", []);
ok(e.length === 2, "4a: sin cliente y sin renglones");
e = L.validarConfirmacionVenta(1, [{ libroId: 1, cantidad: 0 }]);
ok(e.length > 0, "4b: cantidad cero");
e = L.validarConfirmacionVenta(1, [{ libroId: 1, cantidad: -2 }]);
ok(e.length > 0, "4c: cantidad negativa");
e = L.validarConfirmacionVenta(1, [{ libroId: 1, cantidad: 1.5 }]);
ok(e.length > 0, "4d: cantidad decimal");
e = L.validarConfirmacionVenta(1, [{ libroId: 1, cantidad: 1 }, { libroId: 1, cantidad: 2 }]);
ok(e.some((x) => x.includes("repetidos")), "4e: libro repetido en la venta");
e = L.validarConfirmacionVenta(1, [{ libroId: 1, cantidad: 2 }]);
ok(e.length === 0, "4f: venta válida");

// renglón duplicado al agregar
let res = L.agregarRenglon([], datos.libros[0], 2);
ok(res.ok, "4g: primer renglón se agrega");
res = L.agregarRenglon(res.renglones, datos.libros[0], 3);
ok(!res.ok && res.error.includes("ya forma parte"), "4h: duplicado informado, no crea otro renglón");

// --- Caso 5: venta válida 2 x 1500 + 1 x 2000 = 5000 ---
let renglones = [];
renglones = L.agregarRenglon(renglones, datos.libros.find((l) => l.precio === 1500), 2).renglones;
renglones = L.agregarRenglon(renglones, datos.libros.find((l) => l.precio === 2000), 1).renglones;
ok(renglones[0].subtotal === 3000, "5a: subtotal 3000");
ok(renglones[1].subtotal === 2000, "5b: subtotal 2000");
ok(L.calcularTotal(renglones) === 5000, "5c: total 5000");
ok(L.formatearImporte(5000) === "$ 5.000,00", "5d: formato dos decimales");
ok(L.formatearImporte(1500) === "$ 1.500,00", "5e: formato miles");

// --- Caso 6: precio histórico inmutable ---
const cliente = datos.clientes[0];
const guardadoPrevio = JSON.stringify(datos.libros);
const ventas = [];
const venta = L.confirmarVenta(cliente, renglones, ventas, new Date("2026-10-20T10:00:00Z"));
const copiaCatalogo = JSON.parse(guardadoPrevio);
const libroEditado = copiaCatalogo.find((l) => l.id === renglones[0].libroId);
libroEditado.precio = 99999; // cambio exclusivo del precio del catálogo
ok(venta.renglones[0].precioUnitario === 1500, "6a: renglón conserva precio unitario histórico");
ok(venta.renglones[0].subtotal === 3000 && venta.total === 5000, "6b: subtotales y total conservados");
ok(venta.clienteNombre === cliente.nombreCompleto && venta.renglones[0].titulo, "6c: datos descriptivos conservados");

// --- Caso 7: persistencia sin duplicar ejemplos ---
const almacenFalso = (() => {
  let mapa = {};
  return { getItem: (k) => (k in mapa ? mapa[k] : null), setItem: (k, v) => { mapa[k] = v; }, _mapa: mapa };
})();
let est = L.cargarEstado(almacenFalso, datos);
ok(est.libros.length === 6 && est.clientes.length === 3 && est.ventas.length === 0, "7a: primer inicio carga ejemplos");
est.libros.push({ id: 7, titulo: "Libro nuevo", isbn: "123", precio: 500, editorialId: 1, generoId: null, autorIds: [1] });
est.clientes.push({ id: 4, nombreCompleto: "Nuevo Cliente", email: "nuevo@example.com" });
est.ventas.push(venta);
L.guardarEstado(almacenFalso, est);
const est2 = L.cargarEstado(almacenFalso, datos);
ok(est2.libros.length === 7, "7b: recarga conserva libros sin duplicar (7)");
ok(est2.clientes.length === 4, "7c: recarga conserva clientes sin duplicar (4)");
ok(est2.ventas.length === 1, "7d: recarga conserva la venta (1)");
ok(est2.ventas[0].renglones[0].precioUnitario === 1500, "7e: precio histórico tras recargar");
const est3 = L.cargarEstado(almacenFalso, datos);
ok(est3.libros.length === 7, "7f: no se duplican ejemplos en aperturas siguientes");

// estado corrupto → vuelve a ejemplos
almacenFalso.setItem(L.CLAVE_STORAGE, "{corrupto");
const est4 = L.cargarEstado(almacenFalso, datos);
ok(est4.libros.length === 6, "7g: JSON corrupto se reemplaza por ejemplos");

console.log("Pasados: " + pasados + " | Fallados: " + fallados);
if (fallados > 0) {
  console.log("FALLAS:");
  fallos.forEach((f) => console.log(" - " + f));
  process.exit(1);
}

