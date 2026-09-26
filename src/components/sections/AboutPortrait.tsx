import { useCallback, useEffect, useRef, useState } from "react";
import {
	type AboutFramesManifest,
	type AboutTrackingAnchor,
	centerFrameUrl,
	DEFAULT_TRACKING_ANCHOR,
	fetchAboutFramesManifest,
	listFrameUrls,
} from "../../lib/about-frames-manifest";
import { applyChromaKey, hexToRgb } from "../../lib/chroma-key-canvas";
import { angleToFrameIndex, lerpAngle } from "../../lib/lerp-angle";

type AboutPortraitProps = {
	alt: string;
};

const DEFAULT_TRACK_LERP = 0.24;
const DEADZONE_RATIO = 0.12;
const ABOUT_SECTION_ID = "about";
const STATIC_PORTRAIT = "/about/portrait-3d.png";

function getAboutSection(): HTMLElement | null {
	return document.getElementById(ABOUT_SECTION_ID);
}

function resolveAnchor(manifest: AboutFramesManifest | null): AboutTrackingAnchor {
	return manifest?.trackingAnchorSection ?? DEFAULT_TRACKING_ANCHOR;
}

function getFaceAnchor(
	sectionRect: DOMRect,
	anchor: AboutTrackingAnchor,
): { x: number; y: number; deadzone: number } {
	const wide = sectionRect.width >= 768;
	const faceXRatio = wide ? anchor.xWide : anchor.xNarrow;
	const faceYRatio = wide ? anchor.yWide : anchor.yNarrow;
	return {
		x: sectionRect.left + sectionRect.width * faceXRatio,
		y: sectionRect.top + sectionRect.height * faceYRatio,
		deadzone: Math.min(sectionRect.width, sectionRect.height) * DEADZONE_RATIO,
	};
}

function loadImage(src: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = () => reject(new Error(`Failed to load ${src}`));
		img.src = src;
	});
}

function pointerInsideSection(clientX: number, clientY: number, section: HTMLElement): boolean {
	const r = section.getBoundingClientRect();
	return clientX >= r.left && clientX <= r.right && clientY >= r.top && clientY <= r.bottom;
}

export function AboutPortrait({ alt }: AboutPortraitProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const anchorMarkerRef = useRef<HTMLDivElement>(null);
	const [manifest, setManifest] = useState<AboutFramesManifest | null>(null);
	const [frames, setFrames] = useState<HTMLImageElement[] | null>(null);
	const [centerFrame, setCenterFrame] = useState<HTMLImageElement | null>(null);
	const [ready, setReady] = useState(false);
	const [useStatic, setUseStatic] = useState(false);
	const [staticSrc, setStaticSrc] = useState(STATIC_PORTRAIT);
	const [showAnchorDebug, setShowAnchorDebug] = useState(false);

	const smoothedAngleRef = useRef(0);
	const targetAngleRef = useRef(0);
	const frameIndexRef = useRef(0);
	const pointerActiveRef = useRef(false);
	const rafRef = useRef<number>(0);
	const pointerRef = useRef({ x: 0, y: 0, active: false });
	const layoutRef = useRef({ w: 0, h: 0, dpr: 1 });
	const manifestRef = useRef<AboutFramesManifest | null>(null);

	const drawFrame = useCallback((img: HTMLImageElement, bgHex: string) => {
		const canvas = canvasRef.current;
		const { w, h, dpr } = layoutRef.current;
		if (!canvas || w < 1 || h < 1) return;

		const ctx = canvas.getContext("2d", { willReadFrequently: true });
		if (!ctx) return;

		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		ctx.clearRect(0, 0, w, h);

		const scale = Math.min(w / img.naturalWidth, h / img.naturalHeight) * 1.08;
		const dw = img.naturalWidth * scale;
		const dh = img.naturalHeight * scale;
		const dx = 0;
		const dy = h - dh;
		ctx.drawImage(img, dx, dy, dw, dh);

		const key = hexToRgb(bgHex);
		const tolerance = manifestRef.current?.chromaTolerance ?? 32;
		if (key) {
			applyChromaKey(ctx, w, h, key, tolerance);
		}
	}, []);

	const syncCanvasSize = useCallback(() => {
		const container = containerRef.current;
		const canvas = canvasRef.current;
		if (!container || !canvas) return;

		const w = container.clientWidth;
		const h = container.clientHeight;
		const dpr = Math.min(window.devicePixelRatio || 1, 2);
		layoutRef.current = { w, h, dpr };

		if (w < 1 || h < 1) return;
		canvas.width = Math.floor(w * dpr);
		canvas.height = Math.floor(h * dpr);
		canvas.style.width = `${w}px`;
		canvas.style.height = `${h}px`;
	}, []);

	useEffect(() => {
		if (import.meta.env.DEV) {
			setShowAnchorDebug(new URLSearchParams(window.location.search).has("about-anchor"));
		}
	}, []);

	useEffect(() => {
		let cancelled = false;

		(async () => {
			const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
			const mEarly = await fetchAboutFramesManifest();
			if (reduced) {
				if (mEarly) {
					try {
						await loadImage(centerFrameUrl(mEarly));
						setStaticSrc(centerFrameUrl(mEarly));
					} catch {
						/* portrait-3d fallback */
					}
				}
				setUseStatic(true);
				return;
			}

			const m = mEarly ?? (await fetchAboutFramesManifest());
			if (cancelled || !m) {
				setUseStatic(true);
				return;
			}

			manifestRef.current = m;

			try {
				const urls = listFrameUrls(m);
				const loaded = await Promise.all(urls.map(loadImage));
				const center = await loadImage(centerFrameUrl(m));
				if (cancelled) return;
				setManifest(m);
				setFrames(loaded);
				setCenterFrame(center);
				setReady(true);
			} catch {
				setUseStatic(true);
			}
		})();

		return () => {
			cancelled = true;
		};
	}, []);

	useEffect(() => {
		if (!ready) return;
		syncCanvasSize();
		const container = containerRef.current;
		if (!container) return;

		const ro = new ResizeObserver(() => syncCanvasSize());
		ro.observe(container);
		return () => ro.disconnect();
	}, [ready, syncCanvasSize]);

	useEffect(() => {
		if (!ready || !frames || !centerFrame || !manifest) return;

		const bg = manifest.background ?? "#0a0614";
		const angleOffset = manifest.angleOffsetRadians ?? 0;
		const trackLerp = DEFAULT_TRACK_LERP;
		const frameCount = frames.length;

		const tick = () => {
			const section = getAboutSection();
			const anchorRect = section?.getBoundingClientRect();
			if (!section || !anchorRect) {
				rafRef.current = requestAnimationFrame(tick);
				return;
			}

			const anchor = resolveAnchor(manifestRef.current);
			const { x: faceX, y: faceY, deadzone } = getFaceAnchor(anchorRect, anchor);
			const { x, y, active } = pointerRef.current;

			if (showAnchorDebug && anchorMarkerRef.current) {
				const dot = anchorMarkerRef.current;
				dot.style.position = "fixed";
				dot.style.left = `${faceX}px`;
				dot.style.top = `${faceY}px`;
			}

			let img = frames[frameIndexRef.current] ?? frames[0];

			if (active) {
				const dx = x - faceX;
				const dy = y - faceY;
				const dist = Math.hypot(dx, dy);

				if (dist < deadzone) {
					img = centerFrame;
				} else {
					const target = Math.atan2(dy, dx);
					if (!pointerActiveRef.current) {
						smoothedAngleRef.current = target;
					}
					targetAngleRef.current = target;
					smoothedAngleRef.current = lerpAngle(
						smoothedAngleRef.current,
						targetAngleRef.current,
						trackLerp,
					);
					const idx = angleToFrameIndex(smoothedAngleRef.current, frameCount, angleOffset);
					frameIndexRef.current = idx;
					img = frames[idx] ?? frames[0];
				}
			} else {
				img = centerFrame;
			}

			pointerActiveRef.current = active;
			drawFrame(img, bg);
			rafRef.current = requestAnimationFrame(tick);
		};

		rafRef.current = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(rafRef.current);
	}, [ready, frames, centerFrame, manifest, drawFrame, showAnchorDebug]);

	useEffect(() => {
		if (!ready) return;

		const section = getAboutSection();
		if (!section) return;

		const onPointerMove = (e: PointerEvent) => {
			const inside = pointerInsideSection(e.clientX, e.clientY, section);
			pointerRef.current = {
				x: e.clientX,
				y: e.clientY,
				active: inside,
			};
		};

		const onLeave = () => {
			pointerRef.current.active = false;
		};

		window.addEventListener("pointermove", onPointerMove, { passive: true });
		section.addEventListener("pointerleave", onLeave);
		return () => {
			window.removeEventListener("pointermove", onPointerMove);
			section.removeEventListener("pointerleave", onLeave);
		};
	}, [ready]);

	if (useStatic) {
		return (
			<div className="about-portrait-stage relative flex h-full w-full items-end justify-start">
				<div
					className="about-portrait-glow pointer-events-none absolute inset-[8%] rounded-full bg-[radial-gradient(circle,rgb(255_0_138_/_0.18)_0%,transparent_68%)]"
					aria-hidden="true"
				/>
				<img
					src={staticSrc}
					alt={alt}
					width={1024}
					height={1024}
					className="about-portrait relative z-[1] max-h-full w-auto max-w-[115%] object-contain object-left-bottom drop-shadow-[0_20px_48px_rgb(0_0_0_/_0.45)]"
					loading="lazy"
					decoding="async"
				/>
			</div>
		);
	}

	return (
		<div
			ref={containerRef}
			className="about-portrait-stage about-portrait-stage--tracking relative h-full w-full"
		>
			<div
				className="about-portrait-glow pointer-events-none absolute inset-[8%] rounded-full bg-[radial-gradient(circle,rgb(255_0_138_/_0.18)_0%,transparent_68%)]"
				aria-hidden="true"
			/>
			<canvas
				ref={canvasRef}
				className="relative z-[1] h-full w-full touch-none"
				aria-label={alt}
				role="img"
			/>
			{showAnchorDebug ? (
				<div
					ref={anchorMarkerRef}
					className="about-tracking-anchor-debug pointer-events-none absolute z-20 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-brand-magenta bg-brand-magenta/40 shadow-[0_0_12px_#ff008a]"
					aria-hidden="true"
					title="Tracking anchor (section coords)"
				/>
			) : null}
			{!ready ? (
				<img
					src={STATIC_PORTRAIT}
					alt=""
					aria-hidden="true"
					className="pointer-events-none absolute inset-0 z-0 m-auto max-h-full max-w-full object-contain object-left-bottom opacity-40"
				/>
			) : null}
		</div>
	);
}
