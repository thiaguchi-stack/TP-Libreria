# Arquitectura Propuesta

## Patrones aplicados

| Patrón | Dónde se usa | Por qué |
|---|---|---|
| SPA sin router | 5 vistas en `index.html` conmutadas por JS | No se permite backend ni frameworks; el enrutado por anclas + JS es el mínimo que cumple «navegación clara» |
| Separación estructura/estilos/comportamiento | `index.html`, `css/estilos.css`, `js/*.js` | Criterio de evaluación explícito |
| Lógica pura desacoplada del DOM | `js/logica.js` (sin tocar `document`) | Permite probar las reglas con Node sin navegador |
| Estado único en memoria + persistencia | Objeto de estado de `app.js` sincronizado con `localStorage` | Fuente de verdad única; evita duplicar datos |
| Renderizado desde datos | Catálogo y listados generados desde arrays | Los datos mandan; el HTML es un reflejo |
| Copy-on-confirm (snapshot histórico) | `confirmarVenta` copia precio/título/cliente al renglón | Garantiza inmutabilidad del historial |
| Delegación de eventos | Listeners en formularios y botones de `app.js` | Un handler por responsabilidad, sin duplicar lógica |
| Inserción segura de texto | Uso de `textContent` | Evita inyección de HTML desde datos del usuario |

## Estructura de directorios

```
TP-Libreria/
├── index.html                  ← entrada, cinco vistas semánticas
├── css/
│   └── estilos.css             ← identidad visual, Flexbox/Grid, responsive
├── js/
│   ├── datos.js                ← datos iniciales ficticios (DATOS_INICIALES)
│   ├── logica.js               ← validaciones, catálogo, ventas y persistencia (sin DOM)
│   └── app.js                  ← renderizado, eventos y navegación
├── pruebas/
│   └── test-logica.js          ← pruebas automáticas de lógica (Node, sin dependencias)
├── docs/
│   └── consigna-tp-libreria.md ← consigna fuente del proyecto
├── knowledge-base/             ← base de conocimiento (este directorio)
└── README.md                   ← entrega: funcionamiento, límites y casos manuales
```

## Seguridad

- **Autenticación**: no existe (fuera de alcance). Todas las vistas son públicas.
- **Autorización**: no aplica (sin roles ni sesiones).
- **Validación de input**: en `js/logica.js` (`validarLibro`, `validarCliente`, `agregarRenglon`, `validarConfirmacionVenta`), aplicada antes de mutar el estado.
- **Inserción en el DOM**: siempre como texto (`textContent`), nunca como HTML (`innerHTML` con datos del usuario).
- **Secrets management**: no aplica; no hay credenciales ni servicios externos.
- **Advertencia explícita (RN-EX-04)**: las validaciones y el `localStorage` no proveen seguridad ni integridad garantizada; son de práctica.

## Variables de entorno

**No aplica.** El proyecto no usa variables de entorno, no tiene build y se ejecuta abriendo el HTML directamente.

| Variable | Descripción | Ejemplo | Sensible |
|---|---|---|---|
| *(ninguna)* | — | — | — |

## Consideraciones de despliegue

- **Ejecución local**: abrir `index.html` con doble clic (protocolo `file://`).
- **Sin dependencias**: no hay `node_modules`, bundlers ni pasos de compilación.
- **Alcance de la persistencia**: `localStorage` depende del navegador, del perfil y de la ubicación de apertura; no se comparte entre usuarios ni dispositivos.
- **Ejecución de pruebas (solo desarrollo)**: `node pruebas/test-logica.js` (requiere Node 18+; no forma parte de la entrega ejecutable).
