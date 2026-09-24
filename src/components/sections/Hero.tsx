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
			className="relative z-10 flex min-h-[min(72vh,52rem)] flex-1 flex-col justify-center pt-20 md:pt-24"
		>
			<div
				className={`hero-stagger relative z-10 mx-auto w-full max-w-6xl px-6 ${
					isLight
						? "rounded-3xl border border-border bg-bg-elevated/85 p-8 text-center shadow-[0_0_48px_var(--color-glow)] backdrop-blur-sm md:p-12"
						: "text-center"
				}`}
			>
				<div className="mx-auto flex max-w-4xl flex-col items-center gap-8">
					<h1 className="w-full uppercase">
						{rolePrimary ? (
							<span className="text-hero-fullstack block">{rolePrimary}</span>
						) : null}
						{roleSecondary ? (
							<span className="text-hero-developer relative mt-0 block">
								{roleSecondary}
								<span
									className="font-script absolute left-[58%] top-[0.72em] z-10 hidden max-w-[min(100vw-3rem,22rem)] -translate-x-1/2 text-[clamp(1.65rem,4.5vw,2.85rem)] normal-case leading-none tracking-normal text-brand-magenta text-neon-subtle md:block"
								>
									{config.name}
								</span>
							</span>
						) : null}
					</h1>

					<p className="font-script -mt-2 text-[clamp(1.65rem,4.5vw,2.85rem)] leading-none text-brand-magenta text-neon-subtle md:hidden">
						{config.name}
					</p>

					<a
						href="#contact"
						className="inline-flex items-center rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-on-accent transition hover:bg-accent-2 hover:shadow-[0_0_24px_var(--color-glow)]"
					>
						{config.cta.contact}
					</a>
				</div>
			</div>
			<HeroStackCarousel stack={config.heroStack} />
		</div>
	);
}
