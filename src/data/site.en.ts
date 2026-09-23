import type { SiteConfig } from "../types/site";

export const siteEn: SiteConfig = {
	locale: "en",
	meta: {
		title: "Mariajose Soles — Full Stack Developer",
		description:
			"Full stack developer focused on frontend and product UX/UI. React, TypeScript, Astro, Cloudflare. Lima, Peru · Remote LATAM.",
		ogTitle: "Mariajose Soles · Frontend & Product UX/UI",
	},
	name: "Mariajose Soles",
	heroRole: "Full Stack Developer",
	tagline:
		"Full Stack Developer · Frontend & Product UX/UI · Lima, Peru · Remote",
	profile:
		"I build web products end to end — from the interface to what runs behind it. Collaborative, direct, and tuned for remote delivery.",
	heroChips: ["React", "TypeScript", "Tailwind", "Cloudflare"],
	nav: [
		{ id: "experience", label: "Experience" },
		{ id: "work", label: "Work" },
		{ id: "building", label: "Building" },
		{ id: "about", label: "About" },
		{ id: "contact", label: "Contact" },
	],
	experience: {
		company: "Rhinolabs Agency",
		period: "Dec. 2025 – present",
		location: "Remote, LATAM",
		intro: "Agency products, end to end, with the development team.",
		products: [
			{
				name: "Train64",
				description: "Chess coaching marketplace.",
				role: "Frontend and full stack",
			},
			{
				name: "BillRelay",
				description: "Invoicing and payments SaaS.",
				role: "Full stack",
			},
			{
				name: "Armagedón Chess",
				description: "Chess academy marketing site in Lima.",
				role: "Frontend / product UI",
			},
			{
				name: "Docutopia",
				description: "OpenAPI developer documentation site.",
				role: "Frontend",
			},
		],
	},
	sections: {
		experience: "Experience",
		selectedWork: "Selected work",
		openSource: "Open source",
		building: "Building",
		about: "About",
		contact: "Contact",
	},
	cta: {
		contact: "Contact me",
		viewLive: "View live",
	},
	openSource: {
		title: "Docutopia",
		role: "Frontend (focused contribution)",
		description:
			"Hero alignment, How to use anchor, and smooth scroll on the OpenAPI documentation landing. CDN switch (unpkg → jsDelivr) in the React island pattern.",
		stack: ["astro", "react", "tailwindcss"],
		url: "https://docutopia.dev/",
		pr: "Merged PR #59",
	},
	building: [
		{
			name: "CartaQR",
			description: "Digital menu with QR for restaurants.",
			status: "In design",
		},
		{
			name: "La Cuenta",
			description: "App to split bills with friends.",
			status: "Coming soon",
		},
	],
	about: {
		paragraphs: [
			"I'm Mariajose Soles, a software developer focused on frontend and product UX/UI. I'm passionate about building web products people actually use.",
			"I work well on remote teams: collaborative, direct, and proactive. I ship at the pace each task needs without cutting corners.",
		],
		languages: "Spanish (native) · English C1",
	},
	contact: {
		intro: "Have a project or want to connect? Reach out.",
		email: "majo.solesg@gmail.com",
		phone: "+51 972 584 793",
	},
	links: {
		github: "https://github.com/mariajosesoles",
		linkedin: "https://www.linkedin.com/in/mariajosesoles",
		email: "mailto:majo.solesg@gmail.com",
	},
	footer: {
		copyright: "Mariajose Soles Guerrero",
	},
};
