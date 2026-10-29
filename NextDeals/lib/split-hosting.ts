/**
 * Routing between the two deployments (see DEPLOY.md), decided per request
 * from runtime environment variables so no build-time setting is needed:
 *
 * - Storefront on Cloudflare (CMS_URL set): /admin redirects to the CMS
 *   server; /api/* and /media/* are proxied to it, because logins, forms and
 *   uploads need the database, which only the CMS server has.
 * - CMS server on Render (STOREFRONT_URL set): storefront pages redirect to
 *   the public site so they aren't served (and indexed) twice.
 */

export type SplitRoute = { action: "redirect" | "proxy"; url: string } | { action: "none" }

const NONE: SplitRoute = { action: "none" }

function readOrigin(value: string | undefined): string | null {
  const url = (value || "").trim().replace(/\/+$/, "")
  return /^https?:\/\//.test(url) ? url : null
}

function isAdminPath(pathname: string): boolean {
  return pathname === "/admin" || pathname.startsWith("/admin/")
}

function isProxiedToCms(pathname: string): boolean {
  return pathname.startsWith("/api/") || pathname.startsWith("/media/")
}

/** Storefront pages: everything except the CMS, APIs, tracker, media, Next internals and static files. */
export function isStorefrontPath(pathname: string): boolean {
  if (isAdminPath(pathname) || isProxiedToCms(pathname)) return false
  if (pathname === "/api" || pathname === "/out" || pathname.startsWith("/_next/")) return false
  return !/\.[^/]+$/.test(pathname)
}

export function resolveSplitRoute(
  pathname: string,
  search: string,
  // Read by name: edge runtimes don't always expose process.env as a whole object.
  env: { CMS_URL?: string; STOREFRONT_URL?: string } = {
    CMS_URL: process.env.CMS_URL,
    STOREFRONT_URL: process.env.STOREFRONT_URL,
  },
): SplitRoute {
  const cmsUrl = readOrigin(env.CMS_URL)
  if (cmsUrl) {
    if (isAdminPath(pathname)) return { action: "redirect", url: `${cmsUrl}${pathname}${search}` }
    if (isProxiedToCms(pathname)) return { action: "proxy", url: `${cmsUrl}${pathname}${search}` }
    return NONE
  }

  const storefrontUrl = readOrigin(env.STOREFRONT_URL)
  if (storefrontUrl && isStorefrontPath(pathname)) {
    return { action: "redirect", url: `${storefrontUrl}${pathname === "/" ? "" : pathname}${search}` }
  }
  return NONE
}
