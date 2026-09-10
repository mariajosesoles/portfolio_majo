# Mariajose Soles — Portfolio

Developer portfolio for **Mariajose Soles Guerrero** — Full Stack Developer with a focus on frontend and product UX/UI.

- **Live (pending deploy):** [mariajosesoles.pages.dev](https://mariajosesoles.pages.dev)
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

1. Push this repo to `github.com/mariajosesoles/portfolio_majo`
2. Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** → Connect GitHub
3. Build settings:
   - **Build command:** `pnpm build`
   - **Build output:** `dist`
   - **Node version:** 22+
4. Optional: enable **Web Analytics** in the Pages project settings

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
