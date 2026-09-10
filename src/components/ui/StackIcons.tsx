import { getStackIcon } from "../../lib/stack-icons";

type StackIconsProps = {
	stack: string[];
};

export function StackIcons({ stack }: StackIconsProps) {
	return (
		<ul className="flex flex-wrap items-center gap-2" aria-label="Stack">
			{stack.map((slug) => {
				const icon = getStackIcon(slug);
				if (!icon) return null;
				return (
					<li key={slug}>
						<span
							className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-bg-elevated/60"
							title={icon.title}
						>
							<svg
								role="img"
								viewBox="0 0 24 24"
								className="h-4 w-4 fill-current"
								style={{ color: `#${icon.hex}` }}
								aria-label={icon.title}
							>
								<title>{icon.title}</title>
								<path d={icon.path} />
							</svg>
						</span>
					</li>
				);
			})}
		</ul>
	);
}
