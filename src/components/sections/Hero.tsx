import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { splitHeroRole } from "../../lib/split-hero-role";
import type { SiteConfig } from "../../types/site";
import { HeroStackCarousel } from "./HeroStackCarousel";

type HeroProps = {
	config: SiteConfig;
};

function readTheme(): "light" | "dark" {
	if (typeof document === "undefined") return "dark";
	return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export function Hero({ config }: HeroProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [theme, setTheme] = useState<"light" | "dark">("dark");
	const [rolePrimary, roleSecondary] = splitHeroRole(config.heroRole);

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
		<div
			ref={containerRef}
			className="relative z-10 flex min-h-0 flex-1 flex-col justify-between pt-[clamp(4.5rem,12vh,6.5rem)]"
		>
			<div
				className={`hero-stagger mx-auto w-full max-w-6xl flex-1 px-6 ${
					isLight
						? "rounded-3xl border border-border bg-bg-elevated/85 p-8 shadow-[0_0_48px_var(--color-glow)] backdrop-blur-sm md:p-12"
						: ""
				}`}
			>
				<div className="mx-auto flex w-full max-w-[min(100%,73rem)] flex-col items-center">
					<h1 className="w-full">
						{rolePrimary ? (
							<div className="hero-noise-wrap flex w-full justify-center">
								<span className="hero-noise-wrap__text uppercase">{rolePrimary}</span>
							</div>
						) : null}
						{roleSecondary ? (
							<div className="hero-shadow-wrap -mt-[0.04em] flex w-full justify-center">
								<span className="hero-shadow-wrap__text uppercase">{roleSecondary}</span>
							</div>
						) : null}
					</h1>

					<p className="hero-signature -mt-[0.15em] w-full max-w-[92%] pr-[6%] text-right normal-case md:max-w-[85%] md:pr-[10%]">
						{config.name}
					</p>

					<a
						href="#contact"
						className="mt-8 inline-flex items-center rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-on-accent transition hover:bg-accent-2 hover:shadow-[0_0_24px_var(--color-glow)]"
					>
						{config.cta.contact}
					</a>
				</div>
			</div>
			<HeroStackCarousel stack={config.heroStack} />
		</div>
	);
}
