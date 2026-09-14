import type { Project } from "../types/site";

export const projects: Project[] = [
	{
		id: "billrelay",
		title: "BillRelay",
		role: "Full stack",
		description:
			"SaaS de facturación y cobro con pasarelas configurables. Integraciones de pago (Culqi, Square, OpenPay, Redsys), checkout embebido, webhooks en producción, onboarding complejo e i18n.",
		stack: ["react", "typescript", "cloudflare", "hono", "drizzle", "zod"],
		badge: "Rhinolabs · Private",
	},
	{
		id: "train64",
		title: "Train64",
		role: "Frontend y full stack",
		description:
			"Marketplace de coaching de ajedrez. Módulo coach de Figma a producción (dashboard, calendario, students, classroom, chat), Better Auth, email transaccional y fundación de payouts.",
		stack: ["react", "typescript", "cloudflare", "hono", "drizzle"],
		badge: "Rhinolabs · Private",
	},
	{
		id: "armagedon",
		title: "Armagedón Chess",
		role: "Frontend / product UI",
		description:
			"Sitio marketing completo para academia de ajedrez en Lima. Astro + React, galería Cloudinary en build, SEO, migración SSR → SSG y deploy en Cloudflare.",
		stack: ["astro", "react", "tailwindcss", "cloudflare", "cloudinary"],
		url: "https://ajedrezarmagedon.com",
	},
	{
		id: "docutopia",
		title: "Docutopia",
		role: "Frontend",
		description:
			"Contribución OSS en landing de documentación OpenAPI: hero, ancla How to use, scroll suave, CDN jsDelivr — PR #59 mergeado.",
		stack: ["astro", "react", "tailwindcss"],
		url: "https://docutopia.dev/",
		badge: "Open source · PR #59",
	},
];

export const projectsEn: Project[] = [
	{
		id: "billrelay",
		title: "BillRelay",
		role: "Full stack",
		description:
			"Invoicing and payments SaaS with configurable processors. Payment integrations (Culqi, Square, OpenPay, Redsys), embedded checkout, production webhooks, complex onboarding, and i18n.",
		stack: ["react", "typescript", "cloudflare", "hono", "drizzle", "zod"],
		badge: "Rhinolabs · Private",
	},
	{
		id: "train64",
		title: "Train64",
		role: "Frontend and full stack",
		description:
			"Chess coaching marketplace. Coach module from Figma to production (dashboard, calendar, students, classroom, chat), Better Auth, transactional email, and payouts foundation.",
		stack: ["react", "typescript", "cloudflare", "hono", "drizzle"],
		badge: "Rhinolabs · Private",
	},
	{
		id: "armagedon",
		title: "Armagedón Chess",
		role: "Frontend / product UI",
		description:
			"Full marketing site for a chess academy in Lima. Astro + React, Cloudinary gallery at build time, SEO, SSR → SSG migration, and Cloudflare deploy.",
		stack: ["astro", "react", "tailwindcss", "cloudflare", "cloudinary"],
		url: "https://ajedrezarmagedon.com",
	},
	{
		id: "docutopia",
		title: "Docutopia",
		role: "Frontend",
		description:
			"OSS contribution on OpenAPI docs landing: hero alignment, How to use anchor, smooth scroll, jsDelivr CDN — merged PR #59.",
		stack: ["astro", "react", "tailwindcss"],
		url: "https://docutopia.dev/",
		badge: "Open source · PR #59",
	},
];
