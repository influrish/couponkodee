import { NextResponse, type NextRequest } from "next/server"
import {
  DEFAULT_REGION,
  REGION_COOKIE,
  countryCodeToRegion,
  isRegionSlug,
  regionFromIsoCountry,
  regionToCountryCode,
  splitRegion,
} from "@/lib/regions"

const ONE_YEAR = 60 * 60 * 24 * 365

/**
 * /in/stores  -> serves /stores with region "in" (URL stays /in/stores)
 * /stores     -> 307 to /<preferred region>/stores
 * Preferred region: saved cookie, then the visitor's country (Cloudflare), then India.
 */
export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl
  const { region, path } = splitRegion(pathname)

  if (region) {
    const url = req.nextUrl.clone()
    url.pathname = path

    const headers = new Headers(req.headers)
    headers.set("x-region", region)
    headers.set("x-pathname", path)

    const res = NextResponse.rewrite(url, { request: { headers } })
    const countryCode = regionToCountryCode(region)
    if (req.cookies.get(REGION_COOKIE)?.value !== countryCode) {
      res.cookies.set(REGION_COOKIE, countryCode, { path: "/", maxAge: ONE_YEAR, sameSite: "lax" })
    }
    return res
  }

  const saved = req.cookies.get(REGION_COOKIE)?.value
  const preferred =
    (saved && isRegionSlug(saved) ? countryCodeToRegion(saved) : null) ??
    regionFromIsoCountry(req.headers.get("cf-ipcountry")) ??
    DEFAULT_REGION

  const url = req.nextUrl.clone()
  url.pathname = `/${preferred}${pathname === "/" ? "" : pathname}`
  url.search = search
  return NextResponse.redirect(url, 307)
}

export const config = {
  // Everything except the CMS, APIs, the /out tracker, media, Next internals and static files
  matcher: ["/((?!api|admin|out|media|_next|.*\\..*).*)"],
}
