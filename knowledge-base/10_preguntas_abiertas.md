# Preguntas Abiertas

## Inconsistencias detectadas

### IN-01 — Carga de `app.js` y `logica.js` como globals vs. módulos ES
**Documento A dice**: DD-03 y `02_descripcion_general.md` describen scripts cargados en orden y funciones accesibles como globals.
**Documento B dice**: `js/logica.js` termina con `module.exports` para Node, lo que sugiere un consumo modular.
**Impacto**: si en el futuro se migrara a módulos ES (`type="module"`), el doble contrato actual (`global` + `module.exports`) habría que rehacerlo.
**Resolución propuesta**: mantener el doble contrato mientras el proyecto sea estático; documentar que es intencional.

### IN-02 — «Sin clasificar» como género ausente vs. género especial
**Documento A dice**: la consigna define «Sin clasificar» como la ausencia de género.
**Documento B dice**: el selector de género incluye «Sin clasificar» como una opción seleccionable.
**Impacto**: confundir ambos casos llevaría a guardar un `generoId` inválido en lugar de `null`.
**Resolución propuesta**: `«Sin clasificar»` se mapea a `generoId = null`; `validarLibro` acepta `null` como ausencia y solo valida existencia cuando hay un id (RN-LI-08).

## Preguntas abiertas (priorizadas)

| Prioridad | Pregunta | Bloquea | Decisor |
|-----------|----------|---------|---------|
| Alta | ¿Se espera algún formato específico de fecha en el historial (dd/mm/aaaa vs. ISO)? | Presentación del historial | Docente |
| Alta | ¿El identificador visible de venta debe tener prefijo (V-1) o puede ser numérico simple? | Detalle de historial | Docente |
| Media | ¿Se evaluará el uso de teclado con un lector de pantalla real o alcanza el recorrido con Tab/Shift+Tab? | Accesibilidad (4 pts) | Docente |
| Media | ¿La validación de ISBN debe tolerar el prefijo «978-»/«979-» o cualquier formato sin espacios/guiones? | RN-LI-03 | Docente |
| Baja | ¿Se esperan más de las 2 editoriales/géneros mínimos para cubrir casos de relación? | Seed data | Equipo |
| Baja | ¿Conviene separar `logica.js` en varios archivos si el proyecto crece? | Mantenibilidad | Equipo técnico |

## Notas para el seguimiento (SDD)

- Estas preguntas **no bloquean** la entrega actual: la consigna ya define explícitamente la mayoría de los comportamientos y todos los casos manuales están cubiertos.
- Si el docente comunica precisiones (fecha, canal de entrega, formato del ID), registrarlas acá y reflejarlas en `05_reglas_de_negocio.md`.
