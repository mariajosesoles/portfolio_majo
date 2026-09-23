/** "Full Stack Developer" → ["FULLSTACK", "DEVELOPER"] */
export function splitHeroRole(role: string): [string, string] {
	const parts = role.trim().split(/\s+/).filter(Boolean);
	if (parts.length === 0) return ["", ""];
	if (parts.length === 1) return [parts[0]!.toUpperCase(), ""];
	const secondary = parts[parts.length - 1]!;
	const primary = parts.slice(0, -1).join("");
	return [primary.toUpperCase(), secondary.toUpperCase()];
}
