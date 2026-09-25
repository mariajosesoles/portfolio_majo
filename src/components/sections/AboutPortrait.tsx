import { useCallback, useEffect, useRef, useState } from "react";
import {
	type AboutFramesManifest,
	centerFrameUrl,
	fetchAboutFramesManifest,
	frameUrl,
} from "../../lib/about-frames-manifest";
import { angleToFrameIndex, lerpAngle } from "../../lib/lerp-angle";

type AboutPortraitProps = {
	alt: string;
};

const DEFAULT_TRACK_LERP = 0.24;
const DEADZONE_RATIO = 0.12;
/** Face anchor within #about (not the portrait slot) — desktop: left column; mobile: centered. */
const SECTION_FACE_X_WIDE = 0.26;
const SECTION_FACE_Y_WIDE = 0.56;
const SECTION_FACE_X_NARROW = 0.5;
const SECTION_FACE_Y_NARROW = 0.46;
const ABOUT_SECTION_ID = "about";
const STATIC_PORTRAIT = "/about/portrait-3d.png";

function getAboutSection(): HTMLElement | null {
	return document.getElementById(ABOUT_SECTION_ID);
}

function getFaceAnchor(sectionRect: DOMRect): { x: number; y: number; deadzone: number } {
	const wide = sectionRect.width >= 768;
	const faceXRatio = wide ? SECTION_FACE_X_WIDE : SECTION_FACE_X_NARROW;
	const faceYRatio = wide ? SECTION_FACE_Y_WIDE : SECTION_FACE_Y_NARROW;
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

export function AboutPortrait({ alt }: AboutPortraitProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [manifest, setManifest] = useState<AboutFramesManifest | null>(null);
	const [frames, setFrames] = useState<HTMLImageElement[] | null>(null);
	const [centerFrame, setCenterFrame] = useState<HTMLImageElement | null>(null);
	const [ready, setReady] = useState(false);
	const [useStatic, setUseStatic] = useState(false);
	const [staticSrc, setStaticSrc] = useState(STATIC_PORTRAIT);

	const smoothedAngleRef = useRef(0);
	const targetAngleRef = useRef(0);
	const frameIndexRef = useRef(0);
	const pointerActiveRef = useRef(false);
	const rafRef = useRef<number>(0);
	const pointerRef = useRef({ x: 0, y: 0, active: false });
	const layoutRef = useRef({ w: 0, h: 0, dpr: 1 });

	const drawFrame = useCallback(
		(img: HTMLImageElement, bg: string) => {
			const canvas = canvasRef.current;
			const { w, h, dpr } = layoutRef.current;
			if (!canvas || w < 1 || h < 1) return;

			const ctx = canvas.getContext("2d");
			if (!ctx) return;

			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			ctx.fillStyle = bg;
			ctx.fillRect(0, 0, w, h);

			const scale = Math.min(w / img.naturalWidth, h / img.naturalHeight);
			const dw = img.naturalWidth * scale;
			const dh = img.naturalHeight * scale;
			const dx = 0;
			const dy = h - dh;
			ctx.drawImage(img, dx, dy, dw, dh);
		},
		[],
	);

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

			try {
				const urls = Array.from({ length: m.frameCount }, (_, i) => frameUrl(m, i));
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

		const tick = () => {
			const container = containerRef.current;
			if (!container) {
				rafRef.current = requestAnimationFrame(tick);
				return;
			}

			const section = getAboutSection();
			const anchorRect =
				section?.getBoundingClientRect() ?? container.getBoundingClientRect();
			const { x: faceX, y: faceY, deadzone } = getFaceAnchor(anchorRect);
			const { x, y, active } = pointerRef.current;

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
					const idx = angleToFrameIndex(
						smoothedAngleRef.current,
						frames.length,
						angleOffset,
					);
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
	}, [ready, frames, centerFrame, manifest, drawFrame]);

	useEffect(() => {
		if (!ready) return;

		const section = getAboutSection();
		if (!section) return;

		const setPointer = (e: PointerEvent, active: boolean) => {
			pointerRef.current = {
				x: e.clientX,
				y: e.clientY,
				active,
			};
		};

		const onEnter = (e: PointerEvent) => setPointer(e, true);
		const onMove = (e: PointerEvent) => setPointer(e, true);
		const onLeave = () => {
			pointerRef.current.active = false;
		};

		section.addEventListener("pointerenter", onEnter, { passive: true });
		section.addEventListener("pointermove", onMove, { passive: true });
		section.addEventListener("pointerleave", onLeave);
		return () => {
			section.removeEventListener("pointerenter", onEnter);
			section.removeEventListener("pointermove", onMove);
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
					className="about-portrait relative z-[1] max-h-full w-auto max-w-full object-contain object-left-bottom drop-shadow-[0_20px_48px_rgb(0_0_0_/_0.45)]"
					loading="lazy"
					decoding="async"
				/>
			</div>
		);
	}

	const slotBg = manifest?.background ?? "#0a0614";

	return (
		<div
			ref={containerRef}
			className="about-portrait-stage about-portrait-stage--tracking relative h-full w-full"
			style={{ backgroundColor: slotBg }}
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
