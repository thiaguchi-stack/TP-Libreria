# TP-Libreria — Base de Conocimiento

Base de conocimiento generada a partir de los documentos del proyecto (consigna del parcial + código existente).

## Índice de Archivos

| Archivo | Contenido |
|---------|-----------|
| [01_vision_y_objetivos.md](01_vision_y_objetivos.md) | Propósito, 3 actores, alcance v1.0, fuera de alcance, métricas |
| [02_descripcion_general.md](02_descripcion_general.md) | Stack, arquitectura general, integraciones, sin API |
| [03_actores_y_roles.md](03_actores_y_roles.md) | Actores, matriz de capacidades, rutas públicas |
| [04_modelo_de_datos.md](04_modelo_de_datos.md) | Dominios, ERD, entidades, persistencia, seed data |
| [05_reglas_de_negocio.md](05_reglas_de_negocio.md) | Reglas RN-XX por dominio con trazabilidad |
| [06_funcionalidades.md](06_funcionalidades.md) | 7 épicas, 10 historias de usuario con criterios de aceptación |
| [07_flujos_principales.md](07_flujos_principales.md) | 8 flujos extremo a extremo con diagramas y casos de error |
| [08_arquitectura_propuesta.md](08_arquitectura_propuesta.md) | Patrones, estructura de directorios, seguridad, despliegue |
| [09_decisiones_y_supuestos.md](09_decisiones_y_supuestos.md) | 7 decisiones documentadas + 5 supuestos inferidos |
| [10_preguntas_abiertas.md](10_preguntas_abiertas.md) | 2 inconsistencias + 6 preguntas priorizadas |

## Quick Start para Desarrolladores

1. Entender el dominio → [01](01_vision_y_objetivos.md), [03](03_actores_y_roles.md)
2. Entender los datos → [04](04_modelo_de_datos.md)
3. Entender las reglas → [05](05_reglas_de_negocio.md)
4. Entender la arquitectura → [02](02_descripcion_general.md), [08](08_arquitectura_propuesta.md)
5. Implementar → [07](07_flujos_principales.md), [06](06_funcionalidades.md)
6. Antes de codificar → [10](10_preguntas_abiertas.md)

## Resumen Ejecutivo

**Librería El Coso** es una aplicación web de frontend puro (HTML/CSS/JS nativos, sin frameworks ni backend) que presenta el catálogo de una librería y registra libros, clientes y ventas simuladas en el navegador. Toda la lógica vive en `js/logica.js` como funciones puras probables con Node (37 aserciones), el estado en memoria se sincroniza con `localStorage` bajo la clave `tp_libreria_estado`, y las ventas confirmadas guardan una copia histórica del precio para que el historial nunca dependa del catálogo actual. El proyecto es el TPI de la unidad «HTML, CSS y JavaScript — Repaso para el parcial 1» de Programación III.
