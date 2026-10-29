#!/bin/sh
# Render start: copy committed images onto the media disk if missing (never
# overwriting uploads), then start Next.js on the port Render provides.
set -eu

mkdir -p media
if [ -d .media-seed ]; then
  for file in .media-seed/*; do
    [ -e "$file" ] || continue
    [ -e "media/${file##*/}" ] || cp -R "$file" media/
  done
else
  echo "No .media-seed folder; skipping media seeding (check the Build Command runs scripts/render/build.sh)."
fi

exec npm run start
