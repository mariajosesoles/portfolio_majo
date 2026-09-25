#!/usr/bin/env python3
"""Extract WebP frames from public/about/character.mp4 for cursor tracking."""

from __future__ import annotations

import json
import sys
from pathlib import Path

try:
	import cv2
except ImportError:
	print("Install: pip install opencv-python-headless", file=sys.stderr)
	sys.exit(1)

ROOT = Path(__file__).resolve().parents[1]
VIDEO = ROOT / "public" / "about" / "character.mp4"
OUT_DIR = ROOT / "public" / "about" / "frames"
FRAME_COUNT = 64
CENTER_NAME = "center.webp"
PREFIX = "frame"


def dominant_bg_hex(frame) -> str:
	"""Sample corners for flat background color."""
	h, w = frame.shape[:2]
	points = [
		(4, 4),
		(w - 5, 4),
		(4, h - 5),
		(w - 5, h - 5),
	]
	rs, gs, bs = [], [], []
	for x, y in points:
		b, g, r = frame[y, x]
		rs.append(int(r))
		gs.append(int(g))
		bs.append(int(b))
	r = sum(rs) // len(rs)
	g = sum(gs) // len(gs)
	b = sum(bs) // len(bs)
	return f"#{r:02x}{g:02x}{b:02x}"


def main() -> int:
	if not VIDEO.is_file():
		print(f"Missing video: {VIDEO}", file=sys.stderr)
		return 1

	OUT_DIR.mkdir(parents=True, exist_ok=True)

	cap = cv2.VideoCapture(str(VIDEO))
	if not cap.isOpened():
		print("Could not open video", file=sys.stderr)
		return 1

	total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT)) or 0
	if total < 2:
		print("Video has too few frames", file=sys.stderr)
		return 1

	print(f"Video frames: {total}")

	# Clear old numbered frames
	for old in OUT_DIR.glob(f"{PREFIX}-*.webp"):
		old.unlink()
	center_path = OUT_DIR / CENTER_NAME

	bg_hex = "#0a0614"
	for i in range(FRAME_COUNT):
		idx = int(round(i * (total - 1) / (FRAME_COUNT - 1)))
		cap.set(cv2.CAP_PROP_POS_FRAMES, idx)
		ok, frame = cap.read()
		if not ok:
			print(f"Failed to read frame {idx}", file=sys.stderr)
			return 1
		if i == 0:
			bg_hex = dominant_bg_hex(frame)
		out = OUT_DIR / f"{PREFIX}-{i:03d}.webp"
		cv2.imwrite(str(out), frame, [int(cv2.IMWRITE_WEBP_QUALITY), 92])

	# Center / neutral: last frame (tutorial: forward gaze at end)
	cap.set(cv2.CAP_PROP_POS_FRAMES, total - 1)
	ok, center = cap.read()
	if ok:
		cv2.imwrite(str(center_path), center, [int(cv2.IMWRITE_WEBP_QUALITY), 92])

	cap.release()

	manifest = {
		"frameCount": FRAME_COUNT,
		"background": bg_hex,
		"framePrefix": PREFIX,
		"centerFile": CENTER_NAME,
		"sourceVideo": "character.mp4",
		"totalVideoFrames": total,
	}
	(OUT_DIR / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
	print(f"Wrote {FRAME_COUNT} frames + center to {OUT_DIR}")
	print(f"Background (detected): {bg_hex}")
	return 0


if __name__ == "__main__":
	raise SystemExit(main())
