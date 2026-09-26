## Qué cambia

<!-- Resumen breve del PR -->

## Checklist (quality gates)

Marca lo que aplique antes de pedir review:

- [ ] `pnpm install` y lockfile actualizado si cambiaron dependencias
- [ ] `pnpm exec biome ci .` — lint + format (Biome)
- [ ] `pnpm exec astro check` — tipos Astro/TS
- [ ] `pnpm build` — build estático OK
- [ ] Sin secretos en código (`.env` fuera del repo)
- [ ] **Cloudflare Pages:** `wrangler.toml` sigue apuntando a `dist` y project `portfolio-majo`
- [ ] Si tocaste deploy: secrets `CLOUDFLARE_*` y `PUBLIC_CF_WEB_ANALYTICS_TOKEN` documentados en `DEPLOY.md`
- [ ] Responsive probado (mobile / tablet / desktop) en hero y secciones tocadas
- [ ] `prefers-reduced-motion` respetado en animaciones nuevas

## Screenshots / notas

<!-- Opcional -->
