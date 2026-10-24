/**
 * Region-prefixed URLs: every storefront page lives under /<region>/..., e.g.
 * /in/stores or /us/store/amazon. The region slug is the lower-cased country
 * code from lib/countries-data.ts, so adding a country there adds its URLs.
 * Kept dependency-free because middleware imports it.
 */
import { COUNTRIES, DEFAULT_COUNTRY } from "./countries-data"

export const REGION_COOKIE = "couponkodee_country"

export const REGION_SLUGS: readonly string[] = COUNTRIES.map((c) => c.code.toLowerCase())
export const DEFAULT_REGION = DEFAULT_COUNTRY.code.toLowerCase()
export const FALLBACK_REGION = "global"

/** Paths that are never region-prefixed: CMS, APIs, tracking redirect, media. */
const UNLOCALIZED_PREFIXES = ["/admin", "/api", "/out", "/media", "/_next"]

// ISO country codes that differ from our region codes
const ISO_TO_REGION: Record<string, string> = { gb: "uk" }

export function isRegionSlug(value: string | null | undefined): boolean {
  return Boolean(value) && REGION_SLUGS.includes(value!.toLowerCase())
}

export function regionToCountryCode(region: string): string {
  return region.toUpperCase()
}

export function countryCodeToRegion(code: string): string {
  const region = code.toLowerCase()
  return isRegionSlug(region) ? region : DEFAULT_REGION
}

/** Maps a visitor's ISO country (e.g. from Cloudflare's cf-ipcountry) to a region we serve. */
export function regionFromIsoCountry(iso: string | null | undefined): string | null {
  if (!iso) return null
  const lower = iso.toLowerCase()
  const region = ISO_TO_REGION[lower] ?? lower
  if (isRegionSlug(region)) return region
  return lower === "xx" || lower === "t1" ? null : FALLBACK_REGION
}

/** Splits "/us/store/amazon" into { region: "us", path: "/store/amazon" }. */
export function splitRegion(pathname: string): { region: string | null; path: string } {
  const [, first = "", ...rest] = pathname.split("/")
  if (isRegionSlug(first)) {
    return { region: first.toLowerCase(), path: `/${rest.join("/")}` }
  }
  return { region: null, path: pathname || "/" }
}

export function isLocalizablePath(path: string): boolean {
  if (!path.startsWith("/") || path.startsWith("//")) return false
  if (UNLOCALIZED_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`) || path.startsWith(`${p}?`))) {
    return false
  }
  // Static files such as /logos/amazon.svg
  const pathname = path.split(/[?#]/)[0]
  return !/\.[a-z0-9]+$/i.test(pathname)
}

/** Prefixes an internal storefront href with the region; leaves other hrefs untouched. */
export function localizeHref(href: string, region: string): string {
  if (!isLocalizablePath(href)) return href
  const { path } = splitRegion(href.split(/[?#]/)[0])
  const suffix = href.slice(href.split(/[?#]/)[0].length)
  return `/${region}${path === "/" ? "" : path}${suffix}`
}
