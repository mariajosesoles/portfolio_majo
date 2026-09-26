About — retrato y cursor tracking

1. portrait-3d.png — imagen estática (fallback)
2. character.mp4 — video de Google Flow (head/eye directions)
3. Tras añadir character.mp4, extraer frames:
   pip install opencv-python-headless
   pnpm about:extract-frames
4. Commit public/about/character.mp4 y public/about/frames/*

Afinar tracking: public/about/frames/manifest.json
- trackingAnchorSection — punto fijo en #about (xWide/yWide desktop)
- angleOffsetRadians — rotar direcciones
- frameFiles + centerFile — tras renombrar proyecciones (ver frames/FRAME_NAMING.md)
- chromaTolerance — quitar fondo en canvas

Debug ancla (dev): ?about-anchor en la URL → punto magenta en la sección.
