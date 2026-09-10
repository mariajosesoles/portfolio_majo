# Backlog — Portfolio Mariajose Soles

Metodología: **GitHub Flow** + sprints por entregable (spec en `mariajose/11-portfolio-stack-y-marca.md`).

**Estado v1:** ✅ Completado en repo `portfolio_majo`.

---

## Sprint 0 — Foundation ✅

- [x] Repo propio + scaffold Astro + React + Tailwind v4 + Biome
- [x] Design tokens dark (navy + acento eléctrico)
- [x] Layout shell: Header, Footer, skip link

## Sprint 1 — Core sections ✅

- [x] Capa de datos tipada (`site.es.ts`, `site.en.ts`, `projects.ts`)
- [x] Hero + chips + CTA
- [x] Experience (Rhinolabs · 4 productos)
- [x] Selected work + StackIcons (simple-icons)

## Sprint 2 — Content + i18n ✅

- [x] Rutas `/` (ES) y `/en/` (EN) + LangSwitch
- [x] Open source (Docutopia)
- [x] Building (CartaQR, La Cuenta placeholders)
- [x] About + Contact

## Sprint 3 — Motion + SEO ✅

- [x] GSAP hero stagger
- [x] GSAP ScrollTrigger en project cards
- [x] `prefers-reduced-motion` respetado
- [x] Sitemap, meta OG, favicon, og.svg

## Sprint 4 — Ship

- [x] README + BACKLOG.md
- [x] wrangler.toml + CI GitHub Actions
- [ ] Deploy Cloudflare Pages → ver [`DEPLOY.md`](./DEPLOY.md) (código + workflow listos)
- [ ] Cloudflare Web Analytics → token en env `PUBLIC_CF_WEB_ANALYTICS_TOKEN` (beacon ya en Layout)
- [ ] Post LinkedIn launch

---

## Backlog v1.1

- [ ] Foto profesional en About (reemplazar inicial M)
- [ ] `og.png` 1200×630 (LinkedIn prefiere PNG)
- [ ] CartaQR — repo y URL real
- [ ] La Cuenta — repo y URL real
- [ ] Toggle light theme
- [ ] CV PDF descargable
- [ ] Eventos analytics outbound (GitHub, LinkedIn, email)
- [ ] Dominio custom (`mariajose.dev` o similar)

---

## Dependencias (referencia)

```
Foundation → Core sections → i18n/Content → Motion/SEO → Ship
```
