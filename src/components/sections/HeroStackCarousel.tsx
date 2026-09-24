import { useEffect, useState } from "react";
import { getStackIcon } from "../../lib/stack-icons";

type HeroStackCarouselProps = {
	stack: string[];
};

const REPEAT_IN_HALF = 3;
const TILE_GAP = "gap-5 md:gap-6";

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
	const { slug, icon } = item;
	return (
		<div key={id} className="shrink-0" role="listitem">
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

	const tiles = (keyPrefix: string) =>
		expanded.map((item, index) => (
			<StackIconTile
				key={`${keyPrefix}-${item.slug}-${index}`}
				id={`${keyPrefix}-${item.slug}-${index}`}
				item={item}
			/>
		));

	return (
		<div
			className="relative z-10 mt-auto w-full py-6 md:py-10"
			aria-label="Stack tecnológico"
		>
			<div className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2">
				{reducedMotion ? (
					<div
						className={`flex w-max items-center overflow-x-auto px-4 ${TILE_GAP}`}
						role="list"
					>
						{tiles("static-a")}
						{tiles("static-b")}
					</div>
				) : (
					<div className="hero-stack-marquee overflow-hidden py-3 md:py-4">
						<div
							className={`hero-stack-marquee__track flex w-max items-center ${TILE_GAP}`}
							role="list"
						>
							{tiles("loop-a")}
							{tiles("loop-b")}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
