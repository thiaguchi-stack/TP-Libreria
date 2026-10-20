# Actores y Roles

## Actores del sistema

| Actor | Descripción | Cómo interactúa |
|---|---|---|
| Visitante/Cliente | Persona que consulta el catálogo | Usa el buscador por título y observa las tarjetas de libros; no modifica datos |
| Bibliotecario/Operador | Persona que gestiona el sistema de la librería | Da de alta libros y clientes, compone y confirma ventas, consulta el historial |
| Docente/Evaluador | Revisor de la unidad que corrige el TPI | Ejecuta los casos manuales, inspecciona el `localStorage` y verifica el precio histórico |

En la práctica, **todos los actores comparten la misma interfaz sin autenticación**: la distinción es funcional (qué hace cada uno), no de permisos. No existe inicio de sesión real.

## RBAC — Matriz de permisos

No hay control de acceso basado en roles porque no hay autenticación. La siguiente matriz describe las **capacidades funcionales expuestas por la interfaz**, que cualquier actor puede ejecutar:

| Recurso | Consultar | Crear | Editar | Eliminar |
|---|---|---|---|---|
| Catálogo | ✅ | — | — | — |
| Libros | ✅ | ✅ | ❌ | ❌ |
| Clientes | ✅ | ✅ | ❌ | ❌ |
| Editoriales | ✅ (solo lectura, vía selectores) | ❌ | ❌ | ❌ |
| Géneros | ✅ (solo lectura, vía selectores) | ❌ | ❌ | ❌ |
| Autores | ✅ (solo lectura, vía selectores) | ❌ | ❌ | ❌ |
| Ventas | ✅ | ✅ (solo confirmar) | ❌ | ❌ |
| Historial | ✅ | — | ❌ | ❌ |

Notas:
- Las ventas confirmadas son **inmutables**: no se editan ni eliminan desde la interfaz.
- Editoriales, géneros y autores **no se persisten** ni se gestionan: se leen siempre de `js/datos.js`.

## Rutas públicas

Todas las vistas son públicas. La navegación no usa rutas HTTP sino **anclas dentro de `index.html`**:

| Vista | Ancla | Descripción |
|---|---|---|
| Catálogo | `#catalogo` | Vista por defecto al abrir la aplicación |
| Libros | `#libros` | Alta y listado de libros |
| Clientes | `#clientes` | Alta y listado de clientes |
| Ventas | `#ventas` | Composición y confirmación de ventas |
| Historial | `#historial` | Ventas confirmadas y detalle |

Al entrar a una vista, el menú marca el enlace activo y el JavaScript actualiza los listados correspondientes.
