/** Shortest-path interpolation between two angles (radians). */
export function lerpAngle(from: number, to: number, t: number): number {
	const delta = Math.atan2(Math.sin(to - from), Math.cos(to - from));
	return from + delta * t;
}

/** Map angle (radians, atan2) to frame index 0..frameCount-1 (clockwise from right). */
export function angleToFrameIndex(angle: number, frameCount: number, offsetRadians = 0): number {
	const normalized = (angle + offsetRadians + Math.PI * 2) % (Math.PI * 2);
	const index = Math.round((normalized / (Math.PI * 2)) * frameCount) % frameCount;
	return index;
}
