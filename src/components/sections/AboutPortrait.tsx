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

const TRACK_LERP = 0.26;
const DEADZONE_RATIO = 0.12;
/** Face anchor when character is composed on the left (matches Flow prompt). */
const FACE_CENTER_X_RATIO = 0.38;
const FACE_CENTER_Y_RATIO = 0.42;
const STATIC_PORTRAIT = "/about/portrait-3d.png";

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
	const rafRef = useRef<number>(0);
	const pointerRef = useRef({ x: 0, y: 0, active: false });

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

	const drawFrame = useCallback(
		(img: HTMLImageElement) => {
			const canvas = canvasRef.current;
			const container = containerRef.current;
			if (!canvas || !container) return;

			const dpr = Math.min(window.devicePixelRatio || 1, 2);
			const w = container.clientWidth;
			const h = container.clientHeight;
			if (w < 1 || h < 1) return;

			canvas.width = Math.floor(w * dpr);
			canvas.height = Math.floor(h * dpr);
			canvas.style.width = `${w}px`;
			canvas.style.height = `${h}px`;

			const ctx = canvas.getContext("2d");
			if (!ctx) return;

			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			const bg = manifest?.background ?? "#0a0614";
			ctx.fillStyle = bg;
			ctx.fillRect(0, 0, w, h);

			const scale = Math.min(w / img.naturalWidth, h / img.naturalHeight);
			const dw = img.naturalWidth * scale;
			const dh = img.naturalHeight * scale;
			const dx = (w - dw) / 2;
			const dy = (h - dh) / 2;
			ctx.drawImage(img, dx, dy, dw, dh);
		},
		[manifest?.background],
	);

	useEffect(() => {
		if (!ready || !frames || !centerFrame) return;

		const tick = () => {
			const container = containerRef.current;
			if (!container) {
				rafRef.current = requestAnimationFrame(tick);
				return;
			}

			const rect = container.getBoundingClientRect();
			const faceX = rect.left + rect.width * 0.5;
			const faceY = rect.top + rect.height * 0.42;
			const { x, y, active } = pointerRef.current;

			let img = frames[frameIndexRef.current] ?? frames[0];

			if (active) {
				const dx = x - faceX;
				const dy = y - faceY;
				const dist = Math.hypot(dx, dy);
				const deadzone = Math.min(rect.width, rect.height) * DEADZONE_RATIO;

				if (dist < deadzone) {
					img = centerFrame;
				} else {
					targetAngleRef.current = Math.atan2(dy, dx);
					smoothedAngleRef.current = lerpAngle(
						smoothedAngleRef.current,
						targetAngleRef.current,
						TRACK_LERP,
					);
					const idx = angleToFrameIndex(smoothedAngleRef.current, frames.length);
					frameIndexRef.current = idx;
					img = frames[idx] ?? frames[0];
				}
			} else {
				img = centerFrame;
			}

			drawFrame(img);
			rafRef.current = requestAnimationFrame(tick);
		};

		rafRef.current = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(rafRef.current);
	}, [ready, frames, centerFrame, drawFrame]);

	useEffect(() => {
		if (!ready) return;

		const getTrackRegion = (): HTMLElement | null =>
			containerRef.current?.closest("#about") ?? containerRef.current;

		const pointerInsideRegion = (e: PointerEvent): boolean => {
			const region = getTrackRegion();
			if (!region) return false;
			const rect = region.getBoundingClientRect();
			return (
				e.clientX >= rect.left &&
				e.clientX <= rect.right &&
				e.clientY >= rect.top &&
				e.clientY <= rect.bottom
			);
		};

		const onMove = (e: PointerEvent) => {
			const inside = pointerInsideRegion(e);
			pointerRef.current = {
				x: e.clientX,
				y: e.clientY,
				active: inside,
			};
		};

		const onLeave = (e: PointerEvent) => {
			if (e.relatedTarget === null) {
				pointerRef.current.active = false;
			}
		};

		window.addEventListener("pointermove", onMove, { passive: true });
		document.addEventListener("pointerleave", onLeave);
		return () => {
			window.removeEventListener("pointermove", onMove);
			document.removeEventListener("pointerleave", onLeave);
		};
	}, [ready]);

	if (useStatic) {
		return (
			<div className="about-portrait-stage relative flex h-full w-full items-end justify-center">
				<div
					className="about-portrait-glow pointer-events-none absolute inset-[8%] rounded-full bg-[radial-gradient(circle,rgb(255_0_138_/_0.18)_0%,transparent_68%)]"
					aria-hidden="true"
				/>
				<img
					src={staticSrc}
					alt={alt}
					width={1024}
					height={1024}
					className="about-portrait relative z-[1] max-h-full w-auto max-w-full object-contain object-bottom drop-shadow-[0_20px_48px_rgb(0_0_0_/_0.45)]"
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
			style={{ backgroundColor: manifest?.background ?? "#0a0614" }}
		>
			<div
				className="about-portrait-glow pointer-events-none absolute inset-[8%] rounded-full bg-[radial-gradient(circle,rgb(255_0_138_/_0.18)_0%,transparent_68%)]"
				aria-hidden="true"
			/>
			<canvas
				ref={canvasRef}
				className="relative z-[1] h-full w-full"
				aria-label={alt}
				role="img"
			/>
			{!ready ? (
				<img
					src={STATIC_PORTRAIT}
					alt=""
					aria-hidden="true"
					className="pointer-events-none absolute inset-0 z-0 m-auto max-h-full max-w-full object-contain opacity-40"
				/>
			) : null}
		</div>
	);
}
