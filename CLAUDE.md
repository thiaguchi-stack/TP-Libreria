# TP-Libreria (Librería El Coso) — Instrucciones para Agentes

> Este archivo (y sus copias `CLAUDE.md` y `OPENCODE.md`) es lo PRIMERO que todo agente lee al entrar al repo.
> Generado a partir de `knowledge-base/` y `CHANGES.md`. No editar a mano sin re-sincronizar los tres archivos.

---

## Stack Tecnológico

| Capa | Tecnología | Versión |
|------|------------|---------|
| Estructura | HTML5 semántico | Navegador moderno |
| Estilos | CSS3 (Flexbox, Grid, custom properties) | Navegador moderno |
| Comportamiento | JavaScript nativo (ES6+) | Navegador moderno |
| Persistencia | `localStorage` (clave `tp_libreria_estado`) | Navegador moderno |
| Pruebas de lógica | Node.js (solo desarrollo) | Node 18+ |

**Sin backend, sin API, sin base de datos, sin servidor, sin frameworks, sin bundlers, sin CDNs.** El proyecto se abre con doble clic en `index.html`.

Detalle completo: [knowledge-base/02_descripcion_general.md](knowledge-base/02_descripcion_general.md)

---

## Base de Conocimiento

La fuente de verdad del dominio vive en `knowledge-base/`. **Leé el archivo relevante ANTES de implementar.**

| Archivo | Cuándo leerlo |
|---------|---------------|
| [01_vision_y_objetivos.md](knowledge-base/01_vision_y_objetivos.md) | Entender propósito, alcance y fuera de alcance |
| [02_descripcion_general.md](knowledge-base/02_descripcion_general.md) | Stack y arquitectura general |
| [03_actores_y_roles.md](knowledge-base/03_actores_y_roles.md) | Actores, capacidades, rutas públicas |
| [04_modelo_de_datos.md](knowledge-base/04_modelo_de_datos.md) | Entidades, ERD, persistencia, seed data |
| [05_reglas_de_negocio.md](knowledge-base/05_reglas_de_negocio.md) | Reglas codificadas (RN-XX) |
| [06_funcionalidades.md](knowledge-base/06_funcionalidades.md) | Historias de usuario por épica |
| [07_flujos_principales.md](knowledge-base/07_flujos_principales.md) | Flujos E2E con casos de error |
| [08_arquitectura_propuesta.md](knowledge-base/08_arquitectura_propuesta.md) | Patrones, estructura, despliegue |
| [09_decisiones_y_supuestos.md](knowledge-base/09_decisiones_y_supuestos.md) | Decisiones (DD) y supuestos (SU) |
| [10_preguntas_abiertas.md](knowledge-base/10_preguntas_abiertas.md) | ⚠️ Inconsistencias a resolver ANTES de codear |

> ⚠️ Revisar las preguntas de prioridad **Alta** de `10_preguntas_abiertas.md` antes de arrancar el primer change.

---

## Skills Disponibles

| Agente | Rol | Skills que carga |
|--------|-----|------------------|
| **Frontend** | HTML/CSS/JS nativo, DOM, eventos, localStorage | `frontend-dev` |
| **Revisión UX/UI** | Accesibilidad WCAG, jerarquía visual, responsive | `ux-ui-revisor` |
| **Seguridad / Debug** | XSS en render, causa raíz de bugs de lógica | `security-debugger` |
| **Orquestación SDD** | Fundación OpenSpec, KB, roadmap, reglas, registry | `active-orchestrator`, `kb-creator`, `roadmap-generator`, `agents-md-generator`, `skill-registry`, `find-skills` |
| **Arquitectura de proyecto** | Plan por hitos y roles | `prompt-engineer-arquitecto` |

Cargá la skill correspondiente al contexto ANTES de escribir código.

> Los compact rules de cada skill los resuelve el orquestador desde `.atl/skill-registry.md` (generado por `skill-registry`; no versionado — no está en el repo). Esta tabla solo mapea skill→rol.

---

## Roadmap de Changes

El plan de implementación completo está en [CHANGES.md](CHANGES.md). Resumen:

- **Total**: 11 changes en 4 fases (0, 1A, 1B, 2).
- **Camino crítico** (9): `C-01 → C-02 → C-03 → C-06 → C-07 → C-08 → C-10 → C-11`.
- **Primer change**: `C-01` (`base-semantica-html`).

**Antes de cualquier `/opsx:propose`**: leé [CHANGES.md](CHANGES.md), identificá las dependencias del change y los archivos de "Leer antes".

---

## Reglas Duras (específicas del proyecto)

> Reglas **globales** ya definidas en `~/.claude/CLAUDE.md` (orquestador OPSX, governance por dominio, engram, TDD estricto): el proyecto las **hereda** y no se repiten acá. Lo de abajo son las reglas específicas de este proyecto, derivadas de su stack (HTML/CSS/JS nativo + `localStorage` + consigna que prohíbe dependencias).

- **NUNCA agregar librerías, frameworks, bundlers ni CDNs de CSS/JS** → solo HTML/CSS/JS nativos incluidos localmente. Es restricción dura de la consigna; romperla incumple el alcance técnico.
- **NUNCA insertar datos de usuario con `innerHTML`** → usar `textContent` en todo el render (RN-CA-08). Evita inyección de HTML.
- **NUNCA meter acceso al DOM en `js/logica.js`** → la lógica debe quedar pura y probable con Node; el DOM, los eventos y la navegación viven en `js/app.js`.
- **NUNCA leer el precio del catálogo al mostrar el historial** → el renglón de la venta conserva su copia histórica (`precioUnitario`, `titulo`, `clienteNombre`) (RN-VE-10). Las ventas confirmadas son inmutables.
- **NUNCA commitear con las pruebas en rojo** → correr `node pruebas/test-logica.js` (37/37) antes de cada commit de código.
- **NUNCA romper la apertura sin npm** → `index.html` debe abrirse con doble clic (`file://`); nada de pasos de build ni dependencias instaladas en la entrega.
- **NUNCA validar solo en el navegador** → toda regla de negocio va en `js/logica.js` con su aserción correspondiente en `pruebas/test-logica.js`.
- **Commit `tipo(alcance): resumen corto` + push por hito verificado** → un cambio, un hito; no commitear con checks en rojo.

---

## Flujo de Trabajo

```
1. Leer la KB relevante (knowledge-base/)        → entender el dominio
2. Identificar el change en CHANGES.md           → respetar dependencias
3. /opsx:propose C-NN-nombre                     → proposal + design + specs + tasks
4. Implementar las tasks (cargando skills)       → respetando las reglas duras
5. /opsx:archive C-NN-nombre + marcar [x]        → cerrar el change
```

Aplicar TODAS las reglas duras en cada paso. Ante conflicto entre la KB y este archivo, las reglas duras prevalecen.
