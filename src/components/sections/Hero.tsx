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
		<div ref={containerRef} className="hero-shell relative z-10 flex min-h-0 flex-1 flex-col">
			<div
				className={`hero-title-region flex min-h-0 flex-1 items-center justify-center ${
					isLight
						? "mx-4 rounded-3xl border border-border bg-bg-elevated/85 p-5 shadow-[0_0_48px_var(--color-glow)] backdrop-blur-sm sm:mx-6 sm:p-6 md:p-8 lg:p-10"
						: ""
				}`}
			>
				<div className="hero-stagger hero-copy-block page-container w-full">
					<h1 className="mx-auto w-full">
						{rolePrimary ? (
							<div className="hero-noise-wrap flex w-full justify-center">
								<span className="hero-noise-wrap__text uppercase">{rolePrimary}</span>
							</div>
						) : null}
						{roleSecondary ? (
							<div className="hero-shadow-wrap flex w-full justify-center">
								<span className="hero-shadow-wrap__text uppercase">{roleSecondary}</span>
							</div>
						) : null}
					</h1>

					<div className="hero-signature-wrap mx-auto w-full">
						<p className="hero-signature text-center sm:text-right sm:pr-[6%] md:pr-[8%]">
							{displayName}
						</p>
					</div>
				</div>
			</div>

			<HeroStackCarousel stack={config.heroStack} />
		</div>
	);
}
