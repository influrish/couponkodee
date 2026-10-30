import { afterEach, describe, expect, it, vi } from "vitest"
import { clearCmsCache } from "@/src/lib/cms-cache"
import { createRestPayloadClient, getCmsUrl, toQueryString } from "@/src/lib/cms-rest"

describe("toQueryString", () => {
  it("encodes nested and/or where clauses in Payload's bracket notation", () => {
    const query = toQueryString({
      where: {
        and: [{ or: [{ merchantSlug: { equals: "costco" } }] }, { isActive: { equals: true } }],
      },
      limit: 5,
      sort: "-createdAt",
    })

    expect(decodeURIComponent(query)).toBe(
      "where[and][0][or][0][merchantSlug][equals]=costco&where[and][1][isActive][equals]=true&limit=5&sort=-createdAt"
    )
  })

  it("skips undefined values and encodes special characters", () => {
    expect(toQueryString({ depth: undefined, sort: "a&b" })).toBe("sort=a%26b")
  })
})

describe("getCmsUrl", () => {
  afterEach(() => vi.unstubAllEnvs())

  it("returns the CMS address without a trailing slash", () => {
    vi.stubEnv("CMS_URL", "https://admin.couponkodee.com/ ")
    expect(getCmsUrl()).toBe("https://admin.couponkodee.com")
  })

  it.each(["", "admin.couponkodee.com"])("is off when CMS_URL is %j", (value) => {
    vi.stubEnv("CMS_URL", value)
    expect(getCmsUrl()).toBeNull()
  })
})

describe("createRestPayloadClient", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    clearCmsCache()
  })

  it("reads collections from the CMS REST API", async () => {
    const fetchMock = vi.fn().mockResolvedValue(Response.json({ docs: [{ slug: "costco" }], totalDocs: 1 }))
    vi.stubGlobal("fetch", fetchMock)

    const result = await createRestPayloadClient("https://cms.test").find({ collection: "stores", limit: 1 })

    expect(result.docs[0].slug).toBe("costco")
    expect(fetchMock.mock.calls[0][0]).toBe("https://cms.test/api/stores?limit=1")
  })

  it("reuses a recent response for the same query instead of calling the CMS again", async () => {
    const fetchMock = vi.fn().mockImplementation(async () => Response.json({ docs: [], totalDocs: 0 }))
    vi.stubGlobal("fetch", fetchMock)
    const client = createRestPayloadClient("https://cms.test")

    await client.find({ collection: "stores", limit: 1 })
    await client.find({ collection: "stores", limit: 1 })
    await client.find({ collection: "stores", limit: 2 })

    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it("does not cache failures, so the next request retries the CMS", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response("down", { status: 503 }))
      .mockResolvedValueOnce(Response.json({ cashbackVisibility: "on" }))
    vi.stubGlobal("fetch", fetchMock)
    const client = createRestPayloadClient("https://cms.test")

    await expect(client.findGlobal({ slug: "site-settings" })).rejects.toThrow()
    await expect(client.findGlobal({ slug: "site-settings" })).resolves.toEqual({ cashbackVisibility: "on" })
  })

  it("throws when the CMS responds with an error so callers use their fallbacks", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("down", { status: 503 })))

    await expect(createRestPayloadClient("https://cms.test").findGlobal({ slug: "site-settings" })).rejects.toThrow(
      "CMS request failed: 503"
    )
  })

  it("resolves the signed-in user by forwarding only the visitor's cookie", async () => {
    const fetchMock = vi.fn().mockResolvedValue(Response.json({ user: { id: "u1" } }))
    vi.stubGlobal("fetch", fetchMock)

    const { user } = await createRestPayloadClient("https://cms.test").auth({
      headers: new Headers({ cookie: "payload-token=abc", "x-other": "ignored" }),
    })

    expect(user?.id).toBe("u1")
    expect(fetchMock.mock.calls[0][0]).toBe("https://cms.test/api/users/me")
    expect(fetchMock.mock.calls[0][1].headers).toEqual({ Accept: "application/json", Cookie: "payload-token=abc" })
  })

  it("treats a visitor without a cookie as signed out without calling the CMS", async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal("fetch", fetchMock)

    const { user } = await createRestPayloadClient("https://cms.test").auth({ headers: new Headers() })

    expect(user).toBeNull()
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
