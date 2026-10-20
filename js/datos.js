// Datos iniciales ficticios del TP.
// Se cargan en el navegador la primera vez; luego se persisten en localStorage.

const DATOS_INICIALES = {
  editoriales: [
    { id: 1, nombre: "Planeta" },
    { id: 2, nombre: "Alfaguara" }
  ],
  generos: [
    { id: 1, nombre: "Novela" },
    { id: 2, nombre: "Ciencia ficción" }
  ],
  autores: [
    { id: 1, nombre: "Gabriel García Márquez" },
    { id: 2, nombre: "Jorge Luis Borges" },
    { id: 3, nombre: "Isabel Allende" }
  ],
  libros: [
    { id: 1, titulo: "Cien años de soledad", isbn: "978-84-376-0421-8", precio: 1500, editorialId: 2, generoId: 1, autorIds: [1] },
    { id: 2, titulo: "El Aleph", isbn: "978-84-206-3311-2", precio: 2000, editorialId: 1, generoId: 2, autorIds: [2] },
    { id: 3, titulo: "La casa de los espíritus", isbn: "978-84-663-3111-4", precio: 1850, editorialId: 2, generoId: 1, autorIds: [3] },
    { id: 4, titulo: "Ficciones", isbn: "978-84-206-3309-9", precio: 1600, editorialId: 1, generoId: 2, autorIds: [2] },
    { id: 5, titulo: "El amor en los tiempos del cólera", isbn: "978-84-376-0422-5", precio: 1750, editorialId: 2, generoId: 1, autorIds: [1] },
    { id: 6, titulo: "Manual de dibujo para principiantes", isbn: "978-84-376-0999-1", precio: 990, editorialId: 1, generoId: null, autorIds: [3] }
  ],
  clientes: [
    { id: 1, nombreCompleto: "Lucía Fernández", email: "lucia.fernandez@example.com" },
    { id: 2, nombreCompleto: "Martín Gómez", email: "martin.gomez@example.com" },
    { id: 3, nombreCompleto: "Sofía Ríos", email: "sofia.rios@example.com" }
  ],
  ventas: []
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = DATOS_INICIALES;
}
