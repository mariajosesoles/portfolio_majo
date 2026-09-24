import { MeshGradient } from "@paper-design/shaders-react";
import { useEffect, useState } from "react";

/** Figma mesh: negro central, fucsia abajo-centro, morado izquierda, violeta/azul derecha */
const MESH_DARK = [
	"#000000",
	"#ff008a",
	"#ff4fd8",
	"#e020a0",
	"#9333ea",
	"#7c3aed",
	"#4c1d95",
	"#1e1b4b",
] as const;

const MESH_LIGHT = [
	"#faf0ff",
	"#ffe4f5",
	"#e7a0cc",
	"#c084fc",
	"#94c2da",
	"#203f9a",
] as const;

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

	const cssMeshDark =
		"bg-[#050508] bg-[radial-gradient(ellipse_90%_55%_at_50%_100%,#ff008acc_0%,transparent_58%),radial-gradient(ellipse_45%_40%_at_18%_55%,#9333eaa8_0%,transparent_55%),radial-gradient(ellipse_55%_70%_at_100%_45%,#4c1d95cc_0%,transparent_62%),radial-gradient(ellipse_35%_30%_at_8%_12%,#ff2ec444_0%,transparent_50%),radial-gradient(ellipse_40%_35%_at_92%_8%,#7c3aed55_0%,transparent_48%)]";

	const cssMeshLight =
		"bg-brand-cream bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,#e8479788_0%,transparent_55%),radial-gradient(ellipse_50%_45%_at_15%_50%,#c084fc66_0%,transparent_50%),radial-gradient(ellipse_55%_60%_at_100%_40%,#94c2da77_0%,transparent_55%)]";

	return (
		<div className="pointer-events-none absolute inset-0" aria-hidden="true">
			{!mounted ? (
				<div
					className={`h-full w-full ${theme === "light" ? cssMeshLight : cssMeshDark}`}
				/>
			) : (
				<MeshGradient
					colors={[...colors]}
					distortion={theme === "light" ? 0.55 : 0.78}
					swirl={0.22}
					grainMixer={0}
					grainOverlay={0}
					speed={reducedMotion ? 0 : theme === "light" ? 0.4 : 0.55}
					scale={1.15}
					rotation={0.08}
					offsetX={0.02}
					offsetY={0.06}
					fit="cover"
					width="100%"
					height="100%"
				/>
			)}
			<div
				className={`absolute inset-0 ${
					theme === "light"
						? "bg-gradient-to-b from-transparent via-transparent to-bg/40"
						: "bg-gradient-to-b from-[#000000]/25 via-transparent to-[#050508]/35"
				}`}
			/>
		</div>
	);
}
