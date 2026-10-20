# Proposal

## Why

El proyecto tiene el código de los seis ejercicios del TPI, pero la entrega (Ejercicio 6, «documentación y entrega: 3 puntos») se evalúa leyendo el `README.md`: la consigna exige que identifique a los integrantes, explique cómo abrir `index.html` sin npm, la navegación entre vistas, las funcionalidades implementadas y pendientes, la ubicación de los datos iniciales, el funcionamiento y los **límites** de `localStorage`, los resultados de los **8 casos manuales** y la procedencia de imágenes. El README actual existe pero es el de la primera etapa: contiene un placeholder de legajo sin completar, mezcla la redacción de la maqueta con la del alcance completo y no tiene una sección de contrato verificable que permita comprobar que la entrega está cerrada. Sin este change, la entrega no puede auditarse contra la lista de contenidos de la consigna.

## What Changes

- Auditar el `README.md` contra la lista de contenidos exigida por `docs/consigna-tp-libreria.md` §Formato de entrega y contra US-009 CA-4 y US-010 CA-1, y registrar el resultado real.
- Completar y normalizar las secciones exigidas: integrantes (nombre y legajo, sin placeholders), pasos para abrir `index.html` **sin npm**, navegación entre las cinco vistas, funcionalidades **implementadas y pendientes** (lo fuera de alcance declarado como tal), ubicación de los datos iniciales (`js/datos.js`, `DATOS_INICIALES`) y relaciones por `id`.
- Documentar el **funcionamiento y los límites** de `localStorage`: clave `tp_libreria_estado`, estructura JSON `{ libros, clientes, ventas }`, ubicación para la comprobación guiada (herramientas del navegador → Almacenamiento → LocalStorage), dependencia de navegador/perfil/ubicación de apertura, borrado de datos y ausencia de seguridad (RN-EX-01…RN-EX-04).
- Registrar los **resultados de los 8 casos manuales** con resultado observado (tabla caso / esperado / observado) y declarar la **procedencia de imágenes** (no hay imágenes).
- Registrar el **comando de pruebas** (`node pruebas/test-logica.js`), su resultado vigente y las limitaciones del entorno de ejecución (Node solo desarrollo, sin dependencias en la entrega).
- Verificar la sección «Estructura del proyecto» y la coherencia entre lo que el README declara y lo que el código hace.

No es un cambio **BREAKING**: solo altera el documento de entrega; no toca `index.html`, `css/`, `js/` ni el contrato de datos.

## Capabilities

### New Capabilities
- `documentacion`: define el contrato de contenido del README de entrega — sus secciones exigidas (integrantes, apertura sin npm, navegación, funcionalidades implementadas y pendientes, datos iniciales, funcionamiento y límites de `localStorage`, resultados de los casos manuales, procedencia de imágenes y comando de pruebas) y la regla de registrar el comportamiento real sin dar por aprobado nada no ejecutado.

### Modified Capabilities
<!-- Ninguna: el proyecto aún no tenía specs registradas; la capacidad de documentación se introduce como nueva. -->

## Impact

- **Artefactos afectados**: `README.md` (documento de entrega). No se modifican `index.html`, `css/estilos.css`, `js/datos.js`, `js/logica.js`, `js/app.js` ni `pruebas/test-logica.js`.
- **Datos**: ninguna estructura de datos cambia; el README describe la existente.
- **Dependencias**: ninguna. Se mantiene la restricción dura de frontend puro sin librerías, frameworks, bundlers ni backend (RN-PR-10, RN-EX-01).
- **Evaluación**: cierra el ítem «documentación y entrega» del Ejercicio 6 (3 puntos) y es requisito de la verificación de US-010 (los 8 casos manuales deben quedar registrados en el README).
- **Habilitá**: entrega final del TPI. Es el último change del árbol (depende de C-10).
