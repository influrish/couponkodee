#!/bin/sh
# Render build: install, build, and keep a copy of the committed media/ images.
# At runtime the persistent disk is mounted over media/ and hides them.
set -eu

npx -y pnpm@10 install --frozen-lockfile
npx -y pnpm@10 build

rm -rf .media-seed
cp -R media .media-seed
