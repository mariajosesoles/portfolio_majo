export type ThemePreference = "light" | "dark" | "system";

export type ResolvedTheme = "light" | "dark";

const STORAGE_KEY = "majo-theme";

export function getSystemTheme(): ResolvedTheme {
	if (typeof window === "undefined") return "dark";
	return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

export function getStoredPreference(): ThemePreference {
	if (typeof window === "undefined") return "system";
	const stored = localStorage.getItem(STORAGE_KEY);
	if (stored === "light" || stored === "dark" || stored === "system") {
		return stored;
	}
	return "system";
}

export function resolveTheme(preference: ThemePreference): ResolvedTheme {
	if (preference === "system") return getSystemTheme();
	return preference;
}

export function applyTheme(preference: ThemePreference): ResolvedTheme {
	const resolved = resolveTheme(preference);
	document.documentElement.dataset.theme = resolved;
	return resolved;
}

export function setThemePreference(preference: ThemePreference): ResolvedTheme {
	localStorage.setItem(STORAGE_KEY, preference);
	return applyTheme(preference);
}

export function initTheme(): ResolvedTheme {
	return applyTheme(getStoredPreference());
}
