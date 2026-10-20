# Modelo de Datos

## Dominios

| Dominio | Descripción |
|---|---|
| Catálogo | Libros y los datos descriptivos que los relacionan (editorial, género, autores) |
| Clientes | Personas a las que se les registra una venta |
| Ventas | Operaciones confirmadas, con renglones históricos e inmutables |
| Datos de referencia | Editoriales, géneros y autores (solo lectura, no persistidos) |

## ERD (Entity Relationship Diagram)

```
┌──────────────┐         ┌──────────────┐
│  Editorial   │1       *│    Libro     │
│──────────────│─────────│──────────────│
│ id           │         │ id           │
│ nombre       │         │ titulo       │
└──────────────┘         │ isbn         │
                         │ precio       │
┌──────────────┐         │ editorialId  │
│   Genero     │1       *│ generoId (?) │
│──────────────│─────────│ autorIds[]   │
│ id           │         └──────┬───────┘
│ nombre       │                │ *
└──────────────┘                │
                                │ (referencia por id en el renglón)
┌──────────────┐         ┌──────┴───────┐
│    Autor     │*       *│   Renglon    │
│──────────────│─────────│──────────────│
│ id           │         │ libroId      │
│ nombre       │         │ titulo       │  ← copia histórica
└──────────────┘         │ cantidad     │
                         │ precioUnitario ← copia histórica
┌──────────────┐         │ subtotal     │  ← cantidad × precio
│   Cliente    │1       *└──────┬───────┘
│──────────────│                │ *
│ id           │         ┌──────┴───────┐
│ nombreCompleto│────────│    Venta     │
│ email        │       1 │──────────────│
└──────────────┘         │ id           │
                         │ fecha        │
                         │ clienteId    │
                         │ clienteNombre│  ← copia histórica
                         │ renglones[]  │
                         │ total        │
                         └──────────────┘
```

Relaciones:
- **Editorial 1—N Libro**: cada libro tiene una editorial existente.
- **Género 1—N Libro**: el género es **opcional**; ausente ⇒ «Sin clasificar».
- **Autor N—N Libro**: cada libro tiene uno o más autores existentes (`autorIds`).
- **Cliente 1—N Venta**: cada venta tiene un cliente existente.
- **Venta 1—N Renglón**: cada venta tiene al menos un renglón al confirmarse.
- **Libro 1—N Renglón**: el renglón referencia el libro por `libroId`, y además copia título y precio.

## Entidades

### Libro
- `id` (number, entero) — identificador estable.
- `titulo` (string, no vacío).
- `isbn` (string, no vacío; se compara normalizado sin espacios ni guiones).
- `precio` (number, mayor que cero).
- `editorialId` (number) — FK a Editorial.
- `generoId` (number | null) — FK opcional a Género; `null` ⇒ «Sin clasificar».
- `autorIds` (number[]) — FKs a Autor; **al menos uno**.
- Relaciones: N:1 Editorial, N:1 Género (opcional), N:N Autor, 1:N Renglón (histórico).
- Constraints: ISBN único (normalizado); precio > 0; al menos un autor.

### Cliente
- `id` (number, entero) — identificador estable.
- `nombreCompleto` (string, no vacío).
- `email` (string, formato válido y único, comparado sin espacios exteriores y sin distinguir mayúsculas).
- Relaciones: 1:N Venta.

### Editorial
- `id` (number), `nombre` (string). Solo lectura; no se persiste.

### Género
- `id` (number), `nombre` (string). Solo lectura; no se persiste.

### Autor
- `id` (number), `nombre` (string). Solo lectura; no se persiste.

### Venta
- `id` (number, entero) — identificador estable (V-1, V-2, …).
- `fecha` (string ISO) — fecha de confirmación.
- `clienteId` (number) — FK a Cliente.
- `clienteNombre` (string) — **copia histórica** del nombre al confirmar.
- `renglones` (Renglón[]) — detalle histórico.
- `total` (number) — suma de subtotales.
- Constraints: inmutable; no se edita ni elimina desde la interfaz.

### Renglón (dentro de una venta confirmada)
- `libroId` (number) — referencia al libro.
- `titulo` (string) — **copia histórica** del título.
- `cantidad` (number, entero mayor que cero).
- `precioUnitario` (number) — **copia histórica** del precio al confirmar.
- `subtotal` (number) — `cantidad × precioUnitario`.
- Constraints: no se admiten libros repetidos dentro de una misma venta.

### Renglón en curso (antes de confirmar)
Es una estructura en memoria equivalente a la anterior (`libroId`, `titulo`, `cantidad`, `precioUnitario`, `subtotal`) que se puede modificar (cantidad) o quitar libremente mientras la venta no se confirma.

## Persistencia

### Estructura en `localStorage`

- **Clave**: `tp_libreria_estado`
- **Valor**: JSON plano con `{ "libros": [...], "clientes": [...], "ventas": [...] }`
- **Ubicación**: herramientas del navegador → Almacenamiento → LocalStorage → `file:///.../TP-Libreria/index.html`

Editoriales, géneros y autores **no se guardan**: se leen siempre de `js/datos.js`. Solo se persisten libros, clientes y ventas.

## Seed data inicial

Definida en `js/datos.js` como `DATOS_INICIALES`:

| Colección | Cantidad mínima | Detalle |
|---|---|---|
| Editoriales | 2 | Relacionadas por `editorialId` |
| Géneros | 2 | Relacionados por `generoId` |
| Autores | 3 | Relacionados por `autorIds` |
| Libros | 6 | Cada uno con editorial y uno o más autores; género opcional |
| Clientes | 3 | Ficticios, con email único |
| Ventas | 0 | El historial arranca vacío |

Al primer inicio, si la clave no existe, se siembran estos ejemplos y se guardan. Al reabrir, si la clave existe, se recuperan los registros guardados **sin duplicar** los ejemplos.
