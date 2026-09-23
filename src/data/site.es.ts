import type { SiteConfig } from "../types/site";

export const siteEs: SiteConfig = {
	locale: "es",
	meta: {
		title: "Mariajose Soles — Full Stack Developer",
		description:
			"Desarrolladora full stack con foco en frontend y product UX/UI. React, TypeScript, Astro, Cloudflare. Lima, Perú · Remote LATAM.",
		ogTitle: "Mariajose Soles · Frontend & Product UX/UI",
	},
	name: "Mariajose Soles",
	heroRole: "Full Stack Developer",
	tagline:
		"Desarrolladora Full Stack · Frontend & Product UX/UI · Lima, PE · Remote",
	profile:
		"Construyo productos web de punta a punta — desde la interfaz hasta lo que corre detrás. Colaborativa, directa y adaptada al ritmo remoto.",
	heroChips: ["React", "TypeScript", "Tailwind", "Cloudflare"],
	heroStack: [
		"react",
		"typescript",
		"tailwindcss",
		"astro",
		"cloudflare",
		"hono",
		"drizzle",
		"zod",
	],
	nav: [
		{ id: "experience", label: "Experiencia" },
		{ id: "work", label: "Trabajo" },
		{ id: "building", label: "Building" },
		{ id: "about", label: "Sobre mí" },
		{ id: "contact", label: "Contacto" },
	],
	experience: {
		company: "Rhinolabs Agency",
		period: "Dic. 2025 – presente",
		location: "Remoto, LATAM",
		intro:
			"Productos de la agencia de punta a punta, con el equipo de desarrollo.",
		products: [
			{
				name: "Train64",
				description: "Marketplace de coaching de ajedrez.",
				role: "Frontend y full stack",
			},
			{
				name: "BillRelay",
				description: "SaaS de facturación y cobro con pasarelas.",
				role: "Full stack",
			},
			{
				name: "Armagedón Chess",
				description: "Sitio de la academia de ajedrez en Lima.",
				role: "Frontend / product UI",
			},
			{
				name: "Docutopia",
				description: "Documentación OpenAPI para desarrolladores.",
				role: "Frontend",
			},
		],
	},
	sections: {
		experience: "Experiencia",
		selectedWork: "Trabajo seleccionado",
		openSource: "Open source",
		building: "Building",
		about: "Sobre mí",
		contact: "Contacto",
	},
	cta: {
		contact: "Contáctame",
		viewLive: "Ver sitio",
	},
	openSource: {
		title: "Docutopia",
		role: "Frontend (contribución puntual)",
		description:
			"Alineación del hero, ancla How to use y scroll suave en la landing de documentación OpenAPI. Cambio de CDN (unpkg → jsDelivr) en el patrón de islas React.",
		stack: ["astro", "react", "tailwindcss"],
		url: "https://docutopia.dev/",
		pr: "PR #59 mergeado",
	},
	building: [
		{
			name: "CartaQR",
			description: "Menú digital con QR para restaurantes.",
			status: "En diseño",
		},
		{
			name: "La Cuenta",
			description: "App para dividir cuentas entre amigos.",
			status: "Próximamente",
		},
	],
	about: {
		paragraphs: [
			"Soy Mariajose Soles, desarrolladora de software enfocada en frontend y product UX/UI. Me apasiona construir productos web que la gente use de verdad.",
			"Trabajo bien en equipos remotos: colaborativa, directa y proactiva. Entrego al ritmo que pide cada tarea sin sacrificar calidad.",
		],
		languages: "Español (nativo) · Inglés C1",
	},
	contact: {
		intro: "¿Tienes un proyecto o quieres conectar? Escríbeme.",
		email: "majo.solesg@gmail.com",
		phone: "+51 972 584 793",
		whatsappMessage:
			"Hola Majo, vi tu portfolio y me gustaría conectar contigo.",
		whatsappLabel: "WhatsApp",
		copyEmailLabel: "Copiar email",
		copiedLabel: "¡Copiado!",
	},
	cvSoon: "CV — próximamente",
	links: {
		github: "https://github.com/mariajosesoles",
		linkedin: "https://www.linkedin.com/in/mariajosesoles",
		email: "mailto:majo.solesg@gmail.com",
	},
	footer: {
		copyright: "Mariajose Soles Guerrero",
	},
};
