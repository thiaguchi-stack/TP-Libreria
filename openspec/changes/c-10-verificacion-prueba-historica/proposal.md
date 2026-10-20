# Proposal

## Why

La consigna (Ejercicio 6) exige cerrar el TPI con evidencia objetiva: la suite de lógica en verde y los 8 casos manuales documentados con su resultado observado, incluida la prueba guiada del precio histórico. Hoy el proyecto tiene implementadas las funcionalidades y la persistencia, pero no hay una verificación registrada ni un método reproducible que pruebe que el historial conserva los importes confirmados cuando cambia el precio del catálogo guardado (RN-HI-03, RN-VE-10). Sin esta verificación, el cierre del proyecto no es auditable y ninguna afirmación de «pasa» está respaldada por una ejecución real.

## What Changes

- Ejecutar y registrar el resultado real de `node pruebas/test-logica.js` (baseline: 37 aserciones pasadas, 0 falladas).
- Reproducir la **prueba guiada del precio histórico** en una **copia de prueba** del proyecto: confirmar una venta y anotar sus importes; modificar **únicamente el precio del libro** dentro del catálogo guardado en `localStorage` (clave `tp_libreria_estado`, array `libros`) sin tocar ni borrar las ventas guardadas; recargar y verificar que el detalle conserva precio unitario, subtotales y total originales.
- Verificar y registrar los **8 casos manuales** de la consigna con su resultado observado: búsqueda (mayúsculas/vacía/inexistente), ISBN duplicado/nuevo, email inválido/existente/nuevo, venta inválida y libro repetido, venta válida 2×1500 + 1×2000 (subtotales 3000 y 2000, total 5000), precio histórico, recarga sin duplicar, y navegación por teclado a 320 px y 1280 px.
- Documentar el **método** de verificación (comando, entorno, ubicación del catálogo guardado) sin dar por aprobado nada que no se haya ejecutado.

No es un cambio **BREAKING**: es verificación y registro de evidencia sobre el comportamiento ya implementado; no modifica el contrato de las funciones puras ni la estructura del estado persistido.

## Capabilities

### New Capabilities
- `verificacion`: verificación objetiva del comportamiento del sistema mediante (a) las pruebas automáticas de lógica (`node pruebas/test-logica.js`, 37 aserciones) y (b) los 8 casos manuales de la consigna, incluida la prueba guiada del precio histórico; regla dura: ninguna prueba se marca aprobada sin ejecutarla.

### Modified Capabilities
<!-- Ninguna: el proyecto aún no tenía specs registradas; las capacidades previstas (catálogo, altas, ventas, historial, persistencia) no cambian sus requerimientos en este change. Verificacion se introduce como capacidad nueva. -->

## Impact

- **Código afectado**: ninguno en `js/`, `css/` ni `index.html`. El change produce evidencia (registro de corrida de la suite y de los casos manuales) que C-11 (`readme-entrega`) volcará al README.
- **Datos**: en la copia de prueba se edita manualmente el precio de un libro dentro del catálogo guardado en `localStorage` (`tp_libreria_estado.libros`), sin tocar las ventas. El proyecto original no se modifica.
- **Dependencias**: ninguna. Se usa Node 18+ solo para la suite de desarrollo y las herramientas de almacenamiento del navegador para la prueba guiada; se mantiene la restricción de frontend puro sin librerías, frameworks ni backend.
- **Sistemas**: la comprobación depende del navegador, del perfil y de la ubicación de apertura de `index.html` (RN-EX-01, RN-EX-02); no se promete durabilidad entre dispositivos.
- **Habilitá**: C-11 (`readme-entrega`) requiere los resultados de los 8 casos y el método de la prueba histórica para documentarlos en la entrega.
