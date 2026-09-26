import { useEffect, useState } from "react";
import { getStackIcon } from "../../lib/stack-icons";

type HeroStackCarouselProps = {
	stack: string[];
};

const REPEAT_IN_HALF = 4;
const TILE_GAP = "gap-4 md:gap-5 lg:gap-6";

type StackItem = {
	slug: string;
	icon: NonNullable<ReturnType<typeof getStackIcon>>;
};

function StackIconTile({
	item,
	id,
}: {
	item: StackItem;
	id: string;
}) {
	const { icon } = item;
	return (
		<div key={id} className="flex shrink-0 items-center justify-center" role="listitem">
			<span
				className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-bg-elevated/70 shadow-[0_0_20px_var(--color-glow)] md:h-11 md:w-11"
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
		</div>
	);
}

function IconRow({
	items,
	keyPrefix,
}: {
	items: StackItem[];
	keyPrefix: string;
}) {
	return (
		<div className={`flex shrink-0 items-center ${TILE_GAP}`}>
			{items.map((item, index) => (
				<StackIconTile
					key={`${keyPrefix}-${item.slug}-${index}`}
					id={`${keyPrefix}-${item.slug}-${index}`}
					item={item}
				/>
			))}
		</div>
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

	const expanded: StackItem[] = Array.from({ length: REPEAT_IN_HALF }, () => items).flat();

	return (
		<div
			className="hero-carousel-wrap relative z-10 mt-auto w-full shrink-0"
			aria-label="Stack tecnológico"
		>
			<div className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 px-0">
				{reducedMotion ? (
					<div className="flex w-max items-center overflow-x-auto px-4">
						<IconRow items={expanded} keyPrefix="static-a" />
						<div className="w-5 shrink-0 md:w-6" aria-hidden="true" />
						<IconRow items={expanded} keyPrefix="static-b" />
					</div>
				) : (
					<div className="hero-stack-marquee overflow-hidden px-0">
						<div className={`hero-stack-marquee__track flex items-center ${TILE_GAP}`}>
							<IconRow items={expanded} keyPrefix="loop-a" />
							<IconRow items={expanded} keyPrefix="loop-b" />
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
