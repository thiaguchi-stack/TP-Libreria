# Descripción General

## Stack tecnológico

| Capa | Tecnologías | Versión mínima |
|---|---|---|
| Estructura | HTML5 semántico | Navegador moderno |
| Estilos | CSS3 (Flexbox, Grid, custom properties) | Navegador moderno |
| Comportamiento | JavaScript nativo (ES6+) | Navegador que soporte `localStorage` y `fetch`-less DOM |
| Persistencia | `localStorage` (Web Storage API) | Navegador moderno |
| Pruebas de lógica | Node.js (para `pruebas/test-logica.js`) | Node 18+ (solo desarrollo) |
| Entorno de ejecución | Navegador de escritorio (apertura de `file://`) | Cualquiera |

**Restricción dura**: no se usan librerías, frameworks, bundlers, `node_modules`, pasos de compilación ni CDNs de CSS o JavaScript. Todo recurso se incluye localmente. El único uso de Node.js es ejecutar las pruebas de lógica fuera del navegador, y no forma parte de la entrega ejecutable.

## Arquitectura general

Aplicación **estática de una sola página** con cinco vistas conmutadas por JavaScript (patrón SPA sin router):

```
┌─────────────────────────────────────────────────────────────┐
│  index.html                                                 │
│  ┌───────────┐ ┌─────────────────────────────────────────┐  │
│  │ <header>  │ │ <nav> Catálogo Libros Clientes Ventas    │  │
│  └───────────┘ │       Historial                          │  │
│                └─────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ <main>                                                  ││
│  │   <section id="catalogo">  ── buscador + tarjetas       ││
│  │   <section id="libros">    ── form alta + tabla         ││
│  │   <section id="clientes">  ── form alta + tabla         ││
│  │   <section id="ventas">    ── cliente + renglones + tot ││
│  │   <section id="historial"> ── tabla + detalle           ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
        │
        │ <script src="js/datos.js">   → DATOS_INICIALES (constantes)
        │ <script src="js/logica.js">  → funciones puras, sin DOM
        │ <script src="js/app.js">     → renderizado, eventos, navegación
        ▼
   ┌───────────────────────────────┐
   │  localStorage                 │
   │  clave: tp_libreria_estado    │
   │  { libros, clientes, ventas } │
   └───────────────────────────────┘
```

La separación es deliberada y sigue el criterio de evaluación «separación entre estructura, estilos y comportamiento»:

- **`js/datos.js`** — datos iniciales ficticios como constantes (`DATOS_INICIALES`). Editoriales, géneros y autores viven solo acá.
- **`js/logica.js`** — funciones puras y sin dependencia del DOM (validaciones, filtro, cálculos, persistencia). Exportables con `module.exports` para probarlas con Node.
- **`js/app.js`** — capa de presentación: consulta el DOM, renderiza, escucha eventos y navega entre vistas.
- **`css/estilos.css`** — identidad visual, layout y responsive.

## Integraciones externas

| Servicio | Propósito | Tipo |
|---|---|---|
| *(ninguno)* | El proyecto no se integra con ningún servicio externo | — |

El almacenamiento del navegador (`localStorage`) es la única «integración», y es local al dispositivo y al perfil del usuario.

## API REST (si aplica)

**No aplica.** No hay API, servidor ni conexión con backend. Todas las operaciones se resuelven en el navegador sobre el estado en memoria sincronizado con `localStorage`.
