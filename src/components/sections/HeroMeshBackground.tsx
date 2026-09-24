import { MeshGradient } from "@paper-design/shaders-react";
import { useEffect, useState } from "react";

/** Focos vibrantes sobre base muy negra */
const MESH_DARK = [
	"#000000",
	"#000000",
	"#030303",
	"#000000",
	"#ff008a",
	"#050008",
	"#6b21a8",
	"#030008",
	"#000000",
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
		"bg-black bg-[radial-gradient(ellipse_75%_50%_at_50%_100%,#ff008a55_0%,transparent_52%),radial-gradient(ellipse_40%_38%_at_16%_58%,#9333ea44_0%,transparent_50%),radial-gradient(ellipse_48%_58%_at_100%_42%,#4c1d9555_0%,transparent_55%),radial-gradient(ellipse_130%_90%_at_50%_40%,#000000_0%,#000000e6_50%,transparent_78%)]";

	const cssMeshLight =
		"bg-brand-cream bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,#e8479788_0%,transparent_55%),radial-gradient(ellipse_50%_45%_at_15%_50%,#c084fc66_0%,transparent_50%),radial-gradient(ellipse_55%_60%_at_100%_40%,#94c2da77_0%,transparent_55%)]";

	return (
		<div className="pointer-events-none absolute inset-0 bg-black" aria-hidden="true">
			{!mounted ? (
				<div
					className={`h-full w-full ${theme === "light" ? cssMeshLight : cssMeshDark}`}
				/>
			) : (
				<MeshGradient
					colors={[...colors]}
					distortion={theme === "light" ? 0.5 : 0.58}
					swirl={0.14}
					grainMixer={0}
					grainOverlay={0}
					speed={reducedMotion ? 0 : theme === "light" ? 0.35 : 0.4}
					scale={1.02}
					rotation={0.05}
					offsetX={0}
					offsetY={0.05}
					fit="cover"
					width="100%"
					height="100%"
				/>
			)}
			<div
				className={`absolute inset-0 ${
					theme === "light"
						? "bg-gradient-to-b from-transparent via-transparent to-bg/40"
						: "bg-[radial-gradient(ellipse_100%_80%_at_50%_45%,#000000d9_0%,#00000080_45%,transparent_70%),linear-gradient(to_bottom,#000000f2_0%,#00000099_35%,#000000cc_100%)]"
				}`}
			/>
		</div>
	);
}
