# Nombres de proyección (frames About)

Convención para validar manualmente hacia dónde mira el personaje en cada frame.

## Formato

```
{ direccion }_{ indice }.webp
```

- **direccion:** hacia dónde mira el personaje (desde su punto de vista), en español snake_case.
- **indice:** `1`, `2`, … si hay varias tomas de la misma dirección.

### Ejemplos

| Archivo | Significado |
|---------|-------------|
| `centro_1.webp` | Mirando al frente / neutro |
| `derecha_1.webp` | Mirando a la derecha del personaje |
| `arriba_derecha_135_1.webp` | Hacia la esquina superior derecha (~135° desde el frente) |
| `abajo_izquierda_225_1.webp` | Hacia abajo-izquierda (~225°) |

## Ángulos (referencia cursor)

El tracking usa el ángulo del cursor respecto al **punto ancla** en `#about` (ver `trackingAnchorSection` en `manifest.json`):

- **0 rad** ≈ cursor a la **derecha** del ancla (eje X positivo).
- **π/2** ≈ cursor **debajo** del ancla.
- **π** ≈ cursor a la **izquierda**.
- **−π/2** ≈ cursor **arriba**.

Tras renombrar archivos, actualiza `manifest.json`:

```json
"frameFiles": ["centro_1.webp", "derecha_1.webp", "..."],
"centerFile": "centro_1.webp"
```

El orden en `frameFiles` debe seguir el círculo de ángulos (sentido horario o el mismo orden que el video original).

## Stubs automáticos

`pnpm about:extract-frames` sigue generando `frame-000.webp` … y escribe alias sugeridos en `manifest.json` → `suggestedProjectionNames`.
