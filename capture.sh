#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
/usr/bin/time -p echo "capture: $CAPTURE_URL -> $CAPTURE_DIR"
/usr/bin/time -p bash -c 'test -n "${CAPTURE_URL:-}" || { echo "CAPTURE_URL is required" >&2; exit 1; }'
/usr/bin/time -p bash -c 'test -n "${CAPTURE_DIR:-}" || { echo "CAPTURE_DIR is required" >&2; exit 1; }'
/usr/bin/time -p mkdir -p "$CAPTURE_DIR"
/usr/bin/time -p node "$PWD/capture-helper.mjs"
/usr/bin/time -p test -f "$CAPTURE_DIR/final-desktop.png"
/usr/bin/time -p test -f "$CAPTURE_DIR/final-mobile.png"
/usr/bin/time -p test -s "$CAPTURE_DIR/final-desktop.png"
/usr/bin/time -p test -s "$CAPTURE_DIR/final-mobile.png"
/usr/bin/time -p ls -lh "$CAPTURE_DIR"
