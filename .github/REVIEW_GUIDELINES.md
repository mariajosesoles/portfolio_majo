# Review guidelines — portfolio_majo

Referencia para reviewers humanos, Bugbot y Cloud Agents.

## Comandos locales (misma barra que CI)

```bash
pnpm install
pnpm exec biome ci .      # lint + format estricto (falla en CI)
pnpm exec astro check     # tipos
pnpm build                # SSG
```

Atajos en `package.json`:

| Script | Uso |
|--------|-----|
| `pnpm check` | biome check + astro check (desarrollo) |
| `pnpm lint` | solo linter Biome |
| `pnpm format` | formatear con Biome |
| `pnpm verify` | biome ci + astro check + build |

## Biome

- Config: [`biome.json`](../biome.json) — preset recommended + reglas a11y, imports, TS.
- **Astro** (`.astro`): linter Biome desactivado; formato vía Astro/Prettier del language server.
- **`public/`** y frames generados (`public/about/frames/**`): excluidos de Biome.
- Indent: tabs; comillas dobles en JS/TS; Tailwind v4 en CSS.

## CI (GitHub Actions)

Workflow [`.github/workflows/ci.yml`](workflows/ci.yml):

1. **biome** — `biome ci .`
2. **typecheck** — `astro check`
3. **build** — `pnpm build` (depende de 1 y 2)
4. **wrangler** — valida `wrangler.toml` + versión CLI (depende de build)

Deploy a producción: [`.github/workflows/deploy.yml`](workflows/deploy.yml) en push a `main`.

## Cloudflare Workers / Pages

- Config estática: [`wrangler.toml`](../wrangler.toml) — `pages_build_output_dir = "dist"`.
- No hay Worker runtime en este repo; deploy es **Pages** con `wrangler pages deploy`.
- Variables: ver [`.env.example`](../.env.example) y [`DEPLOY.md`](../DEPLOY.md).

## Qué mirar en review de UI

- Tokens en `src/styles/global.css` (`--type-*`, `--hero-*`, `.page-container`).
- Mesh fijo: `SiteMeshBackdrop` + `body.site-mesh-page`.
- About: tracking en `#about`, frames en `public/about/frames/`.

## Git

Commits solo a nombre de **Mariajose Soles** (`majo.solesg@gmail.com`); sin `Co-authored-by: Cursor`. Ver [`AGENTS.md`](../AGENTS.md).
