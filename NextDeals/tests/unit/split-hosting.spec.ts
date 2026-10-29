import { describe, expect, it } from "vitest"
import { isStorefrontPath, resolveSplitRoute } from "@/lib/split-hosting"

const STOREFRONT = { CMS_URL: "https://couponkodee.onrender.com/" }
const CMS = { STOREFRONT_URL: "https://couponkodee.com" }

describe("resolveSplitRoute on the Cloudflare storefront", () => {
  it.each(["/admin", "/admin/collections/stores"])("redirects %s to the CMS admin", (path) => {
    expect(resolveSplitRoute(path, "?x=1", STOREFRONT)).toEqual({
      action: "redirect",
      url: `https://couponkodee.onrender.com${path}?x=1`,
    })
  })

  it.each(["/api/users/login", "/api/contact", "/media/logo.svg", "/api/media/file/a.jpg"])(
    "proxies %s to the CMS server",
    (path) => {
      expect(resolveSplitRoute(path, "", STOREFRONT)).toEqual({
        action: "proxy",
        url: `https://couponkodee.onrender.com${path}`,
      })
    }
  )

  it.each(["/in", "/in/stores", "/out", "/administrator"])("serves %s itself", (path) => {
    expect(resolveSplitRoute(path, "", STOREFRONT)).toEqual({ action: "none" })
  })
})

describe("resolveSplitRoute on the CMS server", () => {
  it("sends storefront visitors to the public site, keeping the query", () => {
    expect(resolveSplitRoute("/in/stores", "?q=amazon", CMS)).toEqual({
      action: "redirect",
      url: "https://couponkodee.com/in/stores?q=amazon",
    })
    expect(resolveSplitRoute("/", "", CMS)).toEqual({ action: "redirect", url: "https://couponkodee.com" })
  })

  it.each(["/admin", "/api/health", "/media/a.svg", "/out", "/brand-mark.svg"])("keeps serving %s", (path) => {
    expect(resolveSplitRoute(path, "", CMS)).toEqual({ action: "none" })
  })
})

describe("resolveSplitRoute without split hosting", () => {
  it("changes nothing when neither variable is set or the value is not a URL", () => {
    expect(resolveSplitRoute("/admin", "", {})).toEqual({ action: "none" })
    expect(resolveSplitRoute("/admin", "", { CMS_URL: "couponkodee.onrender.com" })).toEqual({ action: "none" })
  })
})

describe("isStorefrontPath", () => {
  it.each([
    ["/", true],
    ["/in/store/costco", true],
    ["/api/health", false],
    ["/out", false],
    ["/_next/static/x.js", false],
    ["/robots.txt", false],
  ])("%s -> %s", (path, expected) => {
    expect(isStorefrontPath(path)).toBe(expected)
  })
})
