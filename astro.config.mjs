// @ts-check
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
	site: "https://portfolio-majo.pages.dev",
	integrations: [react(), sitemap()],
	vite: {
		plugins: [tailwindcss()],
	},
	server: {
		port: 5174,
	},
});
