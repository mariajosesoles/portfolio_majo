import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import type { SiteConfig } from "../../types/site";
import { HeroMeshBackground } from "./HeroMeshBackground";
import { HeroStackCarousel } from "./HeroStackCarousel";

type HeroProps = {
	config: SiteConfig;
};

function readTheme(): "light" | "dark" {
	if (typeof document === "undefined") return "dark";
	return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export function Hero({ config }: HeroProps) {
	const containerRef = useRef<HTMLElement>(null);
	const [theme, setTheme] = useState<"light" | "dark">("dark");

	useEffect(() => {
		setTheme(readTheme());
		const observer = new MutationObserver(() => setTheme(readTheme()));
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["data-theme"],
		});
		return () => observer.disconnect();
	}, []);

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

	const isLight = theme === "light";

	return (
		<section
			ref={containerRef}
			id="hero"
			className="relative isolate overflow-hidden py-16 md:py-24"
		>
			<HeroMeshBackground />
			<div
				className={`hero-stagger relative z-10 mx-auto max-w-6xl px-6 ${
					isLight
						? "rounded-3xl border border-border bg-bg-elevated/85 p-8 shadow-[0_0_48px_var(--color-glow)] backdrop-blur-sm md:p-12"
						: ""
				}`}
			>
				<div className="space-y-5">
					<p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-brand-sky md:text-base">
						{config.tagline}
					</p>
					<h1 className="font-display text-[clamp(2.25rem,6vw,3.75rem)] font-bold leading-tight tracking-tight text-neon">
						{config.heroRole}
					</h1>
					<p
						className="font-script text-[clamp(2rem,5vw,3.25rem)] leading-none text-brand-magenta text-neon-subtle"
						aria-label={config.name}
					>
						{config.name}
					</p>
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
						className="inline-flex items-center rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-on-accent transition hover:bg-accent-2 hover:shadow-[0_0_24px_var(--color-glow)]"
					>
						{config.cta.contact}
					</a>
				</div>
			</div>
			<HeroStackCarousel stack={config.heroStack} />
		</section>
	);
}
