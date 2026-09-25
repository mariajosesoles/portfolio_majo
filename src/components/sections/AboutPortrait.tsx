type AboutPortraitProps = {
	alt: string;
};

export function AboutPortrait({ alt }: AboutPortraitProps) {
	return (
		<div className="about-portrait-stage relative flex h-full w-full items-end justify-center">
			<div
				className="about-portrait-glow pointer-events-none absolute inset-[8%] rounded-full bg-[radial-gradient(circle,rgb(255_0_138_/_0.18)_0%,transparent_68%)]"
				aria-hidden="true"
			/>
			<img
				src="/about/portrait-3d.png"
				alt={alt}
				width={1024}
				height={1024}
				className="about-portrait relative z-[1] max-h-full w-auto max-w-full object-contain object-bottom drop-shadow-[0_20px_48px_rgb(0_0_0_/_0.45)]"
				loading="lazy"
				decoding="async"
			/>
		</div>
	);
}
