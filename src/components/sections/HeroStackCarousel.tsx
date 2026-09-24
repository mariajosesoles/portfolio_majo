import { useEffect, useState } from "react";
import { getStackIcon } from "../../lib/stack-icons";

type HeroStackCarouselProps = {
	stack: string[];
};

const REPEAT_IN_HALF = 5;

function StackIconTile({
	slug,
	icon,
}: {
	slug: string;
	icon: NonNullable<ReturnType<typeof getStackIcon>>;
}) {
	return (
		<li className="shrink-0 list-none">
			<span
				className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-bg-elevated/70 shadow-[0_0_16px_var(--color-glow)] md:h-11 md:w-11"
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

function IconRow({
	items,
	keyPrefix,
}: {
	items: { slug: string; icon: NonNullable<ReturnType<typeof getStackIcon>> }[];
	keyPrefix: string;
}) {
	return (
		<ul className="flex shrink-0 list-none items-center gap-4 md:gap-6">
			{items.map(({ slug, icon }, index) => (
				<StackIconTile key={`${keyPrefix}-${slug}-${index}`} slug={slug} icon={icon} />
			))}
		</ul>
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

	return (
		<div
			className="relative z-10 mt-auto w-full pt-8 md:pt-10"
			aria-label="Stack tecnológico"
		>
			<div className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 overflow-hidden">
				{reducedMotion ? (
					<div className="flex w-max min-w-full justify-start gap-4 px-4 md:gap-6">
						<IconRow items={expanded} keyPrefix="static-a" />
						<IconRow items={expanded} keyPrefix="static-b" />
					</div>
				) : (
					<div className="hero-stack-marquee">
						<div className="hero-stack-marquee__track">
							<IconRow items={expanded} keyPrefix="loop-a" />
							<IconRow items={expanded} keyPrefix="loop-b" />
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
