import {
	siAstro,
	siCloudflare,
	siCloudinary,
	siDrizzle,
	siHono,
	siReact,
	siTailwindcss,
	siTypescript,
	siZod,
} from "simple-icons";

const iconMap: Record<string, { path: string; hex: string; title: string }> = {
	react: { path: siReact.path, hex: siReact.hex, title: "React" },
	typescript: {
		path: siTypescript.path,
		hex: siTypescript.hex,
		title: "TypeScript",
	},
	tailwindcss: {
		path: siTailwindcss.path,
		hex: siTailwindcss.hex,
		title: "Tailwind CSS",
	},
	astro: { path: siAstro.path, hex: siAstro.hex, title: "Astro" },
	cloudflare: {
		path: siCloudflare.path,
		hex: siCloudflare.hex,
		title: "Cloudflare",
	},
	cloudinary: {
		path: siCloudinary.path,
		hex: siCloudinary.hex,
		title: "Cloudinary",
	},
	hono: { path: siHono.path, hex: siHono.hex, title: "Hono" },
	drizzle: { path: siDrizzle.path, hex: siDrizzle.hex, title: "Drizzle" },
	zod: { path: siZod.path, hex: siZod.hex, title: "Zod" },
};

export function getStackIcon(slug: string) {
	return iconMap[slug.toLowerCase()];
}
