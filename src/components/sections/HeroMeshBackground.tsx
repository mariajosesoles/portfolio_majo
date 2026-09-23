import { MeshGradient } from "@paper-design/shaders-react";
import { useEffect, useState } from "react";

const MESH_DARK = ["#8b2be8", "#e020a0", "#ff4fd8", "#0a0a0f"] as const;
const MESH_LIGHT = ["#efe8e0", "#e7a0cc", "#94c2da", "#203f9a"] as const;

function readTheme(): "light" | "dark" {
	if (typeof document === "undefined") return "dark";
	return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export function HeroMeshBackground() {
	const [mounted, setMounted] = useState(false);
	const [reducedMotion, setReducedMotion] = useState(false);
	const [theme, setTheme] = useState<"light" | "dark">("dark");

	useEffect(() => {
		setReducedMotion(
			window.matchMedia("(prefers-reduced-motion: reduce)").matches,
		);
		setTheme(readTheme());
		setMounted(true);

		const observer = new MutationObserver(() => {
			setTheme(readTheme());
		});
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["data-theme"],
		});
		return () => observer.disconnect();
	}, []);

	const colors = theme === "light" ? MESH_LIGHT : MESH_DARK;

	return (
		<div className="pointer-events-none absolute inset-0" aria-hidden="true">
			{!mounted ? (
				<div
					className={`h-full w-full bg-bg ${
						theme === "light"
							? "bg-[radial-gradient(ellipse_at_top,#e7a0cc55,transparent_50%),radial-gradient(ellipse_at_bottom_right,#94c2da66,transparent_45%),radial-gradient(ellipse_at_left,#203f9a33,transparent_40%)]"
							: "bg-[radial-gradient(ellipse_at_top,#ff4fd855,transparent_50%),radial-gradient(ellipse_at_bottom_right,#8b2be866,transparent_45%),radial-gradient(ellipse_at_left,#0a0a0f88,transparent_40%)]"
					}`}
				/>
			) : (
				<MeshGradient
					colors={[...colors]}
					distortion={theme === "light" ? 0.55 : 0.8}
					swirl={0.1}
					grainMixer={0}
					grainOverlay={0}
					speed={reducedMotion ? 0 : theme === "light" ? 0.6 : 1}
					scale={1}
					rotation={0}
					offsetX={0}
					offsetY={0}
					fit="cover"
					width="100%"
					height="100%"
				/>
			)}
			<div
				className={`absolute inset-0 bg-gradient-to-b ${
					theme === "light"
						? "from-brand-cream/30 via-bg/55 to-bg"
						: "from-vibe-black/20 via-bg/68 to-bg"
				}`}
			/>
		</div>
	);
}
