# Skill Registry

**Delegator use only.** Any agent that launches sub-agents reads this registry to resolve compact rules, then injects them directly into sub-agent prompts. Sub-agents do NOT read this registry or individual SKILL.md files.

See `_shared/skill-resolver.md` for the full resolution protocol.

## User Skills

| Trigger | Skill | Path |
|---------|-------|------|
| "implementar/corregir/refactorizar frontend", React/Vite/Tailwind/JS/TS | frontend-dev | C:\Users\Usuario\.config\opencode\skills\frontend-dev\SKILL.md |
| Backend, endpoints, API REST, JWT, SQL, Spring Boot, FastAPI | backend-dev | C:\Users\Usuario\.config\opencode\skills\backend-dev\SKILL.md |
| "revisá la seguridad", "encontrá el bug", "debuggeá esto" | security-debugger | C:\Users\Usuario\.config\opencode\skills\security-debugger\SKILL.md |
| "revisá la página", "auditá el UX", accesibilidad WCAG, "mejorá la UI" | ux-ui-revisor | C:\Users\Usuario\.config\opencode\skills\ux-ui-revisor\SKILL.md |
| Pipelines, GitHub Actions, Docker, deploy, CI/CD | cicd-dev | C:\Users\Usuario\.config\opencode\skills\cicd-dev\SKILL.md |
| Crear/editar/optimizar/evaluar skills, mejorar triggers | skill-creator | C:\Users\Usuario\.config\opencode\skills\skill-creator\SKILL.md |
| "crear/generar/actualizar AGENTS.md o CLAUDE.md", reglas del proyecto | agents-md-generator | C:\Users\Usuario\.config\opencode\skills\agent-instruction\SKILL.md |
| Flujo de fundación SDD/OpenSpec desde cero | active-orchestrator | C:\Users\Usuario\.config\opencode\skills\active-orchestrator\SKILL.md |
| "find a skill for X", "how do I do X", extender capacidades | find-skills | C:\Users\Usuario\.config\opencode\skills\find-skill\SKILL.md |
| Plan de proyecto por hitos + equipo de roles con prompts | prompt-engineer-arquitecto | C:\Users\Usuario\.config\opencode\skills\prompt-engineer-arquitecto\SKILL.md |
| Investigar/scrapear competidor desde una URL | web-scraper | C:\Users\Usuario\.config\opencode\skills\web-scraper\SKILL.md |
| "armar base de conocimiento", "crear KB", "documentar proyecto" | kb-creator | C:\Users\Usuario\.config\opencode\skills\kb-creator\SKILL.md |
| "armar CHANGES", "armar roadmap", "crear mapa de changes" | roadmap-generator | C:\Users\Usuario\.config\opencode\skills\roadmap-generator\SKILL.md |
| Discovery/investigación de mercado antes de la KB | discovery-research | C:\Users\Usuario\.config\opencode\skills\discovery-research\SKILL.md |

## Compact Rules

Pre-digested rules per skill. Delegators copy matching blocks into sub-agent prompts as `## Project Standards (auto-resolved)`.

### frontend-dev
- Causa raíz ANTES de tocar nada: explicá archivo, por qué no cumple, cambio mínimo.
- Aplicá SOLO lo listado en QUÉ CAMBIAR; un cambio, un hito.
- Verificación objetiva ANTES de commitear (`npm run build` o el check del repo).
- QUÉ NO TOCAR: archivos no relacionados; no refactorizar "de paso"; no cambiar firmas/nombres existentes; no cambiar rama/force push/historial.
- Seguí convenciones del repo (naming, estructura, imports).
- Commit formato `tipo(alcance): resumen corto` (feat/fix/refactor/chore/docs) + push por hito verificado.
- Nunca commitear con checks en rojo.

### backend-dev
- Contrato explícito, no interpretación: firma exacta (nombres, params, tipos, retorno), comportamiento ante entradas inválidas, casos de borde.
- Crear causa raíz ANTES de implementar.
- Tests: caso típico + entrada inválida + caso límite (no solo camino feliz).
- Sin secretos en código: variables de entorno (JWT_SECRET, DB_URL).
- QUÉ NO TOCAR: interfaces ya en uso, archivos fuera del hito, no mutar estructuras compartidas.
- Check verde (`mvn test`/`pytest -q`/build tool) antes de commit; no commitear con tests rojos.
- Commit `tipo(alcance): resumen corto` + push por hito.

### security-debugger
- Solo diagnóstico y reporte: NO modificar código.
- Seguridad, orden: secretos hardcodeados → inyección (SQL/XSS/cmd) → auth/authz → entradas no validadas → dependencias → headers/CORS/CSP/cookies.
- Debug: síntoma esperado vs real → causa raíz ANTES de proponer fix; parche mínimo, no tapar el síntoma.
- Máx 5 hallazgos, priorizados, con ubicación `archivo:línea`.
- Sin teorías sin camino de explotación verificable; no inventar.
- Formato: Severidad / Ubicación / Problema / Por qué explota-falla / Fix propuesto.

### ux-ui-revisor
- Revisión, NO implementación: no generar código ni tocar archivos.
- Orden: propósito en <5s → jerarquía/consistencia → navegación/CTA → accesibilidad (contraste, foco, teclado, alt) → mobile (tap targets, overflow).
- Descartar opiniones de gusto antes de entregar; solo problemas reales de UX o WCAG.
- Máx 8 hallazgos priorizados, con ubicación + severidad + razón.
- No inventar mediciones (tiempos, conversión).
- Formato: Resumen ejecutivo / Hallazgos / Lo que funciona / 3 fixes de mayor retorno.

### cicd-dev
- Gates: G1 trigger real · G2 `permissions:` mínimo (`contents: read`) · G3 acciones pineadas por SHA + comentario de versión · G4 verificación real con caché derivada del lockfile · G5 imagen con tag inmutable (SHA, nunca `latest`) · G6 deploy con `environment:` + health check + rollback · G7 migraciones expand→migrar→contract · G8 fallo limpio (sin `continue-on-error` en lint/test/build).
- Verificar el camino de FALLO: romper a propósito y confirmar rojo, luego restaurar.
- Si no podés ejecutar el pipeline, NO declararlo verificado: decir qué falta.
- Sin secretos en el YAML ni en logs.
- QUÉ NO TOCAR: código de la app, `package.json`/`pom.xml`/`requirements.txt` si no lo piden, rama por defecto, protección de ramas.
- Commit `tipo(alcance): ...` + push por hito.

### skill-creator
- Anatomía: `skill-name/SKILL.md` + `scripts/`, `references/`, `assets/` opcionales.
- Progressive disclosure: metadata (name+description) → cuerpo <500 líneas → recursos bajo demanda.
- Campo `description` es el disparador principal; escribir "pushy" para combatir undertriggering.
- Loop: draft → test prompts → eval → iterar. Tests en `evals/evals.json`; resultados en `<skill>-workspace/iteration-N/eval-<ID>/{with_skill,without_skill}/`.
- Generar el viewer con `generate_review.py` ANTES de autoevaluar; sin display usar `--static`.
- Grading: campos `text`, `passed`, `evidence`. Benchmark vía `python -m scripts.aggregate_benchmark`.
- Skill actualizada: preservar nombre original; copiar a ubicación escribible antes de editar.
- Sin contenido malicioso/inesperado.

### agents-md-generator
- Pre-checks: exigir `knowledge-base/` + `02_descripcion_general.md`; si falta `CHANGES.md`, generar sin sección Roadmap y avisar.
- Salida: `AGENTS.md` en raíz + `CLAUDE.md` en raíz con el mismo contenido (copia, no referencia). Nunca en `.claude/` ni `openspec/`.
- Inputs: KB 02 (stack), KB README, `CHANGES.md`, `.atl/skill-registry.md` (fuente de verdad de skills), KB 10, global `~/.claude/CLAUDE.md`.
- Reglas duras: únicas parte interactiva; derivar del stack real, confirmar con el usuario, NO hardcodear lenguajes.
- NO repetir lo que ya está en el global; incluir solo lo universal que el global no cubra.
- DRY: NO copiar compact rules al AGENTS.md; solo mapear skill→rol + referenciar `.atl/skill-registry.md`.
- Validar `diff AGENTS.md CLAUDE.md`.

### active-orchestrator
- Es orquestador fino: rutea, no reimplementa; no escribe KB/CHANGES/discovery/CLAUDE.md.
- No preguntar contenido estratégico (system_type, scale, stack, problem, checklist de Discovery).
- Owna solo `version`, `step`, `owner`; cada sub-skill escribe su sección. Schema `version: 4`.
- Fases en orden: openspec init → [discovery-research opcional] → kb-creator → roadmap-generator → find-skill → skill-registry → agent-instruction → done.
- Interactivas inline (`Skill`), mecánicas en sub-agente (`Agent`).
- Checkpoint en cada frontera de fase; avanzar `step` SOLO con "Continuar" explícito.
- Nunca instalar skills en autonomía: find-skill recomienda, el usuario elige, luego se instala.
- Degradación: si falta un sub-skill → ofrecer instalar → saltear sin abortar el flujo.

### find-skills
- Usar ante "how do I do X", "find a skill for X", "can you do X", interés en extender capacidades.
- Revisar el leaderboard de skills.sh antes de buscar con CLI; luego `npx skills find [query] [--owner]`.
- Verificar calidad: 1K+ installs preferido, fuentes oficiales (vercel-labs, anthropics, microsoft), stars del repo.
- Presentar: nombre, qué hace, installs, fuente, comando de instalación, link a skills.sh.
- Instalar con `npx skills add <owner/repo@skill> -g -y`.
- Si no hay skill: ofrecer hacer la tarea directamente y sugerir `npx skills init`.

### prompt-engineer-arquitecto
- Regla de oro: repo git (local + remoto) desde el inicio; commit + push por hito verificado; commit `tipo(alcance): resumen corto`.
- Nunca commitear hasta que pasen los checks (build, tests, lint).
- Flujo: Fase 0 Definición (objetivo verificable, alcance, criterios de cierre) → Fase 1 Setup repo+esqueleto+CI mínimo → Fases 2..N hitos incrementales → Cierre (seguridad, build prod, docs, tag).
- Techs adaptables por hito con trade-offs (por qué / qué se gana / qué se pierde); no sobre-ingeniería.
- Prompts con anatomía de 4 componentes: objetivo, contexto/rol, restricciones, formato de salida + QUÉ SÍ / QUÉ NO TOCAR + autoevaluación.
- Orden por hito: arquitecto → UX/UI si toca UI → devs → seguridad → CI/CD → commit+push.
- Decisiones de negocio: mostrar 2-3 alternativas, no elegir por el usuario.

### web-scraper
- Esquema de salida FIJO de 8 campos, siempre en el mismo orden (comparabilidad).
- Solo páginas puntuales que el usuario pasa; NO crawling ni scraping masivo.
- Nunca inventar datos: campo no publicado → `(no publicado)`.
- Flujo: validar URL http(s) → `WebFetch` con prompt estructurado → normalizar y escribir `discovery/sources/<slug>.md`.
- Slug kebab-case vía `scripts/slugify.py` (corridas repetidas pisan el mismo archivo).
- Si fetch vacío/SPA/403/paywall/CAPTCHA: reportar la limitación, sin trucos de evasión, y seguir con la siguiente URL.
- Varias URLs: una por una; reportar resueltas vs fallidas (no abortar el lote).

### kb-creator
- 10 archivos canónicos obligatorios en `knowledge-base/` (01..10) + `README.md` índice; extras con prefijo `1X_`/`2X_` complementan, nunca reemplazan.
- Nunca mezclar con `docs/` (fuentes).
- Modo A (docs/ con fuentes): silencioso, fire-and-forget, sin preguntas, `source: "ingest"`; dudas a `10_preguntas_abiertas.md`, nunca inventar.
- Modo B (desde cero): interactivo, 3-5 preguntas estratégicas, esperar respuesta antes de generar, iterar archivo por archivo; `source: "interactive"`.
- Si orquestado: lee `state.discovery` (top-level) para pre-llenar y evitar repreguntar; escribe SOLO `state.kb`.
- Tono Mode B: arquitecto senior + PM; marcar `**Suposición:**`.

### roadmap-generator
- Pre-checks: `knowledge-base/` con los 10 canónicos + `openspec/`; si falta, no generar y avisar.
- Salida: UN `CHANGES.md` en la raíz (no dentro de `openspec/`).
- Leer siempre KB 04, 06, 07, 08; opcional 03, 05, 10.
- Estructura fija (no agregar/quitar secciones): cómo usar → árbol de dependencias → paralelismo por fase (GATES) → camino crítico → plan con 3 agentes → FASES con changes.
- Changes: códigos `C-01..C-NN` (padding 2 dígitos), nombre kebab-case, con Estado/Scope/Dependencias/Governance/Leer antes.
- Dependencias: infra primero (C-01 foundation) → modelos core → auth antes que recursos protegidos → entidad referenciada antes que la que referencia → backend antes que frontend acoplado → integraciones/pagos al final → admin al final → restyle al final.
- GATES: puntos donde se desbloquean múltiples changes independientes.

### discovery-research
- No decidir si corresponde Discovery (eso es del orquestador); correr la fase.
- Flujo: fuentes (invocar `web-scraper` por URL) → checklist Q&A de 11 puntos → gate final → escribir `discovery/discovery.md` + `state.discovery`.
- Gobernanza MEDIA: no escribir archivos ni tocar `state.json` sin confirmación explícita del usuario.
- No repreguntar lo ya resuelto por scraping; mostrarlo como resumen a confirmar.
- No bloquear por falta de URLs: seguir con Q&A pura.
- Riesgos/preguntas abiertas: distinguir hecho verificado vs supuesto sin probar.
- Escribir SOLO la sección `discovery` del state; no tocar otras secciones.
- Depende de `web-scraper`; si no está, seguir con Q&A y avisar.

## Project Conventions

| File | Path | Notes |
|------|------|-------|
| — | — | Sin convenciones de proyecto todavía: `AGENTS.md`/`CLAUDE.md` se generan en la fase siguiente (`agent-instruction`) |

Read the convention files listed above for project-specific patterns and rules. All referenced paths have been extracted — no need to read index files to discover more.
