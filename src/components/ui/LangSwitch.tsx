import { cn } from "../../lib/cn";
import type { Locale } from "../../types/site";

type LangSwitchProps = {
	locale: Locale;
};

export function LangSwitch({ locale }: LangSwitchProps) {
	const isEs = locale === "es";
	return (
		<div
			className="flex items-center gap-1 rounded-full border border-border bg-bg-elevated/80 p-1 text-xs font-medium"
			aria-label="Language"
		>
			<a
				href="/"
				className={cn(
					"rounded-full px-2.5 py-1 transition-colors",
					isEs ? "bg-accent text-on-accent" : "text-muted hover:text-text",
				)}
				aria-current={isEs ? "page" : undefined}
			>
				ES
			</a>
			<a
				href="/en/"
				className={cn(
					"rounded-full px-2.5 py-1 transition-colors",
					!isEs ? "bg-accent text-on-accent" : "text-muted hover:text-text",
				)}
				aria-current={!isEs ? "page" : undefined}
			>
				EN
			</a>
		</div>
	);
}
