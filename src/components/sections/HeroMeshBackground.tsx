import { MeshGradient } from "@paper-design/shaders-react";
import { useEffect, useState } from "react";

/** Berry Jam · Strawberry Milk · Pink Foam + mid tone for depth */
const HERO_MESH_COLORS = ["#f4d6dc", "#db8291", "#96363f", "#720002"] as const;

export function HeroMeshBackground() {
	const [mounted, setMounted] = useState(false);
	const [reducedMotion, setReducedMotion] = useState(false);

	useEffect(() => {
		setReducedMotion(
			window.matchMedia("(prefers-reduced-motion: reduce)").matches,
		);
		setMounted(true);
	}, []);

	return (
		<div className="pointer-events-none absolute inset-0" aria-hidden="true">
			{!mounted ? (
				<div className="h-full w-full bg-[radial-gradient(ellipse_at_top,#db829155,transparent_50%),radial-gradient(ellipse_at_bottom_right,#96363f66,transparent_45%),radial-gradient(ellipse_at_left,#72000255,transparent_40%)] bg-bg" />
			) : (
				<MeshGradient
					colors={[...HERO_MESH_COLORS]}
					distortion={0.8}
					swirl={0.1}
					grainMixer={0}
					grainOverlay={0}
					speed={reducedMotion ? 0 : 1}
					scale={1}
					rotation={0}
					offsetX={0}
					offsetY={0}
					fit="cover"
					width="100%"
					height="100%"
				/>
			)}
			<div className="absolute inset-0 bg-gradient-to-b from-bg/45 via-bg/68 to-bg" />
		</div>
	);
}
