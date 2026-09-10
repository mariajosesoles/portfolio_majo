import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import type { SiteConfig } from "../../types/site";

type HeroProps = {
	config: SiteConfig;
};

export function Hero({ config }: HeroProps) {
	const containerRef = useRef<HTMLElement>(null);

	useGSAP(
		() => {
			if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
				return;
			}
			gsap.from(".hero-stagger > *", {
				opacity: 0,
				y: 28,
				duration: 0.65,
				stagger: 0.12,
				ease: "power2.out",
			});
		},
		{ scope: containerRef },
	);

	return (
		<section
			ref={containerRef}
			id="hero"
			className="relative overflow-hidden py-16 md:py-24"
		>
			<div
				className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.12),transparent_55%)]"
				aria-hidden="true"
			/>
			<div className="hero-stagger relative mx-auto flex max-w-6xl flex-col gap-8 px-6 md:flex-row md:items-center md:gap-12">
				<div
					className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border border-border bg-surface text-3xl font-bold text-accent shadow-[0_0_40px_var(--color-glow)]"
					aria-hidden="true"
				>
					M
				</div>
				<div className="space-y-5">
					<p className="text-sm font-medium uppercase tracking-widest text-accent">
						{config.tagline}
					</p>
					<h1 className="text-4xl font-bold tracking-tight md:text-5xl">
						{config.name}
					</h1>
					<p className="max-w-2xl text-lg text-muted">{config.profile}</p>
					<ul className="flex flex-wrap gap-2">
						{config.heroChips.map((chip) => (
							<li
								key={chip}
								className="rounded-full border border-border bg-bg-elevated px-3 py-1 font-mono text-xs text-muted"
							>
								{chip}
							</li>
						))}
					</ul>
					<a
						href="#contact"
						className="inline-flex items-center rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent/90"
					>
						{config.cta.contact}
					</a>
				</div>
			</div>
		</section>
	);
}
