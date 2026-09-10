# Deploy — Cloudflare Pages (manual desde dashboard)

Todo el código ya está listo. Solo falta conectar **tu cuenta personal de Cloudflare** (no la de Rhinolabs/Llontop).

**Tiempo estimado:** 10–15 minutos.

---

## Parte 1 — Crear el project en Cloudflare Pages

1. Entra a [dash.cloudflare.com](https://dash.cloudflare.com) con **tu cuenta personal**.
2. Menú izquierdo → **Workers & Pages**.
3. **Create** → pestaña **Pages** → **Connect to Git**.
4. Autoriza GitHub si te lo pide → elige el repo **`mariajosesoles/portfolio_majo`**.
5. Configura el build:

| Campo | Valor |
|---|---|
| **Project name** | `portfolio-majo` |
| **Production branch** | `main` |
| **Framework preset** | Astro (o None) |
| **Build command** | `pnpm build` |
| **Build output directory** | `dist` |
| **Root directory** | `/` (vacío) |

6. **Environment variables** (Add variable → Production):

| Variable | Valor |
|---|---|
| `NODE_VERSION` | `22` |
| `PNPM_VERSION` | `9` |

7. Click **Save and Deploy**.

8. Espera 2–3 min. Tu URL será:

   **`https://portfolio-majo.pages.dev`**

   (o similar según el nombre del project).

9. **Opcional — URL más bonita:** en el project → **Custom domains** → **Set up a custom domain** → puedes usar un subdominio tipo `mariajosesoles.pages.dev` si Cloudflare te lo permite, o comprar `mariajose.dev` después.

10. **Actualizar canonical en el repo** (después del primer deploy): edita `astro.config.mjs` → campo `site` con tu URL real final y haz push a `main`.

---

## Parte 2 — Cloudflare Web Analytics

1. Dashboard → **Analytics & Logs** → **Web Analytics**.
2. **Add a site** → hostname: `portfolio-majo.pages.dev` (o tu dominio custom).
3. Cloudflare te da un **token** (string largo).
4. Vuelve a **Workers & Pages** → tu project `portfolio-majo` → **Settings** → **Environment variables**.
5. Añade (Production + Preview):

| Variable | Valor |
|---|---|
| `PUBLIC_CF_WEB_ANALYTICS_TOKEN` | *(pega el token)* |

6. **Save** → **Deployments** → **Retry deployment** en el último deploy (o push vacío a `main`).

El beacon ya está en el código (`Layout.astro`); solo necesita esa variable.

7. Verifica: abre el sitio, navega 1–2 páginas, espera ~5 min → Web Analytics dashboard debería mostrar visitas.

---

## Parte 3 — Verificación post-deploy

- [ ] `https://portfolio-majo.pages.dev/` carga (ES)
- [ ] `https://portfolio-majo.pages.dev/en/` carga (EN)
- [ ] Links GitHub / LinkedIn / email funcionan
- [ ] Armagedón abre `ajedrezarmagedon.com`
- [ ] Sitemap: `https://portfolio-majo.pages.dev/sitemap-index.xml`

---

## Alternativa — Deploy vía GitHub Actions (opcional)

Si prefieres no usar “Connect to Git” en Cloudflare, el repo incluye `.github/workflows/deploy.yml`. Necesitas crear un API token en Cloudflare y añadir secrets en GitHub:

### Token Cloudflare

1. [dash.cloudflare.com/profile/api-tokens](https://dash.cloudflare.com/profile/api-tokens)
2. **Create Token** → template **Edit Cloudflare Workers** (o custom con):
   - Account → Cloudflare Pages → Edit
   - Account → Account Settings → Read
3. Copia el token.

### Secrets en GitHub

Repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**:

| Secret | Valor |
|---|---|
| `CLOUDFLARE_API_TOKEN` | token del paso anterior |
| `CLOUDFLARE_ACCOUNT_ID` | lo ves en dashboard URL o Overview (32 chars hex) |

Cada push a `main` hará build + deploy automático.

---

## Troubleshooting

| Problema | Solución |
|---|---|
| Build falla “pnpm not found” | Añade `PNPM_VERSION=9` en env vars |
| Build falla Node | Añade `NODE_VERSION=22` |
| Analytics no aparece | Confirma `PUBLIC_CF_WEB_ANALYTICS_TOKEN` y redeploy |
| OG preview rota en LinkedIn | LinkedIn prefiere PNG; backlog v1.1 incluye `og.png` |
| Token de Cursor apunta a Llontop | Usa **tu** cuenta CF personal en el dashboard, no el token de trabajo |

---

## Checklist launch LinkedIn

- [ ] Deploy live
- [ ] Pin repo en GitHub profile
- [ ] Featured en LinkedIn con URL del portfolio
- [ ] Post corto: stack + link + screenshot hero
