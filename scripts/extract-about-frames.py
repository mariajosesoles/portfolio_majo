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
COMPASS_LABELS = ("E", "SE", "S", "SW", "W", "NW", "N", "NE")


def dominant_bg_hex(frame) -> str:
	"""Sample empty background (character is composed on the left)."""
	h, w = frame.shape[:2]
	points = []
	for x_ratio in (0.72, 0.82, 0.92):
		for y_ratio in (0.2, 0.45, 0.7):
			points.append((int(w * x_ratio), int(h * y_ratio)))
	# fallback corners
	points.extend([(w - 5, 4), (w - 5, h - 5), (4, h - 5)])

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

	for old in OUT_DIR.glob(f"{PREFIX}-*.webp"):
		old.unlink()
	center_path = OUT_DIR / CENTER_NAME

	bg_hex = "#0a0614"
	compass_frames: dict[str, int] = {}

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

	for i, label in enumerate(COMPASS_LABELS):
		idx = int(round(i * (total - 1) / len(COMPASS_LABELS))) % total
		compass_frames[label] = idx

	# Neutral forward gaze — last frame of clip (tutorial default)
	center_video_index = total - 1
	cap.set(cv2.CAP_PROP_POS_FRAMES, center_video_index)
	ok, center = cap.read()
	if ok:
		cv2.imwrite(str(center_path), center, [int(cv2.IMWRITE_WEBP_QUALITY), 92])

	cap.release()

	suggested_projection = []
	for i in range(FRAME_COUNT):
		deg = int(round((i / FRAME_COUNT) * 360)) % 360
		suggested_projection.append(f"azim_{deg:03d}_{i:03d}.webp")

	manifest = {
		"frameCount": FRAME_COUNT,
		"background": bg_hex,
		"framePrefix": PREFIX,
		"centerFile": CENTER_NAME,
		"sourceVideo": "character.mp4",
		"totalVideoFrames": total,
		"centerVideoFrameIndex": center_video_index,
		"compassVideoFrameIndices": compass_frames,
		"angleOffsetRadians": 0,
		"faceCenterX": 0.38,
		"faceCenterY": 0.42,
		"chromaTolerance": 34,
		"trackingAnchorSection": {
			"xWide": 0.2,
			"yWide": 0.58,
			"xNarrow": 0.5,
			"yNarrow": 0.46,
		},
		"suggestedProjectionNames": suggested_projection,
	}
	(OUT_DIR / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
	print(f"Wrote {FRAME_COUNT} frames + center to {OUT_DIR}")
	print(f"Background (detected): {bg_hex}")
	return 0


if __name__ == "__main__":
	raise SystemExit(main())
