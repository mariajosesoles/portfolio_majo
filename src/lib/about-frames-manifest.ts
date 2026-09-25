export type AboutFramesManifest = {
	frameCount: number;
	background: string;
	framePrefix: string;
	centerFile: string;
	/** Radians added when mapping cursor angle → frame index (tune if directions feel rotated). */
	angleOffsetRadians?: number;
	/** Optional face anchor overrides (0–1 of portrait slot). */
	faceCenterX?: number;
	faceCenterY?: number;
};

export const ABOUT_FRAMES_MANIFEST_URL = "/about/frames/manifest.json";

export async function fetchAboutFramesManifest(): Promise<AboutFramesManifest | null> {
	try {
		const res = await fetch(ABOUT_FRAMES_MANIFEST_URL, { cache: "no-cache" });
		if (!res.ok) return null;
		const data = (await res.json()) as AboutFramesManifest;
		if (!data.frameCount || data.frameCount < 2) return null;
		return data;
	} catch {
		return null;
	}
}

export function frameUrl(manifest: AboutFramesManifest, index: number): string {
	const id = String(index).padStart(3, "0");
	return `/about/frames/${manifest.framePrefix}-${id}.webp`;
}

export function centerFrameUrl(manifest: AboutFramesManifest): string {
	return `/about/frames/${manifest.centerFile}`;
}
