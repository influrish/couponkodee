/**
 * Single source of truth for database connection settings.
 *
 * Locally the app talks to a MongoDB on localhost (see `pnpm db:local`).
 * On Cloudflare Workers a loopback URI can never connect, so it is treated
 * as "not configured" there to show the setup screen instead of timing out.
 */

const PLACEHOLDER_MARKERS = ["<username>", "<password>", "<user>", "cluster0.xxx", "..."]
const LOOPBACK_MARKERS = ["127.0.0.1", "localhost", "0.0.0.0"]

export function getDatabaseUri(): string {
  return (process.env.MONGODB_URI || process.env.DATABASE_URI || "").trim()
}

export function isCloudflareRuntime(): boolean {
  return typeof navigator !== "undefined" && navigator.userAgent === "Cloudflare-Workers"
}

export function isDatabaseConfigured(uri: string = getDatabaseUri()): boolean {
  if (!/^mongodb(\+srv)?:\/\//.test(uri)) return false
  if (PLACEHOLDER_MARKERS.some((marker) => uri.includes(marker))) return false
  if (isCloudflareRuntime() && LOOPBACK_MARKERS.some((marker) => uri.includes(marker))) return false
  return true
}
