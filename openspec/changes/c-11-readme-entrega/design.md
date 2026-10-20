# Design

## Context

Ver `proposal.md — Why`. El proyecto es frontend puro que se abre con `file://`, sin backend ni dependencias (RN-EX-01, RN-PR-10). La entrega es una carpeta comprimida con `index.html`, `css/`, `js/`, `pruebas/` y un `README.md`; la consigna (`docs/consigna-tp-libreria.md` §Formato de entrega) enumera el contenido exigido del README y lo evalúa en el ítem «documentación y entrega» del Ejercicio 6. El README actual es el de la primera etapa: ya tiene la mayoría de las secciones, pero arrastra un placeholder de legajo, redacción de maqueta y no está estructurado como contrato auditable contra la lista de contenidos. Como `README.md` no participa de la ejecución, este change no modifica comportamiento observable de la aplicación; su «salida» es un documento verificable. Sigue a C-10, que produce los resultados de los casos manuales y el resultado de la suite de pruebas que el README debe registrar.

## Goals / Non-Goals

**Goals:**
- Dejar el `README.md` con cada una de las secciones exigidas por la consigna, verificables contra `specs/documentacion/spec.md`.
- Completar placeholders (legajos) y separar claramente lo implementado de lo fuera de alcance.
- Documentar el funcionamiento y los límites de `localStorage` (clave, estructura, ubicación, dependencias, borrado, ausencia de seguridad).
- Registrar los 8 casos manuales con resultado observado y el comando de pruebas con su resultado.

**Non-Goals:**
- No modificar código de la aplicación (`index.html`, `css/`, `js/`, `pruebas/`).
- No agregar capturas, imágenes ni recursos gráficos.
- No agregar dependencias, build ni automatización de generación del README.
- No reejecutar ni redefinir los casos manuales: este change consume el resultado de C-10, no lo reproduce.

## Decisions

**1. Declarar una capability `documentacion` en lugar de `skip_specs: true`.**
Se optó por una capability nueva con requirements testeables (que el README contenga cada sección exigida) en vez de marcar el change como sin specs.
- *Alternativas*: (a) `skip_specs: true` y explicar que es solo documentación; (b) declarar la capability.
- *Por qué*: la documentación de entrega es un entregable evaluado con criterios observables (la consigna enumera secciones obligatorias y US-009 CA-4 / US-010 CA-1 las refuerzan), así que hay un contrato verificable cuyo cumplimiento puede inspeccionarse sin tocar código. Modelarlo como spec permite validar la entrega con la misma herramienta que el resto del proyecto.
- *Costo aceptado*: la spec describe el contenido del documento, no comportamiento de ejecución; se acepta porque el documento es un artefacto de primera clase de la entrega.

**2. Una sección en el README por requirement de la spec.**
Cada requirement (`integrantes`, `apertura sin npm`, `navegación`, `funcionalidades`, `datos iniciales`, `localStorage`, `casos manuales`, `imágenes y pruebas`) se mapea a una sección con encabezado propio.
- *Alternativas*: (a) un único bloque narrativo; (b) secciones mapeadas a la lista de la consigna.
- *Por qué*: una sección por ítem exigido hace la auditoría mecánica (existencia y contenido por ítem) y evita que un requisito quede diluido en prosa.
- *Costo aceptado*: un README algo más estructurado y tabulado que una narrativa libre.

**3. Tabla de casos manuales con columnas «esperado» y «observado».**
Los 8 casos se registran en una tabla con el resultado esperado de la consigna y el resultado observado real, más una nota de método.
- *Alternativas*: (a) lista de viñetas; (b) tabla con esperado/observado.
- *Por qué*: la consigna pide «resultado observado» por caso y prohíbe declarar aprobado sin ejecutar; la tabla hace visibles ambos y permite detectar un caso sin evidencia.
- *Costo aceptado*: la tabla puede quedar larga; se acepta por claridad de auditoría.

**4. Consumir los resultados de C-10 en lugar de re-verificar.**
El README registra los resultados que C-10 produce (8 casos + suite); este change no vuelve a ejecutar la verificación histórica.
- *Alternativas*: (a) reejecutar todo dentro de C-11; (b) tomar el resultado de C-10.
- *Por qué*: evita duplicar la verificación y mantiene un único origen de evidencia (C-10), conforme a la dependencia declarada en `CHANGES.md`.
- *Costo aceptado*: si C-10 cambia un resultado, el README debe actualizarse; se cubre con una tarea de contraste.

## Risks / Trade-offs

- **[Placeholders o datos de integrante incorrectos]** → Mitigación: tarea de auditoría que recorre el README buscando corchetes y textos pendientes antes de cerrar.
- **[Resultados de casos desactualizados respecto de C-10]** → Mitigación: tarea de contraste entre la tabla del README y la evidencia de C-10, con el número de aserciones vigente.
- **[Deriva entre lo que el README declara y el código real]** → Mitigación: tarea de contraste de la estructura del proyecto y de las funcionalidades declaradas contra `index.html`, `js/` y `css/`.
- **[La sección de límites de `localStorage` queda incompleta]** → Mitigación: checklist explícito de los cuatro límites (navegador/perfil/ubicación, no comparte entre usuarios, borrado, ausencia de seguridad) contra RN-EX-01…RN-EX-04.
- **[Confundir «pendiente» con «fuera de alcance»]** → Mitigación: requirement que exige declarar que no quedan pendientes dentro del alcance y enumerar lo fuera de alcance.

## Migration Plan

1. Auditar el `README.md` actual contra la lista de contenidos de la consigna y contra `specs/documentacion/spec.md`; registrar los huecos reales.
2. Completar y normalizar cada sección exigida (integrantes, apertura, navegación, funcionalidades, datos iniciales, `localStorage`, casos manuales, imágenes y pruebas).
3. Contrastar la tabla de casos manuales y el resultado de la suite con la evidencia de C-10.
4. *Rollback*: como solo cambia `README.md`, revertir el archivo a su versión anterior restaura el estado previo; no hay migración de datos ni efecto sobre la ejecución.

## Open Questions

- ¿La cátedra exige un formato de fecha o encabezado particular en el README? No cambia las secciones exigidas; se puede ajustar sin tocar la spec ni las tareas.
- ¿Conviene agregar una sección de «Cómo se probó» con más detalle del entorno (versión de Node/Edge)? Es opcional y no altera los requirements; se puede sumar luego dentro de la sección de pruebas.
