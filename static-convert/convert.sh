#!/usr/bin/env bash
# WordPress to Static Site Launcher
# Usage:
#   ./convert.sh                     (Full site conversion, media stays on nq-international.com)
#   ./convert.sh --limit 10          (Quick test run on 10 pages)
#   ./convert.sh --media-domain https://media.nq-international.com

SITE_URL="https://nq-international.com"
OUTPUT_DIR="./dist"

echo "=========================================================="
echo " 🌐 Converting WordPress ($SITE_URL) to Static Site"
echo " 📦 Media (MP3, JPG, PPT) stays hosted on origin server"
echo " 🚀 Ready for deployment to Cloudflare Pages"
echo "=========================================================="

python3 "$(dirname "$0")/wp_static_cli.py" \
  --url "$SITE_URL" \
  --output "$OUTPUT_DIR" \
  "$@"
