About — retrato y cursor tracking

1. portrait-3d.png — imagen estática (fallback)
2. character.mp4 — video de Google Flow (head/eye directions)
3. Tras añadir character.mp4, extraer frames:
   pip install opencv-python-headless
   pnpm about:extract-frames
4. Commit public/about/character.mp4 y public/about/frames/*

Sube character.mp4 desde local con:
   git add public/about/character.mp4
   git commit -m "assets(about): character.mp4 cursor tracking"
   git push origin feat/phase-1-design-system
