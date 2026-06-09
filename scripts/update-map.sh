#!/usr/bin/env bash
# Usage: npm run update-map -- /path/to/new-map.svg
#
# Illustrator export settings (File → Export → Export As → SVG):
#   CSS Properties:  Presentation Attributes
#   Images:          Embed
#   Object IDs:      Minimal
#   Decimal Places:  2
#   Minify:          Yes
#   Responsive:      No  (viewBox must be preserved)
#
# Bounds in app/pages/index.vue only need updating if the artboard size changed.

set -euo pipefail

SRC="${1:-}"
if [[ -z "$SRC" ]]; then
  echo "Usage: $0 path/to/new-map.svg" >&2
  exit 1
fi

if [[ ! -f "$SRC" ]]; then
  echo "Error: file not found: $SRC" >&2
  exit 1
fi

# Run from project root
cd "$(dirname "$0")/.."

DATE=$(date +%Y%m%d)
NEW="pt${DATE}_en.svg"

# Find the currently referenced filename
OLD=$(grep -o 'pt[0-9]\{8\}_en\.svg' app/pages/index.vue | head -1)
if [[ -z "$OLD" ]]; then
  echo "Error: could not detect current SVG filename in app/pages/index.vue" >&2
  exit 1
fi

if [[ "$OLD" == "$NEW" ]]; then
  echo "Warning: new filename matches today's date ($NEW). Overwriting." >&2
fi

echo "Optimizing SVG…"
npx svgo "$SRC" -o "public/$NEW"

echo "Updating references: $OLD → $NEW"
sed -i "s/$OLD/$NEW/g" app/pages/index.vue
sed -i "s/$OLD/$NEW/g" nuxt.config.ts

if [[ "$OLD" != "$NEW" && -f "public/$OLD" ]]; then
  echo "Removing old file: public/$OLD"
  rm "public/$OLD"
fi

echo ""
echo "Done. public/$NEW is installed."
echo "If the Illustrator artboard size changed, verify bounds in app/pages/index.vue."
