import { useEffect } from "react";

const MAX_PARTICLES = 40;
const TRAIL_COLORS = ["#C0C0D8", "#FF4FD8", "#E020A0", "#8B2BE8", "#FFFFFF", "#5EC8FF"];

type Particle = {
	x: number;
	y: number;
	vx: number;
	vy: number;
	life: number;
	maxLife: number;
	size: number;
	rotation: number;
	color: string;
	kind: "star" | "dot";
};

function spawnParticle(x: number, y: number, particles: Particle[]) {
	if (particles.length >= MAX_PARTICLES) particles.shift();
	particles.push({
		x: x + (Math.random() - 0.5) * 6,
		y: y + (Math.random() - 0.5) * 6,
		vx: (Math.random() - 0.5) * 0.6,
		vy: -0.4 - Math.random() * 0.8,
		life: 1,
		maxLife: 0.7 + Math.random() * 0.6,
		size: 2 + Math.random() * 3,
		rotation: Math.random() * Math.PI,
		color: TRAIL_COLORS[Math.floor(Math.random() * TRAIL_COLORS.length)],
		kind: Math.random() > 0.35 ? "star" : "dot",
	});
}

function drawStar(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	r: number,
	rotation: number,
) {
	const inner = r * 0.42;
	ctx.beginPath();
	for (let i = 0; i < 10; i++) {
		const angle = rotation + (i * Math.PI) / 5;
		const radius = i % 2 === 0 ? r : inner;
		const px = x + Math.cos(angle - Math.PI / 2) * radius;
		const py = y + Math.sin(angle - Math.PI / 2) * radius;
		if (i === 0) ctx.moveTo(px, py);
		else ctx.lineTo(px, py);
	}
	ctx.closePath();
	ctx.fill();
}

export function StarCursor() {
	useEffect(() => {
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			return;
		}
		if (!window.matchMedia("(pointer: fine)").matches) {
			return;
		}

		const canvas = document.createElement("canvas");
		canvas.setAttribute("aria-hidden", "true");
		canvas.style.cssText =
			"position:fixed;inset:0;pointer-events:none;z-index:30;width:100%;height:100%;";
		document.body.appendChild(canvas);

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const particles: Particle[] = [];
		let mx = -100;
		let my = -100;
		let lastX = mx;
		let lastY = my;
		let lastSpawn = 0;
		let lastMove = performance.now();
		let raf = 0;
		let running = true;

		const resize = () => {
			const dpr = Math.min(window.devicePixelRatio || 1, 2);
			canvas.width = window.innerWidth * dpr;
			canvas.height = window.innerHeight * dpr;
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		};
		resize();
		window.addEventListener("resize", resize);

		const onMove = (e: PointerEvent) => {
			mx = e.clientX;
			my = e.clientY;
			lastMove = performance.now();
			const dist = Math.hypot(mx - lastX, my - lastY);
			const now = performance.now();
			if (dist > 4 && now - lastSpawn > 16) {
				spawnParticle(mx, my, particles);
				lastSpawn = now;
				lastX = mx;
				lastY = my;
			}
		};
		window.addEventListener("pointermove", onMove, { passive: true });

		const onVisibility = () => {
			running = document.visibilityState === "visible";
			if (running) raf = requestAnimationFrame(frame);
		};
		document.addEventListener("visibilitychange", onVisibility);

		const frame = () => {
			if (!running) return;
			ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

			if (performance.now() - lastMove < 500 && mx >= 0) {
				ctx.save();
				ctx.globalCompositeOperation = "lighter";
				ctx.fillStyle = "#C0C0D8";
				ctx.shadowColor = "rgba(255, 79, 216, 0.45)";
				ctx.shadowBlur = 8;
				drawStar(ctx, mx, my, 7, performance.now() * 0.002);
				ctx.restore();
			}

			for (let i = particles.length - 1; i >= 0; i--) {
				const p = particles[i];
				p.life -= 0.016 / p.maxLife;
				if (p.life <= 0) {
					particles.splice(i, 1);
					continue;
				}
				p.x += p.vx;
				p.y += p.vy;
				p.rotation += 0.04;
				const alpha = p.life * 0.85;
				ctx.save();
				ctx.globalAlpha = alpha;
				ctx.fillStyle = p.color;
				if (p.kind === "star") {
					drawStar(ctx, p.x, p.y, p.size, p.rotation);
				} else {
					ctx.beginPath();
					ctx.arc(p.x, p.y, p.size * 0.45, 0, Math.PI * 2);
					ctx.fill();
				}
				ctx.restore();
			}

			raf = requestAnimationFrame(frame);
		};
		raf = requestAnimationFrame(frame);

		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener("resize", resize);
			window.removeEventListener("pointermove", onMove);
			document.removeEventListener("visibilitychange", onVisibility);
			canvas.remove();
		};
	}, []);

	return null;
}
