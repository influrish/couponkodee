import { describe, expect, it } from "vitest"
import {
  DEFAULT_SUBID,
  buildAffiliateRedirectUrl,
  hostFromUrl,
  isAllowedHost,
  normalizeMerchantSlug,
} from "@/lib/outbound-link"

describe("buildAffiliateRedirectUrl", () => {
  it("attaches the handoff tracking parameters to the merchant URL", () => {
    const url = buildAffiliateRedirectUrl("https://www.amazon.in/deals?ref=x", {
      merchant: "Amazon",
      subid: "usr_123",
      code: "SAVE10",
    })

    expect(url?.origin).toBe("https://www.amazon.in")
    expect(url?.searchParams.get("ref")).toBe("x")
    expect(url?.searchParams.get("utm_source")).toBe("couponkodee")
    expect(url?.searchParams.get("utm_medium")).toBe("affiliate")
    expect(url?.searchParams.get("utm_campaign")).toBe("amazon_deal")
    expect(url?.searchParams.get("subid")).toBe("usr_123")
    expect(url?.searchParams.get("coupon")).toBe("SAVE10")
  })

  it("defaults subid to couponkodee and omits coupon when no code is given", () => {
    const url = buildAffiliateRedirectUrl("https://www.myntra.com/", { merchant: "myntra" })

    expect(url?.searchParams.get("subid")).toBe(DEFAULT_SUBID)
    expect(url?.searchParams.has("coupon")).toBe(false)
  })

  it.each([null, "", "#", "not a url", "javascript:alert(1)", "data:text/html,hi", "ftp://example.com/file"])(
    "rejects unsafe or invalid target %s",
    (target) => {
      expect(buildAffiliateRedirectUrl(target, { merchant: "x" })).toBeNull()
    }
  )

  it("strips characters that could inject extra parameters from subid and code", () => {
    const url = buildAffiliateRedirectUrl("https://www.ajio.com/", { subid: "a&b=c", code: "X Y<z>" })

    expect(url?.searchParams.get("subid")).toBe("abc")
    expect(url?.searchParams.get("coupon")).toBe("XYz")
  })
})

describe("normalizeMerchantSlug", () => {
  it("turns display names into slugs", () => {
    expect(normalizeMerchantSlug("Domino's Pizza")).toBe("domino-s-pizza")
    expect(normalizeMerchantSlug("  Amazon India ")).toBe("amazon-india")
    expect(normalizeMerchantSlug(null)).toBe("")
  })
})

describe("isAllowedHost", () => {
  const allowed = new Set(["amazon.in", "flipkart.com"])

  it("allows exact hosts, www variants and subdomains", () => {
    expect(isAllowedHost("www.amazon.in", allowed)).toBe(true)
    expect(isAllowedHost("m.flipkart.com", allowed)).toBe(true)
  })

  it("blocks unknown hosts and look-alike suffixes", () => {
    expect(isAllowedHost("evil.com", allowed)).toBe(false)
    expect(isAllowedHost("notamazon.in", allowed)).toBe(false)
    expect(isAllowedHost("amazon.in.evil.com", allowed)).toBe(false)
  })
})

describe("hostFromUrl", () => {
  it("returns a normalized host only for http(s) URLs", () => {
    expect(hostFromUrl("https://www.Nykaa.com/x")).toBe("nykaa.com")
    expect(hostFromUrl("mailto:a@b.com")).toBeNull()
    expect(hostFromUrl(undefined)).toBeNull()
  })
})
