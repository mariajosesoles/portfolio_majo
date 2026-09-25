import { MeshGradient } from "@paper-design/shaders-react";
import { useEffect, useState } from "react";

/** Figma: negro/indigo base, focos púrpura/violeta/lila — sin fucsia (rosa reservado a tipografía hero) */
const MESH_DARK = [
	"#0a0614",
	"#9333ea",
	"#2d1b4e",
	"#8b2be8",
	"#6b21a8",
	"#12081f",
	"#a855f7",
	"#4c1d95",
	"#0d0518",
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
		"bg-[#0a0614] bg-[radial-gradient(ellipse_85%_65%_at_22%_88%,#9333eabf_0%,#6b21a866_35%,transparent_62%),radial-gradient(ellipse_45%_95%_at_98%_52%,#8b2be888_0%,#a855f755_28%,transparent_58%),radial-gradient(ellipse_70%_55%_at_55%_18%,#0a0614_0%,#2d1b4ecc_42%,transparent_72%),radial-gradient(ellipse_50%_40%_at_8%_15%,#7c3aed33_0%,transparent_55%)]";

	const cssMeshLight =
		"bg-brand-cream bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,#e8479788_0%,transparent_55%),radial-gradient(ellipse_50%_45%_at_15%_50%,#c084fc66_0%,transparent_50%),radial-gradient(ellipse_55%_60%_at_100%_40%,#94c2da77_0%,transparent_55%)]";

	return (
		<div
			className="pointer-events-none absolute inset-0 bg-[#0a0614]"
			aria-hidden="true"
		>
			{!mounted ? (
				<div
					className={`h-full w-full ${theme === "light" ? cssMeshLight : cssMeshDark}`}
				/>
			) : (
				<MeshGradient
					colors={[...colors]}
					distortion={theme === "light" ? 0.52 : 0.72}
					swirl={0.2}
					grainMixer={0}
					grainOverlay={0}
					speed={reducedMotion ? 0 : theme === "light" ? 0.38 : 0.48}
					scale={1.12}
					rotation={0.1}
					offsetX={0.04}
					offsetY={0.02}
					fit="cover"
					width="100%"
					height="100%"
				/>
			)}
			<div
				className={`absolute inset-0 ${
					theme === "light"
						? "bg-gradient-to-b from-transparent via-transparent to-bg/40"
						: "bg-[radial-gradient(ellipse_90%_70%_at_48%_35%,rgb(10_6_20/0.55)_0%,transparent_58%),linear-gradient(to_bottom,rgb(8_4_15/0.45)_0%,transparent_38%,transparent_68%,rgb(10_6_20/0.35)_100%)]"
				}`}
			/>
		</div>
	);
}
