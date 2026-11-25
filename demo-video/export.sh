#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
# Stage the production marker stylesheet inside the renderer’s asset root.
mkdir -p "$tmp/scene"
cp -R assets ../lib/highlights.css "$tmp/scene/"
sed 's|../lib/highlights.css|highlights.css|' index.html > "$tmp/scene/index.html"
npx --yes hyperframes@0.8.77 render "$tmp/scene" --fps 60 --format png-sequence --output "$tmp/frames"
frames=()
i=0
for frame in "$tmp"/frames/*.png; do
  frames+=(-d $((17 - (i % 3 == 2))) "$frame")
  i=$((i+1))
done
test "$i" -eq 600
img2webp -loop 0 -lossless -m 3 "${frames[@]}" -o "$tmp/demo.webp"
mv "$tmp/demo.webp" ../docs/demo.webp
