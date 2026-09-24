import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { formatDisplayName } from "../../lib/format-display-name";
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
	const displayName = formatDisplayName(config.name);

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
			className="relative z-10 flex min-h-0 flex-1 flex-col justify-center"
		>
			<div
				className={`hero-stagger mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-6 ${
					isLight
						? "rounded-3xl border border-border bg-bg-elevated/85 p-8 shadow-[0_0_48px_var(--color-glow)] backdrop-blur-sm md:p-12"
						: ""
				}`}
			>
				<div className="hero-copy-block mx-auto max-w-[min(100%,73rem)]">
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

					<p className="hero-signature -mt-[0.15em] w-full max-w-[92%] pr-[6%] text-right md:max-w-[85%] md:pr-[10%]">
						{displayName}
					</p>
				</div>
			</div>
			<HeroStackCarousel stack={config.heroStack} />
		</div>
	);
}
