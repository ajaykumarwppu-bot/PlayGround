#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
/usr/bin/time -p echo "starting paper-cutout preview"
PROJECT_DIR="$PWD"
export PROJECT_DIR
PORT="${PORT:-3000}"
OPENCODE_WEB_DIR="${OPENCODE_WEB_DIR:-/home/runner/work/_temp/omgithub-web}"
export OPENCODE_WEB_DIR
DIST_DIR="$PROJECT_DIR/dist"
export DIST_DIR
OUT_VIDEO="$PROJECT_DIR/out/paper-cutout.mp4"
DOC_VIDEO="$PROJECT_DIR/out/kagaz-documentary.mp4"
DIST_VIDEO="$DIST_DIR/paper-cutout.mp4"
DIST_DOC="$DIST_DIR/kagaz-documentary.mp4"
/usr/bin/time -p mkdir -p "$DIST_DIR" "$OPENCODE_WEB_DIR" "$PROJECT_DIR/out"
/usr/bin/time -p test -f "$PROJECT_DIR/package.json"
if /usr/bin/time -p test ! -d "$PROJECT_DIR/node_modules"; then
  /usr/bin/time -p npm install --no-audit --no-fund
else
  /usr/bin/time -p echo "node_modules present, skipping install"
fi
if /usr/bin/time -p test ! -f "$OUT_VIDEO"; then
  /usr/bin/time -p npx remotion render PaperCutoutVideo "$OUT_VIDEO" --overwrite
else
  /usr/bin/time -p echo "video exists, skipping render"
fi
if /usr/bin/time -p test ! -f "$DOC_VIDEO"; then
  /usr/bin/time -p npx remotion render Documentary "$DOC_VIDEO" --overwrite
else
  /usr/bin/time -p echo "documentary exists, skipping render"
fi
/usr/bin/time -p cp -u "$OUT_VIDEO" "$DIST_VIDEO"
/usr/bin/time -p cp -u "$DOC_VIDEO" "$DIST_DOC"
/usr/bin/time -p cp "$PROJECT_DIR/preview-template.html" "$DIST_DIR/index.html"
/usr/bin/time -p test -f "$DIST_DIR/index.html"
/usr/bin/time -p test -f "$DIST_VIDEO"
/usr/bin/time -p test -f "$DIST_DOC"
/usr/bin/time -p ls -lh "$DIST_DIR"
/usr/bin/time -p python3 -c "import json,os; d={'project':os.environ['PROJECT_DIR'],'directory':os.environ['DIST_DIR']}; open(os.path.join(os.environ['OPENCODE_WEB_DIR'],'deployment-output.json'),'w').write(json.dumps(d)); print(json.dumps(d))"
/usr/bin/time -p cat "$OPENCODE_WEB_DIR/deployment-output.json"
/usr/bin/time -p echo "serving $DIST_DIR on port $PORT"
/usr/bin/time -p python3 -m http.server "$PORT" --directory "$DIST_DIR"
