import { MeshGradient } from "@paper-design/shaders-react";
import { useEffect, useState } from "react";

/** Figma: varios focos claros fucsia · morado · violeta sobre base violeta profunda */
const MESH_DARK = [
	"#ff4fd8",
	"#ff2ec4",
	"#e020a0",
	"#a855f7",
	"#8b2be8",
	"#2d1b4e",
] as const;
const MESH_LIGHT = ["#faf0ff", "#e7a0cc", "#c084fc", "#94c2da", "#203f9a"] as const;

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
					className={`h-full w-full ${
						theme === "light"
							? "bg-[radial-gradient(ellipse_at_15%_10%,#faf0ffcc,transparent_42%),radial-gradient(ellipse_at_85%_20%,#c084fc88,transparent_48%),radial-gradient(ellipse_at_50%_90%,#94c2da66,transparent_50%),radial-gradient(ellipse_at_0%_60%,#e7a0cc55,transparent_45%)] bg-bg"
							: "bg-[radial-gradient(ellipse_at_12%_8%,#ff4fd8aa,transparent_38%),radial-gradient(ellipse_at_88%_18%,#a855f799,transparent_42%),radial-gradient(ellipse_at_72%_75%,#8b2be888,transparent_48%),radial-gradient(ellipse_at_20%_65%,#ff2ec466,transparent_40%),radial-gradient(ellipse_at_50%_50%,#2d1b4e,transparent_70%)] bg-[#1a0a28]"
					}`}
				/>
			) : (
				<MeshGradient
					colors={[...colors]}
					distortion={theme === "light" ? 0.62 : 0.92}
					swirl={0.18}
					grainMixer={0}
					grainOverlay={0}
					speed={reducedMotion ? 0 : theme === "light" ? 0.55 : 0.85}
					scale={1.08}
					rotation={0.12}
					offsetX={0.05}
					offsetY={-0.08}
					fit="cover"
					width="100%"
					height="100%"
				/>
			)}
			<div
				className={`absolute inset-0 bg-gradient-to-b ${
					theme === "light"
						? "from-transparent via-transparent to-bg/85"
						: "from-transparent via-[#1a0a28]/15 to-bg/92"
				}`}
			/>
		</div>
	);
}
