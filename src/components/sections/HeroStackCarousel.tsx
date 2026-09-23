import { useEffect, useState } from "react";
import { getStackIcon } from "../../lib/stack-icons";

type HeroStackCarouselProps = {
	stack: string[];
};

export function HeroStackCarousel({ stack }: HeroStackCarouselProps) {
	const [reducedMotion, setReducedMotion] = useState(true);

	useEffect(() => {
		setReducedMotion(
			window.matchMedia("(prefers-reduced-motion: reduce)").matches,
		);
	}, []);

	const items = stack.flatMap((slug) => {
		const icon = getStackIcon(slug);
		return icon ? [{ slug, icon }] : [];
	});

	if (items.length === 0) return null;

	const track = (
		<ul className="flex items-center gap-4 md:gap-6">
			{items.map(({ slug, icon }) => (
				<li key={slug}>
					<span
						className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-bg-elevated/70 shadow-[0_0_16px_var(--color-glow)] transition hover:scale-105 hover:border-accent/40 md:h-11 md:w-11"
						title={icon.title}
					>
						<svg
							role="img"
							viewBox="0 0 24 24"
							className="h-5 w-5 fill-current md:h-6 md:w-6"
							style={{ color: `#${icon.hex}` }}
							aria-label={icon.title}
						>
							<title>{icon.title}</title>
							<path d={icon.path} />
						</svg>
					</span>
				</li>
			))}
		</ul>
	);

	return (
		<div
			className="relative z-10 mt-10 w-screen max-w-[100vw] border-t border-border/60 pt-8 left-1/2 -translate-x-1/2"
			aria-label="Stack tecnológico"
		>
			{reducedMotion ? (
				<div className="flex justify-center px-6">{track}</div>
			) : (
				<div className="hero-stack-marquee overflow-hidden">
					<div className="hero-stack-marquee__track flex w-max gap-4 md:gap-6">
						{track}
						<ul className="flex items-center gap-4 md:gap-6" aria-hidden="true">
							{items.map(({ slug, icon }) => (
								<li key={`dup-${slug}`}>
									<span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-bg-elevated/70 md:h-11 md:w-11">
										<svg
											viewBox="0 0 24 24"
											className="h-5 w-5 fill-current md:h-6 md:w-6"
											style={{ color: `#${icon.hex}` }}
										>
											<path d={icon.path} />
										</svg>
									</span>
								</li>
							))}
						</ul>
					</div>
				</div>
			)}
		</div>
	);
}
