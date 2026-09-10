# Mariajose Soles — Portfolio

Developer portfolio for **Mariajose Soles Guerrero** — Full Stack Developer with a focus on frontend and product UX/UI.

- **Live (pending deploy):** [portfolio-majo.pages.dev](https://portfolio-majo.pages.dev)
- **ES:** `/` · **EN:** `/en/`

## Stack

| Layer | Tech |
|---|---|
| Framework | Astro 7 (SSG) |
| UI islands | React 19 |
| Styles | Tailwind CSS v4 (`@theme` tokens) |
| Motion | GSAP (hero stagger + scroll reveal) |
| Icons | Lucide + simple-icons |
| Tooling | TypeScript strict · Biome · pnpm |
| Deploy | Cloudflare Pages |

## Quick start

```bash
pnpm install
pnpm dev      # http://localhost:5174
pnpm build
pnpm preview
pnpm check    # biome + astro check
```

## Project structure

```
src/
├── components/   # layout, sections, ui
├── data/         # site.es.ts, site.en.ts, projects.ts (single source of truth)
├── lib/          # cn(), stack-icons
├── pages/        # / and /en/
├── styles/       # global.css + design tokens
└── types/
```

Copy and project data come from `cv-es.md` / `cv-en.md` in the parent `mariajose/` folder.

## Deploy — Cloudflare Pages

**Guía completa paso a paso:** [`DEPLOY.md`](./DEPLOY.md)

Resumen rápido (dashboard):

1. [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **Connect to Git**
2. Repo: `mariajosesoles/portfolio_majo` · branch `main`
3. Build: `pnpm build` · output `dist` · env: `NODE_VERSION=22`, `PNPM_VERSION=9`
4. Web Analytics: variable `PUBLIC_CF_WEB_ANALYTICS_TOKEN` en el project

Alternativa: GitHub Actions (`.github/workflows/deploy.yml`) con secrets `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID`.

## Methodology

- **GitHub Flow** — small PRs, `main` always deployable
- **Backlog:** see [`BACKLOG.md`](./BACKLOG.md)
- **Spec:** `../mariajose/11-portfolio-stack-y-marca.md`

## Contact

- Email: majo.solesg@gmail.com
- [GitHub](https://github.com/mariajosesoles)
- [LinkedIn](https://www.linkedin.com/in/mariajosesoles)

---

Built with Astro · Deployed on Cloudflare Pages
