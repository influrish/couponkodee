import { afterEach, describe, expect, it } from "vitest"
import { safeRedirectPath } from "@/lib/safe-redirect"
import { checkRateLimit, resetRateLimits } from "@/lib/rate-limit"
import { isDatabaseConfigured } from "@/src/lib/db-config"
import { mergeOffers, relationSlug } from "@/lib/offer-merge"
import { isAdminOrSelf, isStaffRequest } from "@/src/access/roles"

describe("safeRedirectPath", () => {
  it("keeps same-site paths", () => {
    expect(safeRedirectPath("/stores?q=amazon")).toBe("/stores?q=amazon")
  })

  it.each(["https://evil.com", "//evil.com", "/\\evil.com", "javascript:alert(1)", "", null])(
    "falls back to / for unsafe redirect %s",
    (value) => {
      expect(safeRedirectPath(value)).toBe("/")
    }
  )
})

describe("checkRateLimit", () => {
  afterEach(() => resetRateLimits())

  it("blocks requests over the limit within the window and reports retry time", () => {
    const now = 1_000_000
    expect(checkRateLimit("ip", 2, 60_000, now).allowed).toBe(true)
    expect(checkRateLimit("ip", 2, 60_000, now + 1).allowed).toBe(true)
    const blocked = checkRateLimit("ip", 2, 60_000, now + 2)
    expect(blocked.allowed).toBe(false)
    expect(blocked.retryAfterSeconds).toBe(60)
  })

  it("starts a fresh window once the previous one expires", () => {
    const now = 1_000_000
    checkRateLimit("ip", 1, 1_000, now)
    expect(checkRateLimit("ip", 1, 1_000, now + 1).allowed).toBe(false)
    expect(checkRateLimit("ip", 1, 1_000, now + 1_001).allowed).toBe(true)
  })

  it("tracks keys independently", () => {
    checkRateLimit("a", 1, 60_000)
    expect(checkRateLimit("b", 1, 60_000).allowed).toBe(true)
  })
})

describe("isDatabaseConfigured", () => {
  it("accepts local and Atlas URIs outside Cloudflare", () => {
    expect(isDatabaseConfigured("mongodb://127.0.0.1:27017/couponkodee")).toBe(true)
    expect(isDatabaseConfigured("mongodb+srv://u:p@cluster9.abcde.mongodb.net/couponkodee")).toBe(true)
  })

  it("rejects empty, non-mongo and placeholder URIs", () => {
    expect(isDatabaseConfigured("")).toBe(false)
    expect(isDatabaseConfigured("postgres://localhost/db")).toBe(false)
    expect(isDatabaseConfigured("mongodb+srv://<username>:<password>@cluster0.xxx.mongodb.net/x")).toBe(false)
  })
})

describe("mergeOffers", () => {
  it("drops an offer seen earlier by id or by merchant + content, keeping the first", () => {
    const db = [{ id: "1", merchantSlug: "amazon-india", code: "SAVE" }]
    const fromStores = [
      { id: "1", merchantSlug: "amazon", code: "SAVE" }, // same DB record attached to its store
      { id: "s-2", merchantSlug: "amazon-india", code: "save" }, // same code, same merchant
      { id: "s-3", merchantSlug: "amazon", code: "OTHER" },
    ]

    const merged = mergeOffers([db, fromStores], (o) => o.code)

    expect(merged.map((o) => o.id)).toEqual(["1", "s-3"])
  })
})

describe("relationSlug", () => {
  it("reads the slug of a populated relationship and ignores bare ids", () => {
    expect(relationSlug({ id: "x", slug: "amazon" })).toBe("amazon")
    expect(relationSlug("64f0c0ffee")).toBeUndefined()
    expect(relationSlug(null)).toBeUndefined()
  })
})

describe("access roles", () => {
  const req = (role?: string, id = "u1") => ({ user: role ? { id, role } : null }) as any

  it("treats only admins and editors as staff", () => {
    expect(isStaffRequest(req("admin"))).toBe(true)
    expect(isStaffRequest(req("editor"))).toBe(true)
    expect(isStaffRequest(req("user"))).toBe(false)
    expect(isStaffRequest(req())).toBe(false)
  })

  it("limits non-admins to their own user record", () => {
    expect(isAdminOrSelf({ req: req("admin") } as any)).toBe(true)
    expect(isAdminOrSelf({ req: req("user", "u7") } as any)).toEqual({ id: { equals: "u7" } })
    expect(isAdminOrSelf({ req: req() } as any)).toBe(false)
  })
})
