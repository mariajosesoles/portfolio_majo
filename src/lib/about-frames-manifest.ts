export type AboutTrackingAnchor = {
	/** 0–1 position within #about section (desktop). */
	xWide: number;
	yWide: number;
	xNarrow: number;
	yNarrow: number;
};

export type AboutFramesManifest = {
	frameCount: number;
	background: string;
	framePrefix: string;
	centerFile: string;
	/** Optional explicit list after manual rename (see FRAME_NAMING.md). */
	frameFiles?: string[];
	trackingAnchorSection?: AboutTrackingAnchor;
	chromaTolerance?: number;
	/** Radians added when mapping cursor angle → frame index (tune if directions feel rotated). */
	angleOffsetRadians?: number;
	/** Optional face anchor overrides (0–1 of portrait slot). */
	faceCenterX?: number;
	faceCenterY?: number;
	suggestedProjectionNames?: string[];
};

export const ABOUT_FRAMES_MANIFEST_URL = "/about/frames/manifest.json";

export const DEFAULT_TRACKING_ANCHOR: AboutTrackingAnchor = {
	xWide: 0.2,
	yWide: 0.58,
	xNarrow: 0.5,
	yNarrow: 0.46,
};

export async function fetchAboutFramesManifest(): Promise<AboutFramesManifest | null> {
	try {
		const res = await fetch(ABOUT_FRAMES_MANIFEST_URL, { cache: "no-cache" });
		if (!res.ok) return null;
		const data = (await res.json()) as AboutFramesManifest;
		if (data.frameFiles?.length) {
			if (data.frameFiles.length < 2) return null;
			return data;
		}
		if (!data.frameCount || data.frameCount < 2) return null;
		return data;
	} catch {
		return null;
	}
}

export function frameUrl(manifest: AboutFramesManifest, index: number): string {
	if (manifest.frameFiles?.[index]) {
		return `/about/frames/${manifest.frameFiles[index]}`;
	}
	const id = String(index).padStart(3, "0");
	return `/about/frames/${manifest.framePrefix}-${id}.webp`;
}

export function centerFrameUrl(manifest: AboutFramesManifest): string {
	return `/about/frames/${manifest.centerFile}`;
}

export function listFrameUrls(manifest: AboutFramesManifest): string[] {
	if (manifest.frameFiles?.length) {
		return manifest.frameFiles.map((file) => `/about/frames/${file}`);
	}
	return Array.from({ length: manifest.frameCount }, (_, i) => frameUrl(manifest, i));
}
