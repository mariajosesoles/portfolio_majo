import { useEffect, useState } from "react";
import { getStackIcon } from "../../lib/stack-icons";

type HeroStackCarouselProps = {
	stack: string[];
};

const REPEAT_IN_HALF = 3;

function StackIconTile({
	slug,
	icon,
}: {
	slug: string;
	icon: NonNullable<ReturnType<typeof getStackIcon>>;
}) {
	return (
		<li className="shrink-0">
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
	);
}

export function HeroStackCarousel({ stack }: HeroStackCarouselProps) {
	const [reducedMotion, setReducedMotion] = useState(false);

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

	const expanded = Array.from({ length: REPEAT_IN_HALF }, () => items).flat();

	const halfTrack = (
		<ul className="flex shrink-0 items-center gap-4 md:gap-6">
			{expanded.map(({ slug, icon }, index) => (
				<StackIconTile key={`${slug}-${index}`} slug={slug} icon={icon} />
			))}
		</ul>
	);

	return (
		<div
			className="relative z-10 mt-auto w-full max-w-[100vw] pt-10 md:pt-12"
			aria-label="Stack tecnológico"
		>
			{reducedMotion ? (
				<div className="overflow-hidden px-4">
					<div className="flex w-max gap-4 md:gap-6">
						{halfTrack}
						<ul className="flex shrink-0 items-center gap-4 md:gap-6" aria-hidden="true">
							{expanded.map(({ slug, icon }, index) => (
								<StackIconTile
									key={`static-dup-${slug}-${index}`}
									slug={slug}
									icon={icon}
								/>
							))}
						</ul>
					</div>
				</div>
			) : (
				<div className="hero-stack-marquee overflow-hidden">
					<div className="hero-stack-marquee__track flex w-max">
						{halfTrack}
						<ul className="flex shrink-0 items-center gap-4 md:gap-6" aria-hidden="true">
							{expanded.map(({ slug, icon }, index) => (
								<StackIconTile
									key={`marquee-dup-${slug}-${index}`}
									slug={slug}
									icon={icon}
								/>
							))}
						</ul>
					</div>
				</div>
			)}
		</div>
	);
}
