import { describe, expect, it } from "vitest"
import { isLocalizablePath, localizeHref, regionFromIsoCountry, splitRegion } from "@/lib/regions"
import { currentMonthLabel, getBestPercentOff, getRegionalSiblings } from "@/lib/store-insights"

describe("splitRegion", () => {
  it("separates a known region prefix from the page path", () => {
    expect(splitRegion("/us/store/amazon")).toEqual({ region: "us", path: "/store/amazon" })
    expect(splitRegion("/in")).toEqual({ region: "in", path: "/" })
  })

  it("treats paths without a known region as unprefixed", () => {
    expect(splitRegion("/stores")).toEqual({ region: null, path: "/stores" })
    expect(splitRegion("/xx/stores")).toEqual({ region: null, path: "/xx/stores" })
  })
})

describe("localizeHref", () => {
  it("prefixes storefront links and keeps the query string", () => {
    expect(localizeHref("/stores", "us")).toBe("/us/stores")
    expect(localizeHref("/", "uk")).toBe("/uk")
    expect(localizeHref("/deals?q=nike#top", "de")).toBe("/de/deals?q=nike#top")
  })

  it("swaps an existing region instead of stacking prefixes", () => {
    expect(localizeHref("/in/store/amazon", "us")).toBe("/us/store/amazon")
  })

  it.each(["/admin", "/api/users/me", "/out?url=x", "/logos/amazon.svg", "https://amazon.in", "//evil.com", "#top"])(
    "leaves %s untouched",
    (href) => {
      expect(localizeHref(href, "us")).toBe(href)
      expect(isLocalizablePath(href)).toBe(false)
    }
  )
})

describe("regionFromIsoCountry", () => {
  it("maps visitor countries to the regions we serve", () => {
    expect(regionFromIsoCountry("IN")).toBe("in")
    expect(regionFromIsoCountry("GB")).toBe("uk")
    expect(regionFromIsoCountry("FR")).toBe("global")
  })

  it("ignores unknown or Tor countries", () => {
    expect(regionFromIsoCountry("XX")).toBeNull()
    expect(regionFromIsoCountry(null)).toBeNull()
  })
})

describe("store insights", () => {
  const offer = (discount: string, title = "Offer") =>
    ({ id: discount, title, discount, type: "deal", affiliateUrl: "", isVerified: true }) as const

  it("finds the best real percentage saving", () => {
    expect(getBestPercentOff([offer("10% OFF"), offer("DEAL", "Up to 60% off TVs"), offer("FLAT ₹500")])).toBe(60)
    expect(getBestPercentOff([offer("FLAT ₹500")])).toBeNull()
  })

  it("formats the month label shown in titles", () => {
    expect(currentMonthLabel(new Date("2026-10-24T00:00:00Z"))).toBe("October 2026")
  })

  it("finds the same brand in other regions", () => {
    const store = (slug: string) => ({ slug }) as any
    const all = ["amazon", "amazon-us", "amazon-uk", "ajio", "amazonia"].map(store)
    expect(getRegionalSiblings(store("amazon-us"), all).map((s) => s.slug)).toEqual(["amazon", "amazon-uk"])
  })
})
