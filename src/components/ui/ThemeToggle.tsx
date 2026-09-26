import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "../../lib/cn";
import {
	getStoredPreference,
	getSystemTheme,
	type ResolvedTheme,
	resolveTheme,
	setThemePreference,
	type ThemePreference,
} from "../../lib/theme";
import type { Locale } from "../../types/site";

type ThemeToggleProps = {
	locale: Locale;
};

const labels: Record<Locale, { toggle: string; light: string; dark: string; system: string }> = {
	es: {
		toggle: "Cambiar tema",
		light: "Claro",
		dark: "Oscuro",
		system: "Sistema",
	},
	en: {
		toggle: "Toggle theme",
		light: "Light",
		dark: "Dark",
		system: "System",
	},
};

export function ThemeToggle({ locale }: ThemeToggleProps) {
	const copy = labels[locale];
	const [preference, setPreference] = useState<ThemePreference>("system");
	const [resolved, setResolved] = useState<ResolvedTheme>("dark");

	useEffect(() => {
		const stored = getStoredPreference();
		setPreference(stored);
		setResolved(resolveTheme(stored));

		const mq = window.matchMedia("(prefers-color-scheme: light)");
		const onSystemChange = () => {
			if (getStoredPreference() === "system") {
				setResolved(getSystemTheme());
			}
		};
		mq.addEventListener("change", onSystemChange);
		return () => mq.removeEventListener("change", onSystemChange);
	}, []);

	const cycle = () => {
		const order: ThemePreference[] = ["system", "light", "dark"];
		const next = order[(order.indexOf(preference) + 1) % order.length];
		setPreference(next);
		setResolved(setThemePreference(next));
	};

	const hint =
		preference === "system"
			? `${copy.system} (${resolved === "light" ? copy.light : copy.dark})`
			: preference === "light"
				? copy.light
				: copy.dark;

	return (
		<button
			type="button"
			onClick={cycle}
			className={cn(
				"inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-bg-elevated/80 text-muted transition hover:border-accent/40 hover:text-text",
			)}
			aria-label={`${copy.toggle}: ${hint}`}
			title={hint}
		>
			{resolved === "light" ? (
				<Sun className="h-4 w-4" aria-hidden />
			) : (
				<Moon className="h-4 w-4" aria-hidden />
			)}
		</button>
	);
}
