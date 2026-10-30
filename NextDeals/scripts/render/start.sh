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

# One-off admin password reset for hosts without a shell: set SEED_ADMIN_EMAIL
# and SEED_ADMIN_PASSWORD, deploy once, then delete both variables.
if [ -n "${SEED_ADMIN_EMAIL:-}" ] && [ -n "${SEED_ADMIN_PASSWORD:-}" ]; then
  echo "SEED_ADMIN_EMAIL is set: resetting the password for ${SEED_ADMIN_EMAIL}. Delete SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD afterwards."
  npm run admin:reset-password || echo "Admin password reset failed (see error above); starting the server anyway."
fi

exec npm run start
