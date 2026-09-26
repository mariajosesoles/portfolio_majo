/** Remove solid background from canvas pixels (tolerance per channel). */
export function applyChromaKey(
	ctx: CanvasRenderingContext2D,
	width: number,
	height: number,
	keyRgb: { r: number; g: number; b: number },
	tolerance = 28,
): void {
	const { data } = ctx.getImageData(0, 0, width, height);
	for (let i = 0; i < data.length; i += 4) {
		const dr = Math.abs(data[i] - keyRgb.r);
		const dg = Math.abs(data[i + 1] - keyRgb.g);
		const db = Math.abs(data[i + 2] - keyRgb.b);
		if (dr <= tolerance && dg <= tolerance && db <= tolerance) {
			data[i + 3] = 0;
		}
	}
	ctx.putImageData(new ImageData(data, width, height), 0, 0);
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
	const normalized = hex.replace("#", "").trim();
	if (normalized.length !== 6) return null;
	const r = Number.parseInt(normalized.slice(0, 2), 16);
	const g = Number.parseInt(normalized.slice(2, 4), 16);
	const b = Number.parseInt(normalized.slice(4, 6), 16);
	if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return null;
	return { r, g, b };
}
