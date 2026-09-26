import { cn } from "../../lib/cn";
import type { Locale } from "../../types/site";

type LangSwitchProps = {
	locale: Locale;
};

export function LangSwitch({ locale }: LangSwitchProps) {
	const isEs = locale === "es";
	return (
		<fieldset className="type-caption m-0 min-w-0 rounded-full border border-border bg-bg-elevated/80 p-1">
			<legend className="sr-only">Language</legend>
			<div className="flex items-center gap-1 font-medium">
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
		</fieldset>
	);
}
